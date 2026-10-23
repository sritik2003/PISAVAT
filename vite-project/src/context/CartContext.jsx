import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponAPI } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('pisawat_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('pisawat_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Fetch available coupons on mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const res = await couponAPI.getAll();
      if (res.success && res.coupons) {
        setAvailableCoupons(res.coupons.filter(c => c.isActive));
      }
    } catch (err) {
      console.warn('Could not fetch coupons:', err.message);
    }
  };

  useEffect(() => {
    localStorage.setItem('pisawat_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('pisawat_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('pisawat_coupon');
    }
  }, [appliedCoupon]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addToCart = (product, quantity = 1) => {
    const productId = product._id || product.slug || product.id;
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === productId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: productId,
            productRef: product._id,
            name: product.name,
            subTitle: product.subTitle,
            price: product.price || 99,
            image: product.image,
            weight: product.weight || '100g Pack',
            seller: product.seller || undefined,
            quantity
          }
        ];
      }
    });

    showToast(`Added ${product.name} to cart!`);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recalculate discount based on current cartTotal
  let couponDiscount = 0;
  if (appliedCoupon && cartTotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      let disc = Math.round((cartTotal * appliedCoupon.discountAmount) / 100);
      if (appliedCoupon.maxDiscount) disc = Math.min(disc, appliedCoupon.maxDiscount);
      couponDiscount = disc;
    } else {
      couponDiscount = Math.min(appliedCoupon.discountAmount, cartTotal);
    }
  }

  const discountedTotal = Math.max(0, cartTotal - couponDiscount);
  const shippingPrice = discountedTotal > 499 || cartCount === 0 ? 0 : 40;
  const grandTotal = cartCount === 0 ? 0 : discountedTotal + shippingPrice;

  // Apply Coupon function
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code');
      return { success: false, message: 'Please enter a coupon code' };
    }

    if (cartTotal <= 0) {
      setCouponError('Your cart is empty. Add products to apply coupon.');
      return { success: false, message: 'Your cart is empty' };
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await couponAPI.apply(code.trim().toUpperCase(), cartTotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        showToast(`🎉 Coupon ${res.coupon.code} applied! Saved ₹${res.discountValue}`);
        setCouponLoading(false);
        return { success: true, message: res.message };
      }
    } catch (err) {
      const msg = err.message || 'Failed to apply coupon';
      setCouponError(msg);
      setCouponLoading(false);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    showToast('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        couponDiscount,
        discountedTotal,
        shippingPrice,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        availableCoupons,
        refreshCoupons: fetchAvailableCoupons,
        couponLoading,
        couponError,
        setCouponError,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toastMessage,
        showToast
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
