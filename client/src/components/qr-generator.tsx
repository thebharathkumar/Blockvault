import React, { useState, useRef } from "react";
import { QrCode, Download, Printer, Copy } from "lucide-react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateHash } from "@/lib/crypto";

export function QRCodeGenerator() {
  const [input, setInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!input.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a document hash or URL",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      let qrContent = input.trim();
      
      // If it looks like a hash, create a verification URL
      if (validateHash(qrContent)) {
        const baseUrl = window.location.origin;
        qrContent = `${baseUrl}/verify?hash=${qrContent}`;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, qrContent, {
        width: 200,
        margin: 2,
        color: {
          dark: "#334155",
          light: "#FFFFFF",
        },
      });

      // Also generate a data URL for download
      const dataUrl = await QRCode.toDataURL(qrContent, {
        width: 400,
        margin: 2,
        color: {
          dark: "#334155", 
          light: "#FFFFFF",
        },
      });
      
      setQrCodeUrl(dataUrl);

      toast({
        title: "Success",
        description: "QR code generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.download = "document-verification-qr.png";
    link.href = qrCodeUrl;
    link.click();

    toast({
      title: "Downloaded",
      description: "QR code saved to downloads",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const printQR = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Document Verification QR Code</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0; 
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 20px;
            }
            img { 
              max-width: 300px; 
              height: auto; 
            }
            h3 { 
              margin-bottom: 20px; 
              color: #333;
            }
            p {
              font-size: 12px;
              color: #666;
              word-break: break-all;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h3>Document Verification QR Code</h3>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <p>Scan to verify: ${input}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <QrCode className="text-primary" />
          <span>QR Code Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Hash or URL
            </label>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter document hash or verification URL"
              data-testid="input-qr-content"
            />
          </div>
          <Button
            onClick={generateQRCode}
            className="w-full"
            disabled={isGenerating}
            data-testid="button-generate-qr"
          >
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </Button>
        </div>

        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <canvas
              ref={canvasRef}
              className="mx-auto"
              style={{ display: qrCodeUrl ? "block" : "none" }}
              data-testid="qr-canvas"
            />
            {!qrCodeUrl && (
              <div className="text-gray-400" data-testid="qr-placeholder">
                <QrCode className="h-16 w-16 mx-auto mb-4" />
                <p>QR code will appear here</p>
              </div>
            )}
          </div>
          
          {qrCodeUrl && (
            <div className="mt-4 space-x-3" data-testid="qr-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadQR}
                data-testid="button-download-qr"
              >
                <Download className="w-3 h-3 mr-2" />
                Download PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={printQR}
                data-testid="button-print-qr"
              >
                <Printer className="w-3 h-3 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                data-testid="button-copy-qr-content"
              >
                <Copy className="w-3 h-3 mr-2" />
                Copy
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
