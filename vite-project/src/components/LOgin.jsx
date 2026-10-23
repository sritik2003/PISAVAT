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
  Github, 
  Globe, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  KeyRound, 
  X,
  Check,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Navigation & View state: 'login' | 'signup' | 'forgot' | 'dashboard'
  const [view, setView] = useState('login');
  const [lang, setLang] = useState('en'); // 'en' | 'hinglish'
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login Form Data
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form Data
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot Password Data
  const [forgotEmail, setForgotEmail] = useState('');

  // Active User State after successful login
  const [currentUser, setCurrentUser] = useState(null);

  // Helper for showing temporary toast messages
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Password Strength Calculation
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: lang === 'en' ? 'Weak' : 'Kamzor', color: 'bg-rose-500' };
    if (score <= 3) return { score: 65, label: lang === 'en' ? 'Medium' : 'Thik-Thak', color: 'bg-amber-500' };
    return { score: 100, label: lang === 'en' ? 'Strong' : 'Mast / Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = calculatePasswordStrength(signupPassword);

  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast(lang === 'en' ? 'Please fill all fields!' : 'Bhai, saare fields bharo pehle!', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const nameFromEmail = loginEmail.split('@')[0];
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      setCurrentUser({
        name: formattedName || 'Aman Sharma',
        email: loginEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginEmail}`,
        role: 'Pro Developer',
        joinDate: 'October 2026'
      });
      setView('dashboard');
      showToast(lang === 'en' ? 'Welcome back! Signed in successfully.' : 'Sahi hai boss! Login ho gaya.', 'success');
    }, 1500);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !confirmPassword) {
      showToast(lang === 'en' ? 'Please fill all required fields.' : 'Saare fields required hain yaar!', 'error');
      return;
    }
    if (signupPassword !== confirmPassword) {
      showToast(lang === 'en' ? 'Passwords do not match!' : 'Passwords match nahi kar rahe!', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast(lang === 'en' ? 'Please accept Terms & Conditions' : 'Terms & Conditions accept karna padega boss!', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({
        name: signupName,
        email: signupEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupEmail}`,
        role: 'New Member',
        joinDate: 'Just Now'
      });
      setView('dashboard');
      showToast(lang === 'en' ? 'Account created successfully!' : 'Aapka account ban gaya hai!', 'success');
    }, 1500);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast(lang === 'en' ? 'Please enter your registered email' : 'Apna email address daalo pehle!', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(
        lang === 'en' 
          ? `Password reset link sent to ${forgotEmail}` 
          : `Reset link ${forgotEmail} pe bhej diya gaya hai!`, 
        'success'
      );
      setView('login');
    }, 1200);
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({
        name: provider === 'Google' ? 'Rahul Verma' : 'Dev Community User',
        email: `${provider.toLowerCase()}user@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        role: 'Verified Developer',
        joinDate: 'October 2026'
      });
      setView('dashboard');
      showToast(lang === 'en' ? `Connected via ${provider}!` : `${provider} se directly connect ho gaye!`, 'success');
    }, 1200);
  };

  // Translations object
  const text = {
    en: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Enter your credentials to access your account',
      signupTitle: 'Create Account',
      signupSubtitle: 'Join thousands of developers building modern web apps',
      forgotTitle: 'Forgot Password?',
      forgotSubtitle: 'No worries! Enter your email and we will send you reset steps.',
      emailLabel: 'Email Address / Username',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      fullNameLabel: 'Full Name',
      rememberMe: 'Remember me',
      forgotPass: 'Forgot password?',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      sendResetBtn: 'Send Reset Link',
      orContinueWith: 'Or continue with',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      signUpLink: 'Sign Up',
      signInLink: 'Sign In',
      backToLogin: 'Back to Sign In',
      termsText: 'I agree to the Terms of Service & Privacy Policy',
      dashboardWelcome: 'Welcome to your Dashboard!',
      dashboardSubtitle: 'Your authentication flow works flawlessly.',
      logoutBtn: 'Sign Out'
    },
    hinglish: {
      loginTitle: 'Wapas Aane Par Swagat Hai!',
      loginSubtitle: 'Apne account mein login karne ke liye details daalein',
      signupTitle: 'Naya Account Banayein',
      signupSubtitle: 'Humare platform se judein aur awesome features explore karein',
      forgotTitle: 'Password Bhool Gaye?',
      forgotSubtitle: 'Koi baat nahi! Email daalo, hum reset link bhej denge.',
      emailLabel: 'Email Address ya Username',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      fullNameLabel: 'Aapka Poora Naam',
      rememberMe: 'Mujhe yaad rakho',
      forgotPass: 'Password yaad nahi?',
      signInBtn: 'Sign In Karein',
      signUpBtn: 'Account Banayein',
      sendResetBtn: 'Reset Link Bhejo',
      orContinueWith: 'Ya phir inse continue karein',
      noAccount: 'Naye ho yahan?',
      haveAccount: 'Pehle se account hai?',
      signUpLink: 'Sign Up Karein',
      signInLink: 'Login Karein',
      backToLogin: 'Wapas Login Pe Jao',
      termsText: 'Main Terms of Service aur Policy se agree karta/karti hoon',
      dashboardWelcome: 'Aapka Dashboard Ready Hai!',
      dashboardSubtitle: 'Aapka authentication setup bilkul mast kaam kar raha hai.',
      logoutBtn: 'Log Out Karein'
    }
  };

  const t = text[lang];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden font-sans p-4 sm:p-6 md:p-8 select-none">
      
      {/* Dynamic Animated Gradient Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* Top Bar: Brand Logo & Language Switcher */}
      <header className="w-full max-w-md md:max-w-4xl flex justify-between items-center mb-6 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-200">
              NexusAuth
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v2.4
            </span>
          </div>
        </div>

        {/* Language Switch Toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hinglish' : 'en')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-medium backdrop-blur-md shadow-inner"
          title="Toggle UI Language"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'en' ? 'English' : 'Hinglish'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
            {lang.toUpperCase()}
          </span>
        </button>
      </header>

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-900/95 border border-slate-700/80 text-slate-100 shadow-2xl backdrop-blur-xl animate-bounce">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Glassmorphic Auth Card Container */}
      <main className="w-full max-w-md z-10">
        <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 overflow-hidden transition-all duration-300">
          
          {/* Subtle Top Accent Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80" />

          {/* VIEW: LOGGED IN DASHBOARD PREVIEW */}
          {view === 'dashboard' && currentUser ? (
            <div className="py-4 text-center space-y-6 animate-fadeIn">
              <div className="relative inline-block">
                <img 
                  src={currentUser.avatar} 
                  alt="User Avatar" 
                  className="w-24 h-24 rounded-full mx-auto border-2 border-indigo-500/50 p-1 bg-slate-800/80 shadow-xl"
                />
                <span className="absolute bottom-1 right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
                <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                <div className="inline-flex items-center space-x-1 mt-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{currentUser.role}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                    Authenticated
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Session Joined:</span>
                  <span className="text-slate-200">{currentUser.joinDate}</span>
                </div>
                <p className="pt-2 text-slate-400 border-t border-slate-800 text-[11px] leading-relaxed">
                  {t.dashboardSubtitle}
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentUser(null);
                  setView('login');
                  showToast(lang === 'en' ? 'Signed out successfully' : 'Log out ho gaye ho!', 'info');
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center space-x-2 transition-all border border-slate-700 hover:border-slate-600"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logoutBtn}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Top Navigation Tabs (Only visible for Login / Sign Up views) */}
              {view !== 'forgot' && (
                <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-slate-800/80 mb-6">
                  <button
                    onClick={() => setView('login')}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                      view === 'login'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'en' ? 'Sign In' : 'Login'}
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                      view === 'signup'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'en' ? 'Sign Up' : 'Register'}
                  </button>
                </div>
              )}

              {/* VIEW: LOGIN FORM */}
              {view === 'login' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{t.loginTitle}</h1>
                    <p className="text-xs text-slate-400">{t.loginSubtitle}</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 block">{t.emailLabel}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 block">{t.passwordLabel}</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center space-x-2 cursor-pointer text-slate-400 hover:text-slate-300">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                        <span>{t.rememberMe}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        {t.forgotPass}
                      </button>
                    </div>

                    {/* Primary Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{t.signInBtn}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Login Divider */}
                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800" />
                    </div>
                    <span className="relative px-3 bg-slate-900 text-[11px] text-slate-500 uppercase tracking-wider">
                      {t.orContinueWith}
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('GitHub')}
                      className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </button>
                  </div>

                  {/* Switch to Signup */}
                  <div className="text-center pt-2 text-xs text-slate-400">
                    {t.noAccount}{' '}
                    <button
                      onClick={() => setView('signup')}
                      className="text-indigo-400 font-semibold hover:underline ml-1"
                    >
                      {t.signUpLink}
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW: SIGN UP FORM */}
              {view === 'signup' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{t.signupTitle}</h1>
                    <p className="text-xs text-slate-400">{t.signupSubtitle}</p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-3.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">{t.fullNameLabel}</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="Aman Sharma"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">{t.emailLabel}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="aman@example.com"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password + Strength Meter */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">{t.passwordLabel}</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Dynamic Strength Meter */}
                      {signupPassword && (
                        <div className="pt-1 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">
                              {lang === 'en' ? 'Strength:' : 'Majbooti:'}
                            </span>
                            <span className="font-semibold text-slate-300">{passwordStrength.label}</span>
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${passwordStrength.score}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">{t.confirmPasswordLabel}</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-400 leading-snug">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                        <span>{t.termsText}</span>
                      </label>
                    </div>

                    {/* Submit Signup Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 mt-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{t.signUpBtn}</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <div className="text-center pt-1 text-xs text-slate-400">
                    {t.haveAccount}{' '}
                    <button
                      onClick={() => setView('login')}
                      className="text-indigo-400 font-semibold hover:underline ml-1"
                    >
                      {t.signInLink}
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW: FORGOT PASSWORD */}
              {view === 'forgot' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{t.forgotTitle}</h1>
                    <p className="text-xs text-slate-400">{t.forgotSubtitle}</p>
                  </div>

                  <form onSubmit={handleForgot} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 block">{t.emailLabel}</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>{t.sendResetBtn}</span>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
                    >
                      ← {t.backToLogin}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer info */}
      <footer className="mt-8 text-center text-xs text-slate-600 z-10">
        <p>© 2026 NexusAuth Portal. Crafted for modern web experience.</p>
      </footer>
    </div>
  );
}