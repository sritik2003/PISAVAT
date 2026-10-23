// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import Hero from './components/Hero';
// import Products from './components/Products';
// import { PromiseSection, TributeSection } from './components/PromiseSection';
// import ContactSection from './components/ContactSection';
// import ProductModal from './components/ProductModal';
// import Footer from './components/Footer';
// import AuthPortal from './components/AuthPortal';
// import CartDrawer from './components/CartDrawer';
// import OrdersModal from './components/OrdersModal';
// import Product3D from  './components/Product3D'

// import { AuthProvider } from './context/AuthContext';
// import { CartProvider, useCart } from './context/CartContext';

// function MainLayout() {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isOrdersOpen, setIsOrdersOpen] = useState(false);
//   const { toastMessage } = useCart();

//   return (
//     <div className="min-h-screen bg-[#0d0f12] text-gray-100 font-sans selection:bg-amber-500 selection:text-black">
//       {/* Toast Alert for Cart actions */}
//       {toastMessage && (
//         <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
//           <span>✓</span>
//           <span>{toastMessage}</span>
//         </div>
//       )}

//       {/* Navigation Bar */}
//       <Navbar onOpenOrders={() => setIsOrdersOpen(true)} />

//       {/* Main Landing Page Sections */}
//       <main>
//         <Hero />
//         <Products onSelectProduct={(product) => setSelectedProduct(product)} />
//         <PromiseSection />
//         <ContactSection />
//       </main>

//       {/* Footer */}
//       <Footer />

//       {/* Modals & Slide-over Drawers */}
//       <ProductModal 
//         product={selectedProduct} 
//         onClose={() => setSelectedProduct(null)} 
//       />
//       <CartDrawer />
//       <OrdersModal 
//         isOpen={isOrdersOpen} 
//         onClose={() => setIsOrdersOpen(false)} 
//       />
//       <AuthPortal />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <MainLayout />
//       </CartProvider>
//     </AuthProvider>
//   );
// }












import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import { PromiseSection, TributeSection } from './components/PromiseSection';
import ContactSection from './components/ContactSection';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import AuthPortal from './components/AuthPortal';
import CartDrawer from './components/CartDrawer';
import OrdersModal from './components/OrdersModal';
import Product3D from './components/Product3D'; // 3D कंपोनेंट इम्पोर्ट किया

import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

function MainLayout() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const { toastMessage } = useCart();

  return (
    <div className="min-h-screen bg-[#0d0f12] text-gray-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Alert for Cart actions */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar onOpenOrders={() => setIsOrdersOpen(true)} />

      {/* Main Landing Page Sections */}
      <main>
        <Hero />

        {/* --- 3D PRODUCT SHOWCASE SECTION START --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#14181e] p-8 rounded-2xl border border-gray-800 shadow-2xl">
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
            <div className="w-full relative rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-b from-[#1c212a] to-[#14181e]">
              <Product3D />
            </div>
          </div>
        </section>
        {/* --- 3D PRODUCT SHOWCASE SECTION END --- */}

        <Products onSelectProduct={(product) => setSelectedProduct(product)} />
        <PromiseSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-over Drawers */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
      <CartDrawer />
      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
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
