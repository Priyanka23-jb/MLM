import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import { Table, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIER_BADGES = {
  1: "bg-[#e6f4ea] text-[#137333] border-[#ceead6]",
  2: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]",
  3: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]",
  4: "bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]",
  5: "bg-[#ede9fe] text-[#7c3aed] border-[#ddd6fe]",
  6: "bg-[#f3e8ff] text-[#9333ea] border-[#e9d5ff]",
  7: "bg-[#fae8ff] text-[#c026d3] border-[#f5d0fe]",
  8: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]",
};

export const CommissionCalculator = () => {
  const [directReferrals, setDirectReferrals] = useState(5);
  const [duplicationFactor, setDuplicationFactor] = useState(3);

  const levels = [
    { level: 1, rate: 5.0, amount: 100, label: "Direct Referral" },
    { level: 2, rate: 3.0, amount: 60, label: "Level 2 Indirect" },
    { level: 3, rate: 2.0, amount: 40, label: "Level 3 Indirect" },
    { level: 4, rate: 1.5, amount: 30, label: "Level 4 Indirect" },
    { level: 5, rate: 1.0, amount: 20, label: "Level 5 Indirect" },
    { level: 6, rate: 1.0, amount: 20, label: "Level 6 Indirect" },
    { level: 7, rate: 0.5, amount: 10, label: "Level 7 Indirect" },
    { level: 8, rate: 0.5, amount: 10, label: "Level 8 Indirect" },
  ];

  // Calculate team size and earnings per level
  let currentMembers = directReferrals;
  const calculatedLevels = levels.map((lvl, index) => {
    let count = 0;
    if (index === 0) {
      count = directReferrals;
    } else {
      count = Math.min(250000, Math.round(currentMembers * duplicationFactor));
      currentMembers = count;
    }
    const totalEarned = count * lvl.amount;
    return {
      ...lvl,
      members: count,
      totalEarned
    };
  });

  const totalProjectedEarnings = calculatedLevels.reduce((sum, l) => sum + l.totalEarned, 0);
  const totalTeamSize = calculatedLevels.reduce((sum, l) => sum + l.members, 0);

  return (
    <section id="calculator" className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaf7ee] text-[#137333] border border-[#a8dab5] text-xs font-bold mb-3 shadow-2xs">
            <Table className="w-3.5 h-3.5 text-[#137333]" />
            <span>Interactive 8-Level Income Simulator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2e24] tracking-tight">
            Calculate Your <span className="text-[#137333]">8-Level Earning Potential</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
            See how referring just a few health-conscious friends compounds through the 8-tier DirectGrow matrix. Every qualifying starter order of ₹2,000 distributes ₹290 across 8 levels.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Sliders & Total Card (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card 1: Network Growth Assumptions */}
            <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Network Growth Assumptions</span>
              </h3>

              {/* Slider 1: Direct Referrals */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-[11px]">Level 1 Direct Referrals</span>
                  <span className="text-[#137333] font-extrabold text-xs bg-[#eaf7ee] px-2 py-0.5 rounded-md border border-[#a8dab5]">
                    {directReferrals} Members
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={directReferrals}
                  onChange={(e) => setDirectReferrals(Number(e.target.value))}
                  className="w-full accent-[#137333] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>2 people</span>
                  <span>15 people</span>
                </div>
              </div>

              {/* Slider 2: Duplication */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="text-[11px]">Average Team Duplication</span>
                  <span className="text-[#137333] font-extrabold text-xs bg-[#e6f4ea] px-2 py-0.5 rounded-md border border-[#c3e6cb]">
                    {duplicationFactor}x per person
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="4"
                  step="1"
                  value={duplicationFactor}
                  onChange={(e) => setDuplicationFactor(Number(e.target.value))}
                  className="w-full accent-[#137333] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>Each recruits 2</span>
                  <span>Each recruits 4</span>
                </div>
              </div>

              {/* Standard Rule Box */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
                <p className="font-bold text-slate-800">Standard Rule Applied:</p>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  Calculated based on each member completing one qualifying first purchase of <strong className="text-slate-800">₹2,000</strong>.
                </p>
              </div>
            </div>

            {/* Card 2: Total Projected Commission (Dark Forest Green) */}
            <div className="bg-[#0c3934] text-white p-5 rounded-3xl shadow-lg border border-emerald-950/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                TOTAL PROJECTED COMMISSION
              </span>
              <p className="text-3xl font-black text-[#25e294]">
                {formatCurrency(totalProjectedEarnings)}
              </p>

              <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200/90 font-medium">
                <span>Total Downline Network:</span>
                <span className="font-bold text-white text-xs">{totalTeamSize.toLocaleString()} Members</span>
              </div>

              <div className="pt-1">
                <Link
                  to="/join"
                  className="w-full flex items-center justify-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-[1.02]"
                >
                  <span>Start Building Today</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Payout Distribution Matrix Table (col-span-8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Table Top Header Bar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Official 8-Level Payout Distribution Matrix
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Level 1 direct referral (5%) & Levels 2-8 indirect referrals (9.5%)
                </p>
              </div>

              <span className="self-start sm:self-auto bg-[#eaf7ee] text-[#137333] border border-[#a8dab5] font-bold px-3 py-1 rounded-full text-xs shrink-0">
                ₹290 / ₹2,000 Order
              </span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100">
                    <th className="py-2.5 px-4">LEVEL</th>
                    <th className="py-2.5 px-3">TYPE</th>
                    <th className="py-2.5 px-3 text-center">COMMISSION %</th>
                    <th className="py-2.5 px-3 text-center">REWARD / ORDER</th>
                    <th className="py-2.5 px-3 text-right">SIMULATED TEAM</th>
                    <th className="py-2.5 px-4 text-right">POTENTIAL EARNED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {calculatedLevels.map((lvl) => {
                    const badgeStyle = TIER_BADGES[lvl.level] || TIER_BADGES[1];

                    return (
                      <tr key={lvl.level} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                            L{lvl.level} Level {lvl.level}
                          </span>
                        </td>

                        <td className="py-2 px-3 text-slate-600 font-medium text-[11px]">
                          {lvl.label}
                        </td>

                        <td className="py-2 px-3 text-center font-bold text-slate-700">
                          {lvl.rate}%
                        </td>

                        <td className="py-2 px-3 text-center font-bold text-[#137333]">
                          ₹{lvl.amount}
                        </td>

                        <td className="py-2 px-3 text-right font-medium text-slate-600">
                          {lvl.members.toLocaleString()}
                        </td>

                        <td className="py-2 px-4 text-right font-extrabold text-slate-900">
                          {formatCurrency(lvl.totalEarned)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Dark Footer Summary Row */}
            <div className="bg-[#062c26] text-white px-4 py-3 flex items-center justify-between text-xs sm:text-xs font-bold">
              <span className="font-extrabold text-white">Total Across 8 Levels:</span>
              <div className="flex items-center gap-6 sm:gap-10">
                <span className="text-slate-300">14.5%</span>
                <span className="text-[#25e294]">₹290</span>
                <span className="text-white">{totalTeamSize.toLocaleString()}</span>
                <span className="text-[#25e294] font-black">{formatCurrency(totalProjectedEarnings)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
