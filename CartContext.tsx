// src/context/CartContext.tsx (or wherever your context files are)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of a product in the cart
interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string; // Optional image
  quantity: number;
}

// Define the shape of the cart context value
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { _id: string; name: string; price: number; image?: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Initialize cart from localStorage or as an empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') { // Check if window is defined (for SSR compatibility)
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart or increase quantity if already present
  const addToCart = (product: { _id: string; name: string; price: number; image?: string }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item completely from cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // Update quantity of a specific item
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item._id !== id); // Remove if quantity is 0 or less
      }
      return prevCart.map((item) =>
        item._id === id ? { ...item, quantity: quantity } : item
      );
    });
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total number of items in the cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of all items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};