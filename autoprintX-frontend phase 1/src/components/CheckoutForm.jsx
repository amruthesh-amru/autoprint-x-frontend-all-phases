import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export const CheckoutForm = ({ costEstimate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://your-website.com/order-complete",
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      // Handle successful payment here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div>{errorMessage}</div>}
      <button type="submit" disabled={!stripe}>
        Pay {costEstimate}
      </button>
    </form>
  );
};
