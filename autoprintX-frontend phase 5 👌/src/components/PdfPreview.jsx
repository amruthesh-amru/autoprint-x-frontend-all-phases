import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useDispatch } from "react-redux";
import { setPageNumber } from "@/app/slices/pageNoSlice";

export default function PdfPreview({ pdf }) {
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!pdf) {
      setPdfError(true);
      return;
    }
    setPdfError(false);

    // Handle different PDF source types
    if (typeof pdf === "string") {
      setPdfFile(pdf);
    } else if (pdf instanceof Blob || pdf instanceof File) {
      setPdfFile(pdf);
    } else if (pdf.previewUrl && typeof pdf.previewUrl === "string") {
      setPdfFile(pdf.previewUrl);
    } else {
      console.error("Invalid PDF source:", pdf);
      setPdfError(true);
    }
  }, [pdf]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    dispatch(setPageNumber(numPages));
  };

  const onDocumentLoadError = (error) => {
    console.error("Failed to load PDF:", error);
    setPdfError(true);
  };

  if (pdfError || !pdfFile) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#dedede]">
        <div className="text-red-600 p-4 bg-white rounded shadow">
          <h3 className="font-bold mb-2">Unable to display PDF</h3>
          <p>
            The PDF could not be loaded. Please try again with a valid file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="p-[2rem] bg-[#dedede]"
        loading={
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        }
      >
        {numPages &&
          Array.from({ length: numPages }, (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="mb-[2rem]"
              loading={
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-600">Loading page {index + 1}...</p>
                </div>
              }
            />
          ))}
      </Document>
    </div>
  );
}
