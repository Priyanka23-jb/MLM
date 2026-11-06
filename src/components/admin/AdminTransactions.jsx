import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  FileText, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCcw,
  Sparkles,
  Filter
} from 'lucide-react';

export const AdminTransactions = () => {
  const { transactions } = useMLM();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = transactions.filter(t => {
    if (filterType !== 'ALL') {
      if (filterType === 'COMMISSION' && t.type !== 'COMMISSION_CREDIT') return false;
      if (filterType === 'WITHDRAWAL' && t.type !== 'WITHDRAWAL_DEBIT') return false;
      if (filterType === 'REVERSAL' && t.type !== 'COMMISSION_REVERSED') return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.userName.toLowerCase().includes(q) || 
             t.description.toLowerCase().includes(q) ||
             t.id.toLowerCase().includes(q) ||
             (t.orderId && t.orderId.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            <span>Complete Financial Audit Trail</span>
          </div>
          <h2 className="text-2xl font-black">Global Transaction Ledger ({transactions.length})</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident record of all 8-level commissions, withdrawals, and clawback reversals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['ALL', 'COMMISSION', 'WITHDRAWAL', 'REVERSAL'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterType === type ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Tx ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Beneficiary</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-center">Level</th>
                <th className="py-3 px-3 text-center">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => {
                const isCredit = tx.type === 'COMMISSION_CREDIT' || tx.type === 'WITHDRAWAL_REFUNDED';
                const isDebit = tx.type === 'WITHDRAWAL_DEBIT';
                const isReversal = tx.type === 'COMMISSION_REVERSED';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 text-slate-700 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[11px]">
                      {tx.id}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDateTime(tx.date)}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {tx.userName}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      <p className="font-medium text-slate-800">{tx.description}</p>
                      {tx.orderId && <span className="text-[10px] font-mono text-slate-400">Order: #{tx.orderId}</span>}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {tx.level ? (
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                          L{tx.level}
                        </span>
                      ) : "—"}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {isCredit && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Credit
                        </span>
                      )}
                      {isDebit && (
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Withdrawal
                        </span>
                      )}
                      {isReversal && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Clawback
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black">
                      {isCredit && <span className="text-emerald-600">+{formatCurrency(tx.amount)}</span>}
                      {(isDebit || isReversal) && <span className="text-rose-600">-{formatCurrency(tx.amount)}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
