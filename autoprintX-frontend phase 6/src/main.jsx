import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import AppRouter from "./appRouter";
import { PersistGate } from "redux-persist/integration/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CartFileProvider } from "./contexts/CartFileContext";
import { Toaster } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <Provider store={store}>
        <CartFileProvider>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <AppRouter />
            <Toaster position="top-right" />
          </PersistGate>
        </CartFileProvider>
      </Provider>
    </Elements>
  </BrowserRouter>
);
