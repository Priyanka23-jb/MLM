import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMLM } from '../context/MLMContext';
import { Shield, Key, AlertCircle, ArrowRight, Sparkles, User } from 'lucide-react';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
      setError('Please enter your email or referral code.');
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
      setError(res.message || 'Login failed. Please verify credentials.');
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

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-3">
            <User className="w-3.5 h-3.5" />
            <span>DirectGrow Member Access</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Access your 8-level referral network, wallet commissions, and orders
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address or Referral Code
              </label>
              <input
                type="text"
                placeholder="e.g. rohan.d@example.com or DG10008"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Demo: Any password</span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Fast Persona Fill */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              ⚡ Instant One-Click Demo Logins:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'usr-008')}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left text-xs transition-colors"
              >
                <p className="font-bold text-slate-800 truncate">Rohan (DG10008)</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Active Distributor</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'usr-007')}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left text-xs transition-colors"
              >
                <p className="font-bold text-slate-800 truncate">Meera (DG10007)</p>
                <p className="text-[10px] text-brand-600 font-semibold">Level 1 Sponsor</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('USER', 'usr-000')}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left text-xs transition-colors"
              >
                <p className="font-bold text-slate-800 truncate">Dr. Rajesh (DG10000)</p>
                <p className="text-[10px] text-purple-600 font-semibold">Root Diamond</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-left text-xs transition-colors text-white"
              >
                <p className="font-bold text-amber-300 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Super Admin
                </p>
                <p className="text-[10px] text-slate-300">Admin Dashboard</p>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              New to DirectGrow?{' '}
              <Link to="/join" className="text-brand-600 font-bold hover:underline">
                Register as Distributor
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

