import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Clock, Building } from 'lucide-react';
import { enquiryAPI } from '../services/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    productInterest: 'Turmeric (Haldi) Powder',
    quantity: 'Bulk 25kg+',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await enquiryAPI.create(formData);
      if (res.success) {
        setSuccessMsg(res.message || 'Thank you! Your enquiry has been received in our system.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          productInterest: 'Turmeric (Haldi) Powder',
          quantity: 'Bulk 25kg+',
          message: ''
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="enquiry" className="py-20 bg-gradient-to-b from-[#0d0f12] via-[#12151c] to-[#0d0f12] border-t border-gray-800">
      <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Wholesale & Direct Bulk Supply
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Connect with Pisawat Spices
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-3 leading-relaxed">
            Whether you are a retailer, restaurant, catering business, or individual seeking stone-ground pure spices in bulk, we are here to supply pure purity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Business & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#151922] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                Headquarters & Processing Unit
              </h3>

              <div className="space-y-5 text-sm text-gray-300">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Registered Address</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      145 G.NO.3, Roshan Nagar, Faridabad, Haryana, India - 121003
                    </p>
                    <p className="text-[11px] text-amber-400/80 mt-1">FBO: Manish Pratap Singh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">FSSAI Registration</h4>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      Registration No: 20826004001943 (Govt. of Haryana)
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-1">100% Food Safety & Hygiene Compliant</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Phone / WhatsApp</h4>
                    <p className="text-xs text-gray-400 mt-1 font-mono">+91 98112 23344 / +91 98765 43210</p>
                    <p className="text-[11px] text-gray-500">Mon - Sat: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Direct Email</h4>
                    <p className="text-xs text-gray-400 mt-1 font-mono">contact@pisawatspices.com</p>
                    <p className="text-xs text-gray-400 font-mono">orders@pisawatspices.com</p>
                  </div>
                </div>
              </div>

              {/* Wholesale Highlight Banner */}
              <div className="pt-4 border-t border-gray-800 text-xs text-gray-400 space-y-1.5">
                <p className="font-semibold text-amber-400">✨ Wholesale Benefits:</p>
                <p>• Custom packing options: 100g, 250g, 500g, 1kg, and 25kg bulk bags.</p>
                <p>• Batch lab test certificates provided with every consignment.</p>
                <p>• Direct farm procurement for maximum curcumin and aroma retention.</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#151922] border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              
              <h3 className="text-2xl font-bold text-white mb-2">Send an Enquiry / Order Request</h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill the form below and our team will get back to you within 2 hours with catalog & quotations.
              </p>

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Gupta"
                      className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Company / Store Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Gupta General Stores / Kitchen"
                      className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Spice / Product Needed
                    </label>
                    <select
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleChange}
                      className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    >
                      <option value="Turmeric (Haldi) Powder">Turmeric (Haldi) Powder (High Curcumin)</option>
                      <option value="Red Chilli Powder">Red Chilli Powder (Pure & Vibrant)</option>
                      <option value="Coriander (Dhaniya) Powder">Coriander (Dhaniya) Powder</option>
                      <option value="Cumin (Jeera) Seeds">Cumin (Jeera) Seeds</option>
                      <option value="Premium Garam Masala">Premium Garam Masala</option>
                      <option value="All Products Sample Kit">All Products Sample Kit</option>
                      <option value="Custom Bulk Requirement">Custom Bulk Requirement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Approx Quantity
                    </label>
                    <select
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    >
                      <option value="Retail Packs (5 - 20 packs)">Retail Packs (5 - 20 packs)</option>
                      <option value="Small Bulk (10kg - 25kg)">Small Bulk (10kg - 25kg)</option>
                      <option value="Wholesale (50kg - 200kg)">Wholesale (50kg - 200kg)</option>
                      <option value="Commercial (500kg+)">Commercial (500kg+)</option>
                      <option value="Sample Pack Trial">Sample Pack Trial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Your Requirements & Message *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirement, delivery destination, or any specific questions..."
                    className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl transition text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Wholesale Enquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
