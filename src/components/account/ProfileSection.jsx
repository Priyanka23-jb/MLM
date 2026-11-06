import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatDate } from '../../utils/helpers';
import { 
  User, 
  ShieldCheck, 
  Building, 
  QrCode, 
  Check, 
  AlertCircle,
  FileCheck,
  CreditCard
} from 'lucide-react';

export const ProfileSection = () => {
  const { currentUser, updateProfile } = useAuth();
  const { getUserByCode } = useMLM();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    pan: currentUser?.kyc?.pan || '',
    aadhar: currentUser?.kyc?.aadhar || '',
    accountHolder: currentUser?.bankDetails?.accountHolder || currentUser?.name || '',
    accountNumber: currentUser?.bankDetails?.accountNumber || '',
    ifsc: currentUser?.bankDetails?.ifsc || '',
    bankName: currentUser?.bankDetails?.bankName || '',
    upiId: currentUser?.bankDetails?.upiId || '',
    address: currentUser?.address?.line || '',
    city: currentUser?.address?.city || '',
    state: currentUser?.address?.state || '',
    pincode: currentUser?.address?.pincode || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const sponsorUser = currentUser.sponsorCode ? getUserByCode(currentUser.sponsorCode) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      kyc: {
        ...currentUser.kyc,
        pan: formData.pan,
        aadhar: formData.aadhar
      },
      bankDetails: {
        accountHolder: formData.accountHolder,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        bankName: formData.bankName,
        upiId: formData.upiId
      },
      address: {
        line: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {currentUser.kyc?.status === 'VERIFIED' ? 'KYC Verified' : 'KYC Submitted'}
              </span>
            </div>
            <p className="text-xs text-brand-600 font-semibold">{currentUser.rank}</p>
            <p className="text-[11px] text-slate-400">
              Member since {formatDate(currentUser.joinedDate)} • Ref Code: <strong className="font-mono text-slate-700">{currentUser.referralCode}</strong>
            </p>
          </div>
        </div>

        {/* Sponsor Banner */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs w-full sm:w-auto text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Sponsor</span>
          <p className="font-bold text-slate-900">{sponsorUser ? sponsorUser.name : "DirectGrow Root"}</p>
          <p className="text-[11px] font-mono text-slate-500">{currentUser.sponsorCode || "ROOT-SYSTEM"}</p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Address & City</label>
              <input
                type="text"
                value={`${formData.address}, ${formData.city}`}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Bank & UPI Details for Wallet Withdrawals */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Bank & UPI Payout Credentials
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Used for automated wallet withdrawals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank, SBI, ICICI"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                placeholder="Enter bank account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                placeholder="e.g. SBIN0001456"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID (VPA)</label>
              <input
                type="text"
                placeholder="e.g. yourname@okhdfcbank"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Instant UPI payouts are supported for eligible verified accounts.
              </p>
            </div>
          </div>
        </div>

        {/* KYC Verification Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-purple-600" />
            Government Compliance & KYC
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PAN Card Number</label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                placeholder="e.g. ABCDE1234F"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar (Last 4 Digits / Masked)</label>
              <input
                type="text"
                value={formData.aadhar}
                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                placeholder="XXXX-XXXX-1234"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Profile and payout details updated successfully!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};

