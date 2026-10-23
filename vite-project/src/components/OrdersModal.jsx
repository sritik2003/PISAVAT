import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Truck, 
  CheckCircle, 
  ChevronRight,
  Tag,
  Search,
  RefreshCw
} from 'lucide-react';
import { orderAPI } from '../services/api';

export default function OrdersModal({ isOpen, onClose, onOpenInvoice }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getMyOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('Failed to fetch user orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const orderStatuses = ['Placed', 'Processing', 'Dispatched', 'Delivered'];

  const getStepIndex = (status) => {
    const idx = orderStatuses.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filterStatus === 'All' || order.orderStatus === filterStatus;
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderItems?.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12151c] border border-gray-800 max-w-3xl w-full rounded-3xl p-5 sm:p-7 relative max-h-[90vh] flex flex-col shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Order Tracking & History</h3>
              <p className="text-xs text-gray-400">Track real-time shipment status & download official tax invoices</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mb-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Placed', 'Processing', 'Dispatched', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterStatus === status
                    ? 'bg-amber-500 text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 bg-gray-950 border border-gray-800 focus:border-amber-500 text-white text-xs rounded-xl pl-8 pr-3 py-1.5 outline-none"
            />
          </div>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="text-center py-16 text-gray-400 text-xs">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-amber-500" />
              Loading your verified orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400 space-y-3">
              <Package className="w-12 h-12 mx-auto text-gray-600" />
              <p className="text-sm font-semibold text-gray-300">No orders found</p>
              <p className="text-xs text-gray-500">
                {orders.length === 0
                  ? "You haven't placed any spice orders yet. Add items to your cart to begin!"
                  : "No orders match the selected filter."}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const currentStep = getStepIndex(order.orderStatus);

              return (
                <div
                  key={order._id}
                  className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-gray-700 transition shadow-lg"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono font-bold text-xs sm:text-sm">
                          ID: #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">({order._id})</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block uppercase">Net Amount</span>
                        <span className="font-extrabold text-amber-400 text-sm sm:text-base">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      {/* View Invoice Button */}
                      <button
                        onClick={() => onOpenInvoice(order)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        title="View Official Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* VISUAL ORDER TRACKER */}
                  <div className="py-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-3">
                      Live Order Tracking:
                    </span>
                    <div className="relative flex items-center justify-between">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-800 z-0">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                          style={{
                            width: `${(currentStep / (orderStatuses.length - 1)) * 100}%`
                          }}
                        />
                      </div>

                      {/* Steps */}
                      {orderStatuses.map((step, idx) => {
                        const isCompleted = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                                isCompleted
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-gray-900 border border-gray-700 text-gray-500'
                              } ${isCurrent ? 'ring-4 ring-amber-500/20 scale-110' : ''}`}
                            >
                              {idx < currentStep ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span
                              className={`text-[10px] mt-1.5 font-semibold ${
                                isCompleted ? 'text-amber-300' : 'text-gray-500'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="space-y-2 bg-gray-950/60 p-3 rounded-xl border border-gray-800/80">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">
                      Ordered Products:
                    </span>
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-300">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-7 h-7 rounded object-cover bg-gray-800"
                            />
                          )}
                          <span>
                            {item.name} <span className="text-gray-500">({item.weight || '100g'}) × {item.quantity}</span>
                          </span>
                        </div>
                        <span className="font-semibold text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}

                    {/* Applied Coupon Tag */}
                    {order.coupon?.code && (
                      <div className="pt-2 border-t border-gray-800/80 flex justify-between items-center text-xs text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" /> Coupon Discount ({order.coupon.code}):
                        </span>
                        <span>-₹{order.coupon.discountAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="text-[11px] text-gray-400 flex flex-wrap justify-between items-center gap-2 pt-1 border-t border-gray-800/60">
                    <span>
                      Delivery To: <strong className="text-gray-200">{order.customerName}</strong> ({order.shippingAddress?.city}, {order.shippingAddress?.pincode})
                    </span>
                    <span className="text-gray-500">Payment: {order.paymentMethod || 'COD'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
