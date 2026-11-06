import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  Package, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText, 
  X,
  Truck,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrdersSection = () => {
  const { currentUser } = useAuth();
  const { orders, refundOrder } = useMLM();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundConfirmOrder, setRefundConfirmOrder] = useState(null);

  if (!currentUser) return null;

  // Filter orders for current user
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  const handleConfirmRefund = () => {
    if (refundConfirmOrder) {
      refundOrder(refundConfirmOrder.id);
      setRefundConfirmOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            My Orders & Purchase Invoices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View orders, check qualifying status, track shipments, and review invoices
          </p>
        </div>

        <Link
          to="/products"
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          Browse Products
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Place your first order of ₹2,000+ (such as the Starter Pack) to qualify as an active distributor and unlock 8-level earning rights!
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-block"
            >
              Order Starter Pack
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const isRefunded = order.status === 'REFUNDED';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-xs ${
                  isRefunded ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200 hover:border-brand-300'
                }`}
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 text-sm">
                        #{order.id}
                      </span>
                      {order.isQualifying && !isRefunded && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Qualifying Purchase (₹290 Distributed)
                        </span>
                      )}
                      {isRefunded && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <RotateCcw className="w-3 h-3" />
                          Refunded & Rewards Reversed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Placed on {formatDateTime(order.createdAt)} • Payment: {order.paymentMethod || 'UPI / Online'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>

                    {!isRefunded && (
                      <button
                        onClick={() => setRefundConfirmOrder(order)}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
                        title="Test refund & commission clawback"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Refund</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="py-4 divide-y divide-slate-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Delivered to: {order.shippingAddress?.city || 'Pune'}, {order.shippingAddress?.pincode || '411005'}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 mr-2">Total Amount:</span>
                    <span className="font-black text-slate-900 text-base">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 mb-4">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Official Tax Invoice
              </span>
              <h3 className="text-xl font-black text-slate-900">DirectGrow Ayurvedic Platform</h3>
              <p className="text-xs text-slate-500">Order Ref: #{selectedOrder.id} • {formatDateTime(selectedOrder.createdAt)}</p>
            </div>

            <div className="text-xs space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-700">Billed To:</p>
                  <p className="text-slate-900 font-semibold">{selectedOrder.userName || currentUser.name}</p>
                  <p className="text-slate-500 text-[11px]">{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-slate-500 text-[11px]">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700">Payment Status:</p>
                  <p className="text-emerald-600 font-bold">PAID ({selectedOrder.paymentMethod || 'Online'})</p>
                  <p className="font-bold text-slate-700 mt-2">MLM Status:</p>
                  <p className="text-brand-600 font-semibold">
                    {selectedOrder.isQualifying ? "Qualified 8-Level First Order" : "Standard Order"}
                  </p>
                </div>
              </div>

              {/* Items table */}
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[11px]">
                    {selectedOrder.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                        <td className="p-2 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-right space-y-1 pt-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping:</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE' : formatCurrency(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-700">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Refund / Clawback Modal */}
      {refundConfirmOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Confirm Order Refund</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to refund Order <strong className="text-slate-900">#{refundConfirmOrder.id}</strong> ({formatCurrency(refundConfirmOrder.total)})?
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 mb-5">
              <strong>MLM Compliance Rule:</strong> Refunding this qualifying order will automatically <em>reverse and claw back the ₹290 referral rewards</em> that were previously credited to the 8 upline sponsors' wallets.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRefundConfirmOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Yes, Refund & Reverse Rewards
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

