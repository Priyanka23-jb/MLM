import React from 'react';
import { Link } from 'react-router-dom';
import { CommissionCalculator } from '../components/home/CommissionCalculator';
import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';

export const OpportunityPage = () => {
  const levels = [
    { level: 1, type: "Direct Sponsor", percent: "5.0%", payout: "₹100", desc: "Awarded immediately on the first qualifying order of any personal recruit." },
    { level: 2, type: "Indirect Tier 2", percent: "3.0%", payout: "₹60", desc: "Awarded when your Level 1 members refer their direct customers." },
    { level: 3, type: "Indirect Tier 3", percent: "2.0%", payout: "₹40", desc: "Awarded as your team continues to duplicate into deeper layers." },
    { level: 4, type: "Indirect Tier 4", percent: "1.5%", payout: "₹30", desc: "Sustainable indirect income from growing community clusters." },
    { level: 5, type: "Indirect Tier 5", percent: "1.0%", payout: "₹20", desc: "Rewarded for organizational leadership and regional expansion." },
    { level: 6, type: "Indirect Tier 6", percent: "1.0%", payout: "₹20", desc: "Wide distribution tier leveraging large customer volumes." },
    { level: 7, type: "Indirect Tier 7", percent: "0.5%", payout: "₹10", desc: "Deep multi-tier residual rewards on national downlines." },
    { level: 8, type: "Indirect Tier 8", percent: "0.5%", payout: "₹10", desc: "The ultimate 8th tier completing the ₹290 total payout pool." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-ayur-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>Modernized Ethical Direct Selling Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              The DirectGrow 8-Level Compensation Plan
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Engineered with uncompromising integrity, DirectGrow offers India's most transparent and compliant direct selling model. We distribute a fixed ₹290 commission pool across 8 upline tiers on every ₹2,000 qualifying purchase.
            </p>
            <div className="pt-2">
              <Link
                to="/join"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <span>Register as Distributor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* The Exact 8-Level Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                8-Tier Commission Breakdown (₹2,000 Qualifying Order)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact payouts credited directly into distributors' internal wallets upon first order confirmation
              </p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
              Total ₹290 (14.5%) Distributed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-3">Relationship Type</th>
                  <th className="py-3 px-3 text-center">Commission %</th>
                  <th className="py-3 px-3 text-center">Rupee Payout (₹)</th>
                  <th className="py-3 px-4">Description & Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {levels.map((lvl) => (
                  <tr key={lvl.level} className={`hover:bg-slate-50 ${lvl.level === 1 ? 'bg-emerald-50/40 font-semibold' : ''}`}>
                    <td className="py-3.5 px-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        lvl.level === 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        L{lvl.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-900 font-bold">{lvl.type}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">{lvl.percent}</td>
                    <td className="py-3.5 px-3 text-center font-black text-emerald-700 text-sm">{lvl.payout}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">{lvl.desc}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-xs">
                  <td colSpan="2" className="py-4 px-4 text-emerald-400">Total Across 8 Levels</td>
                  <td className="py-4 px-3 text-center font-mono">14.5%</td>
                  <td className="py-4 px-3 text-center text-emerald-400 font-mono text-sm">₹290</td>
                  <td className="py-4 px-4 text-slate-300 text-[11px]">Fully distributed upstream in real time</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 4 Core Pillars of DirectGrow Opportunity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Product-Driven Model</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No mandatory enrollment kits or artificial joining fees. Earnings derive solely from genuine retail consumption of AYUSH certified herbal products.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct Wallet Credit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No waiting for complicated monthly balancing or rank breakage. Payouts reflect in internal customer wallets immediately upon order placement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Seamless Public Portal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No disconnected backoffices. Browse, buy, invite, track orders, and monitor your 8-level tree right on the public website.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Full Clawback Integrity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete audit ledger compliance: if an order is refunded, associated commissions reverse gracefully across all 8 tiers with full audit trail.
            </p>
          </div>
        </div>

        {/* Interactive Calculator Section */}
        <CommissionCalculator />

      </div>
    </div>
  );
};

