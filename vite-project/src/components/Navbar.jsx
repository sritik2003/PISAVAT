import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut, Package, CheckCircle, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { healthAPI } from '../services/api';

export default function Navbar({ onOpenOrders }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cartCount, openCart } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    // Check backend health
    healthAPI.check()
      .then(() => setIsBackendConnected(true))
      .catch(() => setIsBackendConnected(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#12151c]/90 backdrop-blur-md border-b border-gray-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition">
                PISAWAT SPICES
              </h1>
              {isBackendConnected && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MongoDB API Live
                </span>
              )}
            </div>
            <p className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">
              Rooted in Purity, Rich in Tradition
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm text-gray-300 font-medium">
          <a href="#products" className="hover:text-amber-400 transition">Products</a>
          <a href="#promise" className="hover:text-amber-400 transition">Our Promise</a>
          <a href="#enquiry" className="hover:text-amber-400 transition">Wholesale & Bulk</a>
          <a href="#fssai" className="hover:text-amber-400 transition">FSSAI Certificate</a>
          <a href="#contact" className="hover:text-amber-400 transition">Contact Us</a>
        </nav>

        {/* Right Action Elements */}
        <div className="flex items-center space-x-3">
          
          {/* Cart Icon Button */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-xl bg-gray-900 border border-gray-700 hover:border-amber-500/50 text-gray-200 hover:text-amber-400 transition flex items-center justify-center cursor-pointer shadow-md"
            title="View Cart & Checkout"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-1.5 transition text-xs text-white"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-bold flex items-center justify-center text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium hidden sm:inline">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs text-slate-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-bold text-white text-sm">{user?.name}</p>
                    <p className="text-slate-400 truncate text-[11px] font-mono">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      {user?.role || 'Customer'}
                    </span>
                  </div>

                  <button
                    onClick={onOpenOrders}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white transition"
                  >
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>My Orders</span>
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Enquire Now CTA */}
          <a
            href="#enquiry"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            Enquire Now
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 text-sm">
          <a 
            href="#products" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-amber-400 py-1"
          >
            Products
          </a>
          <a 
            href="#promise" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-amber-400 py-1"
          >
            Our Promise
          </a>
          <a 
            href="#enquiry" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-amber-400 py-1"
          >
            Wholesale & Bulk
          </a>
          <a 
            href="#fssai" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-amber-400 py-1"
          >
            FSSAI Certificate
          </a>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-amber-400 py-1"
          >
            Contact Us
          </a>

          {!isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full text-left py-2 text-amber-400 font-semibold"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}
