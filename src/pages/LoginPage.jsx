import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMLM } from '../context/MLMContext';
import { Logo } from '../components/common/Logo';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  GitBranch, 
  Wallet, 
  ShoppingCart, 
  Crown, 
  AlertCircle 
} from 'lucide-react';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginAsUser, loginAsAdmin } = useAuth();
  const { users } = useMLM();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your name, email address, or referral code.');
      return;
    }

    const res = login(identifier, password);
    if (res.success) {
      if (res.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      setError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleQuickLogin = (type, target) => {
    if (type === 'ADMIN') {
      loginAsAdmin();
      navigate('/admin');
    } else {
      loginAsUser(target);
      navigate(redirect);
    }
  };

  const handleForgotPassword = () => {
    alert("For demo access, you can enter any password (e.g. demo123) or click any of the 1-click demo accounts below!");
  };

  return (
    <div className="min-h-screen bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      
      {/* Centered Main 2-Column Container (Exact Match to Mockup) */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10 py-6">
        
        {/* Left Column: Branding, Title & 3 Benefit Items (Span 5 on LG) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* DirectGrow Logo */}
          <Link to="/" className="inline-block transition-transform hover:scale-[1.01]">
            <Logo className="h-10 sm:h-11" />
          </Link>

          {/* Green Horizontal Accent Bar */}
          <div className="w-10 h-1 bg-[#16a34a] rounded-full" />

          {/* Headline */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f241a] tracking-tight leading-[1.15]">
              Grow Your{' '}
              <span className="text-[#16a34a] block mt-1">Wellness Network</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-3 max-w-sm leading-relaxed">
              Access your 8-level referral network, wallet commissions, and orders.
            </p>
          </div>

          {/* Feature Highlights List */}
          <div className="space-y-4 pt-2">
            
            {/* Feature 1: 8-Level Referral Network */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#eef8f2] flex items-center justify-center text-[#0c6b37] shrink-0 shadow-2xs">
                <GitBranch className="w-5 h-5 text-[#0c6b37]" />
              </div>
              <span className="font-bold text-sm text-slate-800">
                8-Level Referral Network
              </span>
            </div>

            {/* Feature 2: Wallet & Commission */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#eef8f2] flex items-center justify-center text-[#0c6b37] shrink-0 shadow-2xs">
                <Wallet className="w-5 h-5 text-[#0c6b37]" strokeWidth={1.8} />
              </div>
              <span className="font-bold text-sm text-slate-800">
                Wallet & Commission
              </span>
            </div>

            {/* Feature 3: Orders & Purchases */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#eef8f2] flex items-center justify-center text-[#0c6b37] shrink-0 shadow-2xs">
                <ShoppingCart className="w-5 h-5 text-[#0c6b37]" strokeWidth={1.8} />
              </div>
              <span className="font-bold text-sm text-slate-800">
                Orders & Purchases
              </span>
            </div>

          </div>

        </div>

        {/* Right Column: Sign In Card (Span 7 on LG) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/50 border border-slate-100/90 max-w-md w-full mx-auto space-y-5">
            
            {/* Card Header */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
                Sign In to Your Account
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Access your DirectGrow account to manage your network, earnings, and orders.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Field 1: Email or Referral Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name, Email Address, or Referral Code
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter your name, email, or referral code"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15803d] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password with Forgot Password link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[#15803d] hover:underline font-semibold text-xs cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#15803d] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>Sign In to Account</span>
                <span className="text-base leading-none">→</span>
              </button>

            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200/80 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                Or try a demo account
              </span>
            </div>

            {/* 1-Click Demo Accounts (2x2 Grid Exact Match to Mockup) */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* 1. Rohan (DG10008) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'usr-008')}
                className="border border-slate-200/90 bg-white hover:bg-slate-50/90 rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-[#edf7ee] text-[#15803d] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#15803d]" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">Rohan (DG10008)</p>
                  <p className="text-[10px] text-slate-400 truncate">Active Distributor</p>
                </div>
              </button>

              {/* 2. Meera (DG10007) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'usr-007')}
                className="border border-slate-200/90 bg-white hover:bg-slate-50/90 rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-[#edf7ee] text-[#15803d] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#15803d]" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">Meera (DG10007)</p>
                  <p className="text-[10px] text-slate-400 truncate">Level 1 Sponsor</p>
                </div>
              </button>

              {/* 3. Dr. Rajesh (DG10000) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'usr-000')}
                className="border border-slate-200/90 bg-white hover:bg-slate-50/90 rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-[#edf7ee] text-[#15803d] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#15803d]" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 truncate">Dr. Rajesh (DG10000)</p>
                  <p className="text-[10px] text-slate-400 truncate">Root Diamond</p>
                </div>
              </button>

              {/* 4. Super Admin (Dark Theme Card) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="bg-[#0f2e24] hover:bg-[#091f18] text-white rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all border border-[#166534] shadow-xs text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-[#164e3c] text-amber-300 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-amber-300 truncate">Super Admin</p>
                  <p className="text-[10px] text-slate-300 truncate">Admin Dashboard</p>
                </div>
              </button>

            </div>

            {/* Footer Register Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-600 font-normal">
                New to DirectGrow?{' '}
                <Link to="/join" className="text-[#15803d] font-bold hover:underline">
                  Register as Distributor
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
