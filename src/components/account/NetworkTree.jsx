import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Users, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  GitBranch, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  Lock,
  ShoppingCart,
  Zap,
  Check
} from 'lucide-react';

const TIER_COLORS = {
  1: { badge: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-500", border: "border-emerald-300", text: "text-emerald-700", bgLight: "bg-emerald-50/50" },
  2: { badge: "bg-teal-100 text-teal-800 border-teal-300", dot: "bg-teal-500", border: "border-teal-300", text: "text-teal-700", bgLight: "bg-teal-50/50" },
  3: { badge: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-500", border: "border-blue-300", text: "text-blue-700", bgLight: "bg-blue-50/50" },
  4: { badge: "bg-indigo-100 text-indigo-800 border-indigo-300", dot: "bg-indigo-500", border: "border-indigo-300", text: "text-indigo-700", bgLight: "bg-indigo-50/50" },
  5: { badge: "bg-violet-100 text-violet-800 border-violet-300", dot: "bg-violet-500", border: "border-violet-300", text: "text-violet-700", bgLight: "bg-violet-50/50" },
  6: { badge: "bg-purple-100 text-purple-800 border-purple-300", dot: "bg-purple-500", border: "border-purple-300", text: "text-purple-700", bgLight: "bg-purple-50/50" },
  7: { badge: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300", dot: "bg-fuchsia-500", border: "border-fuchsia-300", text: "text-fuchsia-700", bgLight: "bg-fuchsia-50/50" },
  8: { badge: "bg-amber-100 text-amber-800 border-amber-300", dot: "bg-amber-500", border: "border-amber-300", text: "text-amber-700", bgLight: "bg-amber-50/50" },
};

export const NetworkTree = () => {
  const { currentUser } = useAuth();
  const { 
    users, 
    getUserDownline, 
    getUserLevelEarnings, 
    commissionRules,
    getChainSequence,
    canUserRefer,
    getDirectReferral,
    processOrderPayment
  } = useMLM();
  
  // Active Root User for the tree view: Defaults to currentUser (Rohan Verma),
  // but can be pivoted to Sunita Patel, Amit Verma, etc. to inspect their 8 names!
  const [activeRootId, setActiveRootId] = useState(currentUser?.id || 'usr-008');
  const [selectedLevel, setSelectedLevel] = useState('ALL'); // 'ALL' or 1..8
  const [searchMember, setSearchMember] = useState('');
  const [viewMode, setViewMode] = useState('TREE'); // 'TREE' or 'TABLE'
  
  // Real-time purchase simulation state
  const [simulatingBuyerId, setSimulatingBuyerId] = useState('');
  const [simulateAmount, setSimulateAmount] = useState('2000');
  const [simulateSuccessMsg, setSimulateSuccessMsg] = useState('');

  if (!currentUser) return null;

  // Active root node being viewed
  const activeRoot = users.find(u => u.id === activeRootId) || currentUser;
  const isViewingSelf = activeRoot.id === currentUser.id;

  // Get strict 8-level single-line sequence
  const chainSequence = getChainSequence ? getChainSequence(activeRoot.id, 8) : [];
  const levelEarnings = getUserLevelEarnings(activeRoot.id);

  // Active members count across all levels
  const totalMembers = chainSequence.length;
  const totalActive = chainSequence.filter(item => item.user.isQualified || item.user.hasFirstPurchase).length;
  let totalTeamEarnings = 0;
  for (let l = 1; l <= 8; l++) {
    totalTeamEarnings += (levelEarnings[l]?.earned || 0);
  }

  const getLevelRule = (lvl) => commissionRules.levels.find(r => r.level === lvl) || {
    percentage: 0,
    fixedAmount: 0
  };

  // Compile list for Table View
  const getFilteredTableMembers = () => {
    let list = chainSequence.map(item => {
      const earned = levelEarnings[item.level]?.earned || (item.user.hasFirstPurchase ? Math.round((item.user.wallet?.totalPurchases || 2000) * item.rule.percentage / 100) : 0);
      return {
        ...item.user,
        levelNumber: item.level,
        rule: item.rule,
        referredMember: item.referredMember,
        canRefer: item.canRefer,
        isTerminal: item.isTerminal || item.level === 8,
        commissionEarned: earned
      };
    });

    if (selectedLevel !== 'ALL') {
      const lvlNum = Number(selectedLevel);
      list = list.filter(m => m.levelNumber === lvlNum);
    }

    if (!searchMember.trim()) return list;
    const q = searchMember.toLowerCase();
    return list.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.referralCode.toLowerCase().includes(q) ||
      (m.sponsorCode && m.sponsorCode.toLowerCase().includes(q))
    );
  };

  const tableMembers = getFilteredTableMembers();

  // Handle live purchase simulation to test first and subsequent purchases
  const handleSimulatePurchase = (e) => {
    e.preventDefault();
    const buyerId = simulatingBuyerId || chainSequence[0]?.user.id;
    if (!buyerId) return;

    const buyer = users.find(u => u.id === buyerId);
    if (!buyer) return;

    const orderAmount = Number(simulateAmount) || 2000;
    const isSubsequent = buyer.hasFirstPurchase;
    const orderId = `ORD-SIM-${Date.now().toString().slice(-5)}`;

    const simOrder = {
      id: orderId,
      userId: buyer.id,
      userName: buyer.name,
      items: [{ productId: "prod-sim", name: "Ayurvedic Formulation Pack", price: orderAmount, quantity: 1 }],
      subtotal: orderAmount,
      discount: 0,
      shipping: 0,
      total: orderAmount,
      paymentMethod: "UPI_SIMULATED",
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      shippingAddress: { name: buyer.name, phone: buyer.phone || "+91 98000 00000", address: "Main Road", city: "Pune", state: "Maharashtra", pincode: "411001" },
      status: "DELIVERED"
    };

    processOrderPayment(simOrder, buyer);

    setSimulateSuccessMsg(`Success! ${buyer.name} placed a ${isSubsequent ? 'subsequent' : 'qualifying'} purchase of ${formatCurrency(orderAmount)}. Commissions were credited up to 8 levels in real time!`);
    setTimeout(() => setSimulateSuccessMsg(''), 6000);
  };

  // Find key members for quick-jump navigation
  const sunitaMember = users.find(u => u.referralCode === "DG20001" || u.name.includes("Sunita"));
  const amitMember = users.find(u => u.referralCode === "DG20002" || u.name.includes("Amit"));
  const poojaMember = users.find(u => u.referralCode === "DG20003" || u.name.includes("Pooja"));

  return (
    <div className="space-y-6">
      
      {/* Strict 8-Level Single-Line Hierarchy Rule Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 rounded-3xl p-5 shadow-xs text-amber-950">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-wider text-amber-900">
                  Strict 8-Level Single-Line Referral Chain
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-300">
                  1 Member = 1 Referral Max
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-3xl">
                Every member can refer <strong>only one new member</strong>, creating a direct parent-child chain without parallel branches. 
                Once a member refers someone, their referral option is disabled. 
                Commissions trigger on <strong>every purchase (first & all subsequent orders)</strong> cascading up to 8 uplines!
              </p>
            </div>
          </div>

          {/* Quick Downline Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Inspect:</span>
            
            <button
              onClick={() => setActiveRootId('usr-008')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                activeRoot.id === 'usr-008'
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>Rohan Verma (Root)</span>
            </button>

            {sunitaMember && (
              <button
                onClick={() => setActiveRootId(sunitaMember.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  activeRoot.id === sunitaMember.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>Sunita Patel (L1)</span>
              </button>
            )}

            {amitMember && (
              <button
                onClick={() => setActiveRootId(amitMember.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  activeRoot.id === amitMember.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>Amit Verma (L2)</span>
              </button>
            )}

            {!isViewingSelf && (
              <button
                onClick={() => setActiveRootId(currentUser.id)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-slate-800 transition-colors"
                title="Reset view to yourself"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to You</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-800 to-violet-brand rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-2">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Direct Parent-Child Sequential Chain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {activeRoot.name}'s 8-Level Single-Line Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              {isViewingSelf 
                ? "Showing the exact 8 sequential downline members under you (Sunita → Amit → Pooja → Vikram → Neha → Karan → Meera → Priya)."
                : `Showing the 8 sequential downline members in ${activeRoot.name}'s direct chain.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Chain Members</span>
              <span className="text-xl font-black text-white">{totalMembers} Members</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Active Qualifiers</span>
              <span className="text-xl font-black text-emerald-400">{totalActive} Active</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Commissions</span>
              <span className="text-xl font-black text-amber-300">+{formatCurrency(totalTeamEarnings)}</span>
            </div>
          </div>
        </div>

        {/* Level Navigation Tabs (All + Levels 1 to 8) */}
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-9 gap-2 pt-4 border-t border-white/15">
          {/* ALL Tab */}
          <button
            onClick={() => setSelectedLevel('ALL')}
            className={`p-2.5 rounded-2xl text-center transition-all ${
              selectedLevel === 'ALL'
                ? "bg-white text-slate-900 shadow-lg scale-105 font-bold"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-80">Full Chain</div>
            <div className="text-sm font-black mt-0.5">{totalMembers} Names</div>
            <div className={`text-[10px] mt-0.5 font-bold ${selectedLevel === 'ALL' ? "text-emerald-700" : "text-emerald-300"}`}>
              +{formatCurrency(totalTeamEarnings)}
            </div>
            <div className="text-[9px] opacity-70">Levels 1–8</div>
          </button>

          {/* Levels 1 to 8 Tabs */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
            const item = chainSequence.find(i => i.level === lvl);
            const isSelected = selectedLevel === lvl;
            const rule = getLevelRule(lvl);
            const earned = levelEarnings[lvl]?.earned || (item?.user.hasFirstPurchase ? rule.fixedAmount : 0);
            const memberFirstName = item?.user.name.split(' ')[0] || "—";

            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-2.5 rounded-2xl text-center transition-all ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-lg scale-105 font-bold"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  L{lvl} {lvl === 1 ? "(Direct)" : ""}
                </div>
                <div className="text-xs font-black mt-0.5 truncate">{memberFirstName}</div>
                <div className={`text-[10px] mt-0.5 font-bold ${isSelected ? "text-emerald-700" : "text-emerald-300"}`}>
                  +{formatCurrency(earned)}
                </div>
                <div className="text-[9px] opacity-70">
                  {rule.percentage}% (₹{rule.fixedAmount})
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Commission Simulation Tool (Tests First & Subsequent Purchases) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Live Commission Simulation (Tests First & Subsequent Purchases)
              </h4>
              <p className="text-[11px] text-slate-500">
                Trigger a purchase as any downline member and watch commissions cascade up to 8 levels in real time!
              </p>
            </div>
          </div>
        </div>

        {simulateSuccessMsg && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{simulateSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSimulatePurchase} className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Buyer Member:</span>
            <select
              value={simulatingBuyerId || chainSequence[0]?.user.id || ''}
              onChange={(e) => setSimulatingBuyerId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {chainSequence.map(item => (
                <option key={item.user.id} value={item.user.id}>
                  Level {item.level}: {item.user.name} ({item.user.referralCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Purchase Amount:</span>
            <select
              value={simulateAmount}
              onChange={(e) => setSimulateAmount(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="2000">₹2,000 (Standard Qualifying Order)</option>
              <option value="3000">₹3,000 (Subsequent Order)</option>
              <option value="4000">₹4,000 (Subsequent Order)</option>
              <option value="1000">₹1,000 (Custom Order)</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 ml-auto"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Simulate Purchase & Payout</span>
          </button>
        </form>
      </div>

      {/* Selected Level Summary & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center">
                {selectedLevel === 'ALL' ? '8L' : `L${selectedLevel}`}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedLevel === 'ALL' 
                    ? `8 Sequential Downline Names under ${activeRoot.name}` 
                    : selectedLevel === 1 
                      ? "Level 1: 1-Time Direct Referral" 
                      : `Level ${selectedLevel}: ${selectedLevel}th Generation Referral`}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedLevel === 'ALL' 
                    ? "Strict 1-to-1 sequential hierarchy. Every member can refer only 1 person. ₹290 commission pool on qualifying orders."
                    : `Commission: ${getLevelRule(Number(selectedLevel)).percentage}% (₹${getLevelRule(Number(selectedLevel)).fixedAmount}) per qualifying purchase`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or code..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="bg-slate-100 focus:bg-white text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('TREE')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'TREE' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Visual Tree (8 Names)</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'TABLE' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'TABLE' ? (
          /* Table View */
          tableMembers.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No Member at this Tier</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Member Info</th>
                    <th className="py-3 px-3">Referral Code</th>
                    <th className="py-3 px-3">Direct Sponsor</th>
                    <th className="py-3 px-3 text-center">Referral Quota</th>
                    <th className="py-3 px-3 text-center">Qualification</th>
                    <th className="py-3 px-3 text-right">Reward %</th>
                    <th className="py-3 px-4 text-right">Commission to {activeRoot.name.split(' ')[0]}</th>
                    <th className="py-3 px-4 text-center">Downline Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableMembers.map((member) => {
                    const tierStyle = TIER_COLORS[member.levelNumber] || TIER_COLORS[1];

                    return (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${tierStyle.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tierStyle.dot}`} />
                            Level {member.levelNumber}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{member.name}</p>
                              <p className="text-[10px] text-slate-400">{member.rank}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-brand-700">
                          {member.referralCode}
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-600">
                          {member.sponsorCode || "—"}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {member.levelNumber === 8 || member.isTerminal ? (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                              <Lock className="w-2.5 h-2.5 text-rose-600" />
                              Level 8 Limit (Cannot Refer)
                            </span>
                          ) : !member.canRefer ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                              <Lock className="w-2.5 h-2.5 text-amber-600" />
                              1/1 Used (Disabled)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              0/1 Active (Ready)
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {member.isQualified || member.hasFirstPurchase ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active Qualifier
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-slate-500" />
                              Registered
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right font-black text-slate-800">
                          {member.rule.percentage}%
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-black text-emerald-600 text-xs">
                            +{formatCurrency(member.commissionEarned)}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {member.levelNumber === 8 || member.isTerminal ? (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                              <span>End of Chain</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setActiveRootId(member.id)}
                              className="text-[11px] font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 inline-flex items-center gap-1 transition-all"
                            >
                              <span>View Downline from {member.name.split(' ')[0]}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Visual Interactive Sequential Tree matching Image 2 */
          <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            
            {/* Active Root Persona Display (Matches Top Card in Image 2) */}
            <div className="flex flex-col items-center">
              <div className="bg-[#0c2340] text-white p-5 rounded-3xl shadow-xl border-2 border-teal-500/40 text-center min-w-[280px] max-w-sm relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/80 text-teal-300 text-[10px] font-black uppercase tracking-wider mb-2 border border-teal-500/30">
                  <Sparkles className="w-3 h-3 text-teal-300" />
                  <span>{isViewingSelf ? "SPONSOR ROOT (YOU)" : `SPONSOR ROOT (${activeRoot.name.toUpperCase()})`}</span>
                </div>
                <h4 className="text-xl font-black text-white">{activeRoot.name}</h4>
                <p className="text-xs font-mono text-amber-300 font-bold mt-0.5">{activeRoot.referralCode}</p>
                <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-around text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">team</span>
                    <strong className="text-white font-extrabold text-sm">{totalMembers} Members</strong>
                  </div>
                  <div className="w-px h-6 bg-white/15" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">earnings</span>
                    <strong className="text-emerald-400 font-extrabold text-sm">+{formatCurrency(totalTeamEarnings)}</strong>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center my-2">
                <div className="w-0.5 h-6 bg-slate-300" />
              </div>
            </div>

            {/* Exactly 8 Names Under Active Root (Levels 1 to 8 with Image 2 Level Header Bars) */}
            <div className="max-w-3xl mx-auto space-y-3">
              {chainSequence.map((item, idx) => {
                if (selectedLevel !== 'ALL' && selectedLevel !== item.level) {
                  return null;
                }

                const member = item.user;
                const rule = item.rule;
                const tierStyle = TIER_COLORS[item.level] || TIER_COLORS[1];
                const earned = levelEarnings[item.level]?.earned || (member.hasFirstPurchase ? rule.fixedAmount : 0);

                return (
                  <div key={member.id} className="relative space-y-2">
                    
                    {/* Level Header Bar (Directly from Image 2) */}
                    <div className="bg-white rounded-2xl border border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-xs border ${tierStyle.badge}`}>
                          Level {item.level}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {item.level === 1 ? "Direct Referrals (1st Generation)" : `Indirect Referrals (${item.level}th Generation)`}
                        </span>
                        <span className="text-slate-300 text-xs hidden md:inline">|</span>
                        <span className="text-xs text-slate-500 hidden md:inline font-medium">
                          Payout: {rule.percentage}% ({formatCurrency(rule.fixedAmount)}) / per qualifier
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <span className="text-xs font-bold text-slate-600">1 Member</span>
                        <span className="text-xs font-black text-emerald-600">+{formatCurrency(earned)}</span>
                      </div>
                    </div>

                    {/* Member Card (Directly from Image 2) */}
                    <div className={`rounded-2xl border-2 ${tierStyle.border} bg-white p-4 shadow-xs hover:shadow-md transition-all`}>
                      <div className="flex flex-col gap-3">
                        
                        {/* Card Top Badges Row */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${tierStyle.badge}`}>
                            LEVEL {item.level}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active Qualifier</span>
                          </span>
                        </div>

                        {/* Card Middle Info Row */}
                        <div className="flex items-center gap-3.5">
                          <img
                            src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-xs shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                              {member.name}
                            </h5>
                            <p className="font-mono text-xs font-bold text-brand-700 mt-0.5">
                              {member.referralCode}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Sponsor: <span className="font-mono font-bold text-slate-700">{member.sponsorCode}</span>
                            </p>
                          </div>

                          {/* Right Reward Highlight */}
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">
                              {item.level === 1 ? "Direct Reward" : "Indirect Reward"}
                            </span>
                            <span className="text-base font-black text-emerald-600">
                              +{formatCurrency(earned)}
                            </span>
                          </div>
                        </div>

                        {/* Card Bottom Status & Downline Pivot Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                          <div>
                            {item.level === 8 || item.isTerminal ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                                <Lock className="w-3 h-3 text-rose-600" />
                                <span>Level 8 Limit (Cannot Refer Anyone)</span>
                              </span>
                            ) : !item.canRefer ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                                <Lock className="w-3 h-3 text-amber-600" />
                                <span>1/1 Used (Cannot Refer Another)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>0/1 Active (Ready to Refer)</span>
                              </span>
                            )}
                          </div>

                          <div>
                            {item.level === 8 || item.isTerminal ? (
                              <span className="text-[11px] font-semibold text-slate-400">
                                End of Chain (Terminal)
                              </span>
                            ) : (
                              <button
                                onClick={() => setActiveRootId(member.id)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs hover:scale-102"
                              >
                                <span>View Downline from {member.name.split(' ')[0]}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Connecting Hierarchy Line */}
                    {idx < chainSequence.length - 1 && selectedLevel === 'ALL' && (
                      <div className="w-0.5 h-5 bg-slate-300 mx-auto my-1" />
                    )}

                  </div>
                );
              })}
            </div>

            {/* Bottom Explainer Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Strict 8-Level Sequential Chain Protection</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Duplicate branches and parallel sponsors are strictly blocked. Every successful purchase automatically credits all 8 uplines in real time!
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-mono font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                <span>Total Pool:</span>
                <span className="text-emerald-600">₹290 (14.5%)</span>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
