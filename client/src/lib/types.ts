export interface UploadedFile {
  file: File;
  hash: string;
  name: string;
  size: number;
  type: string;
}

export interface VerificationStatus {
  status: 'valid' | 'invalid' | 'revoked' | 'not-found';
  message: string;
  details?: any;
}

export interface DocumentStats {
  totalDocuments: number;
  verified: number;
  revoked: number;
  thisMonth: number;
}
