import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  ShoppingBag, 
  Tag, 
  Percent, 
  Check, 
  Sparkles, 
  FileText,
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

export default function CartDrawer({ onOpenInvoice }) {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    couponDiscount, 
    discountedTotal, 
    shippingPrice, 
    grandTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    availableCoupons, 
    couponLoading, 
    couponError, 
    setCouponError, 
    isCartOpen, 
    closeCart 
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [inputCouponCode, setInputCouponCode] = useState('');

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

  const handleApplyCouponSubmit = async (e) => {
    e.preventDefault();
    if (!inputCouponCode.trim()) return;
    const res = await applyCoupon(inputCouponCode.trim());
    if (res.success) {
      setInputCouponCode('');
    }
  };

  const handleSelectCouponPill = async (code) => {
    setInputCouponCode(code);
    await applyCoupon(code);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
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
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount: couponDiscount
        } : undefined,
        totalAmount: grandTotal,
        notes: formData.notes,
        orderItems: cartItems.map(item => ({
          product: item.productRef || undefined,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          weight: item.weight,
          seller: item.seller || undefined
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-[#12151c] h-full shadow-2xl flex flex-col border-l border-gray-800 relative z-10">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-[#151922]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {checkoutStep === 'cart' && `Your Cart (${cartItems.length} items)`}
              {checkoutStep === 'checkout' && 'Checkout & Delivery Details'}
              {checkoutStep === 'success' && 'Order Successfully Placed!'}
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800/60 flex items-center justify-center text-gray-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">Your cart is currently empty</h4>
                    <p className="text-xs text-gray-400 mt-1">Explore our 100% pure stone-ground spices and add your favorites!</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition shadow-lg shadow-amber-500/20"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Item List */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-900/70 border border-gray-800 rounded-xl"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-800 border border-gray-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-xs sm:text-sm truncate">{item.name}</h4>
                          <p className="text-[11px] text-gray-400">{item.weight} • ₹{item.price}</p>
                          <div className="flex items-center space-x-2 mt-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold text-white px-1.5">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end justify-between h-14">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-rose-400 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-white text-xs sm:text-sm">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* --- SEPARATE COUPON CODE FORM STRUCTURE --- */}
                  <div className="bg-gradient-to-br from-amber-500/10 via-gray-900 to-gray-900 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Apply Discount Coupon
                        </h4>
                      </div>
                      <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto Price Update
                      </span>
                    </div>

                    {/* Applied Coupon Active State */}
                    {appliedCoupon ? (
                      <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between animate-fadeIn">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-emerald-300 text-xs tracking-wider">
                                {appliedCoupon.code}
                              </span>
                              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                                APPLIED
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-400/90 font-medium">
                              Saved ₹{couponDiscount} on this order!
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      /* Coupon Input Form Structure */
                      <form onSubmit={handleApplyCouponSubmit} className="space-y-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={inputCouponCode}
                              onChange={(e) => {
                                setInputCouponCode(e.target.value.toUpperCase());
                                if (couponError) setCouponError('');
                              }}
                              placeholder="Enter coupon (e.g. SPICE20)"
                              className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white font-mono uppercase text-xs rounded-xl px-3 py-2.5 outline-none transition"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={couponLoading || !inputCouponCode.trim()}
                            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center"
                          >
                            {couponLoading ? 'Applying...' : 'Apply'}
                          </button>
                        </div>

                        {couponError && (
                          <div className="text-[11px] text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{couponError}</span>
                          </div>
                        )}
                      </form>
                    )}

                    {/* Quick Available Coupons Chips */}
                    {availableCoupons.length > 0 && !appliedCoupon && (
                      <div className="pt-2 border-t border-gray-800/80 space-y-1.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                          Available Offers:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {availableCoupons.map((coupon) => (
                            <button
                              key={coupon._id}
                              type="button"
                              onClick={() => handleSelectCouponPill(coupon.code)}
                              className="bg-gray-800/80 hover:bg-amber-500/20 hover:border-amber-500/50 border border-gray-700 rounded-lg px-2.5 py-1 text-[11px] text-gray-300 hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer font-mono"
                            >
                              <Tag className="w-3 h-3 text-amber-400" />
                              <span className="font-bold">{coupon.code}</span>
                              <span className="text-gray-400 text-[10px]">
                                ({coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* --- END COUPON FORM STRUCTURE --- */}

                  {/* Order Summary & Pricing Breakdown */}
                  <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-300">
                      <span>Items Subtotal</span>
                      <span className="font-medium">₹{cartTotal}</span>
                    </div>

                    {appliedCoupon && couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold animate-fadeIn">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" /> Coupon Discount ({appliedCoupon.code})
                        </span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-300">
                      <span>Standard Delivery Shipping</span>
                      <span className={shippingPrice === 0 ? "text-emerald-400 font-semibold" : "font-medium"}>
                        {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                      </span>
                    </div>

                    <div className="border-t border-gray-800 pt-2 flex justify-between text-sm font-bold text-white">
                      <span>Net Payable Amount</span>
                      <span className="text-amber-400 text-base">₹{grandTotal}</span>
                    </div>

                    {shippingPrice > 0 && (
                      <p className="text-[10px] text-gray-500 italic">
                        Tip: Add ₹{500 - discountedTotal} more to qualify for FREE shipping!
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Order quick summary with applied coupon */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 block">{cartItems.length} items in order</span>
                  {appliedCoupon && (
                    <span className="text-emerald-400 text-[11px] font-medium">
                      Coupon '{appliedCoupon.code}' applied (-₹{couponDiscount})
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">Total Amount</span>
                  <span className="text-base font-extrabold text-amber-400">₹{grandTotal}</span>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-amber-400">
                  Customer & Shipping Address
                </h4>
                
                <div>
                  <label className="text-gray-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                    placeholder="e.g. Aman Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      placeholder="e.g. 9811223344"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      placeholder="e.g. aman@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Street Address</label>
                  <textarea
                    name="street"
                    required
                    rows="2"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                    placeholder="House/Flat No., Street, Landmark"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-gray-400 block mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-2.5 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-2.5 py-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500 text-white rounded-xl px-2.5 py-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['COD', 'Online UPI', 'Card'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, paymentMethod: method }))}
                        className={`p-2.5 rounded-xl border text-center transition font-medium cursor-pointer ${
                          formData.paymentMethod === method
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && placedOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Order Confirmed!</h4>
                <p className="text-xs text-gray-400 mt-1">Thank you for ordering with Pisawat Spices.</p>
                <div className="mt-3 bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs inline-block text-left space-y-1">
                  <p className="text-gray-400">Order ID: <span className="text-white font-mono font-bold">{placedOrder._id}</span></p>
                  <p className="text-gray-400">Total Paid: <span className="text-amber-400 font-bold">₹{placedOrder.totalAmount}</span></p>
                  {placedOrder.coupon?.code && (
                    <p className="text-emerald-400">
                      Coupon Applied: <span className="font-mono font-bold">{placedOrder.coupon.code}</span> (-₹{placedOrder.coupon.discountAmount})
                    </p>
                  )}
                  <p className="text-gray-400">Status: <span className="text-emerald-400 font-semibold">{placedOrder.orderStatus}</span></p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {onOpenInvoice && (
                  <button
                    onClick={() => {
                      closeCart();
                      onOpenInvoice(placedOrder);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Print Tax Invoice</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    closeCart();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {checkoutStep !== 'success' && cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-800 bg-[#151922]">
            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="px-2 py-0.5 rounded bg-black/20 text-xs">₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : `Confirm & Place Order (₹${grandTotal})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
