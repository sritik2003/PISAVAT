import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download, Sparkles, Tag } from 'lucide-react';

export default function OrderInvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${(order._id || '').slice(-8).toUpperCase()}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn print:p-0 print:bg-white">
      <div className="bg-[#12151c] text-gray-200 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-auto print:border-none print:bg-white print:text-black print:w-full print:max-w-none print:shadow-none print:p-8">
        
        {/* Modal Controls - Hidden during print */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/20">
              Tax Invoice
            </span>
            <span className="text-xs text-gray-400 font-mono">{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- INVOICE PRINTABLE AREA --- */}
        <div id="printable-invoice" className="space-y-6">
          
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-5 print:border-gray-300">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-extrabold text-lg flex items-center justify-center">
                  P
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-white print:text-black">
                  PISAWAT SPICES
                </h2>
              </div>
              <p className="text-[11px] text-amber-400 font-medium tracking-wide mt-1 print:text-amber-700">
                Pure Stone-Ground Spices • Traditional Heritage
              </p>
              <p className="text-[10px] text-gray-400 print:text-gray-600">
                FSSAI Lic. No: 20826004001943 | Faridabad, Haryana, India
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-lg font-black text-white block uppercase tracking-wider print:text-black">
                INVOICE
              </span>
              <p className="text-gray-400 print:text-gray-600 font-mono text-[11px]">
                Invoice #: <strong className="text-white print:text-black">{invoiceNumber}</strong>
              </p>
              <p className="text-gray-400 print:text-gray-600 text-[11px]">
                Date: {orderDate}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:border-emerald-600 print:text-emerald-700">
                Status: {order.orderStatus || 'Placed'}
              </span>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800/80 text-xs print:bg-gray-50 print:border-gray-200">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-white text-sm print:text-black">{order.customerName}</p>
              <p className="text-gray-400 print:text-gray-700 mt-0.5">{order.customerPhone}</p>
              <p className="text-gray-400 print:text-gray-700">{order.customerEmail}</p>
              <p className="text-gray-300 print:text-gray-800 mt-1 leading-relaxed">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block mb-1">
                Payment Info:
              </span>
              <p className="text-gray-300 print:text-gray-800 font-medium">
                Payment Method: <span className="font-bold text-amber-400 print:text-black">{order.paymentMethod || 'COD'}</span>
              </p>
              <p className="text-gray-400 print:text-gray-600 text-[11px] mt-0.5">
                Currency: INR (₹)
              </p>
              <p className="text-[10px] text-gray-500 print:text-gray-600 mt-2 font-mono">
                Order ID: {order._id}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider print:border-gray-300 print:text-gray-600">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Product Description</th>
                  <th className="py-2.5 px-2 text-center">Weight</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Price</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 print:divide-gray-200">
                {order.orderItems?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-900/30">
                    <td className="py-3 px-2 font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <span className="font-semibold text-white print:text-black block">{item.name}</span>
                      <span className="text-[10px] text-gray-400 print:text-gray-500">100% Stone-Ground Pure Spice</span>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-300 print:text-gray-700">{item.weight || '100g'}</td>
                    <td className="py-3 px-2 text-center font-bold text-white print:text-black">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-gray-300 print:text-gray-800">₹{item.price}</td>
                    <td className="py-3 px-2 text-right font-bold text-white print:text-black">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Calculation & Coupon Breakdown */}
          <div className="border-t border-gray-800 pt-4 flex justify-end print:border-gray-300">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-gray-300 print:text-gray-700">
                <span>Items Subtotal:</span>
                <span className="font-medium">₹{order.itemsPrice || order.totalAmount}</span>
              </div>

              {/* Coupon Applied Line on Invoice */}
              {order.coupon && order.coupon.code && order.coupon.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold print:text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon Discount ({order.coupon.code}):
                  </span>
                  <span>-₹{order.coupon.discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-300 print:text-gray-700">
                <span>Shipping & Delivery:</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice || 0}`}</span>
              </div>

              <div className="border-t border-gray-700 pt-2 flex justify-between font-black text-sm text-white print:text-black print:border-gray-400">
                <span>Total Amount Paid:</span>
                <span className="text-amber-400 text-base print:text-black">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="border-t border-gray-800/80 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] text-gray-500 print:border-gray-200 print:text-gray-600">
            <div>
              <p className="font-semibold text-gray-400 print:text-gray-700">Terms & Conditions:</p>
              <p>Goods once sold are packed with hygienic seal. Keep in an airtight container away from moisture.</p>
              <p className="text-amber-400/80 print:text-gray-600 mt-0.5">Thank you for supporting pure, authentic Indian agriculture!</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-bold text-gray-300 print:text-black">For Pisawat Spices Pvt Ltd</p>
              <div className="h-6 flex items-center justify-end text-emerald-400 text-[11px] font-mono font-bold">
                ✓ Digitally Verified
              </div>
              <p className="text-[9px] text-gray-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
