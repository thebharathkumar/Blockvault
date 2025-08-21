import { DocumentUpload } from "@/components/document-upload";

export default function Upload() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload & Register Document</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Securely upload documents to generate cryptographic hashes and register them on the blockchain for tamper-proof verification.
          </p>
        </div>
        
        <div className="flex justify-center">
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
}
