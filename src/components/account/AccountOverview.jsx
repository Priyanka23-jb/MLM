import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Wallet, 
  Users, 
  Package, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  GitBranch,
  Lock,
  Check,
  Search,
  ExternalLink,
  Layers,
  RotateCcw,
  Minimize2,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const AccountOverview = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const { 
    users,
    getUserDownline, 
    getUserLevelEarnings, 
    orders, 
    transactions,
    getChainSequence,
    commissionRules
  } = useMLM();

  const [selectedTreeLevel, setSelectedTreeLevel] = useState('ALL');
  const [searchMember, setSearchMember] = useState('');
  const [activeRootId, setActiveRootId] = useState(currentUser?.id || 'usr-008');
  const [isCompactMode, setIsCompactMode] = useState(true);

  if (!currentUser) return null;

  // Active root for the visual tree (defaults to currentUser)
  const activeRoot = users.find(u => u.id === activeRootId) || currentUser;
  const isViewingSelf = activeRoot.id === currentUser.id;

  const { levels, totalMembers: downlineTotal } = getUserDownline(currentUser.id);
  const levelEarnings = getUserLevelEarnings(activeRoot.id);
  const userOrders = orders.filter(o => o.userId === currentUser.id);
  const userTransactions = transactions.filter(t => t.userId === currentUser.id).slice(0, 4);

  // Sequential 8-level downline chain
  const chainSequence = getChainSequence ? getChainSequence(activeRoot.id, 8) : [];
  const directReferralsCount = (levels[1] || []).length;
  const availableBalance = currentUser.wallet?.balance || 0;
  const totalEarned = currentUser.wallet?.totalEarned || 0;

  let totalTeamEarnings = 0;
  for (let l = 1; l <= 8; l++) {
    totalTeamEarnings += (levelEarnings[l]?.earned || 0);
  }

  const getLevelRule = (lvl) => commissionRules.levels.find(r => r.level === lvl) || {
    percentage: 0,
    fixedAmount: 0
  };

  // Filter chain members by search text
  const filteredChain = chainSequence.filter(item => {
    if (selectedTreeLevel !== 'ALL' && item.level !== Number(selectedTreeLevel)) {
      return false;
    }
    if (!searchMember.trim()) return true;
    const query = searchMember.toLowerCase();
    return item.user.name.toLowerCase().includes(query) ||
           item.user.referralCode.toLowerCase().includes(query);
  });

  const isUserPending = !currentUser.isActivated || currentUser.membershipStatus === 'PENDING';

  return (
    <div className="space-y-8">
      
      {/* Pending Membership Activation Alert Banner */}
      {isUserPending && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-100 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                <AlertCircle className="w-3 h-3 text-amber-200" />
                <span>Mandatory Payment Pending</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Activate Membership with ₹2,000 Package Purchase
              </h3>
              <p className="text-xs text-amber-100 max-w-xl leading-relaxed mt-0.5">
                Your account is currently in <strong>Pending Status</strong> and is not counted as active in the 8-level referral chain. Complete your mandatory ₹2,000 package payment to receive 6 authentic Ayurvedic formulations and unlock your referral features.
              </p>
            </div>
          </div>
          <Link
            to="/activate"
            className="w-full sm:w-auto bg-white hover:bg-amber-50 text-amber-900 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all whitespace-nowrap text-center flex items-center justify-center gap-2 shrink-0 hover:scale-105"
          >
            <span>Activate Now (₹2,000)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-800 to-ayur-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                isUserPending 
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/30" 
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
              }`}>
                {isUserPending ? "Pending Activation" : currentUser.rank}
              </span>
              {currentUser.isQualified && (
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Active 8-Level Qualifier
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black">
              Namaste, {currentUser.name}!
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              {isUserPending ? (
                <>Welcome to DirectGrow. Complete your mandatory ₹2,000 package purchase to unlock your lifetime 8-level earning rights and unique referral code.</>
              ) : (
                <>Your personal DirectGrow Hub. Invite friends with your referral code <strong className="font-mono text-amber-300">{currentUser.referralCode}</strong> and track your earnings across all 8 tiers.</>
              )}
            </p>
          </div>

          {/* Quick Referral Share Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-200 block">Your Referral Code</span>
            {isUserPending ? (
              <>
                <div className="flex items-center justify-center gap-1 text-sm font-black font-mono text-amber-300">
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>LOCKED (₹2,000)</span>
                </div>
                <Link
                  to="/activate"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm w-full flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Activate Code</span>
                </Link>
              </>
            ) : (
              <>
                <div className="text-2xl font-black font-mono text-amber-300 tracking-wider">
                  {currentUser.referralCode}
                </div>
                <button
                  onClick={() => setActiveTab('referral')}
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm w-full flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share & Invite</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Wallet Balance */}
        <div 
          onClick={() => setActiveTab('wallet')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wallet Balance</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">{formatCurrency(availableBalance)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Click to request withdrawal →</p>
          </div>
        </div>

        {/* Total Earned */}
        <div 
          onClick={() => setActiveTab('wallet')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Commissions</span>
            <div className="w-9 h-9 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">{formatCurrency(totalEarned)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Across 8 levels to date</p>
          </div>
        </div>

        {/* Downline Network */}
        <div 
          onClick={() => setActiveTab('network')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">8-Level Downline</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">{chainSequence.length} Members</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">{directReferralsCount} Direct (Level 1) →</p>
          </div>
        </div>

        {/* My Orders */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purchases & Orders</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">{userOrders.length} Order{userOrders.length !== 1 ? 's' : ''}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">View invoices & shipments →</p>
          </div>
        </div>

      </div>

      {/* Two Column Grid: COMPACT VISUAL TREE & Recent Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left: VISUAL 8-LEVEL REFERRAL TREE (Optimized Compact Mode) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          
          {/* Visual Tree Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#edf7f0] text-[#137333] border border-[#d3eed9] flex items-center justify-center shrink-0">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Visual 8-Level Downline Tree
                  </h3>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isViewingSelf 
                    ? "Interactive single-line downline under your account"
                    : `Viewing chain under ${activeRoot.name}`}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Compact / Expanded Toggle */}
              <button
                onClick={() => setIsCompactMode(!isCompactMode)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                title={isCompactMode ? "Switch to Expanded View" : "Switch to Compact View"}
              >
                {isCompactMode ? (
                  <>
                    <Maximize2 className="w-3 h-3 text-slate-500" />
                    <span>Expand</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3 h-3 text-slate-500" />
                    <span>Compact</span>
                  </>
                )}
              </button>

              {!isViewingSelf && (
                <button
                  onClick={() => setActiveRootId(currentUser.id)}
                  className="px-2 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-slate-800 transition-colors"
                  title="Reset view to yourself"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('network')}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <span>Full Studio</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Controls Bar: Level Navigation Pills & Member Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            
            {/* Level Quick-Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedTreeLevel('ALL')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  selectedTreeLevel === 'ALL'
                    ? 'bg-[#0c6b37] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All (8L)
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedTreeLevel(lvl)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                    selectedTreeLevel === lvl
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>

            {/* Quick Filter Input */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Filter name / code..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full sm:w-36 bg-slate-50 focus:bg-white text-[11px] pl-6 pr-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-1.5 top-1.5" />
            </div>

          </div>

          {/* VISUAL TREE CONTAINER (Scrollable and Compact to Fit on Screen) */}
          <div className="bg-gradient-to-b from-slate-50/90 to-slate-100/60 p-3 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
            
            {/* 1. Sleek Compact Sponsor Root Node (Top of Tree) */}
            <div className="flex flex-col items-center">
              <div className="bg-[#0c2340] text-white px-3.5 py-2 rounded-xl shadow-xs border border-emerald-500/40 flex items-center justify-between gap-3 w-full">
                
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeRoot.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={activeRoot.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white truncate">{activeRoot.name}</span>
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
                        {isViewingSelf ? "YOU (ROOT)" : "ROOT"}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-amber-300 font-bold">
                      {activeRoot.referralCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 text-right">
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block leading-none">Team</span>
                    <span className="text-[11px] font-black text-white">{chainSequence.length} Members</span>
                  </div>
                  <div className="w-px h-5 bg-white/20" />
                  <div>
                    <span className="text-[9px] uppercase text-slate-400 font-bold block leading-none">Earned</span>
                    <span className="text-[11px] font-black text-emerald-400">+{formatCurrency(totalTeamEarnings)}</span>
                  </div>
                </div>

              </div>

              {/* Connecting Tree Line Downwards */}
              <div className="w-0.5 h-2 bg-emerald-500/50 my-0.5" />
            </div>

            {/* 2. Downline Visual Tree Nodes (Sequential Levels 1 to 8) */}
            {filteredChain.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-200 p-4 space-y-1.5">
                <Users className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {searchMember ? "No matching member found" : "No downline members at this level yet"}
                </p>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                  Share code <strong className="font-mono text-emerald-700">{currentUser.referralCode}</strong> to grow your 8-level tree!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredChain.map((item, idx) => {
                  const member = item.user;
                  const rule = item.rule;
                  const tierStyle = TIER_COLORS[item.level] || TIER_COLORS[1];
                  const earned = levelEarnings[item.level]?.earned || (member.hasFirstPurchase ? rule.fixedAmount : 0);

                  return (
                    <div key={member.id} className="relative">
                      
                      {/* Unified Compact Node Card */}
                      <div className={`rounded-xl border ${tierStyle.border} bg-white p-2 sm:p-2.5 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5`}>
                        
                        {/* Left: Level Badge + Avatar + Member Name & Code */}
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                          
                          {/* Level Number Pill */}
                          <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border ${tierStyle.badge}`}>
                            {item.level}
                          </span>

                          {/* Avatar */}
                          <img
                            src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                            alt={member.name}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />

                          {/* Name + Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-xs truncate">
                                {member.name}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active Qualifier" />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono truncate">
                              <span className="text-brand-700 font-bold">{member.referralCode}</span>
                              <span className="text-slate-300">•</span>
                              <span className="font-sans text-slate-500">{rule.percentage}% ({formatCurrency(rule.fixedAmount)})</span>
                            </div>
                          </div>

                        </div>

                        {/* Center: Referral Quota / Terminal Status */}
                        <div className="hidden sm:flex items-center shrink-0">
                          {item.level === 8 || item.isTerminal ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                              <Lock className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                              <span>Level 8 Limit</span>
                            </span>
                          ) : !item.canRefer ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                              <Lock className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                              <span>1/1 Used</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                              <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              <span>Ready</span>
                            </span>
                          )}
                        </div>

                        {/* Right: Commission & Quick Inspect */}
                        <div className="text-right shrink-0 flex items-center gap-2">
                          <div>
                            <span className="text-xs font-black text-emerald-600 block leading-tight">
                              +{formatCurrency(earned)}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium block">
                              {item.level === 1 ? 'Direct' : 'Indirect'}
                            </span>
                          </div>

                          {item.level < 8 && !item.isTerminal && (
                            <button
                              onClick={() => setActiveRootId(member.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                              title={`Inspect downline from ${member.name.split(' ')[0]}`}
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Small Connecting Hierarchy Line */}
                      {idx < filteredChain.length - 1 && selectedTreeLevel === 'ALL' && (
                        <div className="w-0.5 h-1.5 bg-slate-300 mx-auto my-0.5" />
                      )}

                    </div>
                  );
                })}
              </div>
            )}

            {/* Tree Summary Bottom Bar */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500 font-medium truncate">
                8 levels • ₹290 qualifying commission pool
              </span>
              <button
                onClick={() => setActiveTab('network')}
                className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-0.5 shrink-0"
              >
                <span>Full Tree Studio</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

        {/* Right: Recent Wallet Transactions & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Recent Commissions</h3>
              <button
                onClick={() => setActiveTab('wallet')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {userTransactions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No transactions recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {userTransactions.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(tx.date)}</p>
                    </div>
                    <span className={`font-black ml-2 ${
                      tx.type === 'COMMISSION_CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'COMMISSION_CREDIT' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Business Qualification Status Callout */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-3xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">Distributor Earning Rights</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentUser.isQualified 
                ? "Your account is fully qualified! You are eligible to receive real-time rewards across all 8 referral tiers on downline qualifying purchases."
                : "Your account is not yet qualified. Place a first qualifying purchase of ₹2,000 to activate full 8-level referral commissions!"}
            </p>
            {!currentUser.isQualified && (
              <div className="pt-2">
                <Link
                  to="/products/prod-starter-pack"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl inline-block"
                >
                  Activate with ₹2,000 Starter Pack
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
