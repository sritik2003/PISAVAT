import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import { PromiseSection } from './components/PromiseSection';
import ContactSection from './components/ContactSection';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import AuthPortal from './components/AuthPortal';
import CartDrawer from './components/CartDrawer';
import OrdersModal from './components/OrdersModal';
import WishlistModal from './components/WishlistModal';
import SellerDashboardModal from './components/SellerDashboardModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import OrderInvoiceModal from './components/OrderInvoiceModal';
import Product3D from './components/Product3D';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

function MainLayout() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const { toastMessage } = useCart();
  const { user, isSuspended, isOnHold } = useAuth();

  const handleOpenInvoice = (order) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-gray-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Toast Alert for Cart & Coupon actions */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce border border-amber-400">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account Warning Banner if Admin suspended or put user on hold */}
      {isSuspended && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs text-center font-bold flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>YOUR ACCOUNT IS SUSPENDED BY ADMIN. PLEASE CONTACT SUPPORT@PISAWAT.COM</span>
        </div>
      )}

      {isOnHold && (
        <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs text-center font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Notice: Your account is currently placed on hold by Admin. Actions are temporarily restricted.</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar 
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSellerDashboard={() => setIsSellerOpen(true)}
        onOpenAdminDashboard={() => setIsAdminOpen(true)}
      />

      {/* Main Landing Page Sections */}
      <main>
        <Hero />

        {/* --- 3D PRODUCT SHOWCASE SECTION --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#14181e] p-8 rounded-3xl border border-gray-800 shadow-2xl">
            {/* Left Column: Text Content */}
            <div className="space-y-4">
              <span className="text-amber-500 font-bold uppercase tracking-wider text-xs">Interactive 3D Experience</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Lakadong Turmeric Powder
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our Turmeric Powder is sourced from the Lakadong region of Meghalaya, India, known for its highest curcumin content (7-12%) and rich aroma. Drag or rotate the 3D pack to explore its purity.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-medium rounded-full border border-amber-500/20">7-12% Curcumin</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full border border-emerald-500/20">100% Pure & Natural</span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full border border-blue-500/20">No Additives</span>
              </div>
            </div>

            {/* Right Column: 3D Box Viewer */}
            <div className="w-full relative rounded-2xl overflow-hidden border border-gray-700 bg-gradient-to-b from-[#1c212a] to-[#14181e]">
              <Product3D />
            </div>
          </div>
        </section>

        {/* Products Grid with Wishlist & Seller attribution */}
        <Products onSelectProduct={(product) => setSelectedProduct(product)} />
        <PromiseSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Portals */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <CartDrawer onOpenInvoice={handleOpenInvoice} />

      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
        onOpenInvoice={handleOpenInvoice}
      />

      <WishlistModal 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
      />

      <SellerDashboardModal 
        isOpen={isSellerOpen} 
        onClose={() => setIsSellerOpen(false)} 
      />

      <AdminDashboardModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      <OrderInvoiceModal 
        order={selectedInvoiceOrder} 
        isOpen={isInvoiceOpen} 
        onClose={() => {
          setIsInvoiceOpen(false);
          setSelectedInvoiceOrder(null);
        }} 
      />

      <AuthPortal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}
