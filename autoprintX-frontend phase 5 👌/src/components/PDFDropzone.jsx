import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function PDFDropzone({ onFileAccepted }) {
  const [fileError, setFileError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setFileError(null);

      if (rejectedFiles.length > 0) {
        setFileError("Please upload only PDF files (max 25MB)");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${fileError ? "border-red-500 bg-red-50" : ""}
          cursor-pointer`}
      >
        <input {...getInputProps()} />

        <div className="space-y-2">
          <svg
            className={`mx-auto h-12 w-12 ${
              fileError ? "text-red-400" : "text-gray-400"
            }`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="flex flex-col text-sm text-gray-600">
            {isDragActive ? (
              <span className="font-medium text-blue-600">
                Drop the PDF here
              </span>
            ) : (
              <>
                <span className="font-medium">
                  Drag and drop PDF file, or{" "}
                  <span className="text-blue-600 hover:text-blue-500">
                    click to browse
                  </span>
                </span>
                <span className="text-xs mt-1 text-gray-500">
                  Max file size: 25MB
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {fileError && <p className="text-sm text-red-600">{fileError}</p>}

      {uploadedFile && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-700">
            <span className="font-medium">Selected file:</span>{" "}
            {uploadedFile.name}
            <span className="text-green-600 ml-2">
              ({(uploadedFile.size / 1024 / 1024).toFixed(2)}MB)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
