import React, { useEffect } from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency } from '../../utils/helpers';
import { Award, CheckCircle, ArrowRight, RotateCcw, X, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommissionCelebrationModal = () => {
  const { lastCommissionEvent, setLastCommissionEvent } = useMLM();

  useEffect(() => {
    if (lastCommissionEvent?.type === 'DISTRIBUTION') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [lastCommissionEvent]);

  if (!lastCommissionEvent) return null;

  const isDistribution = lastCommissionEvent.type === 'DISTRIBUTION';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setLastCommissionEvent(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isDistribution ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100 shadow-sm">
                <Sparkles className="w-8 h-8 animate-bounce" />
              </div>
              <span className="block text-xs font-bold uppercase tracking-wider text-emerald-600">
                Official 8-Level Commission Triggered!
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹290 Distributed Across 8 Levels
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Qualifying purchase by <span className="font-semibold text-slate-800">{lastCommissionEvent.buyerName}</span> ({lastCommissionEvent.buyerCode})
              </p>
            </div>

            {/* Total Summary Banner */}
            <div className="bg-gradient-to-r from-brand-50 via-emerald-50 to-purple-50 p-4 rounded-2xl border border-emerald-200/60 flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-slate-600 font-medium">Qualifying Order Value</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(lastCommissionEvent.amount)}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-right">
                <p className="text-xs text-slate-600 font-medium">Total Rewards Distributed</p>
                <p className="text-xl font-black text-emerald-600">₹290 (14.5%)</p>
              </div>
            </div>

            {/* 8-Level Breakdown Table */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 max-h-60 overflow-y-auto mb-5 space-y-1.5">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 px-2">
                <span className="col-span-3">Level / Type</span>
                <span className="col-span-5">Upline Beneficiary</span>
                <span className="col-span-2 text-center">Rate</span>
                <span className="col-span-2 text-right">Commission</span>
              </div>

              {lastCommissionEvent.distributionReport?.map((item) => (
                <div
                  key={item.level}
                  className={`grid grid-cols-12 items-center text-xs py-2 px-2.5 rounded-xl border transition-all ${
                    item.level === 1
                      ? "bg-white border-emerald-300 font-semibold shadow-xs"
                      : "bg-white/80 border-slate-200"
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      item.level === 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      L{item.level}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {item.level === 1 ? "Direct" : "Indirect"}
                    </span>
                  </div>

                  <div className="col-span-5 truncate pr-2">
                    <span className="text-slate-800 text-[11px] font-medium block truncate">
                      {item.userName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {item.userCode}
                    </span>
                  </div>

                  <div className="col-span-2 text-center text-[11px] font-medium text-slate-500">
                    {item.percentage}%
                  </div>

                  <div className="col-span-2 text-right font-bold text-emerald-600 text-xs">
                    +₹{item.amount}
                  </div>
                </div>
              ))}
            </div>

            {/* Note & Action */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500 text-[11px]">
                Wallets of all 8 upline members have been automatically credited.
              </span>
              <button
                onClick={() => setLastCommissionEvent(null)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        ) : (
          /* Reversal Modal on Refund */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 mb-3 border border-rose-100 shadow-sm">
                <RotateCcw className="w-8 h-8" />
              </div>
              <span className="block text-xs font-bold uppercase tracking-wider text-rose-600">
                Order Refund Commission Reversal
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                ₹{lastCommissionEvent.totalReversed} Clawed Back Across Upline
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Order #{lastCommissionEvent.orderId} was refunded. All associated referral commissions have been reversed from upline wallets according to MLM compliance rules.
              </p>
            </div>

            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-xs text-rose-800 mb-6 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-rose-600" />
                Audit Trail Recorded in Ledger
              </p>
              <p className="text-[11px] text-rose-700">
                {lastCommissionEvent.reversalCount} upline accounts debited with type <code className="bg-white/80 px-1 py-0.5 rounded font-mono">COMMISSION_REVERSED</code>.
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={() => setLastCommissionEvent(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-xl transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

