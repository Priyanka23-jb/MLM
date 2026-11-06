import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle,
  Building, 
  QrCode, 
  X, 
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';

export const WalletSection = () => {
  const { currentUser, updateProfile } = useAuth();
  const { 
    commissionRules, 
    transactions, 
    withdrawals, 
    requestWithdrawal, 
    getUserLevelEarnings 
  } = useMLM();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('BANK_TRANSFER');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  if (!currentUser) return null;

  // Filter transactions for this user
  const userTransactions = transactions.filter(t => t.userId === currentUser.id);
  const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);
  const levelEarnings = getUserLevelEarnings(currentUser.id);

  const availableBalance = currentUser.wallet?.balance || 0;
  const totalEarned = currentUser.wallet?.totalEarned || 0;
  const pendingCommissions = currentUser.wallet?.pendingCommissions || 0;
  const totalWithdrawn = currentUser.wallet?.totalWithdrawn || 0;

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setWithdrawError('');
    const amt = Number(withdrawAmount);

    if (isNaN(amt) || amt <= 0) {
      setWithdrawError('Please enter a valid withdrawal amount.');
      return;
    }
    if (amt < 200) {
      setWithdrawError('Minimum withdrawal amount is ₹200.');
      return;
    }
    if (amt > availableBalance) {
      setWithdrawError(`Insufficient funds. Your available balance is ${formatCurrency(availableBalance)}.`);
      return;
    }

    let payoutDetails = "";
    if (withdrawMethod === 'BANK_TRANSFER') {
      const bank = currentUser.bankDetails;
      if (!bank?.accountNumber || !bank?.ifsc) {
        setWithdrawError('Please update your Bank Account Number & IFSC code in your profile first.');
        return;
      }
      payoutDetails = `${bank.bankName || 'Bank'} A/C: ${bank.accountNumber} (IFSC: ${bank.ifsc})`;
    } else {
      const upi = currentUser.bankDetails?.upiId;
      if (!upi) {
        setWithdrawError('Please update your UPI ID in your profile first.');
        return;
      }
      payoutDetails = `UPI ID: ${upi}`;
    }

    const res = requestWithdrawal(currentUser.id, amt, withdrawMethod, payoutDetails);
    if (res.success) {
      setWithdrawSuccess(true);
      // Update local current user balance immediately
      updateProfile({
        wallet: {
          ...currentUser.wallet,
          balance: availableBalance - amt,
          totalWithdrawn: totalWithdrawn + amt
        }
      });
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
      }, 1500);
    } else {
      setWithdrawError(res.message || 'Failed to submit withdrawal request.');
    }
  };

  const filteredTransactions = userTransactions.filter(tx => {
    if (filterType === 'ALL') return true;
    if (filterType === 'COMMISSION') return tx.type === 'COMMISSION_CREDIT';
    if (filterType === 'WITHDRAWAL') return tx.type === 'WITHDRAWAL_DEBIT';
    if (filterType === 'REVERSAL') return tx.type === 'COMMISSION_REVERSED';
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available Wallet Balance */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              Available Wallet Balance
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black">{formatCurrency(availableBalance)}</span>
            <p className="text-[11px] text-emerald-100 mt-0.5">Ready for instant bank withdrawal</p>
          </div>
          <div>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold py-2 rounded-xl transition-all shadow-xs"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Total Referral Earnings */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Total Earnings Received
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900">{formatCurrency(totalEarned)}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Lifetime 8-level referral commissions</p>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatic credit upon first orders</span>
          </div>
        </div>

        {/* Pending Earnings */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Pending Commissions
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900">{formatCurrency(pendingCommissions)}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting delivery verification</p>
          </div>
          <div className="text-[11px] text-slate-400">
            Releases to balance after clearance
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Total Withdrawn
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900">{formatCurrency(totalWithdrawn)}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Transferred to Bank / UPI</p>
          </div>
          <div className="text-[11px] text-purple-600 font-semibold">
            {userWithdrawals.length} withdrawal request(s)
          </div>
        </div>

      </div>

      {/* 8-Level Commission Earnings Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              Level-Wise Referral Commissions Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Exact earnings per level based on the reference design (₹290 per ₹2,000 qualifying order)
            </p>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            14.5% Total Commission Pool
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
            const rule = commissionRules.levels.find(r => r.level === lvl) || { percentage: 0, fixedAmount: 0 };
            const stat = levelEarnings[lvl] || { earned: 0, count: 0 };

            return (
              <div
                key={lvl}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  stat.earned > 0
                    ? "bg-emerald-50/60 border-emerald-300 shadow-xs"
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                <span className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-black mb-1 ${
                  lvl === 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  L{lvl}
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  {lvl === 1 ? "Direct 5%" : `${rule.percentage}%`}
                </span>
                <span className="text-[10px] text-slate-600 block font-mono">
                  (₹{rule.fixedAmount})
                </span>
                <div className="mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-black text-slate-900 block">
                    {formatCurrency(stat.earned)}
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    {stat.count} order{stat.count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdrawal Requests Status & History */}
      {userWithdrawals.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-4">
            Recent Withdrawal Requests
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Request ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method & Details</th>
                  <th className="py-2.5 px-3">Date Requested</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Bank Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{w.id}</td>
                    <td className="py-3 px-3 font-black text-slate-900">{formatCurrency(w.amount)}</td>
                    <td className="py-3 px-3 text-slate-600">{w.details}</td>
                    <td className="py-3 px-3 text-slate-500">{formatDateTime(w.requestedAt)}</td>
                    <td className="py-3 px-3">
                      {w.status === 'PROCESSED' && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Processed
                        </span>
                      )}
                      {w.status === 'PENDING' && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Under Review
                        </span>
                      )}
                      {w.status === 'REJECTED' && (
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Rejected & Refunded
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {w.transactionRef || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complete Financial Transactions Ledger */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Transaction History & Audit Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Transparent log of all credits, debit withdrawals, and refund reversals
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({userTransactions.length})
            </button>
            <button
              onClick={() => setFilterType('COMMISSION')}
              className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                filterType === 'COMMISSION' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Commissions
            </button>
            <button
              onClick={() => setFilterType('WITHDRAWAL')}
              className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                filterType === 'WITHDRAWAL' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Withdrawals
            </button>
            <button
              onClick={() => setFilterType('REVERSAL')}
              className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                filterType === 'REVERSAL' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Reversals
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No transactions found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">Type</th>
                  <th className="py-2.5 px-3 text-center">Level</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'COMMISSION_CREDIT' || tx.type === 'WITHDRAWAL_REFUNDED';
                  const isReversal = tx.type === 'COMMISSION_REVERSED';
                  const isDebit = tx.type === 'WITHDRAWAL_DEBIT';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {formatDateTime(tx.date)}
                      </td>

                      <td className="py-3 px-3 text-slate-800">
                        <p className="font-semibold">{tx.description}</p>
                        {tx.orderId && (
                          <span className="text-[10px] font-mono text-slate-400">
                            Order #{tx.orderId}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isCredit && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Credit
                          </span>
                        )}
                        {isDebit && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Withdrawal
                          </span>
                        )}
                        {isReversal && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Clawback
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {tx.level ? (
                          <span className="font-bold text-slate-700">L{tx.level}</span>
                        ) : "—"}
                      </td>

                      <td className="py-3 px-3 text-right font-black">
                        {isCredit && (
                          <span className="text-emerald-600">+{formatCurrency(tx.amount)}</span>
                        )}
                        {(isDebit || isReversal) && (
                          <span className="text-rose-600">-{formatCurrency(tx.amount)}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Request Wallet Withdrawal</h3>
                <p className="text-xs text-slate-500">
                  Available: <strong className="text-emerald-600">{formatCurrency(availableBalance)}</strong>
                </p>
              </div>
            </div>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-base">Withdrawal Requested!</h4>
                <p className="text-xs text-slate-500">
                  Your request has been submitted to Admin and will be processed directly to your account.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                {withdrawError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="200"
                    max={availableBalance}
                    placeholder="Enter amount (Min ₹200)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>Minimum: ₹200</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(availableBalance.toString())}
                      className="text-brand-600 font-bold hover:underline"
                    >
                      Withdraw Full Balance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payout Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('BANK_TRANSFER')}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 ${
                        withdrawMethod === 'BANK_TRANSFER'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Building className="w-4 h-4 text-emerald-600" />
                      <span>Bank Transfer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('UPI')}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 ${
                        withdrawMethod === 'UPI'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-purple-600" />
                      <span>Instant UPI</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-800 mb-0.5">Destination Account:</p>
                  {withdrawMethod === 'BANK_TRANSFER' ? (
                    <p>
                      {currentUser.bankDetails?.bankName || 'Bank'} A/C: {currentUser.bankDetails?.accountNumber || 'Not set in profile'} (IFSC: {currentUser.bankDetails?.ifsc || '—'})
                    </p>
                  ) : (
                    <p>
                      UPI ID: {currentUser.bankDetails?.upiId || 'Not set in profile'}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors"
                  >
                    Confirm & Submit Request
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

