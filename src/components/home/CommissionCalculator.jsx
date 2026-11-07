import React from 'react';
import { Table, User } from 'lucide-react';

const MATRIX_LEVELS = [
  {
    level: 1,
    badgeText: "L1 Level 1",
    badgeStyle: "bg-[#e6f4ea] text-[#137333] border-[#ceead6]",
    type: "Direct Referral",
    rate: "5%",
    reward: "₹100",
    simulatedTeam: "8",
    potentialEarned: "₹800"
  },
  {
    level: 2,
    badgeText: "L2 Level 2",
    badgeStyle: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]",
    type: "Level 2 Indirect",
    rate: "3%",
    reward: "₹60",
    simulatedTeam: "24",
    potentialEarned: "₹1,440"
  },
  {
    level: 3,
    badgeText: "L3 Level 3",
    badgeStyle: "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]",
    type: "Level 3 Indirect",
    rate: "2%",
    reward: "₹40",
    simulatedTeam: "72",
    potentialEarned: "₹2,880"
  },
  {
    level: 4,
    badgeText: "L4 Level 4",
    badgeStyle: "bg-[#ede9fe] text-[#7c3aed] border-[#ddd6fe]",
    type: "Level 4 Indirect",
    rate: "1.5%",
    reward: "₹30",
    simulatedTeam: "216",
    potentialEarned: "₹6,480"
  },
  {
    level: 5,
    badgeText: "L5 Level 5",
    badgeStyle: "bg-[#f3e8ff] text-[#9333ea] border-[#e9d5ff]",
    type: "Level 5 Indirect",
    rate: "1%",
    reward: "₹20",
    simulatedTeam: "648",
    potentialEarned: "₹12,960"
  },
  {
    level: 6,
    badgeText: "L6 Level 6",
    badgeStyle: "bg-[#fae8ff] text-[#c026d3] border-[#f5d0fe]",
    type: "Level 6 Indirect",
    rate: "1%",
    reward: "₹20",
    simulatedTeam: "1,944",
    potentialEarned: "₹38,880"
  },
  {
    level: 7,
    badgeText: "L7 Level 7",
    badgeStyle: "bg-[#fce7f3] text-[#db2777] border-[#fbcfe8]",
    type: "Level 7 Indirect",
    rate: "0.5%",
    reward: "₹10",
    simulatedTeam: "5,832",
    potentialEarned: "₹58,320"
  },
  {
    level: 8,
    badgeText: "L8 Level 8",
    badgeStyle: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]",
    type: "Level 8 Indirect",
    rate: "0.5%",
    reward: "₹10",
    simulatedTeam: "17,496",
    potentialEarned: "₹1,74,960"
  }
];

const CHAIN_LEVELS = [
  { level: 1, amount: 100 },
  { level: 2, amount: 60 },
  { level: 3, amount: 40 },
  { level: 4, amount: 30 },
  { level: 5, amount: 20 },
  { level: 6, amount: 20 },
  { level: 7, amount: 10 },
  { level: 8, amount: 10 },
];

export const CommissionCalculator = () => {
  return (
    <section id="calculator" className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact Match to Mockup) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf7ee] text-[#15803d] border border-[#d3eed9] text-xs font-bold mb-3 shadow-2xs">
            <Table className="w-3.5 h-3.5 text-[#15803d]" />
            <span>Interactive 8-Level Income Simulator</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0f2e24] tracking-tight leading-tight">
            Calculate Your <span className="text-[#15803d]">8–Level Earning Potential</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed font-normal">
            See how referring just a few health-conscious friends compounds through the 8-tier DirectGrow matrix.
            <br className="hidden sm:block" />
            Every qualifying starter order of ₹2,000 distributes ₹290 across 8 levels.
          </p>
        </div>

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Your 8-Level Referral Chain Card (Span 4 on LG) */}
          <div className="lg:col-span-4 bg-[#fbfdfc] border border-emerald-100 rounded-3xl p-6 sm:p-7 relative overflow-hidden flex flex-col items-center justify-between shadow-xs">
            
            {/* Top-Left Decorative Leaves */}
            <img
              src="/images/home/banner-leaves-left.png"
              alt=""
              className="absolute -top-1 -left-1 w-20 opacity-80 pointer-events-none select-none"
            />

            {/* Bottom Subtle Wave Graphic */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full text-emerald-200/40 pointer-events-none"
              viewBox="0 0 320 60"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <path d="M0,35 C90,65 180,10 320,40 L320,60 L0,60 Z" />
            </svg>

            <div className="w-full flex flex-col items-center relative z-10">
              
              {/* Card Title Pill */}
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#edf7ee] text-[#15803d] border border-[#cbe8d2] text-xs font-bold shadow-2xs mb-5">
                Your 8-Level Referral Chain
              </div>

              {/* Apex Root Capsule ("You") */}
              <div className="inline-flex items-center gap-1.5 bg-[#0c6b37] text-white px-3.5 py-1.5 rounded-full shadow-xs mb-3">
                <div className="w-5 h-5 rounded-full bg-[#15803d] flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-xs pr-1">You</span>
              </div>

              {/* Vertical Chain with Connected Circular Nodes */}
              <div className="relative w-full max-w-[270px] mx-auto py-1">
                
                {/* Continuous Center Green Line */}
                <div className="absolute top-1 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-[#22c55e] z-0" />

                {/* 8 Connected Levels */}
                <div className="space-y-2.5 relative z-10">
                  {CHAIN_LEVELS.map((item) => (
                    <div key={`chain-level-${item.level}`} className="flex items-center justify-between gap-1">
                      
                      {/* Left: Level Pill */}
                      <div className="w-20 text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#edf7ee] text-[#15803d] border border-[#d3eed9] shadow-2xs">
                          Level {item.level}
                        </span>
                      </div>

                      {/* Center: White Circle Node with Green User Icon */}
                      <div className="w-7 h-7 rounded-full border-2 border-[#22c55e] bg-white flex items-center justify-center text-[#16a34a] shadow-2xs shrink-0 mx-auto">
                        <User className="w-3.5 h-3.5 text-[#16a34a]" />
                      </div>

                      {/* Right: Commission Amount Pill */}
                      <div className="w-20 text-left">
                        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#edf7ee] text-[#15803d] border border-[#d3eed9] shadow-2xs min-w-[54px] text-center">
                          ₹{item.amount}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

          {/* Right Column: Official 8-Level Payout Distribution Matrix Table (Span 8 on LG) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
            
            <div>
              {/* Header Bar: Title on Left + Badge on Right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Official 8-Level Payout Distribution Matrix
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Level 1 direct referral (5%) & Levels 2-8 indirect referrals (9.5%)
                  </p>
                </div>

                <span className="self-start sm:self-auto bg-[#edf7ee] text-[#15803d] border border-[#cbe8d2] font-bold px-3.5 py-1 rounded-full text-xs shrink-0 shadow-2xs">
                  ₹290 / ₹2,000 Order
                </span>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                      <th className="pb-3 px-2 font-bold">LEVEL</th>
                      <th className="pb-3 px-3 font-bold">TYPE</th>
                      <th className="pb-3 px-2 text-center font-bold">COMMISSION %</th>
                      <th className="pb-3 px-2 text-center font-bold">REWARD / ORDER</th>
                      <th className="pb-3 px-3 text-right font-bold">SIMULATED TEAM</th>
                      <th className="pb-3 px-2 text-right font-bold">POTENTIAL EARNED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {MATRIX_LEVELS.map((row) => (
                      <tr key={`matrix-row-${row.level}`} className="hover:bg-slate-50/60 transition-colors">
                        
                        {/* Level Badge */}
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${row.badgeStyle}`}>
                            {row.badgeText}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="py-2.5 px-3 text-slate-700 font-semibold text-xs whitespace-nowrap">
                          {row.type}
                        </td>

                        {/* Commission % */}
                        <td className="py-2.5 px-2 text-center font-bold text-slate-900 text-xs">
                          {row.rate}
                        </td>

                        {/* Reward / Order */}
                        <td className="py-2.5 px-2 text-center font-bold text-[#15803d] text-xs">
                          {row.reward}
                        </td>

                        {/* Simulated Team */}
                        <td className="py-2.5 px-3 text-right font-medium text-slate-700 text-xs">
                          {row.simulatedTeam}
                        </td>

                        {/* Potential Earned */}
                        <td className="py-2.5 px-2 text-right font-black text-slate-900 text-xs sm:text-sm">
                          {row.potentialEarned}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Dark Forest Green Footer Summary Row (Exact Match to Mockup) */}
            <div className="bg-[#062c26] text-white px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold mt-5 shadow-xs">
              <span className="font-extrabold text-white text-xs sm:text-sm">
                Total Across 8 Levels:
              </span>
              <div className="flex items-center gap-6 sm:gap-10 md:gap-14 text-right">
                <span className="text-slate-200 font-bold text-xs sm:text-sm">14.5%</span>
                <span className="text-[#25e294] font-black text-xs sm:text-sm">₹290</span>
                <span className="text-white font-bold text-xs sm:text-sm">26,240</span>
                <span className="text-[#25e294] font-black text-sm sm:text-base">₹2,96,720</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
