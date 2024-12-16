import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Button } from './ui/button'; // Import the Button component
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; // Import zoom and pan library

interface PDFViewerProps {
  url: string;
}

function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const transformComponentRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale(0.5); // Set a smaller scale for mobile devices
      } else {
        setScale(1); // Default scale for larger screens
      }
    };

    handleResize(); // Set initial scale
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const goToPrevPage = () => setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  const goToNextPage = () => setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1));
  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    link.click();
  };

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  const resetPosition = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          border: '1px solid #ccc',
          backgroundColor: 'var(--pdf-background-color)',
        }}
      >
        <TransformWrapper
          ref={transformComponentRef}
        >
          <TransformComponent>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          </TransformComponent>
        </TransformWrapper>
      </div>
      {numPages && numPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: '100%' }}>
          <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
            Previous
          </button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
            Next
          </button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button onClick={downloadPDF} variant="default" size="default">
          <Download />
        </Button>
        <Button onClick={resetPosition} variant="default" size="default" style={{ marginLeft: '10px' }}>
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
}

export default PDFViewer;