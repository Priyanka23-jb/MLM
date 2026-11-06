import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AccountOverview } from './AccountOverview';
import { NetworkTree } from './NetworkTree';
import { WalletSection } from './WalletSection';
import { OrdersSection } from './OrdersSection';
import { ReferralTools } from './ReferralTools';
import { ProfileSection } from './ProfileSection';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Package, 
  Share2, 
  User, 
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react';

export const AccountLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/account');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'overview', label: 'Account Hub', icon: LayoutDashboard },
    { id: 'network', label: '8-Level Network', icon: Users, badge: '8 Tiers' },
    { id: 'wallet', label: 'Wallet & Earnings', icon: Wallet },
    { id: 'orders', label: 'Orders & Invoices', icon: Package },
    { id: 'referral', label: 'Invite & Share Tools', icon: Share2 },
    { id: 'profile', label: 'Profile & KYC', icon: User },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-brand-600">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">My Public Account</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize text-brand-600 font-bold">{activeTab.replace('-', ' ')}</span>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs mb-8 flex flex-wrap gap-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Rendering */}
        <div>
          {activeTab === 'overview' && <AccountOverview setActiveTab={setActiveTab} />}
          {activeTab === 'network' && <NetworkTree />}
          {activeTab === 'wallet' && <WalletSection />}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'referral' && <ReferralTools />}
          {activeTab === 'profile' && <ProfileSection />}
        </div>

      </div>
    </div>
  );
};

