import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { DEFAULT_COMMISSION_RULES } from '../../data/initialData';
import { formatCurrency } from '../../utils/helpers';
import { 
  Sliders, 
  RotateCcw, 
  Check, 
  Sparkles, 
  AlertTriangle,
  Info,
  Layers,
  Save
} from 'lucide-react';

export const AdminCommissionRules = () => {
  const { commissionRules, updateCommissionRules, resetCommissionRules } = useMLM();
  const [rules, setRules] = useState(commissionRules);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handlePercentageChange = (levelNum, newPct) => {
    const val = parseFloat(newPct) || 0;
    setRules(prev => ({
      ...prev,
      levels: prev.levels.map(l => {
        if (l.level === levelNum) {
          const calculatedAmount = Math.round((val / 100) * prev.qualifyingOrderAmount);
          return { ...l, percentage: val, fixedAmount: calculatedAmount };
        }
        return l;
      })
    }));
  };

  const handleAmountChange = (levelNum, newAmt) => {
    const val = parseFloat(newAmt) || 0;
    setRules(prev => ({
      ...prev,
      levels: prev.levels.map(l => {
        if (l.level === levelNum) {
          const calculatedPct = Number(((val / prev.qualifyingOrderAmount) * 100).toFixed(1));
          return { ...l, fixedAmount: val, percentage: calculatedPct };
        }
        return l;
      })
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateCommissionRules(rules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    resetCommissionRules();
    setRules(DEFAULT_COMMISSION_RULES);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const totalDistributedAmount = rules.levels.reduce((acc, curr) => acc + curr.fixedAmount, 0);
  const totalPercentage = rules.levels.reduce((acc, curr) => acc + curr.percentage, 0).toFixed(1);

  return (
    <div className="space-y-8">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
              <Sliders className="w-3.5 h-3.5 text-brand-600" />
              <span>Core MLM Commission Rule Engine</span>
            </div>
            <h2 className="text-2xl font-black">8-Level Commission Configuration</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Configure qualifying purchase thresholds, tier payout percentages, and fixed rupee rewards distributed upstream when a new distributor makes their first qualifying order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
              title="Reset to official reference model"
            >
              <RotateCcw className="w-4 h-4 text-brand-600" />
              <span>Reset to Standard ₹290 Spec</span>
            </button>
          </div>
        </div>

        {/* Current Total Pool Highlight */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Qualifying Order Threshold</span>
            <span className="text-xl font-black text-slate-900">{formatCurrency(rules.qualifyingOrderAmount)}</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total 8-Level Payout Pool</span>
            <span className="text-xl font-black text-emerald-700">{formatCurrency(totalDistributedAmount)}</span>
          </div>

          <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200">
            <span className="text-[10px] text-brand-800 uppercase font-bold block">Cumulative Commission %</span>
            <span className="text-xl font-black text-brand-700">{totalPercentage}% of order</span>
          </div>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-2 animate-in fade-in">
          <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Rules have been restored to the exact official Reference Standard: ₹290 total distributed across 8 levels (₹100, ₹60, ₹40, ₹30, ₹20, ₹20, ₹10, ₹10).</span>
        </div>
      )}

      {/* Configuration Form (Light Theme) */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Qualifying Purchase Amount Input */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Qualifying Purchase Threshold</h3>
            <p className="text-xs text-slate-500">
              Minimum first order total required to activate distributor status and trigger 8-level commissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-bold">₹</span>
            <input
              type="number"
              min="500"
              step="100"
              value={rules.qualifyingOrderAmount}
              onChange={(e) => setRules({ ...rules, qualifyingOrderAmount: Number(e.target.value) })}
              className="bg-white border border-slate-300 text-slate-900 font-mono font-bold text-sm rounded-xl px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* 8-Level Table Editor */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            8-Level Payout Distribution Matrix (Configurable)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3 text-center">Percentage (%)</th>
                  <th className="py-3 px-3 text-center">Fixed Amount (₹)</th>
                  <th className="py-3 px-4">Rule Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rules.levels.map((lvl) => (
                  <tr key={lvl.level} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                        lvl.level === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        L{lvl.level}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-900 font-semibold">
                      {lvl.label}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="50"
                        value={lvl.percentage}
                        onChange={(e) => handlePercentageChange(lvl.level, e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-emerald-700 font-bold text-center text-xs rounded-lg px-2 py-1 w-20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <span className="text-slate-400 ml-1">%</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="text-slate-400 mr-1">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={lvl.fixedAmount}
                        onChange={(e) => handleAmountChange(lvl.level, e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-center text-xs rounded-lg px-2 py-1 w-24 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {lvl.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {savedSuccess && (
            <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Commission rules updated successfully!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Commission Rules</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
