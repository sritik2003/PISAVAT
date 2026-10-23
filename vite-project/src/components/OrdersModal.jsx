import React, { useState, useEffect } from 'react';
import { X, Package, Clock, ShieldCheck } from 'lucide-react';
import { orderAPI } from '../services/api';

export default function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12151c] border border-gray-800 max-w-2xl w-full rounded-2xl p-6 relative max-h-[85vh] flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">My Orders History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Loading your orders from database...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <Package className="w-10 h-10 mx-auto text-gray-600" />
              <p className="text-sm">You haven't placed any orders yet.</p>
              <p className="text-xs text-gray-500">All your spice orders will appear here.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 pb-2">
                  <div>
                    <span className="text-gray-400 font-mono">ID: {order._id}</span>
                    <p className="text-[11px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {order.orderStatus}
                    </span>
                    <span className="font-bold text-amber-400 text-sm">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-300">
                      <span>
                        {item.name} ({item.weight || '100g'}) × {item.quantity}
                      </span>
                      <span className="font-medium text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-400 pt-2 border-t border-gray-800/60">
                  <span>Shipping Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}</span>
                  <span className="font-mono">{order.paymentMethod}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
