import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMLM } from '../context/MLMContext';
import { MEMBERSHIP_PACKAGE_DETAILS } from '../data/products';
import { formatCurrency } from '../utils/helpers';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  Lock, 
  Zap, 
  AlertCircle,
  Copy,
  Check,
  Star,
  Layers,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MembershipActivationPage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { activateMembership } = useMLM();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [activationOrder, setActivationOrder] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPreviewCheckout, setShowPreviewCheckout] = useState(false);

  // Address state (editable if needed)
  const [address, setAddress] = useState(currentUser?.address?.line || '12/A, Ayurvedic Health Enclave');
  const [city, setCity] = useState(currentUser?.address?.city || 'New Delhi');
  const [pincode, setPincode] = useState(currentUser?.address?.pincode || '110001');

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign In to Activate Membership</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please log in or register to complete your mandatory ₹2,000 product package payment and activate your 8-level membership.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login?redirect=/activate"
              className="bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-all text-center"
            >
              Log In to Continue
            </Link>
            <Link
              to="/join"
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 transition-all text-center"
            >
              New Member Registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If already active and verified
  const isAlreadyActive = currentUser.isActivated || (currentUser.membershipStatus === 'ACTIVE' && currentUser.isQualified);

  const handleActivate = (e) => {
    e?.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const res = activateMembership(currentUser.id, {
          method: paymentMethod,
          address: { line: address, city, pincode }
        });

        if (res && res.success) {
          setActivationSuccess(true);
          setActivationOrder(res.order);
          if (setCurrentUser) {
            setCurrentUser(res.user);
            try {
              localStorage.setItem('directgrow_current_user_v5', JSON.stringify(res.user));
            } catch (e) {}
          }

          try {
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.6 }
            });
          } catch (e) {}
        } else {
          console.error("Activation response:", res?.message);
        }
      } catch (err) {
        console.error("Activation error:", err);
      } finally {
        setIsProcessing(false);
      }
    }, 700);
  };

  const copyReferral = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4faf6] via-white to-[#edf7f2] py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Decorative Corner Foliage */}
      <img
        src="/images/join/leaves-top.png"
        alt=""
        className="absolute left-0 top-0 w-32 pointer-events-none opacity-80 select-none z-0"
      />
      <img
        src="/images/join/leaves-bottom.png"
        alt=""
        className="absolute right-0 bottom-0 w-36 pointer-events-none opacity-80 select-none z-0"
      />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#edf7f0] text-[#137333] border border-[#d3eed9] text-xs font-bold shadow-2xs">
            <Star className="w-3.5 h-3.5 text-[#137333]" />
            <span>Mandatory Distributor Activation Package</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0f2e24] tracking-tight">
            Activate Your 8-Level Distributor Membership
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every distributor completes a mandatory <strong>₹2,000 package payment</strong> to unlock lifetime 8-level earning rights and receive 6 classical Ayurvedic formulations.
          </p>

          {/* Membership Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-xs transition-all">
            {isAlreadyActive || activationSuccess ? (
              <span className="bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1.5 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Membership Status: ACTIVE & AYUSH QUALIFIED</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 border-amber-300 flex items-center gap-1.5 px-3 py-1 rounded-full animate-pulse">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Membership Status: PENDING ACTIVATION (Unpaid ₹2,000 Package)</span>
              </span>
            )}
          </div>
        </div>

        {/* ALREADY ACTIVE STATE */}
        {isAlreadyActive && !activationSuccess && !showPreviewCheckout ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Your Membership is Already Active!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account is fully qualified for 8-level commissions. Your personal referral code is ready to share.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xl font-black text-[#0c6b37]">
              {currentUser.referralCode}
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/account"
                className="w-full sm:w-auto bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-xs transition-all"
              >
                Go to Member Hub
              </Link>
              <Link
                to="/account?tab=referral"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-6 rounded-xl transition-all"
              >
                View Referral Tools
              </Link>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPreviewCheckout(true)}
                className="text-xs text-[#0c6b37] hover:underline font-bold inline-flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5" />
                <span>View Included ₹2,000 Product Package & Checkout Details →</span>
              </button>
            </div>
          </div>
        ) : activationSuccess ? (
          /* ACTIVATION CELEBRATION CARD */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0c6b37] flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Payment Verified • Congratulations!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Distributor Membership Activated
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your ₹2,000 package payment was successful. Lifetime 8-level earning rights are now unlocked!
              </p>
            </div>

            {/* Generated Unique Referral Code Card */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 rounded-2xl border border-emerald-300 shadow-xs text-center space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Your Activated Referral Code
              </span>
              <div className="text-3xl font-mono font-black text-[#0c6b37] tracking-widest">
                {currentUser.referralCode}
              </div>
              <button
                type="button"
                onClick={() => copyReferral(currentUser.referralCode)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 transition-all shadow-2xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? "Copied Code!" : "Copy My Referral Code"}</span>
              </button>
            </div>

            {/* Order & Included Products Confirmation */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{activationOrder?.id || 'ORD-ACT-2000'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-700">Package Amount:</span>
                <span className="font-black text-emerald-700">₹2,000 (PAID)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Dispatch Status:</span>
                <span className="font-bold text-[#0c6b37] flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Dispatched (Free Delivery)
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/account"
                className="w-full sm:w-auto bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Open Member Hub & Visual Tree</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/account?tab=referral"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl border border-slate-200 transition-all text-center"
              >
                Invite Downline Members
              </Link>
            </div>
          </div>
        ) : (
          /* MAIN ACTIVATION INTERFACE (Included Products + Checkout) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: INCLUDED PRODUCTS COLLECTION (Clearly Displays what they receive!) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                    Included Ayurvedic Products (Worth ₹3,200)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Predefined authentic collection delivered to you for your ₹2,000 activation payment.
                  </p>
                </div>
                <span className="text-[11px] font-black uppercase text-[#137333] bg-[#edf7f0] border border-[#d3eed9] px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  6 Full-Size Items
                </span>
              </div>

              {/* Grid of 6 Predefined Collection Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {MEMBERSHIP_PACKAGE_DETAILS.includedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-200/80 shrink-0 flex items-center justify-center">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                          {prod.category}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs leading-tight mt-0.5">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-[#0c6b37] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                            {prod.quantity}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            MRP: {formatCurrency(prod.mrp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60 line-clamp-2">
                      {prod.benefit}
                    </p>
                  </div>
                ))}
              </div>

              {/* Package Member Perks */}
              <div className="p-4 rounded-2xl bg-[#f4faf6] border border-[#d3eed9] space-y-2">
                <h4 className="font-extrabold text-[#0f2e24] text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#137333]" />
                  <span>Lifetime Member Privileges Included</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  {MEMBERSHIP_PACKAGE_DETAILS.membershipPerks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#137333]" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Column: PAYMENT & ACTIVATION CHECKOUT */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Payment Summary Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
                
                <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Activation Summary</span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                    Qualifying Order
                  </span>
                </h3>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Products Retail Value (6 Items):</span>
                    <span className="font-bold line-through text-slate-400">
                      {formatCurrency(MEMBERSHIP_PACKAGE_DETAILS.mrp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700 font-semibold">
                    <span>Membership Package Discount:</span>
                    <span>- {formatCurrency(MEMBERSHIP_PACKAGE_DETAILS.savings)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expedited All-India Delivery:</span>
                    <span className="font-bold text-emerald-700 uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">Total Payable Now:</span>
                      <span className="text-[10px] text-slate-400">Includes all taxes & activations</span>
                    </div>
                    <span className="text-2xl font-black text-[#0c6b37]">
                      {formatCurrency(MEMBERSHIP_PACKAGE_DETAILS.price)}
                    </span>
                  </div>
                </div>

                {/* Shipping Address Confirmation */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Delivery Address</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">Free Shipping</span>
                  </div>
                  <p className="text-slate-700 font-medium">{currentUser.name} • {currentUser.phone}</p>
                  <p className="text-[11px] text-slate-500">
                    {address}, {city} - {pincode}
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Select Payment Method:
                  </label>

                  <div className="space-y-2 text-xs">
                    {[
                      { id: 'UPI', label: 'UPI / QR Code (Google Pay, PhonePe, Paytm)', icon: Zap },
                      { id: 'CARD', label: 'Credit / Debit Card (Visa, MasterCard, RuPay)', icon: CreditCard },
                      { id: 'NETBANKING', label: 'Net Banking (All Indian Banks)', icon: Layers },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSel = paymentMethod === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSel 
                              ? 'bg-[#edf7f0] border-[#0c6b37] text-slate-900 font-bold' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payMethod"
                            value={opt.id}
                            checked={isSel}
                            onChange={() => setPaymentMethod(opt.id)}
                            className="text-[#0c6b37] focus:ring-[#0c6b37]"
                          />
                          <Icon className={`w-4 h-4 ${isSel ? 'text-[#0c6b37]' : 'text-slate-400'}`} />
                          <span className="text-xs">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isProcessing}
                  className="w-full bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying ₹2,000 Payment...</span>
                  ) : (
                    <>
                      <span>Pay ₹2,000 & Activate Membership</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted • Instant 8-Level Commission Distribution</span>
                </p>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

