// src/contexts/CartFileContext.js
import { createContext, useContext, useState } from "react";
const CartFileContext = createContext();

export const CartFileProvider = ({ children }) => {
  // This state will hold an array of File objects, keyed by a unique identifier (like a cart item ID)
  const [cartFiles, setCartFiles] = useState([]);

  const addCartFile = (fileData) => {
    // fileData can be an object { id, file } where id uniquely identifies the cart item
    setCartFiles((prev) => [...prev, fileData]);
  };

  const getCartFile = (id) => {
    return cartFiles.find((item) => item.id === id)?.file;
  };

  const clearCartFiles = () => {
    setCartFiles([]);
  };

  return (
    <CartFileContext.Provider
      value={{ cartFiles, addCartFile, getCartFile, clearCartFiles }}
    >
      {children}
    </CartFileContext.Provider>
  );
};

export const useCartFiles = () => useContext(CartFileContext);
