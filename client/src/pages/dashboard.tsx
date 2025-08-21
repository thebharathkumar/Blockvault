import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, FileText, Plus, QrCode, Link2, Ban, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { truncateHash } from "@/lib/crypto";
import type { Document } from "@shared/schema";
import type { DocumentStats } from "@/lib/types";
import { Link } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading: documentsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DocumentStats>({
    queryKey: ["/api/stats"],
  });

  const revokeMutation = useMutation({
    mutationFn: async (hash: string) => {
      const response = await apiRequest("PATCH", `/api/documents/${hash}/revoke`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Document Revoked",
        description: "Document has been successfully revoked",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Revocation Failed",
        description: error.message || "Failed to revoke document",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  const generateVerificationLink = (hash: string) => {
    const url = `${window.location.origin}/verify?hash=${hash}`;
    copyToClipboard(url, "Verification link");
  };

  const getDocumentIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <FileText className="text-primary text-xl" />;
  };

  const getStatusColor = (document: Document) => {
    if (document.isRevoked) return "text-warning";
    return "text-success";
  };

  const getStatusText = (document: Document) => {
    if (document.isRevoked) return "Revoked";
    return "Verified";
  };

  if (documentsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-xl text-gray-600">
            Manage your registered documents and view verification analytics.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center bg-blue-50">
              <div className="text-2xl font-bold text-primary" data-testid="stat-total-documents">
                {stats?.totalDocuments || 0}
              </div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center bg-green-50">
              <div className="text-2xl font-bold text-success" data-testid="stat-verified">
                {stats?.verified || 0}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center bg-yellow-50">
              <div className="text-2xl font-bold text-warning" data-testid="stat-revoked">
                {stats?.revoked || 0}
              </div>
              <div className="text-sm text-gray-600">Revoked</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center bg-gray-50">
              <div className="text-2xl font-bold text-gray-600" data-testid="stat-this-month">
                {stats?.thisMonth || 0}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <FolderOpen className="text-primary" />
                <span>My Documents</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>
                <Link href="/upload">
                  <Button 
                    className="bg-primary text-white hover:bg-blue-700"
                    data-testid="button-upload-new"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-documents">
                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-600 mb-4">Get started by uploading your first document.</p>
                <Link href="/upload">
                  <Button data-testid="button-upload-first">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((document: Document) => (
                  <div
                    key={document.id}
                    className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                      document.isRevoked ? "opacity-75" : ""
                    }`}
                    data-testid={`document-item-${document.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getDocumentIcon(document.filename)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{document.title}</h4>
                          <p className="text-sm text-gray-600">{document.filename}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            Hash: {truncateHash(document.documentHash)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`flex items-center text-sm ${getStatusColor(document)}`}>
                            <span className="mr-1">
                              {document.isRevoked ? "⚠" : "✓"}
                            </span>
                            <span>{getStatusText(document)}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateVerificationLink(document.documentHash)}
                            title="Copy verification link"
                            data-testid={`button-copy-link-${document.id}`}
                          >
                            <Link2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(document.documentHash, "Document hash")}
                            title="Copy hash"
                            data-testid={`button-copy-hash-${document.id}`}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          {!document.isRevoked && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => revokeMutation.mutate(document.documentHash)}
                              disabled={revokeMutation.isPending}
                              title="Revoke document"
                              className="text-error hover:text-error hover:bg-red-50"
                              data-testid={`button-revoke-${document.id}`}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
