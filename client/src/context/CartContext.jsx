import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dabbaroti_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('dabbaroti_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Could not save cart:', err);
    }
  }, [cartItems]);

  // Add plan or item to cart
  const addToCart = (item) => {
    // Check if duplicate plan
    const existingIndex = cartItems.findIndex(
      (c) => c._id === item._id && c.startDate === item.startDate
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
      setCartItems(updated);
      toast.success(`Updated quantity for ${item.title || item.name}`);
    } else {
      const newItem = {
        ...item,
        quantity: item.quantity || 1,
        cartId: 'item_' + Date.now() + Math.random().toString(36).substr(2, 4),
        startDate: item.startDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setCartItems((prev) => [...prev, newItem]);
      toast.success(`Added ${item.title || item.name} to your tiffin cart!`);
    }
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const updateItemStartDate = (cartId, startDate) => {
    setCartItems((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, startDate } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('dabbaroti_cart');
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  // Delivery charge calculation (Free on orders > 1000 or subscriptions)
  const deliveryCharge = cartItems.length > 0 && subtotal < 1000 ? 40 : 0;

  // Coupon discount calculation
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Final Total
  const total = Math.max(0, subtotal - discount + deliveryCharge);

  const applyCouponCode = async (code) => {
    if (!code) {
      toast.error('Please enter a coupon code');
      return false;
    }
    try {
      const res = await api.applyCoupon(code, subtotal);
      if (res.success) {
        setAppliedCoupon({
          code: res.code,
          discountPercent: res.discountPercent,
          discountAmount: res.discountAmount
        });
        toast.success(res.message);
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.message || 'Invalid coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemStartDate,
        clearCart,
        subtotal,
        deliveryCharge,
        discount,
        total,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        totalItemsCount: cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
