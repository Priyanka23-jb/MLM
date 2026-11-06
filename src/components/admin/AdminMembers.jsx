import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Eye, 
  X, 
  GitBranch, 
  Building,
  Key
} from 'lucide-react';

export const AdminMembers = () => {
  const { users, getUserByCode, getUplineChain, getUserDownline } = useMLM();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || 
           u.referralCode?.toLowerCase().includes(q) ||
           u.sponsorCode?.toLowerCase().includes(q);
  });

  const uplineChain = selectedUser?.sponsorCode ? getUplineChain(selectedUser.sponsorCode, 8) : [];
  const downline = selectedUser ? getUserDownline(selectedUser.id) : null;

  return (
    <div className="space-y-6">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Customer & Network Directory</span>
          </div>
          <h2 className="text-2xl font-black">All Registered Distributors ({users.length})</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer accounts, inspect 8-tier upline lineages, and audit wallet balances.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search member, code, or sponsor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Member Info</th>
                <th className="py-3 px-3">Referral Code</th>
                <th className="py-3 px-3">Sponsor Code</th>
                <th className="py-3 px-3">Rank & Role</th>
                <th className="py-3 px-3 text-right">Wallet Balance</th>
                <th className="py-3 px-3 text-center">KYC Status</th>
                <th className="py-3 px-3 text-center">Qualifier</th>
                <th className="py-3 px-4 text-right">Genealogy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 text-slate-700 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-brand-600">
                    {user.referralCode}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-500">
                    {user.sponsorCode || "—"}
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {user.rank}
                  </td>

                  <td className="py-3.5 px-3 text-right font-black text-emerald-600">
                    {formatCurrency(user.wallet?.balance || 0)}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {user.isQualified ? (
                      <span className="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Active 8-Tier
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">
                        Pending First Order
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full text-slate-800 relative max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={selectedUser.avatar}
                alt=""
                className="w-14 h-14 rounded-full object-cover border-2 border-brand-500 shadow-sm"
              />
              <div>
                <h3 className="font-bold text-lg text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-brand-600 font-semibold">{selectedUser.rank}</p>
                <p className="text-[11px] text-slate-400">
                  Referral Code: <strong className="font-mono text-slate-800">{selectedUser.referralCode}</strong> • Sponsor: <strong className="font-mono text-slate-800">{selectedUser.sponsorCode || 'Root'}</strong>
                </p>
              </div>
            </div>

            {/* Wallet & Financials */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Available Wallet</span>
                <span className="text-base font-black text-emerald-600">{formatCurrency(selectedUser.wallet?.balance || 0)}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Earned</span>
                <span className="text-base font-black text-slate-900">{formatCurrency(selectedUser.wallet?.totalEarned || 0)}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Withdrawn</span>
                <span className="text-base font-black text-purple-600">{formatCurrency(selectedUser.wallet?.totalWithdrawn || 0)}</span>
              </div>
            </div>

            {/* 8-Level Upline Chain */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-600" />
                <span>8-Tier Upstream Lineage (Who Earns on Their Purchase)</span>
              </h4>

              {uplineChain.length === 0 ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                  Root user has no parent sponsors.
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 max-h-44 overflow-y-auto">
                  {uplineChain.map(item => (
                    <div key={item.level} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                          L{item.level}
                        </span>
                        <span className="font-semibold text-slate-900">{item.user.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({item.user.referralCode})</span>
                      </div>
                      <span className="text-emerald-600 font-bold">
                        {item.rule.percentage}% (+₹{item.rule.fixedAmount})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Downline Summary */}
            {downline && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Downline Network:</span>
                <span className="font-black text-slate-900">{downline.totalMembers} Members Across 8 Levels</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
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
