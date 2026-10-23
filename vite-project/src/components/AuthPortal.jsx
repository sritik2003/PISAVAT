import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  X, 
  Phone,
  Store,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function AuthPortal() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    isAuthModalOpen, 
    closeAuthModal, 
    authInitialView 
  } = useAuth();

  const [view, setView] = useState(authInitialView || 'login'); // 'login' | 'signup' | 'forgot'
  
  useEffect(() => {
    if (authInitialView) {
      setView(authInitialView);
    }
  }, [authInitialView, isAuthModalOpen]);

  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Input fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer', // 'buyer' or 'seller'
    storeName: '',
    rememberMe: false,
    agreeTerms: true
  });

  if (!isAuthModalOpen) return null;

  const showToastMsg = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === 'login') {
        if (!formData.email || !formData.password) {
          showToastMsg('Please fill all required fields.', 'error');
          setIsLoading(false);
          return;
        }
        await login(formData.email, formData.password);
        showToastMsg('Logged in successfully!');
      } else if (view === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          showToastMsg('Passwords do not match!', 'error');
          setIsLoading(false);
          return;
        }
        if (!formData.agreeTerms) {
          showToastMsg('Please accept the Terms & Privacy policy.', 'error');
          setIsLoading(false);
          return;
        }
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          formData.role,
          formData.storeName
        );
        showToastMsg(`Registered successfully as ${formData.role.toUpperCase()}!`);
      } else {
        // Forgot password
        const res = await authAPI.forgotPassword(formData.email);
        showToastMsg(res.message || 'Password reset link sent to your email!');
        setView('login');
      }
    } catch (error) {
      showToastMsg(error.message || 'Operation failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Demo Fill handler
  const handleDemoFill = (roleType) => {
    if (roleType === 'admin') {
      setFormData(prev => ({
        ...prev,
        email: 'admin@pisawat.com',
        password: 'adminPassword123'
      }));
    } else if (roleType === 'seller') {
      setFormData(prev => ({
        ...prev,
        email: 'seller@pisawat.com',
        password: 'sellerPassword123'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        email: 'user@pisawat.com',
        password: 'password123'
      }));
    }
    setView('login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm border backdrop-blur-md transition-all animate-bounce max-w-md ${
          toast.type === 'error' 
            ? 'bg-rose-950/95 border-rose-700 text-rose-200' 
            : 'bg-emerald-950/95 border-emerald-700 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Auth Container */}
      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Card Box */}
        <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/25 mb-3 font-bold text-black text-xl">
              P
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {view === 'login' && "Welcome Back 👋"}
              {view === 'signup' && "Create an Account 🌿"}
              {view === 'forgot' && "Reset Password 🔑"}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {view === 'login' && "Sign in to access your Pisawat account, track orders or store."}
              {view === 'signup' && "Choose your role as Buyer or Seller to get started."}
              {view === 'forgot' && "Enter your email to receive password reset instructions."}
            </p>
          </div>

          {/* 3-ROLE 1-CLICK DEMO BUTTONS */}
          {view === 'login' && (
            <div className="mb-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                ⚡ 1-Click Fast Login by Role:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin')}
                  className="py-1.5 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoFill('seller')}
                  className="py-1.5 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  <span>Seller</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoFill('buyer')}
                  className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Buyer</span>
                </button>
              </div>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* ROLE SELECTOR FOR REGISTRATION */}
            {view === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold block">Select Your Role:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: 'buyer' }))}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                      formData.role === 'buyer'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buyer / Customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: 'seller' }))}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                      formData.role === 'seller'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Seller / Merchant</span>
                  </button>
                </div>
              </div>
            )}

            {/* Seller Store Name input */}
            {view === 'signup' && formData.role === 'seller' && (
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  name="storeName"
                  required
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="e.g. Royal Pisawat Spice Depot"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-white rounded-xl px-3 py-2.5 outline-none transition"
                />
              </div>
            )}

            {/* Name input on Signup */}
            {view === 'signup' && (
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aman Sharma"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-white rounded-xl pl-9 pr-3 py-2.5 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div>
              <label className="text-gray-300 font-semibold block mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. user@pisawat.com"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-white rounded-xl pl-9 pr-3 py-2.5 outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Phone on Signup */}
            {view === 'signup' && (
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9811223344"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-white rounded-xl pl-9 pr-3 py-2.5 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Password input */}
            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-gray-300 font-semibold">Password *</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-white rounded-xl pl-9 pr-10 py-2.5 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password on Signup */}
            {view === 'signup' && (
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 text-white rounded-xl pl-9 pr-10 py-2.5 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {view === 'login' && 'Sign In'}
                    {view === 'signup' && `Create ${formData.role.toUpperCase()} Account`}
                    {view === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle View Footer */}
          <div className="mt-5 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            {view === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Register Now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
