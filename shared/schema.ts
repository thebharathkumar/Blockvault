import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  documentHash: text("document_hash").notNull().unique(),
  ipfsHash: text("ipfs_hash"),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  isRevoked: boolean("is_revoked").default(false),
  issuer: text("issuer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentHash: text("document_hash").notNull(),
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
  verifierAddress: text("verifier_address"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  verifiedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type Verification = typeof verifications.$inferSelect;

// Additional types for the application
export interface VerificationResult {
  exists: boolean;
  document?: Document;
  verifications?: Verification[];
  isValid: boolean;
  issuer?: string;
  timestamp?: Date;
  blockNumber?: string;
  transactionHash?: string;
}

export interface DocumentUploadResult {
  success: boolean;
  document?: Document;
  hash?: string;
  error?: string;
}
