import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { AdminOverview } from './AdminOverview';
import { AdminMembers } from './AdminMembers';
import { AdminGenealogy } from './AdminGenealogy';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCommissionRules } from './AdminCommissionRules';
import { AdminWithdrawals } from './AdminWithdrawals';
import { AdminTransactions } from './AdminTransactions';
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  Package, 
  ShoppingBag, 
  Sliders, 
  CreditCard, 
  FileText, 
  Globe, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, loginAsUser } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Customer Directory', icon: Users },
    { id: 'genealogy', label: '8-Tier Genealogy Tree', icon: GitBranch },
    { id: 'products', label: 'Products & BV Points', icon: Package },
    { id: 'orders', label: 'Orders & Refunds', icon: ShoppingBag },
    { id: 'rules', label: '8-Level Commission Engine', icon: Sliders, badge: '₹290 Ref' },
    { id: 'withdrawals', label: 'Withdrawal Requests', icon: CreditCard },
    { id: 'transactions', label: 'Global Audit Ledger', icon: FileText },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-200/90 p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo className="h-8" />
          <span className="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-brand-600" />
          <span>Public Website</span>
        </Link>
      </div>

      {/* Sidebar Navigation (Light Theme) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 p-5 flex flex-col justify-between shadow-soft lg:shadow-none transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo & Portal Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Logo className="h-10" />
            <span className="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Admin
            </span>
          </div>

          {/* Admin User Card */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">Super Administrator</p>
              <p className="text-[10px] text-slate-500 font-mono">admin@directgrow.com</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Go to Public Website</span>
          </Link>

          <button
            onClick={() => {
              loginAsUser('usr-008'); // Switch to active distributor
              navigate('/account');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Switch to Customer Account</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container (Light Theme) */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && <AdminOverview setActiveTab={setActiveTab} />}
        {activeTab === 'members' && <AdminMembers />}
        {activeTab === 'genealogy' && <AdminGenealogy />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'rules' && <AdminCommissionRules />}
        {activeTab === 'withdrawals' && <AdminWithdrawals />}
        {activeTab === 'transactions' && <AdminTransactions />}
      </main>

    </div>
  );
};
