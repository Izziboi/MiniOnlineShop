import React, { createContext, useState } from 'react';

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutItems, setCheckoutItems] = useState([]);

  const addToCheckout = (product) => {
    setCheckoutItems((prevItems) => {
      // Check if the product already exists, and if so, update its units
      const existingProduct = prevItems.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, units: item.units + product.units } : item
        );
      }
      return [...prevItems, product];
    });
  };

  return (
    <CheckoutContext.Provider value={{ checkoutItems, setCheckoutItems, addToCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}
