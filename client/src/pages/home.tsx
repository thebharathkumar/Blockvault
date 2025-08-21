import { DocumentVerifier } from "@/components/document-verifier";
import { Button } from "@/components/ui/button";
import { Upload, Search } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Secure Document Verification with{" "}
                <span className="text-primary">Blockchain Technology</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Create tamper-proof digital certificates and verify document authenticity using decentralized blockchain technology. Perfect for diplomas, contracts, and legal documents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/upload">
                  <Button 
                    className="bg-primary text-white hover:bg-blue-700"
                    data-testid="button-upload-hero"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => document.getElementById('verify-section')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid="button-verify-hero"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Verify Document
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              {/* Abstract blockchain visualization */}
              <div className="relative bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <i className="fas fa-certificate text-white text-2xl"></i>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-success rounded-full"></div>
                    <span className="text-gray-700">Document Hash Generated</span>
                    <i className="fas fa-check text-success ml-auto"></i>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-success rounded-full"></div>
                    <span className="text-gray-700">Blockchain Registration</span>
                    <i className="fas fa-check text-success ml-auto"></i>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-success rounded-full"></div>
                    <span className="text-gray-700">Verification Complete</span>
                    <i className="fas fa-check text-success ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section id="verify-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Verify Document Authenticity</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a document or enter its hash to verify its authenticity on the blockchain.
          </p>
        </div>
        <DocumentVerifier />
      </section>
    </div>
  );
}
