'use client'

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Loader2, ChevronDown, FileText, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PDFViewerProps {
  url: string;
  latexSource?: string | null;
  onDownloadLatex?: () => void;
}

function PDFViewer({ url, latexSource, onDownloadLatex }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      const isMobile = window.innerWidth < 768;
      const containerWidth = isMobile ? window.innerWidth - 32 : Math.min(window.innerWidth * 0.4, 800);
      setWidth(containerWidth);
      
      // Adjust scale based on width to ensure it fits nicely
      // For a letter-sized document (8.5" x 11"), 612x792 points
      const baseWidth = 612; // PDF point width for letter size
      let newScale = containerWidth / baseWidth;
      
      // Ensure minimum scale for readability
      if (isMobile) {
        newScale = Math.max(newScale, 0.8); // Minimum scale on mobile
      } else {
        newScale = Math.max(newScale, 1.2); // Minimum scale on desktop
      }
      
      setScale(newScale);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setLoading(false);
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error): void {
    setLoading(false);
    setError(error);
    console.error('Error loading PDF:', error);
  }

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    link.click();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-destructive mb-4">Failed to load PDF</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-10rem)] bg-muted">
      {/* PDF Container */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full flex justify-center p-4 pb-16">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center min-h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
            error={null}
            className="max-w-3xl mx-auto"
          >
            <Page
              pageNumber={pageNumber}
              loading={
                <div className="flex items-center justify-center min-h-[600px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
              className={cn(
                "shadow-lg bg-white transition-opacity duration-200",
                loading && "opacity-0"
              )}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              scale={scale}
              width={width}
            />
          </Document>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky bottom-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {numPages && numPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                  disabled={pageNumber >= (numPages || 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              {latexSource && onDownloadLatex && (
                <DropdownMenuItem onClick={onDownloadLatex}>
                  <FileCode className="h-4 w-4 mr-2" />
                  Download LaTeX
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;