import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMLM } from './MLMContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { commissionRules } = useMLM();
  const qualifyingThreshold = commissionRules?.qualifyingOrderAmount || 2000;

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Seed with the 2 items matching the design reference screenshot:
    return [
      {
        id: "prod-shilajit-gold",
        name: "Shilajit Gold",
        price: 2199,
        mrp: 3200,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        isQualifying: true,
        bv: 110
      },
      {
        id: "prod-starter-pack",
        name: "Starter Pack",
        price: 2000,
        mrp: 2800,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
        isQualifying: true,
        bv: 100
      }
    ];
  });

  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('directgrow_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        quantity: qty,
        image: product.image,
        isQualifying: product.isQualifying,
        bv: product.bv || 0
      }];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalBv = items.reduce((acc, item) => acc + ((item.bv || 0) * item.quantity), 0);
  const discount = coupon ? (coupon.type === 'PERCENT' ? (subtotal * coupon.value) / 100 : coupon.value) : 0;
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  const isQualifyingOrder = total >= qualifyingThreshold;
  const progressToQualifying = Math.min(100, Math.round((total / qualifyingThreshold) * 100));
  const amountNeededForQualifying = Math.max(0, qualifyingThreshold - total);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalBv,
        discount,
        shipping,
        total,
        coupon,
        setCoupon,
        isQualifyingOrder,
        progressToQualifying,
        amountNeededForQualifying,
        qualifyingThreshold,
        cartCount: items.reduce((sum, i) => sum + i.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

