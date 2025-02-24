import { FaPrint, FaFileAlt, FaPalette, FaCopy, FaTrash } from "react-icons/fa";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useCartFiles } from "@/contexts/CartFileContext.jsx";
import { API } from "@/utils/api";

// Stripe public key - Replace with your actual public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  const { getCartFile } = useCartFiles();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  let files = getCartFile();

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(API.GET_CART_ITEMS);
        setCartItems(response.data.cart || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate total cost
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.printOptions?.estimatedCost || 0),
      0
    );
    setCartTotal(total);
  }, [cartItems]);

  // Remove item from cart
  const handleRemove = async (index) => {
    try {
      await axios.post(API.REMOVE_FROM_CART, { index });
      setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  // Checkout with Stripe
  const handleCheckout = async () => {
    try {
      const response = await axios.post(API.CREATE_CHECKOUT_SESSION, {
        amount: cartTotal,
        cartItems,
      });

      const { sessionId } = response.data;
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        <FaFileAlt className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <FaPrint className="h-8 w-8 text-blue-600" />
        Your Print Cart
      </h2>

      <div className="space-y-6">
        {cartItems.map((item, index) => {
          const options = item.printOptions;
          const isColor = options.color === "color";
          const itemCost = options.estimatedCost || 0;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaFileAlt className="h-5 w-5 text-blue-500" />
                    {options.fileName || item.pdf.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {options.paperSize} • {options.orientation}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <FaTrash className="h-5 w-5" />
                  <span className="text-sm font-medium">Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPalette
                    className={`h-5 w-5 ${
                      isColor ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isColor ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {isColor ? "Color" : "B/W"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FaCopy className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">
                    {options.copies} {options.copies > 1 ? "copies" : "copy"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h10V4H4zm3 2h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {options.duplex ? "Double-sided" : "Single-sided"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-cyan-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h10V4H4zm3 2h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Binding:{" "}
                    {options.binding === "none" ? "None" : options.binding}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Estimated delivery: 24-48hrs
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Item Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{itemCost}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end items-center">
        <div className="mr-4 text-xl font-bold text-blue-600">
          Cart Total: ₹{cartTotal}
        </div>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
