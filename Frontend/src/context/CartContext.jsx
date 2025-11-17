import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i._id === item._id);

      if (existingItem) {
        return prevItems.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i._id === itemId);

      if (existingItem.quantity === 1) {
        return prevItems.filter(i => i._id !== itemId);
      } else {
        return prevItems.map(i =>
          i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    });
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemCount = (itemId) => {
    return cartItems.find(i => i._id === itemId)?.quantity || 0;
  };

  // --- (1) NAYA FUNCTION ADD KIYA ---
  const getTotalPrice = () => {
    // Yeh har item ki price ko uski quantity se multiply kar ke jama karega
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  // ---------------------------------

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    getCartCount,
    getItemCount,
    getTotalPrice, // (2) Context value mein add kiya
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};