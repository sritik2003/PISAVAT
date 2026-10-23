import React, { useState } from 'react';
import { X, Trash2, ArrowRight, CheckCircle2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, closeCart } = useCart();
  const { user } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Faridabad',
    state: user?.address?.state || 'Haryana',
    pincode: user?.address?.pincode || '121003',
    paymentMethod: 'COD',
    notes: ''
  });

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const shippingPrice = cartTotal > 499 ? 0 : 40;
      const totalAmount = cartTotal + shippingPrice;

      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice,
        totalAmount,
        notes: formData.notes,
        orderItems: cartItems.map(item => ({
          product: item.productRef || undefined,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          weight: item.weight
        }))
      };

      const res = await orderAPI.create(orderPayload);
      if (res.success && res.order) {
        setPlacedOrder(res.order);
        setCheckoutStep('success');
        clearCart();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shippingPrice = cartTotal > 499 ? 0 : 40;
  const grandTotal = cartTotal + shippingPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#12151c] h-full shadow-2xl flex flex-col border-l border-gray-800 relative z-10">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {checkoutStep === 'cart' && `Your Cart (${cartItems.length})`}
              {checkoutStep === 'checkout' && 'Checkout & Delivery'}
              {checkoutStep === 'success' && 'Order Placed!'}
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-600" />
                  <p className="text-sm">Your cart is currently empty.</p>
                  <button
                    onClick={closeCart}
                    className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    ← Browse Pisawat Spices
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-amber-400">{item.weight}</p>
                      <p className="text-xs font-semibold text-white mt-1">₹{item.price}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 bg-gray-800 border border-gray-700 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-gray-300 hover:text-white text-xs font-bold px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-gray-300 hover:text-white text-xs font-bold px-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-gray-800 bg-[#0d0f12] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Charges</span>
                    <span className="text-white font-medium">
                      {shippingPrice === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        `₹${shippingPrice}`
                      )}
                    </span>
                  </div>
                  {shippingPrice > 0 && (
                    <p className="text-[10px] text-amber-400">
                      Add ₹{500 - cartTotal} more for FREE shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                    <span>Total</span>
                    <span className="text-amber-400 text-base">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aman Sharma"
                  className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="aman@example.com"
                    className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Delivery Address *</label>
                <textarea
                  name="street"
                  required
                  rows={2}
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="House/Flat No., Street, Landmark"
                  className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-medium ${
                    formData.paymentMethod === 'COD' 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                      : 'border-gray-800 bg-gray-900 text-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span>Cash on Delivery</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-medium ${
                    formData.paymentMethod === 'Online UPI' 
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                      : 'border-gray-800 bg-gray-900 text-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online UPI"
                      checked={formData.paymentMethod === 'Online UPI'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span>UPI / QR on Delivery</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-gray-800 bg-[#0d0f12] space-y-2.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Amount to Pay (COD)</span>
                <span className="text-amber-400 font-bold text-sm">₹{grandTotal}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="w-1/3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <span>Confirm & Place Order</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {checkoutStep === 'success' && placedOrder && (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Thank you for choosing Pisawat Spices. Your order has been placed in our MongoDB system and will be freshly ground and packed.
            </p>

            <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-amber-400 font-bold">{placedOrder._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Customer:</span>
                <span className="text-white">{placedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Amount:</span>
                <span className="text-white font-bold">₹{placedOrder.totalAmount} ({placedOrder.paymentMethod})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-emerald-400">{placedOrder.orderStatus}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCheckoutStep('cart');
                closeCart();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-xs transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
