import { DocumentVerifier } from "@/components/document-verifier";
import { QRCodeGenerator } from "@/components/qr-generator";

export default function Verify() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Document Verification</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Verify document authenticity and generate QR codes for easy sharing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DocumentVerifier />
          <QRCodeGenerator />
        </div>
      </div>
    </div>
  );
}
