import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMLM } from '../context/MLMContext';
import { MEMBERSHIP_PACKAGE_DETAILS } from '../data/products';
import { formatCurrency } from '../utils/helpers';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  UserPlus,
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Building2,
  AlertCircle,
  ShoppingBag,
  Store,
  Star,
  Eye,
  EyeOff,
  Package,
  Truck,
  CreditCard,
  Copy,
  Check,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JoinNowPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlRef = searchParams.get('ref') || '';

  const { setCurrentUser } = useAuth();
  const { 
    users, 
    getUserByCode, 
    registerMember, 
    isReferralCodeUsed,
    canUserRefer,
    getDirectReferral,
    getActiveChainTail,
    getUserChainDepth,
    activateMembership
  } = useMLM();

  // Multi-step state: 1: Details & Sponsor, 2: Verification, 3: Activate Rights
  const [step, setStep] = useState(1);

  // Form Fields
  const [sponsorCode, setSponsorCode] = useState(urlRef);
  const [noSponsor, setNoSponsor] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP State
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);

  // Error & Created Member
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  // Step 3: Mandatory ₹2,000 Package Activation State
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activationOrder, setActivationOrder] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Check sponsor validity in real time
  const verifiedSponsor = sponsorCode && !noSponsor ? getUserByCode(sponsorCode) : null;
  const sponsorDepth = (verifiedSponsor && getUserChainDepth) ? getUserChainDepth(verifiedSponsor.id) : 0;
  const isSponsorLevel8 = verifiedSponsor ? (sponsorDepth >= 8 || verifiedSponsor.referralCode === 'DG20008') : false;
  const isSponsorEligible = isSponsorLevel8 ? false : (verifiedSponsor ? (canUserRefer ? canUserRefer(sponsorCode) : !isReferralCodeUsed(sponsorCode)) : false);
  const alreadyReferredMember = verifiedSponsor && getDirectReferral ? getDirectReferral(sponsorCode) : null;
  const activeChainTail = getActiveChainTail ? getActiveChainTail() : users[users.length - 1];

  useEffect(() => {
    if (urlRef) {
      setSponsorCode(urlRef);
    }
  }, [urlRef]);

  useEffect(() => {
    let interval = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!noSponsor && sponsorCode.trim()) {
      const found = getUserByCode(sponsorCode);
      if (!found) {
        setError(`Sponsor referral code "${sponsorCode}" is invalid. Please check or select "I don't have a sponsor".`);
        return;
      }
      if (isSponsorLevel8) {
        setError(`Sponsor ${found.name} (${sponsorCode}) is at Level 8 (the terminal tier of the 8-level system). In DirectGrow's strict 8-level system, Level 8 members cannot refer anyone.`);
        return;
      }
      if (!isSponsorEligible) {
        setError(`Sponsor ${found.name} (${sponsorCode}) has already referred their allowed 1 direct recruit (${alreadyReferredMember ? alreadyReferredMember.name : 'a downline member'}). In this strict single-line chain, each member can refer only one person. Their referral option is now disabled.`);
        return;
      }
    }

    // Advance to OTP step
    setOtpSent(true);
    setOtpTimer(30);
    setStep(2);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setError('');

    // Flexible OTP check (accepts demo 123456 or any 4-6 digit code, auto-defaults to 123456)
    const validOtp = otp.trim() || '123456';
    if (validOtp !== '123456' && validOtp.length < 4) {
      setError('Please enter the 6-digit verification code (Demo Code: 123456).');
      return;
    }

    // Register user: if no sponsor, they join as an independent new member
    const targetSponsor = (noSponsor || !sponsorCode.trim())
      ? null
      : (sponsorCode.trim().toUpperCase());

    const result = registerMember({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      sponsorCode: targetSponsor,
      city: city.trim() || 'New Delhi',
      pincode: pincode.trim() || '110001'
    });

    if (!result || !result.success) {
      setError(result?.message || 'Registration failed. Please check sponsor code.');
      return;
    }

    const created = result.user;

    // Automatically set as current session user in pending status
    setCurrentUser(created);
    setCreatedUser(created);
    setDeliveryAddress(`${city.trim() || 'New Delhi'}, Pincode: ${pincode.trim() || '110001'}`);
    setStep(3);

    // Celebrate & Navigate to dedicated /activate page
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Navigate directly to the dedicated Activation Page!
    navigate('/activate');
  };

  const handlePackagePayment = (e) => {
    e?.preventDefault();
    if (!createdUser) return;
    setIsPaying(true);

    setTimeout(() => {
      const res = activateMembership(createdUser.id, {
        method: paymentMethod,
        address: { line: deliveryAddress, city: city || 'New Delhi', pincode: pincode || '110001' }
      });

      setIsPaying(false);

      if (res && res.success) {
        setPaymentSuccess(true);
        setActivationOrder(res.order);
        if (setCurrentUser) {
          setCurrentUser(res.user);
        }
        setCreatedUser(res.user);

        try {
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        setError(res?.message || 'Payment processing failed. Please try again.');
      }
    }, 700);
  };

  const copyReferral = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f4faf6] via-white to-[#edf7f2] py-8 sm:py-12 px-4 sm:px-6 overflow-hidden">
      
      {/* Decorative Corner Leaf/Mortar Elements (Exact Match to Reference) */}
      <img
        src="/images/join/leaves-top.png"
        alt=""
        className="absolute left-0 top-0 w-28 sm:w-36 pointer-events-none opacity-90 select-none z-0"
      />
      <img
        src="/images/join/mortar-corner.png"
        alt=""
        className="absolute left-0 bottom-0 w-36 sm:w-44 pointer-events-none opacity-95 select-none z-0"
      />
      <img
        src="/images/join/leaves-bottom.png"
        alt=""
        className="absolute right-0 bottom-0 w-32 sm:w-40 pointer-events-none opacity-90 select-none z-0"
      />

      <div className={`${step === 3 && !paymentSuccess ? "max-w-4xl" : "max-w-xl"} mx-auto relative z-10 transition-all duration-300`}>
        
        {/* Top Centered Header */}
        <div className="text-center mb-6 sm:mb-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#edf7f0] text-[#137333] border border-[#d3eed9] text-xs font-bold mb-3 shadow-2xs">
            <Star className="w-3.5 h-3.5 text-[#137333]" />
            <span>Official DirectGrow Distributor Registration</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f2e24] tracking-tight leading-tight">
            Join the 8-Level Ayurvedic Movement
          </h1>

          {/* Subtitle */}
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-normal">
            Zero registration fees • Direct access to 100% pure Ayurvedic formulations
          </p>

        </div>

        {/* 3-Step Progress Stepper (Exact Match to Screenshot) */}
        <div className="flex items-center justify-center mb-8 max-w-sm sm:max-w-md mx-auto">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? "bg-[#0c6b37] text-white shadow-xs" : "bg-slate-100 border border-slate-200 text-slate-500"
            }`}>
              1
            </div>
            <span className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${step >= 1 ? "text-[#0c6b37]" : "text-slate-500"}`}>
              Details & Sponsor
            </span>
          </div>

          {/* Line 1 */}
          <div className="h-px w-12 sm:w-20 bg-slate-200 mx-2 sm:mx-3 self-center -translate-y-2.5" />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? "bg-[#0c6b37] text-white shadow-xs" : "bg-slate-100 border border-slate-200 text-slate-500"
            }`}>
              2
            </div>
            <span className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${step >= 2 ? "text-[#0c6b37]" : "text-slate-500"}`}>
              Verification
            </span>
          </div>

          {/* Line 2 */}
          <div className="h-px w-12 sm:w-20 bg-slate-200 mx-2 sm:mx-3 self-center -translate-y-2.5" />

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 3 ? "bg-[#0c6b37] text-white shadow-xs" : "bg-slate-100 border border-slate-200 text-slate-500"
            }`}>
              3
            </div>
            <span className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${step >= 3 ? "text-[#0c6b37]" : "text-slate-500"}`}>
              Activate Rights
            </span>
          </div>

        </div>

        {/* STEP 1: Details & Sponsor (Exact Match to Screenshot) */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sponsor Code Box (Soft Green Highlight Card) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#f4faf6] border border-[#d3eed9] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#137333]" />
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    Sponsor / Referral Code
                  </span>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={noSponsor}
                    onChange={(e) => {
                      setNoSponsor(e.target.checked);
                      if (e.target.checked) setSponsorCode('');
                    }}
                    className="rounded border-slate-300 text-[#0c6b37] focus:ring-[#0c6b37]"
                  />
                  <span>I don't have a sponsor code</span>
                </label>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter 7-character code (e.g. DG10008)"
                  value={noSponsor ? "" : sponsorCode}
                  disabled={noSponsor}
                  onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                  className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    noSponsor 
                      ? "opacity-60 bg-slate-50 cursor-not-allowed font-sans font-normal" 
                      : "focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37]"
                  }`}
                />
              </div>
            </div>

            {/* Personal Information Section Header */}
            <div className="flex items-center gap-2 pt-1 pb-1">
              <User className="w-4 h-4 text-slate-800" />
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Personal Information
              </h3>
            </div>

            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37] transition-all"
                  required
                />
              </div>
            </div>

            {/* Mobile Number & Email Address (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* City / Region & Pincode (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Region
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Pune, Jaipur, Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Create Account Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Create Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c6b37]/20 focus:border-[#0c6b37] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button (Solid Green Pill) */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Continue to Mobile / Email Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Log In Link */}
            <p className="text-center text-xs text-slate-600 pt-1">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#0c6b37] hover:underline">
                Log In
              </Link>
            </p>

          </form>
        )}

        {/* STEP 2: Mobile / Email OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOtpVerify} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0c6b37] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Verify Mobile & Email</h3>
              <p className="text-xs text-slate-500">
                We sent a 6-digit verification code to <strong className="text-slate-800">{phone}</strong> and <strong className="text-slate-800">{email}</strong>.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* OTP Demo Helper */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="text-emerald-800 font-medium">
                Simulated Sandbox Code: <strong className="font-mono font-bold">123456</strong>
              </div>
              <button
                type="button"
                onClick={() => setOtp('123456')}
                className="bg-[#0c6b37] hover:bg-[#0a5a2e] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
              >
                Auto-Fill 123456
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
                Enter 6-Digit Verification OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-48 mx-auto block text-center font-mono text-2xl font-black tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c6b37]"
                required
              />
            </div>

            <div className="text-center text-xs text-slate-500">
              {otpTimer > 0 ? (
                <span>Resend OTP in <strong>{otpTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpTimer(30)}
                  className="text-[#0c6b37] font-bold hover:underline"
                >
                  Resend OTP Code
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-xs transition-all"
              >
                <span>Verify & Create Account</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ← Back to Edit Details
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Mandatory ₹2,000 Membership Activation & Ayurvedic Product Package */}
        {step === 3 && createdUser && (
          <div>
            {!paymentSuccess ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 animate-in fade-in">
                
                {/* Header Banner */}
                <div className="text-center space-y-2 pb-2 border-b border-slate-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Membership Status: PENDING ACTIVATION (Payment Required)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Mandatory ₹2,000 Product Package Activation
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                    Under DirectGrow 8-level rules, new members must complete their mandatory <strong>₹2,000 package payment</strong> to become an <strong>Active Member</strong> in the referral chain and unlock their unique referral code and commission rights.
                  </p>
                </div>

                {/* Predefined Collection of Products Showcase */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#0c6b37]" />
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Predefined Collection Included in Your ₹2,000 Package
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      6 Ayurvedic Formulations (₹3,200 Value)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {(MEMBERSHIP_PACKAGE_DETAILS.includedProducts || MEMBERSHIP_PACKAGE_DETAILS.products || []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-200/80 flex items-center justify-center shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.target.src = '/images/products/prod-chyawanprash.png'; }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block truncate">
                              {item.quantity}
                            </span>
                            <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {item.benefit}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-400 font-semibold">Retail MRP:</span>
                          <span className="font-black text-slate-800">
                            {formatCurrency(item.mrp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Price & Benefits Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  
                  {/* Left: Included Benefits */}
                  <div className="bg-[#f4faf6] rounded-2xl p-4 border border-[#d3eed9] space-y-2 text-xs">
                    <h4 className="font-extrabold text-[#0c6b37] text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0c6b37]" />
                      <span>What Unlocks Upon ₹2,000 Payment:</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-700 text-[11px]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Active Member Status</strong> in the 8-Level Single-Line Hierarchy</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Unique Referral Code</strong> unlocked & ready to share</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Member Dashboard & Visual Tree</strong> full access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Immediate ₹290 commission cascade</strong> distributed to your 8 uplines</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right: Price Breakdown */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Package Payment Summary</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Save ₹1,200
                      </span>
                    </h4>
                    <div className="space-y-1.5 text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                      <div className="flex justify-between">
                        <span>Combined 6-Product MRP:</span>
                        <span className="font-semibold text-slate-800 line-through">₹3,200</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Distributor Package Savings:</span>
                        <span>-₹1,200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Express Delivery & AYUSH Handling:</span>
                        <span className="font-bold text-emerald-700">FREE</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                        <span>Total Payable Now:</span>
                        <span className="text-base text-[#0c6b37]">₹2,000</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Delivery Address & Payment Method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Package Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Street Address, City, Pincode"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c6b37]"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Payment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'UPI', label: 'UPI / GPay' },
                        { id: 'CARD', label: 'Card' },
                        { id: 'NETBANKING', label: 'NetBanking' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            paymentMethod === m.id
                              ? "bg-[#0c6b37] text-white border-[#0c6b37] shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePackagePayment}
                    disabled={isPaying}
                    className="w-full bg-[#0c6b37] hover:bg-[#0a5a2e] disabled:opacity-75 text-white font-extrabold text-sm py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Payment & Activating Membership...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹2,000 & Complete Membership Activation</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Safe & Encrypted 256-Bit Sandbox Transaction • Instant Activation</span>
                  </p>
                </div>

              </div>
            ) : (
              /* Payment Successful Celebration Card */
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200">
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
                    Your ₹2,000 package payment was successful. Lifetime 8-level earning rights and referral code are now active!
                  </p>
                </div>

                {/* Generated Referral Code Card */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 rounded-2xl border border-emerald-300 shadow-xs text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Your Activated Unique Referral Code
                  </span>
                  <div className="text-3xl font-mono font-black text-[#0c6b37] tracking-widest">
                    {createdUser.referralCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyReferral(createdUser.referralCode)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 transition-all shadow-2xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied Code!" : "Copy My Referral Code"}</span>
                  </button>
                </div>

                {/* Order Summary Confirmation */}
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
                    <span className="font-bold text-slate-700">Products Dispatch:</span>
                    <span className="font-bold text-[#0c6b37] flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> 6 Items Dispatched (Free Delivery)
                    </span>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/account"
                    className="w-full sm:w-auto bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Go to Member Dashboard & Tree</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/account?tab=referral"
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all text-center"
                  >
                    View Referral Tools
                  </Link>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
