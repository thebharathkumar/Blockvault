import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, CheckCircle, Copy, QrCode } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateDocumentHash } from "@/lib/crypto";
import { apiRequest } from "@/lib/queryClient";
import type { UploadedFile } from "@/lib/types";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export function DocumentUpload() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [documentHash, setDocumentHash] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData & { documentHash: string; filename: string }) => {
      const response = await apiRequest("POST", "/api/documents", {
        ...data,
        issuer: "0x" + Math.random().toString(16).substr(2, 40), // Mock wallet address
      });
      return response.json();
    },
    onSuccess: () => {
      setUploadSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Document registered successfully on the blockchain!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadSuccess(false);

    try {
      const hash = await generateDocumentHash(file);
      
      const uploadedFileData: UploadedFile = {
        file,
        hash,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setUploadedFile(uploadedFileData);
      setDocumentHash(hash);
      
      // Auto-fill title if empty
      if (!form.getValues("title")) {
        form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
      }

      toast({
        title: "File processed",
        description: "Document hash generated successfully",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to process the document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const mockEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  const onSubmit = (data: UploadFormData) => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      ...data,
      documentHash,
      filename: uploadedFile.name,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Hash copied to clipboard",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <CloudUpload className="text-primary" />
          <span>Register New Document</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Zone */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary hover:bg-blue-50 transition-all cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("document-upload")?.click()}
          data-testid="upload-zone"
        >
          <div className="upload-icon mb-4">
            <CloudUpload className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Drag & Drop Document</h4>
          <p className="text-gray-600 mb-4">or click to browse files</p>
          <input
            type="file"
            id="document-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            data-testid="input-file-upload"
          />
          <Button 
            type="button" 
            variant="outline"
            data-testid="button-choose-file"
          >
            Choose File
          </Button>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center py-4" data-testid="processing-indicator">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <span className="text-gray-700">Processing document...</span>
          </div>
        )}

        {/* File Info */}
        {uploadedFile && !isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {uploadedFile.name}</p>
              <p><strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
              <p><strong>Hash:</strong> 
                <code className="text-xs bg-gray-100 px-1 rounded ml-1">
                  {documentHash.substring(0, 32)}...
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(documentHash)}
                  className="ml-2"
                  data-testid="button-copy-hash"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-testid="upload-success">
            <div className="flex items-center">
              <CheckCircle className="text-success text-xl mr-3" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Document Registered Successfully</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Hash: <code className="font-mono text-xs bg-gray-100 px-1 rounded">
                    {documentHash.substring(0, 16)}...
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter document title" 
                      {...field}
                      data-testid="input-document-title"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the document"
                      rows={3}
                      {...field}
                      data-testid="input-document-description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-public-verification"
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Public verification
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!uploadedFile || uploadMutation.isPending}
              data-testid="button-register-document"
            >
              {uploadMutation.isPending ? "Registering..." : "Register Document"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
