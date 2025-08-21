import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Get document by ID
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  // Create new document
  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      
      // Check if document hash already exists
      const existing = await storage.getDocumentByHash(validatedData.documentHash);
      if (existing) {
        return res.status(400).json({ error: "Document with this hash already exists" });
      }

      const document = await storage.createDocument(validatedData);
      res.status(201).json({ success: true, document });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // Verify document by hash
  app.get("/api/verify/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      
      if (!hash || hash.length !== 64 || !/^[a-f0-9]{64}$/i.test(hash)) {
        return res.status(400).json({ error: "Invalid hash format" });
      }

      const result = await storage.verifyDocument(hash);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Verify document by file upload (expects hash in body)
  app.post("/api/verify", async (req, res) => {
    try {
      const { hash } = req.body;
      
      if (!hash || typeof hash !== 'string' || hash.length !== 64 || !/^[a-f0-9]{64}$/i.test(hash)) {
        return res.status(400).json({ error: "Invalid hash format" });
      }

      const result = await storage.verifyDocument(hash);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Revoke document
  app.patch("/api/documents/:hash/revoke", async (req, res) => {
    try {
      const { hash } = req.params;
      const success = await storage.revokeDocument(hash);
      
      if (!success) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json({ success: true, message: "Document revoked successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to revoke document" });
    }
  });

  // Get verification statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      const stats = {
        totalDocuments: documents.length,
        verified: documents.filter(d => !d.isRevoked).length,
        revoked: documents.filter(d => d.isRevoked).length,
        thisMonth: documents.filter(d => {
          const docDate = new Date(d.createdAt);
          const now = new Date();
          return docDate.getMonth() === now.getMonth() && 
                 docDate.getFullYear() === now.getFullYear();
        }).length,
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
