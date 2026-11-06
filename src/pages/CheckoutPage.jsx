import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useMLM } from '../context/MLMContext';
import { formatCurrency, generateOrderId } from '../utils/helpers';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  QrCode, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { items, subtotal, shipping, total, isQualifyingOrder, clearCart } = useCart();
  const { processOrderPayment, getUserByCode } = useMLM();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    name: currentUser?.name || 'Rohan Deshmukh',
    phone: currentUser?.phone || '+91 98209 99008',
    address: currentUser?.address?.line || 'Plot 42, Shivaji Nagar',
    city: currentUser?.address?.city || 'Pune',
    state: currentUser?.address?.state || 'Maharashtra',
    pincode: currentUser?.address?.pincode || '411005'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const sponsorUser = currentUser?.sponsorCode ? getUserByCode(currentUser.sponsorCode) : null;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!currentUser) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const orderId = generateOrderId();
      const newOrder = {
        id: orderId,
        userId: currentUser.id,
        userName: currentUser.name,
        items: items,
        subtotal: subtotal,
        discount: 0,
        shipping: shipping,
        total: total,
        paymentMethod: paymentMethod,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        shippingAddress: shippingDetails,
        status: "DELIVERED"
      };

      // Process payment and trigger 8-level referral commissions
      const finalized = processOrderPayment(newOrder, currentUser);
      clearCart();
      setProcessing(false);

      // Navigate to success page
      navigate(`/order-success?orderId=${finalized.id}`);
    }, 1000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb matching theme */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 font-medium">
          <Link to="/" className="hover:text-[#137333] transition-colors">Home</Link>
          <span className="text-slate-400">&gt;</span>
          <Link to="/cart" className="hover:text-[#137333] transition-colors">Cart</Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-800 font-bold">Checkout</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2e24] tracking-tight mb-8">
          Secure Order <span className="text-[#137333]">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping & Payment Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#137333]" />
                <span>1. Shipping & Contact Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={shippingDetails.name}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#137333]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={shippingDetails.phone}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#137333]/20"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#137333]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#137333]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={shippingDetails.pincode}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#137333]/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#137333]" />
                <span>2. Select Payment Option</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border text-left text-xs transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#137333] bg-[#eef8f2] text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#137333] mb-2" />
                  <p className="font-bold">Instant UPI (GPay/PhonePe)</p>
                  <p className="text-[10px] text-slate-500">Zero transaction fee</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border text-left text-xs transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#137333] bg-[#eef8f2] text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#137333] mb-2" />
                  <p className="font-bold">Debit / Credit Card</p>
                  <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-4 rounded-2xl border text-left text-xs transition-all ${
                    paymentMethod === 'WALLET'
                      ? 'border-[#137333] bg-[#eef8f2] text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="font-bold">Wallet Balance</p>
                  <p className="text-[10px] text-slate-500">
                    Avail: {formatCurrency(currentUser?.wallet?.balance || 0)}
                  </p>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#137333] shrink-0" />
                <span>Simulated secure payment gateway. No real money is charged.</span>
              </div>
            </div>

          </div>

          {/* Right: Order Summary & MLM Commission Trigger Alert */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Items Mini List */}
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-bold text-slate-700">{item.quantity}x</span>
                      <span className="text-slate-800 truncate">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span className="font-bold text-[#137333]">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
              </div>

              {/* Highlighted Total Box */}
              <div className="bg-[#eaf7ee] rounded-2xl p-4 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  Total Payable
                </span>
                <span className="font-extrabold text-[#137333] text-xl sm:text-2xl">
                  {formatCurrency(total)}
                </span>
              </div>

              {/* 8-Level Upline Commission Preview */}
              {isQualifyingOrder && (
                <div className="p-4 bg-[#eef8f2] rounded-2xl border border-[#a8dab5] text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <Sparkles className="w-4 h-4 text-[#137333]" />
                    <span>8-Level Commission Distribution</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    This order meets the ₹2,000 threshold. On payment, <strong className="text-slate-900">₹290</strong> will be credited across your upline hierarchy:
                  </p>
                  <div className="text-[10px] text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-200 font-mono space-y-0.5">
                    <div>L1: ₹100 (5%) → {sponsorUser?.name || 'Direct Sponsor'}</div>
                    <div>L2: ₹60 (3%) | L3: ₹40 (2%) | L4: ₹30 (1.5%)</div>
                    <div>L5: ₹20 (1%) | L6: ₹20 (1%) | L7: ₹10 | L8: ₹10</div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-[#137333] hover:bg-[#0f5c29] text-white font-bold text-sm py-3.5 px-4 rounded-full shadow-xs transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <span>Processing Payment & Commissions...</span>
                ) : (
                  <>
                    <span>Pay {formatCurrency(total)} & Complete Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

