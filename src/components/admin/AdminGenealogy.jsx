import React, { useState } from 'react';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  GitBranch, 
  Users, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminGenealogy = () => {
  const { users, getUserDownline, commissionRules } = useMLM();
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || 'usr-000');
  const [activeLevelView, setActiveLevelView] = useState(1);

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];
  const { levels, totalMembers } = getUserDownline(selectedUserId);

  return (
    <div className="space-y-6">
      
      {/* Header (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Multi-Level Genealogy Tree</span>
          </div>
          <h2 className="text-2xl font-black">Company-Wide 8-Level Network Hierarchy</h2>
          <p className="text-xs text-slate-500 mt-1">
            Traverse the complete tree from any distributor node down to 8 generations.
          </p>
        </div>

        {/* User Root Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Select Root:</span>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.referralCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Root Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={selectedUser.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
            <div>
              <h3 className="font-bold text-lg text-slate-900">{selectedUser.name}</h3>
              <p className="text-xs text-slate-500">
                Code: <strong className="font-mono text-emerald-600">{selectedUser.referralCode}</strong> • {selectedUser.rank}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Downline</span>
              <span className="text-base font-black text-slate-900">{totalMembers} Members</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Direct Recruits (L1)</span>
              <span className="text-base font-black text-emerald-600">{(levels[1] || []).length} Direct</span>
            </div>
          </div>
        </div>

        {/* 8-Tier Level Switcher Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
            const count = (levels[lvl] || []).length;
            const rule = commissionRules.levels.find(r => r.level === lvl);
            const isSelected = activeLevelView === lvl;

            return (
              <button
                key={lvl}
                onClick={() => setActiveLevelView(lvl)}
                className={`p-3 rounded-2xl text-center transition-all ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md scale-105 font-bold"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider opacity-80">Tier {lvl}</div>
                <div className="text-base font-black mt-0.5">{count}</div>
                <div className="text-[9px] opacity-75">{rule?.percentage}%</div>
              </button>
            );
          })}
        </div>

        {/* Active Level Members List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing members in <strong className="text-slate-900">Level {activeLevelView}</strong> under {selectedUser.name}
            </span>
            <span>
              Commission: <strong className="text-emerald-600 font-bold">₹{commissionRules.levels.find(r => r.level === activeLevelView)?.fixedAmount}</strong> per qualifying purchase
            </span>
          </div>

          {(levels[activeLevelView] || []).length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No members located at Level {activeLevelView} under this distributor node.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(levels[activeLevelView] || []).map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedUserId(m.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200 transition-all cursor-pointer group flex items-center justify-between"
                  title="Click to pivot tree around this member"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <img
                      src={m.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-600 transition-colors">
                        {m.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">{m.referralCode}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-700 font-bold block bg-emerald-50 px-2 py-0.5 rounded-full">
                      {m.isQualified ? "Qualified" : "Registered"}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 block">Pivot Tree →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
