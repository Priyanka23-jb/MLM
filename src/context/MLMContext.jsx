import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DEFAULT_COMMISSION_RULES, 
  INITIAL_USERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ORDERS, 
  INITIAL_WITHDRAWALS 
} from '../data/initialData';
import { INITIAL_PRODUCTS, MEMBERSHIP_PACKAGE_DETAILS } from '../data/products';
import { generateTxId, generateWithdrawalId } from '../utils/helpers';

const MLMContext = createContext();

export const MLMProvider = ({ children }) => {
  // Commission Rules
  const [commissionRules, setCommissionRules] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_rules');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_COMMISSION_RULES;
  });

  // Users / Network
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_users_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(u => u.id === 'usr-108')) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_USERS;
  });

  // Products
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_products_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_orders_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(o => o.id === 'ORD-108')) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_ORDERS;
  });

  // Transactions Ledger
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_transactions_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(t => t.id === 'tx-s7')) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_TRANSACTIONS;
  });

  // Withdrawals
  const [withdrawals, setWithdrawals] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_withdrawals');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WITHDRAWALS;
  });

  // Global popup state for commission celebration/alert
  const [lastCommissionEvent, setLastCommissionEvent] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('directgrow_rules', JSON.stringify(commissionRules));
  }, [commissionRules]);

  useEffect(() => {
    localStorage.setItem('directgrow_users_v5', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('directgrow_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('directgrow_orders_v5', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('directgrow_transactions_v5', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('directgrow_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  // Compute depth from Root Sponsor Rohan Verma (usr-008 / DG10008)
  const getUserChainDepth = (codeOrId) => {
    if (!codeOrId) return 0;
    const clean = String(codeOrId).trim().toUpperCase();
    const startUser = users.find(u => u.id === codeOrId || u.referralCode?.toUpperCase() === clean);
    if (!startUser) return 0;
    if (startUser.id === 'usr-008' || startUser.id === 'usr-000' || startUser.referralCode === 'DG10008') return 0;

    let depth = 0;
    let current = startUser;
    while (current && current.sponsorCode && depth < 20) {
      depth++;
      if (current.sponsorCode.toUpperCase() === 'DG10008' || current.sponsorCode.toUpperCase() === 'DG10000') {
        break;
      }
      current = users.find(u => u.referralCode?.toUpperCase() === current.sponsorCode.toUpperCase());
    }
    return depth;
  };

  // Check if a referral code is already used by an existing downline member (1-time referral rule)
  const isReferralCodeUsed = (code) => {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    return users.some(u => u.sponsorCode && u.sponsorCode.trim().toUpperCase() === clean);
  };

  // Check if a member is eligible to refer
  // Strict Rules:
  // 0. Mandatory ₹2,000 membership activation package must be completed and active
  // 1. Level 8 is the terminal level in the 8-level system — Level 8 (Priya Sharma) CANNOT refer anyone!
  // 2. Strict 1-person limit — disabled once they have successfully referred 1 member.
  const canUserRefer = (codeOrId) => {
    if (!codeOrId) return false;
    const clean = String(codeOrId).trim().toUpperCase();
    const user = users.find(u => u.id === codeOrId || u.referralCode?.toUpperCase() === clean);
    if (!user) return false;

    // Rule 0: Mandatory ₹2,000 membership activation check
    if (user.membershipStatus === 'PENDING' || (!user.isActivated && !user.isQualified)) {
      return false;
    }

    // Rule 1: Level 8 is the terminal level of the 8-level chain -> CANNOT refer anyone
    const depth = getUserChainDepth(user.id);
    if (depth >= 8) {
      return false;
    }

    // Rule 2: In strict single-line chain, each member can refer only 1 person
    const hasReferred = users.some(u => u.sponsorCode && u.sponsorCode.trim().toUpperCase() === user.referralCode.toUpperCase());
    return !hasReferred;
  };

  // Get referral restriction reason
  const getReferralRestrictionReason = (codeOrId) => {
    if (!codeOrId) return null;
    const clean = String(codeOrId).trim().toUpperCase();
    const user = users.find(u => u.id === codeOrId || u.referralCode?.toUpperCase() === clean);
    if (!user) return null;

    if (user.membershipStatus === 'PENDING' || (!user.isActivated && !user.isQualified)) {
      return "PENDING_ACTIVATION";
    }

    const depth = getUserChainDepth(user.id);
    if (depth >= 8) {
      return "LEVEL_8_TERMINAL";
    }

    const referred = users.find(u => u.sponsorCode && u.sponsorCode.trim().toUpperCase() === user.referralCode.toUpperCase());
    if (referred) {
      return "QUOTA_USED";
    }

    return null;
  };

  // Get the single direct referral sponsored by this member (if any)
  const getDirectReferral = (codeOrId) => {
    if (!codeOrId) return null;
    const clean = String(codeOrId).trim().toUpperCase();
    const user = users.find(u => u.id === codeOrId || u.referralCode?.toUpperCase() === clean);
    if (!user) return null;
    return users.find(u => u.sponsorCode && u.sponsorCode.trim().toUpperCase() === user.referralCode.toUpperCase()) || null;
  };

  // Get the active tail member of the chain (the member currently eligible to refer)
  const getActiveChainTail = () => {
    let current = users.find(u => u.id === 'usr-008') || users[0];
    while (current) {
      // If current is already level 8, it cannot refer
      if (getUserChainDepth(current.id) >= 8) return current;
      const nextChild = users.find(u => u.sponsorCode && u.sponsorCode.toUpperCase() === current.referralCode.toUpperCase());
      if (!nextChild) return current;
      current = nextChild;
    }
    return users[users.length - 1];
  };

  // Get strict sequential single-line chain starting from a given user
  const getChainSequence = (startIdOrCode, maxDepth = 8) => {
    const sequence = [];
    const startUser = users.find(u => u.id === startIdOrCode || u.referralCode?.toUpperCase() === String(startIdOrCode).trim().toUpperCase());
    if (!startUser) return sequence;

    let current = startUser;
    let depth = 1;
    while (depth <= maxDepth) {
      const nextChild = users.find(u => u.sponsorCode && u.sponsorCode.toUpperCase() === current.referralCode.toUpperCase());
      if (!nextChild) break;
      const rule = commissionRules.levels.find(r => r.level === depth) || { percentage: 0, fixedAmount: 0 };
      
      const childOrders = orders.filter(o => o.userId === nextChild.id && o.status !== 'REFUNDED');
      const childPurchases = childOrders.reduce((sum, o) => sum + o.total, 0);
      const grandchild = users.find(u => u.sponsorCode && u.sponsorCode.toUpperCase() === nextChild.referralCode.toUpperCase());

      const depthFromRoot = getUserChainDepth(nextChild.id);
      const isLevel8 = depthFromRoot >= 8 || depth >= 8;
      const isPending = nextChild.membershipStatus === 'PENDING' || (!nextChild.isActivated && !nextChild.isQualified);

      sequence.push({
        level: depth,
        user: nextChild,
        rule,
        childPurchases,
        ordersCount: childOrders.length,
        referredMember: grandchild || null,
        canRefer: isLevel8 ? false : (isPending ? false : !grandchild),
        isTerminal: isLevel8,
        isPendingActivation: isPending,
        restrictionReason: isPending ? "PENDING_ACTIVATION" : (isLevel8 ? "LEVEL_8_TERMINAL" : (grandchild ? "QUOTA_USED" : null))
      });

      current = nextChild;
      depth++;
    }
    return sequence;
  };

  // Find user by code
  const getUserByCode = (code) => {
    if (!code) return null;
    return users.find(u => u.referralCode?.toUpperCase() === code.trim().toUpperCase()) || null;
  };

  // Find user by ID
  const getUserById = (id) => {
    if (!id) return null;
    return users.find(u => u.id === id) || null;
  };

  // Traverse up the chain to get up to 8 upline sponsors
  // Returns array of objects: { level: 1..8, user: uplineUser, rule: levelRule }
  const getUplineChain = (sponsorCode, maxLevels = 8) => {
    const chain = [];
    let currentCode = sponsorCode;
    let currentLevel = 1;

    while (currentCode && currentLevel <= maxLevels) {
      const uplineUser = getUserByCode(currentCode);
      if (!uplineUser) break;

      const rule = commissionRules.levels.find(l => l.level === currentLevel) || {
        level: currentLevel,
        percentage: 0,
        fixedAmount: 0
      };

      chain.push({
        level: currentLevel,
        user: uplineUser,
        rule
      });

      currentCode = uplineUser.sponsorCode;
      currentLevel++;
    }

    return chain;
  };

  // Get full 8-level downline tree for a given user
  // Returns structure: { level1: [...], level2: [...], ... level8: [...] }
  const getUserDownline = (userId) => {
    const targetUser = getUserById(userId);
    if (!targetUser) return { levels: {}, totalMembers: 0, totalSales: 0 };

    const levels = {};
    for (let i = 1; i <= 8; i++) {
      levels[i] = [];
    }

    // BFS or iterative collection
    let currentLevelCodes = [targetUser.referralCode];
    let levelNum = 1;

    while (currentLevelCodes.length > 0 && levelNum <= 8) {
      const nextLevelMembers = users.filter(u => u.sponsorCode && currentLevelCodes.includes(u.sponsorCode));
      levels[levelNum] = nextLevelMembers.map(m => {
        // Calculate member sales
        const memberOrders = orders.filter(o => o.userId === m.id && o.status !== 'REFUNDED');
        const memberSales = memberOrders.reduce((acc, curr) => acc + curr.total, 0);
        return {
          ...m,
          totalPurchases: memberSales,
          ordersCount: memberOrders.length
        };
      });

      currentLevelCodes = nextLevelMembers.map(m => m.referralCode);
      levelNum++;
    }

    let totalMembers = 0;
    for (let i = 1; i <= 8; i++) {
      totalMembers += levels[i].length;
    }

    return {
      levels,
      totalMembers
    };
  };

  // Calculate level-wise commission breakdown for a specific user
  const getUserLevelEarnings = (userId) => {
    const userTx = transactions.filter(t => t.userId === userId);
    const breakdown = {};

    for (let l = 1; l <= 8; l++) {
      breakdown[l] = {
        level: l,
        earned: 0,
        count: 0,
        transactions: []
      };
    }

    userTx.forEach(tx => {
      if (tx.level && breakdown[tx.level]) {
        if (tx.type === 'COMMISSION_CREDIT') {
          breakdown[tx.level].earned += tx.amount;
          breakdown[tx.level].count += 1;
          breakdown[tx.level].transactions.push(tx);
        } else if (tx.type === 'COMMISSION_REVERSED') {
          breakdown[tx.level].earned -= tx.amount;
          breakdown[tx.level].transactions.push(tx);
        }
      }
    });

    return breakdown;
  };

  // Register New Member into the Strict 8-Level Single-Line Chain
  const registerMember = (memberData) => {
    const rawSponsor = memberData.sponsorCode ? memberData.sponsorCode.trim().toUpperCase() : null;

    // Only validate sponsor code if a sponsor was provided
    if (rawSponsor && rawSponsor !== 'DIRECT' && rawSponsor !== 'NONE') {
      const sponsor = getUserByCode(rawSponsor);
      if (!sponsor) {
        return {
          success: false,
          message: `Sponsor referral code "${rawSponsor}" does not exist in the network.`
        };
      }

      // Strict Level 8 check: Level 8 is the terminal tier and cannot refer anyone
      const sponsorDepth = getUserChainDepth(sponsor.id);
      if (sponsorDepth >= 8) {
        return {
          success: false,
          message: `Sponsor ${sponsor.name} (${sponsor.referralCode}) is at Level 8 (the terminal level). In DirectGrow's strict 8-level system, Level 8 members cannot refer new members.`
        };
      }

      // Strict single-line check: verify if sponsor already referred someone
      const existingChild = users.find(u => u.sponsorCode && u.sponsorCode.trim().toUpperCase() === rawSponsor);
      if (existingChild) {
        return {
          success: false,
          message: `Sponsor ${sponsor.name} (${sponsor.referralCode}) has already referred ${existingChild.name}. In this strict single-line chain, each member can refer only one person. Their referral option is now disabled.`
        };
      }
    }

    // Generate unique code for new member
    const newCode = memberData.referralCode || `DG${Math.floor(20000 + Math.random() * 79999)}`;
    const newId = `usr-${Date.now().toString().slice(-6)}`;

    const newUser = {
      id: newId,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      referralCode: newCode,
      sponsorCode: (rawSponsor && rawSponsor !== 'DIRECT' && rawSponsor !== 'NONE') ? rawSponsor : null,
      rank: "Distributor (Pending)",
      membershipStatus: "PENDING", // PENDING until mandatory ₹2,000 package payment is verified
      isActivated: false,
      isQualified: false,
      hasFirstPurchase: false,
      referralCodeLocked: true,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(memberData.name)}`,
      wallet: {
        balance: 0,
        totalEarned: 0,
        pendingCommissions: 0,
        totalWithdrawn: 0
      },
      kyc: {
        status: "PENDING",
        pan: memberData.pan || "",
        aadhar: memberData.aadhar || "",
        bankVerified: false
      },
      bankDetails: {
        accountHolder: memberData.name,
        accountNumber: memberData.accountNumber || "",
        ifsc: memberData.ifsc || "",
        bankName: memberData.bankName || "",
        upiId: memberData.upiId || ""
      },
      address: {
        line: memberData.address || "Main Street",
        city: memberData.city || "New Delhi",
        state: memberData.state || "Delhi",
        pincode: memberData.pincode || "110001"
      }
    };

    setUsers(prev => [...prev, newUser]);
    return {
      success: true,
      user: newUser
    };
  };

  // Activate Membership upon completing the mandatory ₹2,000 package purchase
  const activateMembership = (userId, paymentDetails = {}) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    if (user.membershipStatus === 'ACTIVE' && user.isActivated) {
      return { success: true, message: "Membership is already active.", user };
    }

    // 1. Create ₹2,000 Activation Order with all included products
    const orderId = `ORD-ACT-${Date.now().toString().slice(-6)}`;
    const activationOrder = {
      id: orderId,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      date: new Date().toISOString(),
      items: (MEMBERSHIP_PACKAGE_DETAILS.includedProducts || []).map(p => ({
        productId: p.id,
        name: p.name,
        price: p.mrp,
        quantity: 1,
        image: p.image,
        category: p.category
      })),
      subtotal: MEMBERSHIP_PACKAGE_DETAILS.price,
      discount: 0,
      shipping: 0,
      total: 2000,
      isQualifying: true,
      status: "DELIVERED",
      paymentMethod: paymentDetails.method || "UPI",
      paymentStatus: "PAID",
      isMembershipActivation: true,
      shippingAddress: {
        line: user.address?.line || "Default Delivery Address",
        city: user.address?.city || "New Delhi",
        state: user.address?.state || "Delhi",
        pincode: user.address?.pincode || "110001"
      }
    };

    // 2. Mark user ACTIVE and qualified
    const updatedUser = {
      ...user,
      membershipStatus: "ACTIVE",
      isActivated: true,
      isQualified: true,
      hasFirstPurchase: true,
      rank: "Active Distributor",
      activatedAt: new Date().toISOString(),
      referralCodeLocked: false
    };

    const nextUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(nextUsers);
    try {
      localStorage.setItem('directgrow_users_v5', JSON.stringify(nextUsers));
    } catch (e) {}

    const nextOrders = [activationOrder, ...orders];
    setOrders(nextOrders);
    try {
      localStorage.setItem('directgrow_orders_v5', JSON.stringify(nextOrders));
    } catch (e) {}

    // 3. Process ₹2,000 Qualifying Order Payment to distribute ₹290 8-level commissions to uplines
    processOrderPayment(activationOrder, updatedUser);

    return {
      success: true,
      user: updatedUser,
      order: activationOrder
    };
  };

  // Process Order Payment & Distribute 8-Level Single-Line Referral Commissions
  // Triggered on EVERY purchase (first purchase AND all subsequent purchases)
  const processOrderPayment = (newOrder, customerUser) => {
    // 1. Payment & Order Verification
    if (!newOrder || !newOrder.total || newOrder.total <= 0) {
      return { success: false, message: "Invalid order amount or empty items" };
    }

    // 2. Duplicate Commission Prevention
    if (newOrder.commissionDistributed) {
      return newOrder;
    }
    const alreadyProcessed = orders.some(o => o.id === newOrder.id && o.commissionDistributed);
    if (alreadyProcessed) {
      return orders.find(o => o.id === newOrder.id) || newOrder;
    }

    const currentCustomer = users.find(u => u.id === customerUser?.id) || customerUser;
    const isQualifyingAmount = newOrder.total >= (commissionRules.fixedOrderAmount || commissionRules.qualifyingOrderAmount || 2000);

    let distributed = false;
    let distributionReport = [];
    let updatedUsers = [...users];
    const newTransactions = [];

    // Mark current customer as having made purchase and qualified
    updatedUsers = updatedUsers.map(u => {
      if (u.id === currentCustomer.id) {
        return {
          ...u,
          hasFirstPurchase: true,
          isQualified: isQualifyingAmount ? true : u.isQualified,
          rank: isQualifyingAmount ? "Active Qualifier" : u.rank
        };
      }
      return u;
    });

    // 3. Commission Calculation for FIRST PURCHASE AND ALL SUBSEQUENT PURCHASES
    if (currentCustomer.sponsorCode) {
      // Traverse up to 8 levels of uplines in the single-line chain
      const uplineChain = getUplineChain(currentCustomer.sponsorCode, 8);

      if (uplineChain.length > 0) {
        distributed = true;

        uplineChain.forEach(({ level, user: uplineUser, rule }) => {
          // Commission calculated according to configured level-wise percentage:
          // Level 1: 5%, Level 2: 3%, Level 3: 2%, Level 4: 1.5%, Level 5: 1%, Level 6: 1%, Level 7: 0.5%, Level 8: 0.5%
          const percentage = rule.percentage || 0;
          const commissionAmount = Math.round((newOrder.total * percentage) / 100);

          if (commissionAmount > 0) {
            // Credit upline wallet directly
            updatedUsers = updatedUsers.map(u => {
              if (u.id === uplineUser.id) {
                return {
                  ...u,
                  wallet: {
                    ...u.wallet,
                    balance: (u.wallet?.balance || 0) + commissionAmount,
                    totalEarned: (u.wallet?.totalEarned || 0) + commissionAmount
                  }
                };
              }
              return u;
            });

            // Create individual commission credit transaction in ledger
            const tx = {
              id: generateTxId(),
              userId: uplineUser.id,
              userName: uplineUser.name,
              amount: commissionAmount,
              type: "COMMISSION_CREDIT",
              level: level,
              fromUserId: currentCustomer.id,
              fromUserName: currentCustomer.name,
              fromUserCode: currentCustomer.referralCode,
              orderId: newOrder.id,
              orderTotal: newOrder.total,
              percentage: percentage,
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              status: "COMPLETED",
              description: `Level ${level} (${percentage}%) referral commission on purchase of ${formatCurrency(newOrder.total)} by ${currentCustomer.name} (${currentCustomer.referralCode})`
            };

            newTransactions.push(tx);
            distributionReport.push({
              level,
              userId: uplineUser.id,
              userName: uplineUser.name,
              userCode: uplineUser.referralCode,
              percentage: percentage,
              amount: commissionAmount
            });
          }
        });
      }
    }

    const finalizedOrder = {
      ...newOrder,
      status: "DELIVERED",
      isQualifying: isQualifyingAmount,
      commissionDistributed: distributed,
      distributedTotal: distributionReport.reduce((acc, curr) => acc + curr.amount, 0),
      distributionReport: distributionReport
    };

    setOrders(prev => [finalizedOrder, ...prev]);
    setUsers(updatedUsers);
    if (newTransactions.length > 0) {
      setTransactions(prev => [...newTransactions, ...prev]);
    }

    if (distributed) {
      setLastCommissionEvent({
        type: 'DISTRIBUTION',
        orderId: finalizedOrder.id,
        buyerName: currentCustomer.name,
        buyerCode: currentCustomer.referralCode,
        amount: finalizedOrder.total,
        distributionReport
      });
    }

    return finalizedOrder;
  };

  // Refund Order & Reverse Commissions across 8 levels
  const refundOrder = (orderId) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder || targetOrder.status === 'REFUNDED') return false;

    let updatedUsers = [...users];
    const reversalTxs = [];

    // Find all commission credits associated with this order
    const relatedCommissionTxs = transactions.filter(
      t => t.orderId === orderId && t.type === 'COMMISSION_CREDIT'
    );

    relatedCommissionTxs.forEach(cTx => {
      // Deduct from upline user's wallet
      updatedUsers = updatedUsers.map(u => {
        if (u.id === cTx.userId) {
          return {
            ...u,
            wallet: {
              ...u.wallet,
              balance: Math.max(0, (u.wallet.balance || 0) - cTx.amount),
              totalEarned: Math.max(0, (u.wallet.totalEarned || 0) - cTx.amount)
            }
          };
        }
        return u;
      });

      // Add clawback reversal transaction
      reversalTxs.push({
        id: generateTxId(),
        userId: cTx.userId,
        userName: cTx.userName,
        amount: cTx.amount,
        type: "COMMISSION_REVERSED",
        level: cTx.level,
        fromUserName: cTx.fromUserName,
        orderId: orderId,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: "COMPLETED",
        description: `Reversal of Level ${cTx.level} commission due to refund of order #${orderId}`
      });
    });

    // Mark order as refunded
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'REFUNDED' } : o));
    setTransactions(prev => [...reversalTxs, ...prev]);
    setUsers(updatedUsers);

    setLastCommissionEvent({
      type: 'REVERSAL',
      orderId: orderId,
      refundedAmount: targetOrder.total,
      reversalCount: relatedCommissionTxs.length,
      totalReversed: relatedCommissionTxs.reduce((a, b) => a + b.amount, 0)
    });

    return true;
  };

  // User requests wallet withdrawal
  const requestWithdrawal = (userId, amount, method, details) => {
    const user = getUserById(userId);
    if (!user) return { success: false, message: "User not found" };
    if ((user.wallet?.balance || 0) < amount) {
      return { success: false, message: "Insufficient wallet balance" };
    }
    if (amount < 200) {
      return { success: false, message: "Minimum withdrawal amount is ₹200" };
    }

    const newWithdrawal = {
      id: generateWithdrawalId(),
      userId: user.id,
      userName: user.name,
      userCode: user.referralCode,
      amount: Number(amount),
      method: method, // BANK_TRANSFER or UPI
      details: details,
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: "PENDING",
      processedAt: null,
      transactionRef: null
    };

    // Deduct available balance
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          wallet: {
            ...u.wallet,
            balance: u.wallet.balance - amount,
            totalWithdrawn: (u.wallet.totalWithdrawn || 0) + amount
          }
        };
      }
      return u;
    }));

    // Record transaction
    const debitTx = {
      id: generateTxId(),
      userId: user.id,
      userName: user.name,
      amount: Number(amount),
      type: "WITHDRAWAL_DEBIT",
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: "PENDING",
      description: `Withdrawal request #${newWithdrawal.id} via ${method}`
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);
    setTransactions(prev => [debitTx, ...prev]);

    return { success: true, withdrawal: newWithdrawal };
  };

  // Admin approves or rejects withdrawal
  const updateWithdrawalStatus = (withdrawalId, newStatus, transactionRef = "") => {
    const item = withdrawals.find(w => w.id === withdrawalId);
    if (!item) return false;

    // If rejected, refund the money back to user wallet
    if (newStatus === 'REJECTED' && item.status !== 'REJECTED') {
      setUsers(prev => prev.map(u => {
        if (u.id === item.userId) {
          return {
            ...u,
            wallet: {
              ...u.wallet,
              balance: (u.wallet.balance || 0) + item.amount,
              totalWithdrawn: Math.max(0, (u.wallet.totalWithdrawn || 0) - item.amount)
            }
          };
        }
        return u;
      }));

      // Add refund transaction
      const refundTx = {
        id: generateTxId(),
        userId: item.userId,
        userName: item.userName,
        amount: item.amount,
        type: "WITHDRAWAL_REFUNDED",
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: "COMPLETED",
        description: `Refunded rejected withdrawal #${item.id} to wallet`
      };
      setTransactions(prev => [refundTx, ...prev]);
    }

    setWithdrawals(prev => prev.map(w => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status: newStatus,
          processedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          transactionRef: transactionRef || (newStatus === 'PROCESSED' ? `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}` : null)
        };
      }
      return w;
    }));

    return true;
  };

  // Update commission rules from admin
  const updateCommissionRules = (newRules) => {
    setCommissionRules(newRules);
  };

  // Reset to the exact Reference ₹290 / 8-Level Model
  const resetCommissionRules = () => {
    setCommissionRules(DEFAULT_COMMISSION_RULES);
  };

  // Product CRUD
  const addProduct = (prodData) => {
    const newProd = {
      ...prodData,
      id: `prod-${Date.now().toString().slice(-6)}`,
      slug: prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 4.8,
      reviewsCount: 1,
      inStock: true
    };
    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <MLMContext.Provider
      value={{
        commissionRules,
        updateCommissionRules,
        resetCommissionRules,
        users,
        products,
        orders,
        transactions,
        withdrawals,
        getUserByCode,
        getUserById,
        getUplineChain,
        getUserDownline,
        getUserLevelEarnings,
        getUserChainDepth,
        getReferralRestrictionReason,
        isReferralCodeUsed,
        canUserRefer,
        getDirectReferral,
        getActiveChainTail,
        getChainSequence,
        registerMember,
        activateMembership,
        MEMBERSHIP_PACKAGE_DETAILS,
        processOrderPayment,
        refundOrder,
        requestWithdrawal,
        updateWithdrawalStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        lastCommissionEvent,
        setLastCommissionEvent
      }}
    >
      {children}
    </MLMContext.Provider>
  );
};

export const useMLM = () => {
  const context = useContext(MLMContext);
  if (!context) throw new Error("useMLM must be used within an MLMProvider");
  return context;
};

