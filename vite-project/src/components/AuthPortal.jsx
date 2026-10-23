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
  Phone
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
    rememberMe: false,
    agreeTerms: true
  });

  if (!isAuthModalOpen) return null;

  const showToastMsg = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Password strength check
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

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
        await register(formData.name, formData.email, formData.password, formData.phone);
        showToastMsg('Account registered and synced in MongoDB!');
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

  // Quick Demo Autofill handler
  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setFormData(prev => ({
        ...prev,
        email: 'admin@pisawat.com',
        password: 'adminPassword123'
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
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm border backdrop-blur-md transition-all animate-bounce ${
          toast.type === 'error' 
            ? 'bg-rose-950/90 border-rose-800 text-rose-200' 
            : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Auth Container */}
      <div className="w-full max-w-md relative z-10 my-8">
        
        {/* Card Box */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
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
              {view === 'login' && "Sign in to access your Pisawat Spices account & orders."}
              {view === 'signup' && "Join us for stone-ground, pure Indian spices."}
              {view === 'forgot' && "Enter your email to receive password reset instructions."}
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          {view === 'login' && (
            <div className="mb-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                ⚡ 1-Click Test Credentials (Pre-seeded in MongoDB)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('user')}
                  className="py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 font-medium transition"
                >
                  Customer Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin')}
                  className="py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg border border-slate-700 font-medium transition"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Full Name field (For Signup only) */}
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aman Sharma"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Phone (For Signup) */}
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-300">Password *</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[11px] font-medium text-amber-400 hover:text-amber-300 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength meter (Signup only) */}
                {view === 'signup' && formData.password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`} 
                        style={{ width: `${strength.score}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Strength:</span>
                      <span className="font-semibold text-slate-300">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password (For Signup) */}
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Checkboxes */}
            {view === 'signup' && (
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="agreeTerms" className="ml-2 text-[11px] text-slate-400 cursor-pointer">
                  I agree to Pisawat Terms and Food Safety policy.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black rounded-xl font-bold text-xs sm:text-sm transition duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {view === 'login' && "Sign In with MongoDB"}
                    {view === 'signup' && "Create Account"}
                    {view === 'forgot' && "Send Reset Link"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer View Switcher */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {view === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition ml-1"
                >
                  Sign up now
                </button>
              </p>
            )}

            {view === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition ml-1"
                >
                  Log in
                </button>
              </p>
            )}

            {view === 'forgot' && (
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                ← Back to login
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
