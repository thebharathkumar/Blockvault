# Overview

BlockVault is a blockchain document verification platform that enables users to create tamper-proof digital certificates and verify document authenticity using decentralized technology. The application allows document upload with cryptographic hash generation, blockchain storage, and public verification capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Full-Stack Architecture
The application follows a modern full-stack architecture with a React frontend, Express backend, and PostgreSQL database, all connected through a shared schema system.

**Frontend Stack:**
- React 18 with TypeScript for type safety and modern development
- Tailwind CSS with shadcn/ui component library for consistent design
- TanStack Query for efficient data fetching and caching
- Wouter for lightweight client-side routing
- React Hook Form with Zod validation for form handling

**Backend Stack:**
- Express.js server with TypeScript support
- RESTful API design with structured error handling
- In-memory storage with seeded sample data for development
- Comprehensive logging and request tracking middleware

**Database Layer:**
- PostgreSQL database with Drizzle ORM for type-safe queries
- Centralized schema definitions in shared directory for consistency
- Database migrations managed through Drizzle Kit

## Core Features Architecture

**Document Management System:**
- File upload with client-side cryptographic hash generation using Web Crypto API
- Document metadata storage including title, description, IPFS hash, and public visibility settings
- Document lifecycle management with revocation capabilities
- Duplicate hash detection to prevent document re-registration

**Verification System:**
- Hash-based document verification through both file upload and direct hash input
- QR code generation for easy document sharing and verification
- Public document discovery and verification status tracking
- Verification history logging for audit trails

**UI Component System:**
- Modular component architecture using Radix UI primitives
- Consistent design system with CSS custom properties
- Responsive design with mobile-first approach
- Comprehensive UI component library including forms, dialogs, and data displays

## Development Workflow
The project uses Vite for fast development builds with hot module replacement, TypeScript for compile-time type checking, and a monorepo structure with shared types and schemas between frontend and backend.

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity optimized for serverless environments
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect support
- **@tanstack/react-query**: Server state management and data fetching
- **react-hook-form**: Form state management with validation
- **zod**: Runtime type validation and schema definition

## UI and Styling
- **@radix-ui/react-**: Complete set of accessible UI primitives (accordion, dialog, select, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

## Blockchain and Cryptography
- **qrcode**: QR code generation for document sharing
- **Web Crypto API**: Browser-native cryptographic hash generation (SHA-256)

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin**: Replit-specific development enhancements
- **drizzle-kit**: Database migration and schema management

## Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- Planned IPFS integration for distributed file storage

The application is designed to be blockchain-agnostic with a focus on document hash verification rather than specific blockchain implementation, allowing for future integration with various blockchain networks.
