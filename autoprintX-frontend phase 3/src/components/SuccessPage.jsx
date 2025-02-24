import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/app/slices/cartSlice";
import { useCartFiles } from "@/contexts/CartFileContext";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils/api";

const SuccessPage = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customer = useSelector((state) => state.user.customer);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { getCartFile, clearCartFiles } = useCartFiles();
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      setError("User is not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    const verifyPaymentAndSendOrder = async () => {
      const query = new URLSearchParams(window.location.search);
      const sessionId = query.get("session_id");

      if (!sessionId) {
        setError("Session ID not found.");
        setLoading(false);
        return;
      }

      try {
        // Verify payment with backend
        const verifyResponse = await axios.post(API.VERIFY_SESSION, {
          sessionId,
        });
        setPaymentDetails(verifyResponse.data);

        // Trigger order submission
        await sendOrder();

        // Remove query parameters from URL to prevent reprocessing on refresh
        if (window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname);
        }

        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        console.error("Error retrieving payment details:", err);
        setError("Error retrieving payment details. Please try again.");
        setLoading(false);
      }
    };

    verifyPaymentAndSendOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const sendOrder = async () => {
    try {
      const formData = new FormData();

      // Build order items array with id and print options
      const orderItems = cartItems.map((item) => ({
        id: item.id,
        printOptions: item.printOptions,
      }));

      // Calculate overall cost estimate
      const costEstimate = cartItems.reduce(
        (sum, item) => sum + (item.printOptions?.estimatedCost || 0),
        0
      );

      // Append order details as a JSON string
      formData.append(
        "orderData",
        JSON.stringify({
          customer: customer.id,
          costEstimate,
          items: cartItems.map((item) => ({
            printOptions: item.printOptions,
            // Include the S3 URL and any other file metadata from the pre-upload
            s3Url: item.pdf.s3Url,
            fileName: item.pdf.name,
            pages: item.pdf.pages || 1,
          })),
        })
      );

      const orderResponse = await axios.post(API.PROCESS_ORDER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Order processed successfully:", orderResponse.data);
      // Clear the cart in Redux and context after successful order
      dispatch(clearCart());
      clearCartFiles();
    } catch (err) {
      console.error("Error sending order:", err);
      setError("Error sending order. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading payment details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ color: "green" }}>Payment Successful!</h2>
      <p>
        <strong>Amount Paid:</strong> ₹
        {(paymentDetails.amountPaid / 100).toFixed(2)}
      </p>
      <p>
        <strong>Payment Status:</strong> {paymentDetails.paymentStatus}
      </p>
      <p>
        <strong>Customer Email:</strong> {paymentDetails.customerEmail}
      </p>
      <p>
        <strong>Payment Method:</strong> {paymentDetails.paymentMethodType}
      </p>
      <p>
        <strong>Card Details:</strong> {paymentDetails.cardType} ending in{" "}
        {paymentDetails.cardLast4}
      </p>
      {paymentDetails.stripeFee && (
        <p>
          <strong>Stripe Fee:</strong> ₹
          {(paymentDetails.stripeFee / 100).toFixed(2)}
        </p>
      )}
      <p>
        <strong>Receipt:</strong>{" "}
        <a
          href={paymentDetails.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue" }}
        >
          View Receipt
        </a>
      </p>
    </div>
  );
};

export default SuccessPage;
