import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Building, 
  QrCode, 
  AlertCircle 
} from 'lucide-react';

export const AdminWithdrawals = () => {
  const { withdrawals, updateWithdrawalStatus } = useMLM();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = withdrawals.filter(w => {
    if (filter !== 'ALL' && w.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return w.userName.toLowerCase().includes(q) || w.id.toLowerCase().includes(q) || w.userCode.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApprove = (id) => {
    const utr = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    updateWithdrawalStatus(id, 'PROCESSED', utr);
  };

  const handleReject = (id) => {
    if (window.confirm("Reject this withdrawal request? The requested amount will be immediately refunded back to the member's wallet balance.")) {
      updateWithdrawalStatus(id, 'REJECTED');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>Bank & UPI Settlement Payouts</span>
          </div>
          <h2 className="text-2xl font-black">Distributor Withdrawal Requests</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review earnings payout requests, authorize bank transfers, or reject with automatic wallet balance refund.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {['ALL', 'PENDING', 'PROCESSED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
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
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-3">Distributor</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3">Method & Details</th>
                <th className="py-3 px-3">Requested At</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                    No withdrawal requests matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 text-slate-700 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.id}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{item.userName}</p>
                      <p className="text-[10px] font-mono text-slate-400">{item.userCode}</p>
                    </td>

                    <td className="py-3.5 px-3 text-right font-black text-emerald-600 text-sm">
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                      {item.details}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDateTime(item.requestedAt)}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {item.status === 'PROCESSED' && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Processed
                        </span>
                      )}
                      {item.status === 'PENDING' && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Pending Approval
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Rejected & Refunded
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                      {item.transactionRef || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
