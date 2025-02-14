import React, { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; 


export const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const productWithId = { ...product, id: uuidv4() }; // Add a unique id
    setCart((prevCart) => [...prevCart, productWithId]);
  };

  return (
    <ShoppingCartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

