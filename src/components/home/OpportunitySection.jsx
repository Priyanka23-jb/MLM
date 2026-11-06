import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Network, 
  Wallet, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';

const EIGHT_LEVELS = [
  { level: 1, role: "Direct Referral", rate: "5.0%", amount: 100, desc: "Direct sponsor bonus credited instantly to wallet" },
  { level: 2, role: "Tier 2 Indirect", rate: "3.0%", amount: 60, desc: "Earned when your direct recruits refer a customer" },
  { level: 3, role: "Tier 3 Indirect", rate: "2.0%", amount: 40, desc: "Downline network reward for 3rd generation order" },
  { level: 4, role: "Tier 4 Indirect", rate: "1.5%", amount: 30, desc: "Deep multi-tier residual commission distribution" },
  { level: 5, role: "Tier 5 Indirect", rate: "1.0%", amount: 20, desc: "Ecosystem reward supporting team builder scaling" },
  { level: 6, role: "Tier 6 Indirect", rate: "1.0%", amount: 20, desc: "Ecosystem reward across 6th generation" },
  { level: 7, role: "Tier 7 Indirect", rate: "0.5%", amount: 10, desc: "Extended leadership reward across wide networks" },
  { level: 8, role: "Tier 8 Indirect", rate: "0.5%", amount: 10, desc: "Maximum depth boundary in compliant direct selling" },
];

export const OpportunitySection = () => {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>The Ethical 8-Tier Direct Selling Blueprint</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            How The 8-Level Compensation Journey Works
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
            A frictionless customer-to-distributor transition. All activities happen transparently on our public website without confusing secondary portals.
          </p>
        </div>

        {/* 6 Step Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-900/60 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Website Visit & Join Now
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore products, understand Ayurveda benefits, and initiate the simple registration flow via the Join Now button.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Referral Code & Sponsor Link
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the unique invite code of the member who introduced you, automatically anchoring your placement in their genealogy tree.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              First Qualifying Purchase
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Make a single order of ₹2,000+ (or Starter Pack) to officially activate your distributor earning rights across all 8 tiers.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-900/60 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Instant 8-Level Reward Distribution
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ₹290 total is distributed upstream: ₹100 (5%) to Direct Sponsor, followed by ₹60 (L2), ₹40 (L3), down to Level 8.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-500/30 text-teal-400 flex items-center justify-center font-black text-sm mb-4">
              05
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Unique Code & Network Tools
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get your custom DG referral link, QR code, and WhatsApp share buttons directly in your customer account.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black text-sm mb-4">
              06
            </div>
            <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Wallet Credit & Bank Withdrawals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch your internal wallet balance update in real time. Request bank transfers or UPI payouts anytime with 1-click.
            </p>
          </div>

        </div>

        {/* ============================================================== */}
        {/* The Exact 8-Level Commission Structure Display Table & Cards */}
        {/* ============================================================== */}
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 mb-16 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transparent 8-Level Mathematical Model</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                All 8 Referral Levels Explained
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                On every qualifying purchase of <strong>₹2,000</strong>, exactly <strong>₹290 (14.5%)</strong> is distributed directly to uplines across all 8 tiers.
              </p>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-500/40 p-3.5 rounded-2xl text-center shrink-0">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Total Pool Payout</span>
              <span className="text-2xl font-black text-emerald-400">₹290</span>
              <span className="text-[10px] text-slate-400 block">Distributed on ₹2,000 Order</span>
            </div>
          </div>

          {/* 8 Levels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
            {EIGHT_LEVELS.map((item) => (
              <div 
                key={item.level}
                className={`p-4 rounded-2xl border transition-all ${
                  item.level === 1 
                    ? "bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30"
                    : "bg-slate-900/60 border-slate-700/70 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                    item.level === 1 ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-200 border border-slate-700"
                  }`}>
                    L{item.level}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {item.rate}
                  </span>
                </div>

                <div className="mb-2">
                  <h4 className="text-white font-bold text-sm">
                    Level {item.level}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">
                    {item.role}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Rupee Payout</span>
                  <span className="text-lg font-black text-white">
                    ₹{item.amount}
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance & Safeguard Rules Note */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Rules Enforced:</strong> Payout applied on 1st qualifying order (₹2,000). Automated refund commission reversal protected.
              </span>
            </div>
            <Link 
              to="/account?tab=network" 
              className="text-emerald-400 hover:text-emerald-300 font-bold shrink-0 inline-flex items-center gap-1"
            >
              <span>View in My Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-brand-600 via-violet-brand to-ayur-600 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl font-black text-white">
              Ready to embark on your DirectGrow journey?
            </h3>
            <p className="text-xs sm:text-sm text-slate-100 mt-1">
              Join thousands of wellness entrepreneurs across India. No hidden registration fees.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/join"
              className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Start Free Registration
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
