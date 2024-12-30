import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  url: string;
}

function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPDF}
            className="ml-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;