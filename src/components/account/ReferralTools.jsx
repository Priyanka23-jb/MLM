import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  MessageCircle, 
  Send, 
  Mail, 
  Sparkles, 
  Award,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const ReferralTools = () => {
  const { currentUser } = useAuth();
  const { isReferralCodeUsed, canUserRefer, getDirectReferral, getUserChainDepth } = useMLM();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!currentUser) return null;

  const isPendingActivation = !currentUser.isActivated || currentUser.membershipStatus === 'PENDING';
  const depth = getUserChainDepth ? getUserChainDepth(currentUser.id) : 0;
  const isLevel8 = depth >= 8 || currentUser.referralCode === 'DG20008';
  const isEligibleToRefer = isPendingActivation ? false : (isLevel8 ? false : (canUserRefer ? canUserRefer(currentUser.referralCode) : !isReferralCodeUsed(currentUser.referralCode)));
  const referredMember = getDirectReferral ? getDirectReferral(currentUser.referralCode) : null;
  const origin = window.location.origin || 'http://localhost:3000';
  const referralLink = `${origin}/join?ref=${currentUser.referralCode}`;
  const shareMessage = `Namaste! Join me on DirectGrow Ayurvedic Product Platform. Explore 100% pure Ayurvedic formulations and unlock 8-Level referral earnings. Use my referral code ${currentUser.referralCode} to register: ${referralLink}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'CODE') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join DirectGrow Ayurvedic Platform!")}`, '_blank');
  };

  const handleEmailShare = () => {
    window.open(`mailto:?subject=${encodeURIComponent("Invitation to join DirectGrow Ayurvedic Platform")}&body=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-brand-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Grow Your 8-Level Network</span>
            </div>
            <h2 className="text-2xl font-black">Invite & Marketing Toolkit</h2>
            <p className="text-xs text-slate-200 mt-1 max-w-xl">
              Share your personal sponsor credentials to welcome new customers. Whenever someone registers with your code and places their first qualifying order, you earn ₹100 direct commission!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] text-slate-200 uppercase font-bold block">Your Sponsor Code (Single-Use)</span>
            <span className="text-2xl font-mono font-black text-amber-300 tracking-wider">
              {isPendingActivation ? "LOCKED" : currentUser.referralCode}
            </span>
            <div className="mt-1.5">
              {isPendingActivation ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-amber-300" />
                  Pending ₹2,000 Payment
                </span>
              ) : isLevel8 ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-rose-400/20 text-rose-300 border border-rose-400/30 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-rose-300" />
                  Level 8 Limit (Cannot Refer)
                </span>
              ) : !isEligibleToRefer ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3 text-amber-300" />
                  Referral Option Disabled (1/1)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  1-Time Slot Available (0/1)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Code, Link, Social Buttons */}
        <div className="lg:col-span-8 space-y-6">
          
          {isPendingActivation ? (
            /* Locked Box for Pending Unpaid Member */
            <div className="bg-white rounded-3xl p-8 border border-amber-300 shadow-sm text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Mandatory Activation Required
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Referral Tools Locked Until ₹2,000 Package Purchase
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed mt-1">
                  In accordance with DirectGrow's 8-level single-line system, every member must complete their mandatory <strong>₹2,000 package payment</strong> to become an <strong>Active Member</strong>. Until payment is completed and verified, you cannot refer others and are not counted as an active node in the downline hierarchy.
                </p>
              </div>

              {/* Package summary preview */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Package Includes:</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  6 Classical Ayurvedic Formulations (Chyawanprash, Immunity Syrup, Wellness Tablets, Aloe Gel, Triphala, Pain Relief Oil) totaling ₹3,200 retail value for ₹2,000 package price.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/activate"
                  className="inline-flex items-center gap-2 bg-[#0c6b37] hover:bg-[#0a5a2e] text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <Lock className="w-4 h-4" />
                  <span>Activate Membership Now (Pay ₹2,000)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : isLevel8 ? (
            /* Disabled Box specifically for Level 8 Terminal Member (Priya Sharma) */
            <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                  Max 8-Level Chain Limit
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Level 8 Terminal: You Cannot Refer Anyone
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  In DirectGrow's strict 8-level single-line system, Level 8 is the terminal level of the hierarchy. Members at Level 8 cannot sponsor or refer any new members.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md mx-auto text-left space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Your Chain Position:</span>
                  <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-[10px]">
                    Level 8 (Terminal Node)
                  </span>
                </div>
                <p className="text-xs font-mono font-bold text-brand-700 pt-1">
                  Code: {currentUser.referralCode} (Referrals Locked)
                </p>
              </div>

              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                The 8-level single-line chain terminates here. No further downlines can be registered under Level 8.
              </p>
            </div>
          ) : !isEligibleToRefer ? (
            /* Disabled Referral Box when 1/1 Quota is Reached */
            <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Strict Single-Line Chain Enforcement
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Your Direct Referral Option is Disabled
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  In DirectGrow's strict 8-level single-line system, each member is permitted to refer <strong>exactly one person</strong> to maintain a direct parent-child chain without parallel branches.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md mx-auto text-left space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Your 1 Direct Recruit:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    Confirmed
                  </span>
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                  <img
                    src={referredMember?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {referredMember?.name || "Sunita Patel"}
                    </p>
                    <p className="text-[11px] font-mono text-brand-700">
                      Code: {referredMember?.referralCode || "DG20001"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                Next members must register using <strong>{referredMember?.name || "Sunita Patel"}'s</strong> code or the active tail member of the chain.
              </p>
            </div>
          ) : (
            /* Active Referral Box when 0/1 (Open) */
            <>
              {/* Card 1: Unique Referral Link */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Your Personal Referral Link</h3>
                <p className="text-xs text-slate-500">
                  When friends open this link, your sponsor code is automatically pre-filled and locked in during their registration journey.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-800 truncate select-all">
                    {referralLink}
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralLink, 'LINK')}
                    className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: 1-Click Social Sharing */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">1-Click Share to Channels</h3>
                <p className="text-xs text-slate-500">
                  Share directly to your contacts with pre-written inviting copy.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleTelegramShare}
                    className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Share on Telegram</span>
                  </button>

                  <button
                    onClick={handleEmailShare}
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send via Email</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Card 3: Sponsor Invitation Message Preview */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sample Invitation Text
            </span>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
              "{shareMessage}"
            </div>
          </div>

        </div>

        {/* Right Column: QR Code & Quick Rules */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QR Code Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <QrCode className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Instant QR Code</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Let contacts scan this code on their mobile to register under you immediately.
              </p>
            </div>

            {/* Generated QR Code via clean reliable QR API */}
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-300 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(referralLink)}`}
                alt="DirectGrow Referral QR Code"
                className="w-44 h-44 mx-auto object-contain"
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              Code: <strong className="text-slate-800">{currentUser.referralCode}</strong>
            </p>
          </div>

          {/* Quick Rewards Reminders */}
          <div className="bg-gradient-to-br from-brand-50 to-emerald-50 p-5 rounded-3xl border border-emerald-200 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>How You Earn When They Join:</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span>Friend registers with your code <strong>{currentUser.referralCode}</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span>Friend makes their first qualifying purchase (₹2,000+).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span>You receive <strong>₹100 (5%)</strong> instantly in your wallet.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span>When your friend invites others, you earn <strong>Level 2 through 8</strong> commissions continuously!</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

