"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { StaticImageData } from 'next/image';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string | StaticImageData;
  cuisine: string;
  category: string;
  'data-ai-hint'?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartHydrated, setIsCartHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('foodie-forecast-cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Could not read cart from localStorage", error);
    }
    setIsCartHydrated(true);
  }, []);

  useEffect(() => {
    if (isCartHydrated) {
      try {
        localStorage.setItem('foodie-forecast-cart', JSON.stringify(cart));
      } catch (error) {
        console.error("Could not save cart to localStorage", error);
      }
    }
  }, [cart, isCartHydrated]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartHydrated,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartHydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
