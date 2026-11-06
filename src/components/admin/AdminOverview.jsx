import React from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  ShoppingBag, 
  Award, 
  ArrowUpRight, 
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminOverview = ({ setActiveTab }) => {
  const { users, orders, transactions, withdrawals, commissionRules } = useMLM();

  const totalRevenue = orders.filter(o => o.status !== 'REFUNDED').reduce((s, o) => s + o.total, 0);
  const totalCommissionsPaid = transactions.filter(t => t.type === 'COMMISSION_CREDIT').reduce((s, t) => s + t.amount, 0);
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'PENDING').length;
  const pendingWithdrawalsAmount = withdrawals.filter(w => w.status === 'PENDING').reduce((s, w) => s + w.amount, 0);
  const totalActiveDistributors = users.filter(u => u.isQualified).length;

  // Chart Data: Monthly Growth
  const salesVsCommissionData = [
    { month: 'May', sales: 45000, commissions: 6525 },
    { month: 'Jun', sales: 68000, commissions: 9860 },
    { month: 'Jul', sales: 92000, commissions: 13340 },
    { month: 'Aug', sales: 124000, commissions: 17980 },
    { month: 'Sep', sales: 185000, commissions: 26825 },
    { month: 'Oct', sales: 240000, commissions: 34800 },
    { month: 'Nov', sales: 310000, commissions: 44950 },
  ];

  // Level-wise Payout Distribution Chart Data
  const levelDistributionData = commissionRules.levels.map(l => {
    const levelTransactions = transactions.filter(t => t.type === 'COMMISSION_CREDIT' && t.level === l.level);
    const totalAmount = levelTransactions.reduce((s, t) => s + t.amount, 0);
    return {
      name: `Level ${l.level}`,
      amount: totalAmount || (l.fixedAmount * 8),
      rate: `${l.percentage}%`
    };
  });

  const COLORS = ['#16a34a', '#059669', '#0d9488', '#0284c7', '#2563eb', '#6366f1', '#7c3aed', '#9333ea'];

  return (
    <div className="space-y-8">
      
      {/* 4 Stat Cards (Light Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Platform Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900">{formatCurrency(totalRevenue)}</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            {orders.length} Total Platform Orders
          </div>
        </div>

        {/* 8-Level Commissions Paid */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>8-Level Commissions Paid</span>
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-emerald-600">{formatCurrency(totalCommissionsPaid)}</span>
            <p className="text-[11px] text-slate-500 mt-1">
              Exact 14.5% (₹290 per ₹2,000 order)
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            Distributed upstream to 8 tiers
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Registered Members</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900">{users.length} Users</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {totalActiveDistributors} Active Qualifiers (8-tier ready)
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            Across full hierarchy
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Pending Withdrawals</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-amber-600">{formatCurrency(pendingWithdrawalsAmount)}</span>
            <p className="text-[11px] text-slate-500 mt-1">
              {pendingWithdrawalsCount} Request{pendingWithdrawalsCount !== 1 ? 's' : ''} awaiting approval
            </p>
          </div>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className="text-[11px] text-brand-600 hover:text-brand-700 hover:underline font-bold text-left"
          >
            Review & Process Payouts →
          </button>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales vs Commission Payouts Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-slate-900 font-bold text-base">Monthly Revenue & 8-Level Commission Distribution</h3>
              <p className="text-xs text-slate-500">Gross product sales compared against network commission disbursements</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Sales Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-600">
                <span className="w-3 h-3 rounded-full bg-brand-500" />
                <span>Commissions (₹290)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesVsCommissionData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '1rem', color: '#0f172a', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="commissions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCommissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Level Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-slate-900 font-bold text-base">Level Payout Ratio</h3>
            <p className="text-xs text-slate-500">Rewards distributed across 8 tiers</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {levelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Level 1: 5% (₹100)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Level 2: 3% (₹60)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>Level 3: 2% (₹40)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>Level 4: 1.5% (₹30)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Level 5: 1% (₹20)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Level 6: 1% (₹20)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Level 7: 0.5% (₹10)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-600" />
              <span>Level 8: 0.5% (₹10)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Platform Orders & Commission Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-slate-900 font-bold text-base">Recent Platform Orders</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs text-brand-600 hover:text-brand-700 hover:underline font-bold"
            >
              View All Orders →
            </button>
          </div>

          <div className="space-y-2">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">#{ord.id}</span>
                    <span className="text-slate-700 font-semibold">{ord.userName}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{formatDateTime(ord.createdAt)}</p>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 block">{formatCurrency(ord.total)}</span>
                  {ord.isQualifying ? (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Qualifying (₹290 dist)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Regular order
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Wallet Commission Disbursements */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-slate-900 font-bold text-base">Live Commission Feed</h3>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs text-brand-600 hover:text-brand-700 hover:underline font-bold"
            >
              Full Ledger →
            </button>
          </div>

          <div className="space-y-2">
            {transactions.filter(t => t.type === 'COMMISSION_CREDIT').slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs transition-colors">
                <div>
                  <p className="font-semibold text-slate-800 line-clamp-1">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">{formatDateTime(tx.date)}</p>
                </div>
                <span className="font-black text-emerald-600 text-sm shrink-0 ml-2">
                  +{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
