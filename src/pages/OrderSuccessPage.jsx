import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useMLM } from '../context/MLMContext';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import { 
  CheckCircle2, 
  Sparkles, 
  Package, 
  Wallet, 
  Users, 
  ArrowRight, 
  FileText,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useMLM();

  const order = orders.find(o => o.id === orderId) || orders[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, []);

  if (!order) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 animate-pulse" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-1">
              Thank You! Order #{order.id} Placed
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your Ayurvedic formulations will be prepared and dispatched via express courier.
            </p>
          </div>

          {/* 8-Level Commission Distribution Card */}
          {order.commissionDistributed && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-brand-50 p-6 rounded-3xl border border-emerald-200 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    8-Level Referral Commission Payout Executed!
                  </h3>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white/80 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  {formatCurrency(order.distributedTotal || 290)} Distributed
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Because this was a qualifying purchase of <strong className="text-slate-800">{formatCurrency(order.total)}</strong>, commissions were automatically credited upstream to all eligible upline members in the 8-level chain in real time according to their respective commission percentages:
              </p>

              {/* 8 Levels Mini Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {order.distributionReport?.map((rpt) => (
                  <div key={rpt.level} className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs shadow-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-emerald-800">L{rpt.level} {rpt.level === 1 ? '(Direct)' : ''}</span>
                      <span>{rpt.percentage}%</span>
                    </div>
                    <p className="font-bold text-slate-800 text-[11px] truncate mt-0.5">{rpt.userName}</p>
                    <p className="font-black text-emerald-600 text-xs mt-0.5">+₹{rpt.amount}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200 text-[11px] text-slate-600">
                💡 <strong>Verification Tip:</strong> Use the floating <span className="font-bold text-brand-600">Switch Persona</span> button at the bottom-right of your screen to switch into any upline sponsor's account and inspect their updated wallet balance and ledger!
              </div>
            </div>
          )}

          {/* Purchased Items List */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <h4 className="font-bold text-slate-800 text-xs mb-2">Order Items:</h4>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                <span className="text-slate-700 font-medium">{item.quantity}x {item.name}</span>
                <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 flex justify-between font-black text-sm text-slate-900">
              <span>Total Paid:</span>
              <span className="text-emerald-700">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/account?tab=orders"
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>View My Orders</span>
            </Link>

            <Link
              to="/account?tab=wallet"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-3 px-6 rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Go to My Wallet</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto text-xs font-bold text-slate-500 hover:text-slate-800 py-3 px-4"
            >
              Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

