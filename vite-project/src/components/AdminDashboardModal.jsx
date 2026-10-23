import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  Tag, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Search, 
  RefreshCw, 
  DollarSign, 
  Lock,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI, orderAPI, couponAPI } from '../services/api';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'products' | 'orders' | 'coupons'
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  // Tab Data
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // User Filter States
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountAmount: 20,
    minOrderAmount: 200,
    maxDiscount: 150
  });
  const [couponMsg, setCouponMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, prodRes, orderRes, coupRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStats(),
        productAPI.getAll(),
        orderAPI.getAll(),
        couponAPI.getAll()
      ]);

      if (usersRes.success) setUsers(usersRes.users || []);
      if (statsRes.success) setStats(statsRes.stats || {});
      if (prodRes.success) setProducts(prodRes.products || []);
      if (orderRes.success) setOrders(orderRes.orders || []);
      if (coupRes.success) setCoupons(coupRes.coupons || []);
    } catch (err) {
      console.warn('Failed to load admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Change user account status (suspend, hold, activate)
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const res = await adminAPI.updateUserStatus(userId, newStatus);
      if (res.success) {
        setUsers(prev => prev.map(u => (u._id === userId ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  // Change user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await orderAPI.updateStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Admin Coupon Create
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponMsg('');
    try {
      const res = await couponAPI.create(couponForm);
      if (res.success && res.coupon) {
        setCouponMsg(`Platform coupon '${res.coupon.code}' created successfully!`);
        setCoupons(prev => [res.coupon, ...prev]);
        setCouponForm({
          code: '',
          title: '',
          description: '',
          discountType: 'percentage',
          discountAmount: 20,
          minOrderAmount: 200,
          maxDiscount: 150
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
    if (!window.confirm('Delete coupon?')) return;
    try {
      await couponAPI.delete(id);
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const roleMatch = userRoleFilter === 'All' || u.role === userRoleFilter || (userRoleFilter === 'buyer' && u.role === 'user');
    const statusMatch = userStatusFilter === 'All' || u.status === userStatusFilter;
    const searchMatch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery);
    return roleMatch && statusMatch && searchMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12151c] border border-gray-800 max-w-5xl w-full rounded-3xl p-5 sm:p-7 relative max-h-[94vh] flex flex-col shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-extrabold shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">Admin Control Center</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                  Full Authority
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Suspend/Hold buyers & sellers • Platform Revenue • Orders & Coupon Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition"
              title="Refresh"
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

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Total Users</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">{stats.totalUsers || users.length}</span>
              <span className="text-[10px] text-gray-500">({stats.buyersCount || 0} buyers / {stats.sellersCount || 0} sellers)</span>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Total Revenue</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">₹{stats.totalRevenue || 0}</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Total Orders</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">{orders.length}</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">Suspended / Held</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-rose-400">
                {(stats.suspendedCount || 0) + (stats.onHoldCount || 0)}
              </span>
              <span className="text-[10px] text-rose-400/80">restricted</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 mb-5 gap-2 overflow-x-auto">
          {[
            { id: 'users', label: 'User Control (Buyers & Sellers)', icon: Users, count: users.length },
            { id: 'orders', label: 'Platform Orders', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'All Products', icon: Package, count: products.length },
            { id: 'coupons', label: 'Admin Coupons', icon: Tag, count: coupons.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
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
          
          {/* 1. USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-xl px-3 py-1.5 outline-none"
                  >
                    <option value="All">All Roles</option>
                    <option value="buyer">Buyers Only</option>
                    <option value="seller">Sellers Only</option>
                    <option value="admin">Admins Only</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded-xl px-3 py-1.5 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active Accounts</option>
                    <option value="suspended">Suspended</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search user name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 bg-gray-950 border border-gray-800 focus:border-amber-500 text-white text-xs rounded-xl pl-8 pr-3 py-1.5 outline-none"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto border border-gray-800 rounded-2xl bg-gray-900/40">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider bg-gray-950/60">
                      <th className="py-3 px-3">User / Account</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Account Status</th>
                      <th className="py-3 px-3 text-center">Admin Status Actions (Suspend / Hold)</th>
                      <th className="py-3 px-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          No users found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelf = u._id === user?._id;
                        const role = u.role === 'user' ? 'buyer' : u.role;
                        const status = u.status || 'active';

                        return (
                          <tr key={u._id} className="hover:bg-gray-900/60 transition">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 flex items-center justify-center font-bold text-white text-xs">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white">{u.name}</span>
                                    {isSelf && (
                                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 rounded font-mono">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-gray-400 block font-mono">{u.email}</span>
                                  {u.storeName && (
                                    <span className="text-[10px] text-amber-400">Store: {u.storeName}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <select
                                value={role}
                                disabled={isSelf}
                                onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                                className="bg-gray-950 border border-gray-700 text-xs rounded-lg px-2 py-1 text-white outline-none disabled:opacity-50 cursor-pointer"
                              >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : status === 'suspended'
                                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  status === 'active' ? 'bg-emerald-400' : status === 'suspended' ? 'bg-rose-400' : 'bg-amber-400'
                                }`} />
                                {status.replace('_', ' ')}
                              </span>
                            </td>

                            {/* SUSPEND / HOLD / ACTIVATE BUTTONS */}
                            <td className="py-3 px-3 text-center">
                              {isSelf ? (
                                <span className="text-[11px] text-gray-500 italic">Self admin</span>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Activate */}
                                  <button
                                    onClick={() => handleUpdateStatus(u._id, 'active')}
                                    disabled={status === 'active'}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                                      status === 'active'
                                        ? 'bg-emerald-500/20 text-emerald-400 opacity-60 cursor-default'
                                        : 'bg-gray-800 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400'
                                    }`}
                                    title="Activate Account"
                                  >
                                    Active
                                  </button>

                                  {/* Hold */}
                                  <button
                                    onClick={() => handleUpdateStatus(u._id, 'on_hold')}
                                    disabled={status === 'on_hold'}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                                      status === 'on_hold'
                                        ? 'bg-amber-500/20 text-amber-400 opacity-60 cursor-default'
                                        : 'bg-gray-800 hover:bg-amber-500/20 text-gray-300 hover:text-amber-400'
                                    }`}
                                    title="Put On Hold"
                                  >
                                    Hold
                                  </button>

                                  {/* Suspend */}
                                  <button
                                    onClick={() => handleUpdateStatus(u._id, 'suspended')}
                                    disabled={status === 'suspended'}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                                      status === 'suspended'
                                        ? 'bg-rose-500/20 text-rose-400 opacity-60 cursor-default'
                                        : 'bg-gray-800 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400'
                                    }`}
                                    title="Suspend User"
                                  >
                                    Suspend
                                  </button>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              {!isSelf && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-gray-800 transition cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. PLATFORM ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <span className="text-xs text-gray-400 block">All buyer orders across Pisawat Platform</span>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No orders recorded yet.</div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
                      <div>
                        <span className="font-mono font-bold text-white text-xs">ID: #{order._id}</span>
                        <p className="text-[11px] text-gray-400">
                          Buyer: <strong className="text-gray-200">{order.customerName}</strong> ({order.customerPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-amber-400 text-sm">₹{order.totalAmount}</span>
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

                    <div className="space-y-1">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold text-white">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.coupon?.code && (
                      <div className="text-emerald-400 font-semibold text-[11px]">
                        Coupon Applied: {order.coupon.code} (-₹{order.coupon.discountAmount})
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. PLATFORM PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-3">
              <span className="text-xs text-gray-400 block">All listed spices and products across all sellers</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((prod) => (
                  <div
                    key={prod._id}
                    className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3.5 flex gap-3 items-center"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-800 shrink-0 border border-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-white text-xs truncate">{prod.name}</h5>
                      <p className="text-[11px] text-gray-400">{prod.weight} • {prod.category}</p>
                      <p className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                        Sold by: {prod.sellerName || 'Pisawat Seller'}
                      </p>
                      <span className="font-extrabold text-amber-400 text-xs">₹{prod.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ADMIN COUPON MANAGER */}
          {activeTab === 'coupons' && (
            <div className="space-y-5">
              {/* Separate Coupon Creation Form Structure */}
              <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Create Platform Discount Coupon
                  </h4>
                </div>
                <p className="text-xs text-gray-400">
                  Global coupons apply to all items across the Pisawat Spices platform.
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
                        placeholder="e.g. SUPER50"
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
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="fixed">Flat Discount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Discount Value *</label>
                      <input
                        type="number"
                        required
                        value={couponForm.discountAmount}
                        onChange={(e) => setCouponForm(p => ({ ...p, discountAmount: Number(e.target.value) }))}
                        placeholder="e.g. 20 or 50"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Min Order Amount (₹)</label>
                      <input
                        type="number"
                        value={couponForm.minOrderAmount}
                        onChange={(e) => setCouponForm(p => ({ ...p, minOrderAmount: Number(e.target.value) }))}
                        placeholder="e.g. 250"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Max Discount Cap (₹)</label>
                      <input
                        type="number"
                        value={couponForm.maxDiscount}
                        onChange={(e) => setCouponForm(p => ({ ...p, maxDiscount: Number(e.target.value) }))}
                        placeholder="e.g. 150"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">Title / Tagline</label>
                      <input
                        type="text"
                        value={couponForm.title}
                        onChange={(e) => setCouponForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Mega Season Savings"
                        className="w-full bg-gray-950 border border-gray-700 focus:border-amber-500 text-white rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition shadow-lg cursor-pointer"
                    >
                      Publish Admin Coupon
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  Active Platform Coupons:
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
                          <span className="text-[10px] text-gray-500 font-mono">By {c.createdByRole || 'admin'}</span>
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
