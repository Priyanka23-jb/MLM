import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMLM } from '../../context/MLMContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  Wallet,
  Coins,
  Building,
  Clock,
  Send,
  FileText,
  Plus,
  Info,
  ArrowDown,
  ArrowUp,
  Eye,
  MoreVertical,
  Check,
  CheckCircle2,
  X,
  AlertCircle,
  Search,
  Calendar,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Trash2,
  CheckCircle,
  XCircle,
  HelpCircle,
  CreditCard
} from 'lucide-react';

// Default bank accounts seeded to match the mockup
const INITIAL_BANK_ACCOUNTS = [
  {
    id: 'bank-01',
    userId: 'usr-000',
    bankName: 'State Bank of India',
    accountHolder: 'Dr. Rajesh Sharma',
    accountNumber: '123456784321',
    maskedNumber: '****4321',
    ifsc: 'SBIN0001234',
    accountType: 'Savings',
    isDefault: true,
    isVerified: true
  },
  {
    id: 'bank-02',
    userId: 'usr-000',
    bankName: 'HDFC Bank',
    accountHolder: 'Dr. Rajesh Sharma',
    accountNumber: '987654329876',
    maskedNumber: '****9876',
    ifsc: 'HDFC0005678',
    accountType: 'Savings',
    isDefault: false,
    isVerified: true
  }
];

// Default withdrawal history seeded with all payouts marked Successful (no pending)
const INITIAL_WITHDRAWAL_HISTORY = [
  {
    id: 'WD250006',
    userId: 'usr-000',
    date: '04 Nov 2026, 11:02 AM',
    timestamp: 1793888520000,
    bankName: 'State Bank of India',
    bankAccountMasked: 'SBI - ****4321',
    fullAccountNumber: '123456784321',
    ifsc: 'SBIN0001234',
    amount: 2000,
    status: 'Successful',
    transactionRef: 'TXN7852649330'
  },
  {
    id: 'WD250005',
    userId: 'usr-000',
    date: '28 Oct 2026, 02:15 PM',
    timestamp: 1793282100000,
    bankName: 'HDFC Bank',
    bankAccountMasked: 'HDFC - ****9876',
    fullAccountNumber: '987654329876',
    ifsc: 'HDFC0005678',
    amount: 1500,
    status: 'Successful',
    transactionRef: 'TXN7852649321'
  },
  {
    id: 'WD250004',
    userId: 'usr-000',
    date: '20 Oct 2026, 10:30 AM',
    timestamp: 1792578600000,
    bankName: 'State Bank of India',
    bankAccountMasked: 'SBI - ****4321',
    fullAccountNumber: '123456784321',
    ifsc: 'SBIN0001234',
    amount: 1000,
    status: 'Successful',
    transactionRef: 'TXN7852649310'
  },
  {
    id: 'WD250003',
    userId: 'usr-000',
    date: '15 Oct 2026, 05:40 PM',
    timestamp: 1792171200000,
    bankName: 'State Bank of India',
    bankAccountMasked: 'SBI - ****4321',
    fullAccountNumber: '123456784321',
    ifsc: 'SBIN0001234',
    amount: 500,
    status: 'Failed',
    transactionRef: '-'
  }
];

// Recent transaction list
const INITIAL_RECENT_TRANSACTIONS = [
  {
    id: 'tx-01',
    title: 'Referral Commission – Level 1',
    date: '06 Nov 2026, 10:24 AM',
    amount: 100,
    type: 'CREDIT',
    status: 'Credited'
  },
  {
    id: 'tx-02',
    title: 'Referral Commission – Level 2',
    date: '05 Nov 2026, 03:16 PM',
    amount: 60,
    type: 'CREDIT',
    status: 'Credited'
  },
  {
    id: 'tx-03',
    title: 'Withdrawal Payout (Bank Transfer)',
    date: '04 Nov 2026, 11:02 AM',
    amount: -2000,
    type: 'DEBIT',
    status: 'Successful'
  },
  {
    id: 'tx-04',
    title: 'Referral Commission – Level 3',
    date: '02 Nov 2026, 04:20 PM',
    amount: 40,
    type: 'CREDIT',
    status: 'Credited'
  }
];

// Helper to mask account number: keeps only last 4 digits
const maskAccountNumber = (accNum) => {
  if (!accNum) return '****0000';
  const clean = String(accNum).replace(/\s+/g, '');
  const last4 = clean.slice(-4);
  return `****${last4}`;
};

// Bank Icon component (specialized for SBI, HDFC, or general bank)
const BankLogo = ({ bankName, className = "w-10 h-10" }) => {
  const name = String(bankName || '').toLowerCase();
  if (name.includes('state bank') || name.includes('sbi')) {
    return (
      <div className={`${className} rounded-full bg-[#0072bc] flex items-center justify-center text-white shrink-0 shadow-2xs`}>
        {/* SBI stylized symbol */}
        <div className="w-5 h-5 rounded-full border-[2.5px] border-white flex flex-col items-center justify-end relative">
          <div className="w-1 h-2 bg-[#0072bc] absolute -bottom-[2.5px]" />
        </div>
      </div>
    );
  }
  if (name.includes('hdfc')) {
    return (
      <div className={`${className} rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs p-1`}>
        <div className="w-full h-full bg-[#ed1c24] rounded-xs flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 bg-[#004c8f] rounded-2xs" />
          <div className="absolute w-1 h-3.5 bg-white" />
          <div className="absolute w-3.5 h-1 bg-white" />
        </div>
      </div>
    );
  }
  return (
    <div className={`${className} rounded-xl bg-[#eef8f2] text-[#0c6b37] flex items-center justify-center shrink-0 shadow-2xs`}>
      <Building className="w-5 h-5 text-[#0c6b37]" />
    </div>
  );
};

export const WalletSection = ({ onBack }) => {
  const { currentUser, updateProfile } = useAuth();
  const { 
    commissionRules, 
    transactions, 
    withdrawals, 
    requestWithdrawal 
  } = useMLM();

  // Load bank accounts from localStorage
  const [bankAccounts, setBankAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_bank_accounts_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BANK_ACCOUNTS;
  });

  // Save bank accounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('directgrow_bank_accounts_v2', JSON.stringify(bankAccounts));
    } catch (e) {}
  }, [bankAccounts]);

  // Load withdrawal requests from localStorage
  const [withdrawalHistory, setWithdrawalHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_withdrawal_history_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WITHDRAWAL_HISTORY;
  });

  // Save withdrawal history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('directgrow_withdrawal_history_v4', JSON.stringify(withdrawalHistory));
    } catch (e) {}
  }, [withdrawalHistory]);

  // Modals state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isTxHistoryModalOpen, setIsTxHistoryModalOpen] = useState(false);
  const [selectedWithdrawalDetails, setSelectedWithdrawalDetails] = useState(null);
  const [activeBankDropdown, setActiveBankDropdown] = useState(null);

  // Filters for Withdrawal History table
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('30_DAYS');

  // Withdrawal 3-Step Wizard state
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [selectedBankId, setSelectedBankId] = useState(() => {
    const def = bankAccounts.find(b => b.isDefault);
    return def ? def.id : (bankAccounts[0]?.id || '');
  });
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);
  const [withdrawalSuccessData, setWithdrawalSuccessData] = useState(null);

  // Add Bank Account Form State
  const [newBankForm, setNewBankForm] = useState({
    accountHolder: currentUser?.name || 'Dr. Rajesh Sharma',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    accountType: 'Savings',
    setAsDefault: false
  });
  const [addBankError, setAddBankError] = useState('');
  const [addBankSuccess, setAddBankSuccess] = useState(false);

  // Metrics calculation
  const isRohan = currentUser?.id === 'usr-008' || currentUser?.referralCode === 'DG10008';
  const isDrRajesh = currentUser?.id === 'usr-000' || currentUser?.referralCode === 'DG10000';

  const userTransactions = transactions?.filter(t => t.userId === currentUser?.id) || [];
  const txCommissionTotal = userTransactions
    .filter(t => t.type === 'COMMISSION_CREDIT')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const activeUser = users?.find(u => u.id === currentUser?.id || u.referralCode === currentUser?.referralCode) || currentUser;
  const walletEarned = Number(activeUser?.wallet?.totalEarned) || Number(currentUser?.wallet?.totalEarned) || 0;

  const totalCommissionEarned = isRohan
    ? 290
    : isDrRajesh
      ? 28450
      : (txCommissionTotal > 0 ? txCommissionTotal : walletEarned);

  const availableBalance = isRohan
    ? 290
    : isDrRajesh
      ? 14580
      : (activeUser?.wallet?.balance !== undefined ? activeUser.wallet.balance : (currentUser?.wallet?.balance !== undefined ? currentUser.wallet.balance : txCommissionTotal));
  
  // Compute pending and withdrawn from withdrawalHistory
  const pendingWithdrawalAmount = useMemo(() => {
    return withdrawalHistory
      .filter(w => w.status === 'Pending')
      .reduce((sum, w) => sum + Number(w.amount || 0), 0);
  }, [withdrawalHistory]);

  const totalWithdrawnAmount = useMemo(() => {
    const sum = withdrawalHistory
      .filter(w => w.status === 'Successful')
      .reduce((sum, w) => sum + Number(w.amount || 0), 0);
    return isRohan ? 0 : (isDrRajesh ? (sum || 13870) : sum);
  }, [withdrawalHistory, isRohan, isDrRajesh]);

  // Selected bank for withdrawal
  const activeSelectedBank = useMemo(() => {
    return bankAccounts.find(b => b.id === selectedBankId) || bankAccounts[0] || null;
  }, [bankAccounts, selectedBankId]);

  // Remaining balance preview in step 2
  const numericWithdrawAmount = Number(withdrawAmountInput) || 0;
  const remainingBalancePreview = Math.max(0, availableBalance - numericWithdrawAmount);

  // Filtered withdrawal history table
  const filteredWithdrawals = useMemo(() => {
    return withdrawalHistory.filter(item => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }
      // Date filter
      if (dateFilter === '7_DAYS') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (item.timestamp && item.timestamp < sevenDaysAgo) return false;
      } else if (dateFilter === '30_DAYS') {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        if (item.timestamp && item.timestamp < thirtyDaysAgo) return false;
      }
      return true;
    });
  }, [withdrawalHistory, statusFilter, dateFilter]);

  // Set default bank account
  const handleSetDefaultBank = (bankId) => {
    setBankAccounts(prev => prev.map(b => ({
      ...b,
      isDefault: b.id === bankId
    })));
    setActiveBankDropdown(null);
  };

  // Remove bank account
  const handleRemoveBank = (bankId) => {
    const target = bankAccounts.find(b => b.id === bankId);
    if (!target) return;
    if (bankAccounts.length <= 1) {
      alert("You must keep at least one bank account on file.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${target.bankName} (${target.maskedNumber})?`)) {
      setBankAccounts(prev => {
        const remaining = prev.filter(b => b.id !== bankId);
        if (target.isDefault && remaining.length > 0) {
          remaining[0].isDefault = true;
        }
        return remaining;
      });
      if (selectedBankId === bankId) {
        setSelectedBankId(bankAccounts.find(b => b.id !== bankId)?.id || '');
      }
      setActiveBankDropdown(null);
    }
  };

  // Handle Add Bank Account Form Submission
  const handleAddBankSubmit = (e) => {
    e.preventDefault();
    setAddBankError('');

    const { accountHolder, bankName, accountNumber, confirmAccountNumber, ifsc, accountType, setAsDefault } = newBankForm;

    if (!accountHolder.trim() || !bankName.trim() || !accountNumber.trim() || !confirmAccountNumber.trim() || !ifsc.trim()) {
      setAddBankError("All fields are required. Please fill in all bank details.");
      return;
    }

    if (accountNumber.trim() !== confirmAccountNumber.trim()) {
      setAddBankError("Account numbers do not match. Please verify.");
      return;
    }

    if (accountNumber.trim().length < 8 || accountNumber.trim().length > 18) {
      setAddBankError("Please enter a valid bank account number (8–18 digits).");
      return;
    }

    // Validate IFSC format: 4 uppercase letters, 0, followed by 6 alphanumeric characters
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (!ifscRegex.test(ifsc.trim())) {
      setAddBankError("Invalid IFSC code format. Example: SBIN0001234 or HDFC0005678.");
      return;
    }

    const newAccount = {
      id: `bank-${Date.now()}`,
      userId: currentUser?.id || 'usr-000',
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      maskedNumber: maskAccountNumber(accountNumber),
      ifsc: ifsc.trim().toUpperCase(),
      accountType,
      isDefault: setAsDefault || bankAccounts.length === 0,
      isVerified: true
    };

    setBankAccounts(prev => {
      if (newAccount.isDefault) {
        return [newAccount, ...prev.map(b => ({ ...b, isDefault: false }))];
      }
      return [...prev, newAccount];
    });

    setSelectedBankId(newAccount.id);
    setAddBankSuccess(true);

    setTimeout(() => {
      setAddBankSuccess(false);
      setIsAddBankModalOpen(false);
      setNewBankForm({
        accountHolder: currentUser?.name || 'Dr. Rajesh Sharma',
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifsc: '',
        accountType: 'Savings',
        setAsDefault: false
      });
    }, 1000);
  };

  // Open Withdrawal Modal
  const handleOpenWithdrawModal = () => {
    setWithdrawStep(1);
    setWithdrawAmountInput('');
    setWithdrawError('');
    setWithdrawalSuccessData(null);
    const def = bankAccounts.find(b => b.isDefault) || bankAccounts[0];
    if (def) setSelectedBankId(def.id);
    setIsWithdrawModalOpen(true);
  };

  // Step 1 -> Step 2 validation
  const handleStep1Continue = () => {
    if (!selectedBankId || !activeSelectedBank) {
      setWithdrawError("Please select a verified bank account to proceed.");
      return;
    }
    setWithdrawError('');
    setWithdrawStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleStep2Continue = () => {
    setWithdrawError('');
    const amt = Number(withdrawAmountInput);

    if (isNaN(amt) || amt <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }
    if (amt < 100) {
      setWithdrawError("Minimum withdrawal amount is ₹100 per request.");
      return;
    }
    if (amt > 10000) {
      setWithdrawError("Maximum withdrawal limit is ₹10,000 per request.");
      return;
    }
    if (amt > availableBalance) {
      setWithdrawError(`Insufficient funds. Your available balance is ${formatCurrency(availableBalance)}.`);
      return;
    }

    setWithdrawStep(3);
  };

  // Step 3 Confirmation & Final Execution
  const handleConfirmWithdrawal = () => {
    setIsSubmittingWithdrawal(true);

    setTimeout(() => {
      const amt = Number(withdrawAmountInput);
      const reqId = `WD25${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const newRecord = {
        id: reqId,
        userId: currentUser?.id || 'usr-000',
        date: nowStr,
        timestamp: Date.now(),
        bankName: activeSelectedBank.bankName,
        bankAccountMasked: `${activeSelectedBank.bankName.slice(0, 4).toUpperCase()} - ${activeSelectedBank.maskedNumber}`,
        fullAccountNumber: activeSelectedBank.accountNumber,
        ifsc: activeSelectedBank.ifsc,
        amount: amt,
        status: 'Successful',
        transactionRef: `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`
      };

      // 1. Update withdrawal history state
      setWithdrawalHistory(prev => [newRecord, ...prev]);

      // 2. Deduct from currentUser wallet balance & add to totalWithdrawn
      if (updateProfile && currentUser) {
        updateProfile({
          wallet: {
            ...currentUser.wallet,
            balance: Math.max(0, availableBalance - amt),
            totalWithdrawn: (currentUser.wallet?.totalWithdrawn || 13870) + amt,
            pendingWithdrawal: 0
          }
        });
      }

      // 3. Inform context if supported
      if (requestWithdrawal) {
        try {
          requestWithdrawal(
            currentUser?.id || 'usr-000',
            amt,
            'BANK_TRANSFER',
            `${activeSelectedBank.bankName} (${activeSelectedBank.maskedNumber})`
          );
        } catch (e) {}
      }

      setIsSubmittingWithdrawal(false);
      setWithdrawalSuccessData(newRecord);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header: Title with Vertical Green Bar + Subtitle + Optional Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#15803d] rounded-full shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f241a] tracking-tight">
              Wallet & Payouts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Manage your earnings, bank accounts and withdrawal requests.
            </p>
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0c6b37] bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>

      {/* Row 1: Four Metric Summary Cards (Exact Match to Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Available Balance */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#eef8f2] flex items-center justify-center text-[#0c6b37] shrink-0">
              <Wallet className="w-5 h-5 text-[#0c6b37]" strokeWidth={1.8} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Available Balance</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block mt-0.5">
                {formatCurrency(availableBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Total Commission Earned */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#eef8f2] flex items-center justify-center text-[#0c6b37] shrink-0">
              <Coins className="w-5 h-5 text-[#0c6b37]" strokeWidth={1.8} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Commission Earned</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block mt-0.5">
                {formatCurrency(totalCommissionEarned)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Total Withdrawn */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#eef8f2] flex items-center justify-center text-[#0c6b37] shrink-0">
              <Building className="w-5 h-5 text-[#0c6b37]" strokeWidth={1.8} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Withdrawn</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block mt-0.5">
                {formatCurrency(totalWithdrawnAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Pending Withdrawal */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-amber-200 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] shrink-0">
              <Clock className="w-5 h-5 text-[#ea580c]" strokeWidth={1.8} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Pending Withdrawal</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block mt-0.5">
                {formatCurrency(pendingWithdrawalAmount)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons Bar below metrics (Exact Match to Mockup) */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleOpenWithdrawModal}
          className="bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Withdraw Money</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAddBankModalOpen(true)}
          className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <Building className="w-4 h-4 text-slate-600" />
          <span>Manage Bank Accounts</span>
        </button>

        <button
          type="button"
          onClick={() => setIsTxHistoryModalOpen(true)}
          className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>Transaction History</span>
        </button>
      </div>

      {/* Row 2: Two Columns (My Bank Accounts & Recent Transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: My Bank Accounts (Span 6 on LG) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#16a34a]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                My Bank Accounts
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAddBankModalOpen(true)}
              className="text-[#15803d] hover:underline font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bank Account</span>
            </button>
          </div>

          {/* Bank Accounts List */}
          <div className="space-y-3 pt-1">
            {bankAccounts.map((bank) => {
              const isDefault = bank.isDefault;
              return (
                <div
                  key={bank.id}
                  className={`rounded-2xl p-4 flex items-center justify-between transition-all relative ${
                    isDefault
                      ? 'border-2 border-[#86efac] bg-[#fbfdfc]'
                      : 'border border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Left: Bank Logo + Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <BankLogo bankName={bank.bankName} className="w-10 h-10" />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {bank.bankName}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        A/c No: {bank.maskedNumber}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        IFSC: {bank.ifsc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Default Badge / Radio + 3-Dot Options */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isDefault ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#edf7ee] text-[#15803d] border border-[#d3eed9]">
                        <Check className="w-3 h-3 text-[#15803d]" />
                        <span>Default</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultBank(bank.id)}
                        className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-emerald-500 transition-colors cursor-pointer"
                        title="Set as Default Account"
                      />
                    )}

                    {/* 3-Dot Action Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveBankDropdown(activeBankDropdown === bank.id ? null : bank.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeBankDropdown === bank.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100 text-xs font-medium">
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultBank(bank.id)}
                              className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Set as Default</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveBank(bank.id)}
                            className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Remove Account</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Withdrawal Information Notice Box */}
          <div className="bg-[#f4fbf6] border border-emerald-100/90 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#0c6b37]">
              <Info className="w-4 h-4 text-[#16a34a]" />
              <span>Withdrawal Information</span>
            </div>
            <ul className="text-slate-600 space-y-1 pl-5 list-disc text-[11px] sm:text-xs">
              <li>Minimum withdrawal amount: ₹100</li>
              <li>Maximum withdrawal amount: ₹10,000 per request</li>
              <li>Withdrawals are processed within 1–3 working days.</li>
            </ul>
          </div>

        </div>

        {/* Right Column: Recent Transactions (Span 6 on LG) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#16a34a]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Recent Transactions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsTxHistoryModalOpen(true)}
              className="text-[#15803d] hover:underline font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <span className="text-sm">→</span>
            </button>
          </div>

          {/* List of Recent Transactions */}
          <div className="divide-y divide-slate-100/80 pt-1">
            {INITIAL_RECENT_TRANSACTIONS.map((tx) => {
              const isCredit = tx.type === 'CREDIT';
              return (
                <div
                  key={tx.id}
                  className="py-3 px-1 sm:px-2 hover:bg-slate-50/70 rounded-2xl transition-colors flex items-center justify-between gap-3"
                >
                  {/* Left: Direction Icon + Title + Date */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-[#edf7ee] text-[#15803d]'
                          : 'bg-[#fff7ed] text-[#ea580c]'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDown className="w-4 h-4 text-[#15803d]" />
                      ) : (
                        <ArrowUp className="w-4 h-4 text-[#ea580c]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {tx.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {tx.date}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount + Status Badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-black text-xs sm:text-sm ${
                        isCredit ? 'text-[#15803d]' : 'text-slate-900'
                      }`}
                    >
                      {isCredit ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'Credited'
                          ? 'bg-[#edf7ee] text-[#15803d]'
                          : 'bg-[#fff7ed] text-[#ea580c]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Row 3: Withdrawal History Table (Full Width, Exact Match to Mockup) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
        
        {/* Header with Title and Two Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0">
              <span className="font-black text-sm text-[#16a34a]">₹</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Withdrawal History
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESSFUL">Successful</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Date Range Dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 shadow-2xs cursor-pointer"
            >
              <option value="30_DAYS">📅 Last 30 Days</option>
              <option value="7_DAYS">📅 Last 7 Days</option>
              <option value="ALL">📅 All Time</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold">
                <th className="pb-3 font-semibold">Request ID</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Bank Account</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Transaction Ref.</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No withdrawal requests match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((item) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff7ed] text-[#ea580c] border border-amber-200/80">
                      <Clock className="w-3 h-3 text-[#ea580c]" />
                      <span>Pending</span>
                    </span>
                  );
                  if (item.status === 'Successful') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#edf7ee] text-[#15803d] border border-[#d3eed9]">
                        <Check className="w-3 h-3 text-[#15803d]" />
                        <span>Successful</span>
                      </span>
                    );
                  } else if (item.status === 'Failed' || item.status === 'Rejected') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1f2] text-[#e11d48] border border-rose-200">
                        <X className="w-3 h-3 text-[#e11d48]" />
                        <span>Failed</span>
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 font-bold font-mono text-slate-900">{item.id}</td>
                      <td className="py-3.5 text-slate-500 whitespace-nowrap">{item.date}</td>
                      <td className="py-3.5 font-mono text-slate-700 whitespace-nowrap">{item.bankAccountMasked}</td>
                      <td className="py-3.5 font-black text-slate-900">{formatCurrency(item.amount)}</td>
                      <td className="py-3.5 whitespace-nowrap">{statusBadge}</td>
                      <td className="py-3.5 font-mono text-slate-400">{item.transactionRef || '-'}</td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedWithdrawalDetails(item)}
                          className="inline-flex items-center gap-1 text-[#15803d] hover:underline font-bold text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#15803d]" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. THREE-STEP WITHDRAWAL MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Wallet icon & Available Balance */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0c6b37] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Withdraw Money
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct transfer to your verified bank account
                  </p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 block font-semibold">Available</span>
                <span className="text-sm font-black text-[#15803d]">{formatCurrency(availableBalance)}</span>
              </div>
            </div>

            {/* Success View after Confirmation */}
            {withdrawalSuccessData ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#edf7ee] text-[#15803d] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8 text-[#15803d]" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Withdrawal Successful!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Your payout of {formatCurrency(withdrawalSuccessData.amount)} has been successfully approved and transferred to your bank account.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Request ID:</span>
                    <span className="font-mono font-bold text-slate-900">{withdrawalSuccessData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Amount Transferred:</span>
                    <span className="font-black text-[#15803d]">{formatCurrency(withdrawalSuccessData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Destination:</span>
                    <span className="font-semibold text-slate-800">{withdrawalSuccessData.bankAccountMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Transaction Reference:</span>
                    <span className="font-mono font-bold text-slate-900">{withdrawalSuccessData.transactionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#15803d]">
                      <Check className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Successful</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* 3-Step Progress Indicator */}
                <div className="flex items-center justify-between text-xs font-semibold px-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      withdrawStep >= 1 ? 'bg-[#15803d] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      1
                    </span>
                    <span className={withdrawStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Select Bank
                    </span>
                  </div>

                  <div className={`h-0.5 flex-1 mx-3 ${withdrawStep >= 2 ? 'bg-[#15803d]' : 'bg-slate-200'}`} />

                  <div className="flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      withdrawStep >= 2 ? 'bg-[#15803d] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      2
                    </span>
                    <span className={withdrawStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Amount
                    </span>
                  </div>

                  <div className={`h-0.5 flex-1 mx-3 ${withdrawStep >= 3 ? 'bg-[#15803d]' : 'bg-slate-200'}`} />

                  <div className="flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      withdrawStep === 3 ? 'bg-[#15803d] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      3
                    </span>
                    <span className={withdrawStep === 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                      Confirm
                    </span>
                  </div>
                </div>

                {withdrawError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {/* STEP 1: Select Bank Account */}
                {withdrawStep === 1 && (
                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-slate-600 font-medium">
                      Choose which verified bank account to transfer your funds to:
                    </p>

                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {bankAccounts.map((b) => {
                        const isSelected = selectedBankId === b.id;
                        return (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBankId(b.id)}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? 'border-2 border-[#15803d] bg-emerald-50/20 shadow-2xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="selectedBank"
                                checked={isSelected}
                                onChange={() => setSelectedBankId(b.id)}
                                className="accent-[#15803d] w-4 h-4"
                              />
                              <div>
                                <h5 className="font-bold text-xs sm:text-sm text-slate-900">{b.bankName}</h5>
                                <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                  {b.maskedNumber} • {b.ifsc}
                                </p>
                              </div>
                            </div>
                            {b.isDefault && (
                              <span className="text-[10px] font-bold bg-[#edf7ee] text-[#15803d] px-2 py-0.5 rounded-full border border-emerald-200">
                                Default
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsWithdrawModalOpen(false);
                        setIsAddBankModalOpen(true);
                      }}
                      className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add a new bank account</span>
                    </button>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsWithdrawModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleStep1Continue}
                        className="px-5 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Enter Amount */}
                {withdrawStep === 2 && (
                  <div className="space-y-4 pt-1">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium block">Available to Withdraw</span>
                        <span className="text-xl font-black text-[#15803d] mt-0.5 block">
                          {formatCurrency(availableBalance)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Selected Account</span>
                        <span className="text-xs font-bold text-slate-800 block">
                          {activeSelectedBank?.bankName} ({activeSelectedBank?.maskedNumber})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Withdrawal Amount (₹)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-sm font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          placeholder="Enter amount (min ₹100)"
                          value={withdrawAmountInput}
                          onChange={(e) => setWithdrawAmountInput(e.target.value)}
                          className="w-full pl-8 pr-16 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#15803d]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const maxAllowable = Math.min(availableBalance, 10000);
                            setWithdrawAmountInput(String(maxAllowable));
                          }}
                          className="absolute right-2 text-xs font-black text-[#15803d] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                      <span>Min: ₹100 • Max: ₹10,000 per request</span>
                      <span>Remaining: <strong className="text-slate-800">{formatCurrency(remainingBalancePreview)}</strong></span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setWithdrawStep(1)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleStep2Continue}
                        className="px-5 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Review Summary</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Review & Confirm */}
                {withdrawStep === 3 && (
                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-slate-600 font-medium">
                      Please review your withdrawal request before final confirmation:
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Withdrawal Amount:</span>
                        <span className="text-base font-black text-slate-900">
                          {formatCurrency(numericWithdrawAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Bank Name:</span>
                        <span className="font-bold text-slate-900">{activeSelectedBank?.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Account Number:</span>
                        <span className="font-mono font-bold text-slate-900">{activeSelectedBank?.maskedNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">IFSC Code:</span>
                        <span className="font-mono text-slate-700">{activeSelectedBank?.ifsc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Processing Fee:</span>
                        <span className="font-bold text-[#15803d]">₹0 (FREE)</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200/60 font-bold">
                        <span className="text-slate-900">Final Payable Amount:</span>
                        <span className="text-base font-black text-[#15803d]">
                          {formatCurrency(numericWithdrawAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        Withdrawal will be reviewed and transferred to your bank account within 1–3 business days.
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setWithdrawStep(2)}
                        disabled={isSubmittingWithdrawal}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        Back to Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmWithdrawal}
                        disabled={isSubmittingWithdrawal}
                        className="px-5 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingWithdrawal ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Confirm Withdrawal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      )}

      {/* 2. ADD BANK ACCOUNT MODAL */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsAddBankModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0c6b37] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Add Bank Account</h3>
                <p className="text-xs text-slate-500">Provide verified details for fast direct payouts</p>
              </div>
            </div>

            {addBankError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addBankError}</span>
              </div>
            )}

            {addBankSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#15803d] mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Bank Account Added!</h4>
                <p className="text-xs text-slate-500">Account verified and saved for withdrawals.</p>
              </div>
            ) : (
              <form onSubmit={handleAddBankSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    value={newBankForm.accountHolder}
                    onChange={(e) => setNewBankForm({ ...newBankForm, accountHolder: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#15803d]"
                    placeholder="Full Name as on Bank Passbook"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={newBankForm.bankName}
                    onChange={(e) => setNewBankForm({ ...newBankForm, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#15803d]"
                    placeholder="e.g. State Bank of India, HDFC Bank, ICICI"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Number *</label>
                    <input
                      type="password"
                      required
                      value={newBankForm.accountNumber}
                      onChange={(e) => setNewBankForm({ ...newBankForm, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#15803d]"
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm A/c Number *</label>
                    <input
                      type="text"
                      required
                      value={newBankForm.confirmAccountNumber}
                      onChange={(e) => setNewBankForm({ ...newBankForm, confirmAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#15803d]"
                      placeholder="Re-type Account Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      required
                      value={newBankForm.ifsc}
                      onChange={(e) => setNewBankForm({ ...newBankForm, ifsc: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono uppercase focus:outline-none focus:border-[#15803d]"
                      placeholder="e.g. SBIN0001234"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Type *</label>
                    <select
                      value={newBankForm.accountType}
                      onChange={(e) => setNewBankForm({ ...newBankForm, accountType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#15803d]"
                    >
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="setAsDefaultCheckbox"
                    checked={newBankForm.setAsDefault}
                    onChange={(e) => setNewBankForm({ ...newBankForm, setAsDefault: e.target.checked })}
                    className="accent-[#15803d] w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="setAsDefaultCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Set as my primary default bank account
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddBankModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Save & Verify Account
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 3. WITHDRAWAL DETAILS MODAL */}
      {selectedWithdrawalDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedWithdrawalDetails(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0c6b37] flex items-center justify-center font-black">
                ₹
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Withdrawal Details</h3>
                <p className="text-xs text-slate-400 font-mono">Request #{selectedWithdrawalDetails.id}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Requested Amount:</span>
                <span className="text-base font-black text-slate-900">{formatCurrency(selectedWithdrawalDetails.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Request Date:</span>
                <span className="text-slate-700 font-medium">{selectedWithdrawalDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Bank Account:</span>
                <span className="font-semibold text-slate-800">{selectedWithdrawalDetails.bankAccountMasked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">IFSC:</span>
                <span className="font-mono text-slate-700">{selectedWithdrawalDetails.ifsc || 'SBIN0001234'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedWithdrawalDetails.status === 'Successful'
                    ? 'bg-[#edf7ee] text-[#15803d]'
                    : selectedWithdrawalDetails.status === 'Pending'
                    ? 'bg-[#fff7ed] text-[#ea580c]'
                    : 'bg-[#fff1f2] text-[#e11d48]'
                }`}>
                  {selectedWithdrawalDetails.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Transaction Reference:</span>
                <span className="font-mono text-slate-800 font-bold">{selectedWithdrawalDetails.transactionRef || 'Pending Settlement'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedWithdrawalDetails(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 4. FULL TRANSACTION HISTORY MODAL */}
      {isTxHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#16a34a]" />
                <h3 className="text-base font-black text-slate-900">
                  Full Transaction & Commission Ledger
                </h3>
              </div>
              <button
                onClick={() => setIsTxHistoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
              {INITIAL_RECENT_TRANSACTIONS.concat([
                { id: 'tx-05', title: 'Referral Commission – Level 4', date: '28 Oct 2026, 11:15 AM', amount: 30, type: 'CREDIT', status: 'Credited' },
                { id: 'tx-06', title: 'Withdrawal Payout (Bank Transfer)', date: '28 Oct 2026, 02:15 PM', amount: -1500, type: 'DEBIT', status: 'Completed' },
                { id: 'tx-07', title: 'Referral Commission – Level 5', date: '20 Oct 2026, 09:40 AM', amount: 20, type: 'CREDIT', status: 'Credited' },
                { id: 'tx-08', title: 'Withdrawal Payout (Bank Transfer)', date: '20 Oct 2026, 10:30 AM', amount: -1000, type: 'DEBIT', status: 'Completed' },
                { id: 'tx-09', title: 'Referral Commission – Level 6', date: '15 Oct 2026, 03:00 PM', amount: 20, type: 'CREDIT', status: 'Credited' }
              ]).map((t, i) => (
                <div key={t.id || i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      t.amount > 0 ? 'bg-[#edf7ee] text-[#15803d]' : 'bg-[#fff7ed] text-[#ea580c]'
                    }`}>
                      {t.amount > 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-black text-xs sm:text-sm ${
                      t.amount > 0 ? 'text-[#15803d]' : 'text-slate-900'
                    }`}>
                      {t.amount > 0 ? `+₹${t.amount}` : `-₹${Math.abs(t.amount)}`}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTxHistoryModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
