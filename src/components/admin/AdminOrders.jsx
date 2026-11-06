import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  Package, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

export const AdminOrders = () => {
  const { orders, refundOrder } = useMLM();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);

  const filteredOrders = orders.filter(o => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.id.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q);
  });

  const handleExecuteRefund = () => {
    if (refundTarget) {
      refundOrder(refundTarget.id);
      setRefundTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
            <Package className="w-3.5 h-3.5 text-brand-600" />
            <span>Order Fulfillment & Commission Audit</span>
          </div>
          <h2 className="text-2xl font-black">All Platform Customer Orders</h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor product purchases, delivery lifecycle, and execute refunds with real-time 8-level reward reversals.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">MLM Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const isRefunded = order.status === 'REFUNDED';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 text-slate-700 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{order.id}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">{order.userName}</p>
                      <p className="text-[10px] text-slate-400">{order.shippingAddress?.city}</p>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {order.items?.length || 1} product(s)
                    </td>

                    <td className="py-3.5 px-3 text-right font-black text-slate-900">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {order.isQualifying ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          ₹290 Distributed (8-Tiers)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Standard
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {isRefunded ? (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Refunded & Reversed
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Delivered
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="View Invoice & Distribution"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!isRefunded && (
                          <button
                            onClick={() => setRefundTarget(order)}
                            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                            title="Refund & Claw Back Upline Commissions"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Refund</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Confirmation Modal (Light Theme) */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Admin Order Refund</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to refund Order <strong className="text-slate-900">#{refundTarget.id}</strong> ({formatCurrency(refundTarget.total)}) for customer <strong className="text-slate-900">{refundTarget.userName}</strong>?
            </p>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 space-y-1">
              <p className="font-bold">Automated 8-Level Clawback Action:</p>
              <p>
                Refunding this order will immediately deduct the ₹290 commissions previously credited to the 8 upline sponsors' internal wallets, logging an audit transaction with type <code className="bg-white px-1 py-0.5 rounded border border-amber-200 font-mono">COMMISSION_REVERSED</code>.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRefundTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRefund}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all"
              >
                Execute Refund & Reverse Rewards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal (Light Theme) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 text-slate-800 relative shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900">Order #{selectedOrder.id} Overview</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p><strong>Customer:</strong> {selectedOrder.userName}</p>
                <p><strong>Date:</strong> {formatDateTime(selectedOrder.createdAt)}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                <p><strong>Total Paid:</strong> {formatCurrency(selectedOrder.total)}</p>
              </div>

              {selectedOrder.distributionReport && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-emerald-800 text-xs">8-Tier Commission Beneficiaries:</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {selectedOrder.distributionReport.map(r => (
                      <div key={r.level} className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-[11px]">
                        <span>Level {r.level}: <strong>{r.userName}</strong> ({r.userCode})</span>
                        <span className="font-bold text-emerald-600">+₹{r.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
