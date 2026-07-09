import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const COUPONS = {
  "WELCOME10": 0.10,
  "LUXE20": 0.20
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('luxecraft_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading cart from localStorage", e);
      }
    }
    return [];
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    localStorage.setItem('luxecraft_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(item => item.product.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercent(0);
    setCouponError('');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (COUPONS[cleanCode] !== undefined) {
      setCouponCode(cleanCode);
      setDiscountPercent(COUPONS[cleanCode]);
      setCouponError('');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or LUXE20.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setCouponError('');
  };

  // Calculations
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    return getSubtotal() * discountPercent;
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 150 ? 0 : 15.00; // Free shipping above $150
  };

  const getTaxAmount = () => {
    const taxableTotal = getSubtotal() - getDiscountAmount();
    return Math.max(0, taxableTotal * 0.08); // 8% sales tax
  };

  const getGrandTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShippingCost() + getTaxAmount();
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      couponCode,
      discountPercent,
      couponError,
      applyCoupon,
      removeCoupon,
      getSubtotal,
      getDiscountAmount,
      getShippingCost,
      getTaxAmount,
      getGrandTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
