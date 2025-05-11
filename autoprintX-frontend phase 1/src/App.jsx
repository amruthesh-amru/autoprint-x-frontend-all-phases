import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "./app/slices/cartSlice";
import { setOptionField } from "./app/slices/printOptionSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCartFiles } from "./contexts/CartFileContext.jsx"; // Adjust the import path as needed
import PrintOptionsForm from "./components/PrintOptionsForm";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import PDFDropzone from "./components/PDFDropzone";
import PdfPreview from "./components/PdfPreview";
import { pdfjs } from "react-pdf";
import Tic from "./components/Tic";
// ...other imports and code

// Helper: Modified to return a File for cart use
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const getFileForCart = (originalFile, extractedPdf, pageRange) => {
  if (!pageRange || pageRange.trim() === "") {
    return originalFile;
  } else {
    return new File([extractedPdf], originalFile.name, {
      type: extractedPdf.type,
      lastModified: originalFile.lastModified,
    });
  }
};

function App() {
  const dispatch = useDispatch();
  const printOption = useSelector((state) => state.printOption.value);
  const [file, setFile] = useState(null);
  const [extractedFileUrl, setExtractedFileUrl] = useState(null);
  const [extractedPdf, setExtractedPdf] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to manage object URL cleanup
  const extractedUrlRef = useRef(null);

  const { addCartFile } = useCartFiles();

  // Helper to update object URL safely
  const updateExtractedFileUrl = (newUrl) => {
    if (extractedUrlRef.current) {
      URL.revokeObjectURL(extractedUrlRef.current);
    }
    extractedUrlRef.current = newUrl;
    setExtractedFileUrl(newUrl);
  };

  const handleFileAccepted = (file) => {
    console.log("PDF received:", file);
    setFile(file);
    updateExtractedFileUrl(URL.createObjectURL(file));
    setExtractedPdf(null);
    // Save the file name in print options
    dispatch(setOptionField({ key: "fileName", value: file.name }));
    setErrorMessage(null);
  };

  const clearFile = () => {
    if (extractedUrlRef.current) {
      URL.revokeObjectURL(extractedUrlRef.current);
      extractedUrlRef.current = null;
    }
    setFile(null);
    setExtractedFileUrl(null);
    setExtractedPdf(null);
    setErrorMessage(null);
  };

  // ... (your existing extractPagesFromPdf and handleExtractPages logic)

  const addToCart = async () => {
    if (!file) {
      setErrorMessage("Please upload a PDF file first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First, call the pre-upload endpoint
      const formDataUpload = new FormData();
      formDataUpload.append("pdf", file, file.name);

      const uploadResponse = await axios.post(
        "http://localhost:3000/api/upload/pre-upload",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract S3 URL and key from response
      const { fileUrl, key } = uploadResponse.data;

      // Generate a unique ID for the cart item
      const uniqueId = Date.now().toString();

      // Create metadata including the S3 URL
      const fileMetadata = {
        id: uniqueId,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        previewUrl: extractedFileUrl, // For display purposes
        s3Url: fileUrl, // Persisted S3 URL
        s3Key: key, // Optionally store the key if needed for deletion
      };

      // Dispatch the cart item to Redux with metadata including the S3 URL
      dispatch(
        addCartItem({
          id: uniqueId,
          pdf: fileMetadata,
          printOptions: printOption,
        })
      );

      // You can optionally still add the file to your context if needed,
      // but now the order will rely on the S3 URL.
      addCartFile({
        id: uniqueId,
        file, // optionally store the file if needed; otherwise you may omit this.
      });

      // Optionally send cart info to your backend if needed:
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/order/addToCart",
        {
          orderData: {
            pdf: fileMetadata,
            printOptions: printOption,
          },
        },
        { headers: { token } }
      );

      console.log("Item added to cart.");
      clearFile();
    } catch (error) {
      console.error("Error adding to cart", error);
      setErrorMessage("Error adding to cart. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  // Clean up object URLs on unmount.
  useEffect(() => {
    return () => {
      if (extractedUrlRef.current) {
        URL.revokeObjectURL(extractedUrlRef.current);
      }
    };
  }, []);

  // ... (rest of your component JSX)

  return (
    <>
      <Header />
      {/* <div className="flex justify-evenly items-start pt-[2rem]">
        <div className="flex w-[100%] justify-center gap-10 items-start">
          {!file && (
            <div className="max-w-2xl p-8">
              <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>
              <PDFDropzone onFileAccepted={handleFileAccepted} />
            </div>
          )}
          {file && (
            <div className="flex items-center justify-center">
              <PdfPreview pdf={extractedFileUrl} />
            </div>
          )}
          <div className="flex flex-col items-start justify-start gap-4">
            <div>
              <PrintOptionsForm />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading && <p>Processing...</p>}
            {file && (
              <div className="flex flex-col w-full gap-4">
                <button
                  type="button"
                  onClick={clearFile}
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-500 transition"
                >
                  Clear Document Selected
                </button>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={isLoading}
                  className={`w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md transition ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-500"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            )}
            <div className="flex flex-col w-full gap-4">
              <Link to="/cart">
                <button
                  type="button"
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-500 transition"
                >
                  Go to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div> */}
      <Tic />
    </>
  );
}

export default App;

// import "./App.css";
// import { pdfjs } from "react-pdf";
// import PdfPreview from "./components/PdfPreview";
// import PDFDropzone from "./components/PDFDropzone";
// import { useEffect, useRef, useState } from "react";
// import Header from "./components/Header";
// import PrintOptionsForm from "./components/PrintOptionsForm";
// import { PDFDocument } from "pdf-lib";
// import { useDispatch, useSelector } from "react-redux";
// import { setPageNumber } from "./app/slices/pageNoSlice";
// import { addCartItem } from "./app/slices/cartSlice";
// import { setOptionField } from "./app/slices/printOptionSlice";
// import { Link } from "react-router-dom";
// import axios from "axios";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// // Modified to return a File with metadata if a page range is provided.
// const getFileForCart = (originalFile, extractedPdf, pageRange) => {
//   if (!pageRange || pageRange.trim() === "") {
//     return originalFile;
//   } else {
//     return new File([extractedPdf], originalFile.name, {
//       type: extractedPdf.type,
//       lastModified: originalFile.lastModified,
//     });
//   }
// };

// function App() {
//   const dispatch = useDispatch();
//   const printOption = useSelector((state) => state.printOption.value);
//   const [file, setFile] = useState(null);
//   const [extractedFileUrl, setExtractedFileUrl] = useState(null);
//   const [extractedPdf, setExtractedPdf] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Ref to store the current object URL so we can revoke it when needed.
//   const extractedUrlRef = useRef(null);

//   // Helper to safely update the extractedFileUrl and revoke previous URL.
//   const updateExtractedFileUrl = (newUrl) => {
//     if (extractedUrlRef.current) {
//       URL.revokeObjectURL(extractedUrlRef.current);
//     }
//     extractedUrlRef.current = newUrl;
//     setExtractedFileUrl(newUrl);
//   };

//   const handleFileAccepted = (file) => {
//     console.log("PDF received:", file);
//     setFile(file);
//     updateExtractedFileUrl(URL.createObjectURL(file)); // Initial URL
//     setExtractedPdf(null);
//     dispatch(setOptionField({ key: "fileName", value: file.name }));
//     setErrorMessage(null);
//   };

//   const clearFile = () => {
//     if (extractedUrlRef.current) {
//       URL.revokeObjectURL(extractedUrlRef.current);
//       extractedUrlRef.current = null;
//     }
//     setFile(null);
//     setExtractedFileUrl(null);
//     setExtractedPdf(null);
//     dispatch(setPageNumber(0));
//     setErrorMessage(null);
//   };

//   const extractPagesFromPdf = async (pdfFile, rangeStr) => {
//     try {
//       const arrayBuffer = await pdfFile.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(arrayBuffer);
//       const newPdfDoc = await PDFDocument.create();

//       let pagesToExtract = [];
//       const ranges = rangeStr.split(",");
//       ranges.forEach((range) => {
//         range = range.trim();
//         if (range.includes("-")) {
//           const [start, end] = range.split("-").map(Number);
//           for (let i = start; i <= end; i++) {
//             pagesToExtract.push(i - 1);
//           }
//         } else if (range !== "") {
//           pagesToExtract.push(Number(range) - 1);
//         }
//       });

//       if (pagesToExtract.length === 0) {
//         pagesToExtract = pdfDoc.getPageIndices();
//       }

//       const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToExtract);
//       copiedPages.forEach((page) => newPdfDoc.addPage(page));

//       const newPdfBytes = await newPdfDoc.save();
//       const newPdfBlob = new Blob([newPdfBytes], { type: "application/pdf" });
//       return newPdfBlob;
//     } catch (error) {
//       console.error("Error extracting pages:", error);
//       setErrorMessage("Error extracting pages. Please check the page range.");
//       throw error;
//     }
//   };

//   const handleExtractPages = async () => {
//     if (!file) return;

//     try {
//       if (!printOption.pageRange || printOption.pageRange.trim() === "") {
//         updateExtractedFileUrl(URL.createObjectURL(file));
//         setExtractedPdf(file);
//       } else {
//         const newPdfBlob = await extractPagesFromPdf(
//           file,
//           printOption.pageRange
//         );
//         const newPdfUrl = URL.createObjectURL(newPdfBlob);
//         updateExtractedFileUrl(newPdfUrl);
//         setExtractedPdf(newPdfBlob);
//       }
//       dispatch(setOptionField({ key: "fileName", value: file.name }));
//     } catch (error) {
//       // Error is already set in extractPagesFromPdf
//     }
//   };

//   const addToCart = async () => {
//     if (!file) {
//       setErrorMessage("Please upload a PDF file first.");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage(null);

//     try {
//       const fileForCart = getFileForCart(
//         file,
//         extractedPdf,
//         printOption.pageRange
//       );
//       const previewUrl = extractedFileUrl;

//       // Extract serializable metadata from the file for the cart.
//       const fileMetadata = {
//         name: fileForCart.name,
//         size: fileForCart.size,
//         type: fileForCart.type,
//         lastModified: fileForCart.lastModified,
//         previewUrl: previewUrl,
//       };

//       // Dispatch serializable metadata to Redux.
//       dispatch(
//         addCartItem({
//           pdf: fileMetadata,
//           printOptions: printOption,
//         })
//       );

//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:3000/order/addToCart",
//         {
//           orderData: {
//             pdf: fileMetadata, // use the full metadata
//             printOptions: printOption,
//           },
//         },
//         { headers: { token } }
//       );

//       console.log("Item added to cart.");
//       clearFile();
//     } catch (error) {
//       console.error("Error adding to cart", error);
//       setErrorMessage("Error adding to cart. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Clean up object URL on unmount.
//   useEffect(() => {
//     return () => {
//       if (extractedUrlRef.current) {
//         URL.revokeObjectURL(extractedUrlRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (file) {
//       handleExtractPages();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [file, printOption.pageRange]);

//   return (
//     <>
//       <Header />
//       <div className="flex justify-evenly items-start pt-[2rem]">
//         <div className="flex w-[100%] justify-center gap-10 items-start">
//           {!file && (
//             <div className="max-w-2xl p-8">
//               <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>
//               <PDFDropzone onFileAccepted={handleFileAccepted} />
//             </div>
//           )}
//           {file && (
//             <div className="flex items-center justify-center">
//               <PdfPreview pdf={extractedFileUrl} /> {/* Always passing a URL */}
//             </div>
//           )}
//           <div className="flex flex-col items-start justify-start gap-4">
//             <div>
//               <PrintOptionsForm />
//             </div>
//             {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//             {isLoading && <p>Processing...</p>}
//             {file && (
//               <div className="flex flex-col w-full gap-4">
//                 <button
//                   type="button"
//                   onClick={clearFile}
//                   className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-500 transition"
//                 >
//                   Clear Document Selected
//                 </button>
//                 <button
//                   type="button"
//                   onClick={addToCart}
//                   disabled={isLoading}
//                   className={`w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md transition ${
//                     isLoading
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:bg-green-500"
//                   }`}
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             )}
//             <div className="flex flex-col w-full gap-4">
//               <Link to="/cart">
//                 <button
//                   type="button"
//                   className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-500 transition"
//                 >
//                   Go to Cart
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;
