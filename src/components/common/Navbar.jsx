import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { Logo } from './Logo';
import { 
  ShoppingBag, 
  Store,
  User, 
  Wallet, 
  Users, 
  Package, 
  Share2, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      {/* Main Navbar Row (Exact Match to Reference Design) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-4">
          
          {/* 1. Left: DirectGrow Logo (Clicking links to Home) */}
          <div className="flex-shrink-0">
            <Logo className="h-11 sm:h-12" />
          </div>

          {/* 2. Right: Ayurvedic Store Pill (Links to Products) + Cart + User Pill */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Ayurvedic Store Button */}
            <Link
              to="/products"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#eef8f2] hover:bg-[#e2f4e8] border border-[#a8dab5] text-[#137333] font-bold text-xs transition-all shadow-2xs whitespace-nowrap"
            >
              <Store className="w-4 h-4 text-[#137333] shrink-0" strokeWidth={2} />
              <span>Ayurvedic Store</span>
            </Link>

            {/* Cart Icon (matches screenshot) */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-[#137333] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-800 hover:text-[#137333] transition-colors" strokeWidth={1.8} />
              <span className="absolute top-0 right-0 bg-[#137333] text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </Link>

            {/* User Account Controls */}
            {currentUser ? (
              <div className="relative">
                {/* User Pill (matches screenshot: Circle Icon + Name + Chevron) */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs text-xs font-bold text-slate-800"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    {/* User Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">
                        Code: {currentUser.referralCode}
                      </p>
                      {!isAdmin && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-medium">Wallet Balance:</span>
                          <span className="text-xs font-extrabold text-emerald-600">
                            {formatCurrency(currentUser.wallet?.balance || 0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-2 space-y-1 text-xs">
                      <Link
                        to="/account?tab=overview"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                      >
                        <User className="w-4 h-4 text-brand-600" />
                        <span>Account Hub</span>
                      </Link>

                      <Link
                        to="/account?tab=network"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-emerald-600" />
                          <span>8-Level Network</span>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-full">
                          8 Tiers
                        </span>
                      </Link>

                      <Link
                        to="/account?tab=wallet"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-medium"
                      >
                        <div className="flex items-center gap-2.5">
                          <Wallet className="w-4 h-4 text-amber-600" />
                          <span>Wallet & Earnings</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-600">
                          {formatCurrency(currentUser.wallet?.balance || 0)}
                        </span>
                      </Link>

                      <Link
                        to="/account?tab=referral"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                      >
                        <Share2 className="w-4 h-4 text-brand-600" />
                        <span>Invite & Share Tools</span>
                      </Link>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/join"
                  className="bg-[#0c6b37] hover:bg-[#0a5a2e] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-105"
                >
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && !currentUser && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg"
            >
              Log In
            </Link>
            <Link
              to="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-xs font-bold text-white bg-[#15803d] rounded-lg"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
