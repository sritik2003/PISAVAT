import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Percent,
  Check,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sellerAPI, couponAPI } from '../services/api';

export default function SellerDashboardModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'coupons'
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ productsCount: 0, totalOrders: 0, totalRevenue: 0 });

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Product Form State (Add / Edit)
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    subTitle: '',
    price: 99,
    originalPrice: 129,
    weight: '100g Pack',
    category: 'Ground Spices',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    description: '',
    rating: 4.8,
    reviewsCount: 15,
    inStock: true
  });

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'fixed',
    discountAmount: 40,
    minOrderAmount: 200,
    maxDiscount: 200
  });
  const [couponMsg, setCouponMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSellerData();
    }
  }, [isOpen]);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, statRes, coupRes] = await Promise.all([
        sellerAPI.getProducts(),
        sellerAPI.getOrders(),
        sellerAPI.getStats(),
        couponAPI.getAll()
      ]);

      if (prodRes.success) setProducts(prodRes.products || []);
      if (orderRes.success) setOrders(orderRes.orders || []);
      if (statRes.success) setStats(statRes.stats || {});
      if (coupRes.success) setCoupons(coupRes.coupons || []);
    } catch (err) {
      console.warn('Failed to load seller portal data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Handle Product Save
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProductId) {
        await sellerAPI.updateProduct(editingProductId, productForm);
      } else {
        await sellerAPI.createProduct(productForm);
      }
      setIsProductFormOpen(false);
      setEditingProductId(null);
      await loadSellerData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name,
      subTitle: prod.subTitle || '',
      price: prod.price,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.25),
      weight: prod.weight || '100g Pack',
      category: prod.category || 'Ground Spices',
      image: prod.image,
      description: prod.description,
      rating: prod.rating || 4.8,
      reviewsCount: prod.reviewsCount || 10,
      inStock: prod.inStock !== undefined ? prod.inStock : true
    });
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await sellerAPI.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await sellerAPI.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Handle Coupon Create
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponMsg('');
    try {
      const res = await couponAPI.create(couponForm);
      if (res.success && res.coupon) {
        setCouponMsg(`Coupon '${res.coupon.code}' created successfully!`);
        setCoupons(prev => [res.coupon, ...prev]);
        setCouponForm({
          code: '',
          title: '',
          description: '',
          discountType: 'fixed',
          discountAmount: 40,
          minOrderAmount: 200,
          maxDiscount: 200
        });
      }
    } catch (err) {
      setCouponMsg(`Error: ${err.message}`);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      const res = await couponAPI.toggleStatus(id);
      if (res.success && res.coupon) {
        setCoupons(prev => prev.map(c => (c._id === id ? res.coupon : c)));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponAPI.delete(id);
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12151c] border border-gray-800 max-w-4xl w-full rounded-3xl p-5 sm:p-7 relative max-h-[92vh] flex flex-col shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Seller Dashboard</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black">
                  Seller Portal
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Store: <strong className="text-amber-300">{user?.storeName || `${user?.name}'s Spices`}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSellerData}
              className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">My Products</span>
            <span className="text-2xl font-black text-white mt-1 block">{products.length}</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">Total Orders</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{orders.length}</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold block">Total Revenue</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">₹{stats.totalRevenue || 0}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 mb-5 gap-2">
          {[
            { id: 'products', label: 'My Products', icon: Package, count: products.length },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: orders.length },
            { id: 'coupons', label: 'Coupons & Discounts', icon: Tag, count: coupons.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-800 text-gray-300">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* --- TAB CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto pr-1">
          
          {/* 1. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Manage, edit, or list new spice items</span>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm({
                      name: '',
                      subTitle: '',
                      price: 99,
                      originalPrice: 129,
                      weight: '100g Pack',
                      category: 'Ground Spices',
                      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
                      description: '',
                      rating: 4.8,
                      reviewsCount: 15,
                      inStock: true
                    });
                    setIsProductFormOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Add/Edit Modal */}
              {isProductFormOpen && (
                <div className="p-4 sm:p-5 bg-gray-900 border border-amber-500/40 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-400" />
                      {editingProductId ? 'Edit Product' : 'Add New Spice Product'}
                    </h4>
                    <button
                      onClick={() => setIsProductFormOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Product Title / Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Kashmiri Lal Mirch Powder"
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">Subtitle / Tagline</label>
                        <input
                          type="text"
                          value={productForm.subTitle}
                          onChange={(e) => setProductForm(p => ({ ...p, subTitle: e.target.value }))}
                          placeholder="e.g. Mild Heat & Rich Color"
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm(p => ({ ...p, price: Number(e.target.value) }))}
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Original MRP (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm(p => ({ ...p, originalPrice: Number(e.target.value) }))}
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Rating (1 to 5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={productForm.rating}
                          onChange={(e) => setProductForm(p => ({ ...p, rating: Number(e.target.value) }))}
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Reviews Count</label>
                        <input
                          type="number"
                          value={productForm.reviewsCount}
                          onChange={(e) => setProductForm(p => ({ ...p, reviewsCount: Number(e.target.value) }))}
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        >
                          <option value="Ground Spices">Ground Spices</option>
                          <option value="Whole Spices">Whole Spices</option>
                          <option value="Blended Spices">Blended Spices</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">Packaging Weight</label>
                        <input
                          type="text"
                          value={productForm.weight}
                          onChange={(e) => setProductForm(p => ({ ...p, weight: e.target.value }))}
                          placeholder="e.g. 100g Pack, 250g, 500g"
                          className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Image URL *</label>
                      <input
                        type="url"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm(p => ({ ...p, image: e.target.value }))}
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Full Description *</label>
                      <textarea
                        required
                        rows="3"
                        value={productForm.description}
                        onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Detailed authentic description of source, purity, aroma..."
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                        <input
                          type="checkbox"
                          checked={productForm.inStock}
                          onChange={(e) => setProductForm(p => ({ ...p, inStock: e.target.checked }))}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span>Currently In Stock</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsProductFormOpen(false)}
                          className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold"
                        >
                          {editingProductId ? 'Update Product' : 'Publish Product'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List Table */}
              <div className="space-y-3">
                {products.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-xs">
                    No products added yet. Click "+ Add New Product" to start selling.
                  </div>
                ) : (
                  products.map((prod) => (
                    <div
                      key={prod._id}
                      className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded-xl object-cover bg-gray-800 shrink-0 border border-gray-700"
                        />
                        <div>
                          <h5 className="font-bold text-white text-sm">{prod.name}</h5>
                          <p className="text-xs text-gray-400">{prod.weight} • {prod.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-extrabold text-amber-400 text-sm">₹{prod.price}</span>
                            <span className="text-[11px] text-amber-400 flex items-center gap-0.5">
                              ★ {prod.rating || 4.8} ({prod.reviewsCount || 0} reviews)
                            </span>
                            <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                              prod.inStock ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {prod.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-2 rounded-xl bg-gray-800 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <span className="text-xs text-gray-400 block">Orders placed by customers for your spice products</span>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No customer orders received yet.
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
                      <div>
                        <span className="font-mono font-bold text-white text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                        <p className="text-[11px] text-gray-400">
                          Customer: <strong className="text-gray-200">{order.customerName}</strong> ({order.customerPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-amber-400 text-sm">₹{order.totalAmount}</span>
                        {/* Status Select */}
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="bg-gray-950 border border-gray-700 text-amber-400 font-bold rounded-xl px-2.5 py-1 text-xs outline-none cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300">
                          <span>{item.name} × {item.quantity} ({item.weight})</span>
                          <span className="font-medium text-white">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-800/60 text-[11px] text-gray-400">
                      Shipping to: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-5">
              {/* Separate Coupon Creation Form Structure */}
              <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Create New Discount Coupon
                  </h4>
                </div>
                <p className="text-xs text-gray-400">
                  Create custom discount promo codes for your buyers to boost sales.
                </p>

                {couponMsg && (
                  <div className={`p-2.5 rounded-xl text-xs font-medium ${
                    couponMsg.startsWith('Error') ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'
                  }`}>
                    {couponMsg}
                  </div>
                )}

                <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        value={couponForm.code}
                        onChange={(e) => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                        placeholder="e.g. SELLER25"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white font-mono uppercase rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Discount Type</label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm(p => ({ ...p, discountType: e.target.value }))}
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      >
                        <option value="fixed">Flat Discount (₹)</option>
                        <option value="percentage">Percentage Off (%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Discount Value *</label>
                      <input
                        type="number"
                        required
                        value={couponForm.discountAmount}
                        onChange={(e) => setCouponForm(p => ({ ...p, discountAmount: Number(e.target.value) }))}
                        placeholder="e.g. 50 or 20"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Min Order Amount (₹)</label>
                      <input
                        type="number"
                        value={couponForm.minOrderAmount}
                        onChange={(e) => setCouponForm(p => ({ ...p, minOrderAmount: Number(e.target.value) }))}
                        placeholder="e.g. 200"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Title / Offer Banner</label>
                      <input
                        type="text"
                        value={couponForm.title}
                        onChange={(e) => setCouponForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Weekend Mega Festive Saver"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      Publish Coupon
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Active Coupons:
                </span>
                {coupons.map((c) => (
                  <div
                    key={c._id}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                        %
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">{c.code}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                            c.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-800 text-gray-500'
                          }`}>
                            {c.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {c.discountType === 'percentage' ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} Flat OFF`} • Min order ₹{c.minOrderAmount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCoupon(c._id)}
                        className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                      >
                        {c.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
