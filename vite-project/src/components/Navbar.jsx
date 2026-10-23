import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Package, 
  CheckCircle, 
  ChevronDown, 
  Menu, 
  X,
  Heart,
  ShieldCheck,
  Store,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { healthAPI } from '../services/api';

export default function Navbar({ 
  onOpenOrders, 
  onOpenWishlist, 
  onOpenSellerDashboard, 
  onOpenAdminDashboard 
}) {
  const { user, isAuthenticated, logout, openAuthModal, wishlist, isSeller, isAdmin, role } = useAuth();
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
                  MongoDB Live
                </span>
              )}
            </div>
            <p className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">
              Rooted in Purity, Rich in Tradition
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-6 text-xs sm:text-sm text-gray-300 font-medium">
          <a href="#products" className="hover:text-amber-400 transition">Products</a>
          <a href="#promise" className="hover:text-amber-400 transition">Our Promise</a>
          <a href="#enquiry" className="hover:text-amber-400 transition">Wholesale & Bulk</a>
          <a href="#fssai" className="hover:text-amber-400 transition">FSSAI Certificate</a>
          <a href="#contact" className="hover:text-amber-400 transition">Contact</a>
        </nav>

        {/* Right Action Elements */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-rose-500/50 text-gray-300 hover:text-rose-400 transition flex items-center justify-center cursor-pointer shadow-md"
            title="My Saved Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500/20 text-rose-400' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/50 text-gray-200 hover:text-amber-400 transition flex items-center justify-center cursor-pointer shadow-md"
            title="View Cart & Checkout"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Role Direct Shortcut Badges */}
          {isAuthenticated && isSeller && (
            <button
              onClick={onOpenSellerDashboard}
              className="hidden md:flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-sm"
              title="Open Seller Dashboard"
            >
              <Store className="w-3.5 h-3.5 text-blue-400" />
              <span>Seller Portal</span>
            </button>
          )}

          {isAuthenticated && isAdmin && (
            <button
              onClick={onOpenAdminDashboard}
              className="hidden md:flex items-center gap-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-sm"
              title="Open Admin Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* User Account / Auth Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-2.5 py-1.5 transition text-xs text-white cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-bold flex items-center justify-center text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-semibold hidden sm:inline">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs text-slate-200 animate-fadeIn"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                    <p className="text-slate-400 truncate text-[11px] font-mono">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-amber-500/20">
                        {role}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        user?.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {user?.status || 'active'}
                      </span>
                    </div>
                  </div>

                  {/* Role Specific Actions */}
                  {isAdmin && (
                    <button
                      onClick={onOpenAdminDashboard}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-500/10 text-purple-300 flex items-center gap-2 transition cursor-pointer font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>👑 Admin Control Center</span>
                    </button>
                  )}

                  {isSeller && (
                    <button
                      onClick={onOpenSellerDashboard}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-500/10 text-blue-300 flex items-center gap-2 transition cursor-pointer font-semibold"
                    >
                      <Store className="w-4 h-4 text-blue-400" />
                      <span>🏪 Seller Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenOrders}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>My Orders & Tracking</span>
                  </button>

                  <button
                    onClick={onOpenWishlist}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 transition cursor-pointer"
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
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Sign In / Roles</span>
            </button>
          )}

          {/* Enquire Now CTA */}
          <a
            href="#enquiry"
            className="hidden sm:inline-flex bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            Bulk Enquiry
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 text-xs">
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

          {/* Direct Role Buttons on Mobile */}
          {isAuthenticated && isSeller && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellerDashboard();
              }}
              className="w-full text-left py-1 text-blue-400 font-bold flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Seller Dashboard</span>
            </button>
          )}

          {isAuthenticated && isAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminDashboard();
              }}
              className="w-full text-left py-1 text-purple-400 font-bold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Control Center</span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrders();
            }}
            className="w-full text-left py-1 text-amber-400 font-medium flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Tracking</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenWishlist();
            }}
            className="w-full text-left py-1 text-rose-400 font-medium flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full text-left py-2 text-amber-400 font-semibold"
            >
              Sign In / Choose Role
            </button>
          )}
        </div>
      )}
    </header>
  );
}
