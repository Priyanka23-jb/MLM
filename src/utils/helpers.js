// Helper utilities

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return dateString;
  }
};

export const generateReferralCode = (existingUsers = []) => {
  const existingCodes = new Set(existingUsers.map(u => u.referralCode));
  let code = "";
  do {
    const rand = Math.floor(10000 + Math.random() * 90000);
    code = `DG${rand}`;
  } while (existingCodes.has(code));
  return code;
};

export const generateOrderId = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${rand}`;
};

export const generateTxId = () => {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `TX-${rand}`;
};

export const generateWithdrawalId = () => {
  const rand = Math.floor(100 + Math.random() * 900);
  return `WTH-${rand}`;
};

