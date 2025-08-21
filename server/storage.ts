import { type Document, type InsertDocument, type Verification, type InsertVerification, type VerificationResult } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentByHash(hash: string): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  revokeDocument(hash: string): Promise<boolean>;
  
  // Verification operations
  createVerification(verification: InsertVerification): Promise<Verification>;
  getVerificationsByHash(hash: string): Promise<Verification[]>;
  verifyDocument(hash: string): Promise<VerificationResult>;
}

export class MemStorage implements IStorage {
  private documents: Map<string, Document>;
  private verifications: Map<string, Verification>;

  constructor() {
    this.documents = new Map();
    this.verifications = new Map();
    
    // Add some sample documents for demonstration
    this.seedData();
  }

  private seedData() {
    const sampleDocs: Document[] = [
      {
        id: "1",
        title: "University Diploma",
        filename: "diploma_2023.pdf",
        documentHash: "a1b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef1234567890ab",
        ipfsHash: "QmX1B2C3D4E5F6789",
        description: "Computer Science Degree from State University",
        isPublic: true,
        isRevoked: false,
        issuer: "0x1234567890abcdef1234567890abcdef12345678",
        createdAt: new Date("2023-12-15T14:30:00Z"),
      },
      {
        id: "2",
        title: "Professional Certificate",
        filename: "certificate_web3.pdf",
        documentHash: "b2c3d4e5f6a17890bcdef2345678901bcdef2345678901bcdef2345678901bc",
        ipfsHash: "QmY2C3D4E5F6789A",
        description: "Blockchain Development Certification",
        isPublic: true,
        isRevoked: false,
        issuer: "0x2345678901bcdef2345678901bcdef2345678901",
        createdAt: new Date("2023-12-12T10:15:00Z"),
      },
      {
        id: "3",
        title: "Contract Agreement",
        filename: "contract_old.pdf",
        documentHash: "c3d4e5f6a1b28901cdef3456789012cdef3456789012cdef3456789012cd",
        ipfsHash: "QmZ3D4E5F6789AB",
        description: "Service Agreement - Superseded",
        isPublic: false,
        isRevoked: true,
        issuer: "0x3456789012cdef3456789012cdef3456789012cd",
        createdAt: new Date("2023-12-10T16:45:00Z"),
      },
    ];

    sampleDocs.forEach(doc => {
      this.documents.set(doc.id, doc);
    });
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      createdAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentByHash(hash: string): Promise<Document | undefined> {
    return Array.from(this.documents.values()).find(doc => doc.documentHash === hash);
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...updates };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async revokeDocument(hash: string): Promise<boolean> {
    const document = await this.getDocumentByHash(hash);
    if (!document) return false;
    
    const updated = await this.updateDocument(document.id, { isRevoked: true });
    return !!updated;
  }

  async createVerification(insertVerification: InsertVerification): Promise<Verification> {
    const id = randomUUID();
    const verification: Verification = {
      ...insertVerification,
      id,
      verifiedAt: new Date(),
    };
    this.verifications.set(id, verification);
    return verification;
  }

  async getVerificationsByHash(hash: string): Promise<Verification[]> {
    return Array.from(this.verifications.values()).filter(v => v.documentHash === hash);
  }

  async verifyDocument(hash: string): Promise<VerificationResult> {
    const document = await this.getDocumentByHash(hash);
    const verifications = await this.getVerificationsByHash(hash);
    
    if (!document) {
      return {
        exists: false,
        isValid: false,
      };
    }

    // Record this verification
    await this.createVerification({
      documentHash: hash,
      verifierAddress: "0x" + Math.random().toString(16).substr(2, 40),
    });

    return {
      exists: true,
      document,
      verifications,
      isValid: !document.isRevoked,
      issuer: document.issuer,
      timestamp: document.createdAt,
      blockNumber: "#18,547," + Math.floor(Math.random() * 1000 + 800),
      transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
    };
  }
}

export const storage = new MemStorage();
