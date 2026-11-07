import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency } from '../../utils/helpers';
import { Users, Shield, UserCheck, RefreshCw, X, ChevronDown, CheckCircle2 } from 'lucide-react';

export const PersonaSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, loginAsUser, loginAsAdmin, logout, isAdmin } = useAuth();
  const { users, resetNetworkData } = useMLM();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-brand-600 via-violet-brand to-ayur-600 text-white px-4 py-2.5 rounded-full shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-105 border border-white/20 text-xs font-semibold"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Users className="w-4 h-4" />
          <span>Switch Persona (Test 8-Levels)</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            {isAdmin ? "Admin" : currentUser?.name?.split(' ')[0] || "Guest"}
          </span>
        </button>
      )}

      {/* Expanded Modal/Flyout */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-96 p-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-600" />
                MLM Persona Testing Switcher
              </h3>
              <p className="text-[11px] text-slate-500">
                Switch between sponsors in the 8-level tree to verify real-time commission payouts!
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Active Persona Banner */}
          <div className="my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name?.charAt(0) || "G"
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser?.name || "Guest Visitor"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isAdmin ? "Super Administrator" : `Code: ${currentUser?.referralCode || "None"}`}
                </p>
              </div>
            </div>
            {!isAdmin && currentUser && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Wallet</span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {formatCurrency(currentUser?.wallet?.balance || 0)}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                loginAsAdmin();
                setIsOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                isAdmin
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin</span>
            </button>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Guest Visitor</span>
            </button>
          </div>

          {/* 8-Level Hierarchy User List */}
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              The 8-Level Upline Chain:
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset network to default seed and clear test users from local storage?")) {
                  resetNetworkData();
                }
              }}
              className="text-[10px] text-rose-600 hover:text-rose-700 font-bold hover:underline flex items-center gap-1 transition-colors"
              title="Clear all test registered users and restore default 8-level chain"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Default</span>
            </button>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {users.map((u, idx) => {
              const isSelected = currentUser?.id === u.id;
              const isPending = !u.isActivated || u.membershipStatus === 'PENDING';
              // Map level position relative to root
              let levelBadge = "";
              if (isPending) levelBadge = "Pending (Unpaid ₹2,000)";
              else if (u.id === 'usr-008') levelBadge = "Sponsor Root";
              else if (u.referralCode === 'DG20008' || u.id === 'usr-108') levelBadge = "Level 8 (End of Chain)";
              else if (u.sponsorCode) levelBadge = `Via ${u.sponsorCode}`;
              else levelBadge = "Founder";

              return (
                <div
                  key={u.id}
                  onClick={() => {
                    loginAsUser(u.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer border transition-all ${
                    isSelected
                      ? "bg-brand-50 border-brand-300 ring-1 ring-brand-300"
                      : isPending
                      ? "bg-amber-50/40 hover:bg-amber-50 border-amber-200/80"
                      : "hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={u.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 inline" />}
                        {isPending && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded border border-amber-300">
                            Unpaid
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="font-mono bg-slate-100 px-1 rounded">
                          {isPending ? "LOCKED" : u.referralCode}
                        </span>
                        <span>{u.rank}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-600">
                      {formatCurrency(u.wallet?.balance || 0)}
                    </div>
                    <span className={`text-[9px] block ${isPending ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                      {levelBadge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-center text-[11px] text-slate-500">
            💡 Tip: Place an order as <span className="font-semibold text-slate-700">Rohan (DG10008)</span> or a new customer, then switch to uplines to see commissions hit their balance!
          </div>
        </div>
      )}
    </div>
  );
};

