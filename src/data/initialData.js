// Initial Seed Data for DirectGrow 8-Level Single-Line Referral Platform

export const DEFAULT_COMMISSION_RULES = {
  fixedOrderAmount: 2000, // ₹2,000 qualifying first purchase threshold
  totalDistributed: 290,  // ₹290 total distributed (14.5%)
  levels: [
    { level: 1, percentage: 5.0, fixedAmount: 100, label: "Direct Referral (1st Gen)" },
    { level: 2, percentage: 3.0, fixedAmount: 60,  label: "2nd Generation Downline" },
    { level: 3, percentage: 2.0, fixedAmount: 40,  label: "3rd Generation Downline" },
    { level: 4, percentage: 1.5, fixedAmount: 30,  label: "4th Generation Downline" },
    { level: 5, percentage: 1.0, fixedAmount: 20,  label: "5th Generation Downline" },
    { level: 6, percentage: 1.0, fixedAmount: 20,  label: "6th Generation Downline" },
    { level: 7, percentage: 0.5, fixedAmount: 10,  label: "7th Generation Downline" },
    { level: 8, percentage: 0.5, fixedAmount: 10,  label: "8th Generation Downline" }
  ]
};

// =======================================================================
// INITIAL USERS: SINGLE-LINE 1-TIME REFERRAL ENGINE
// In this model, each person can refer ONLY ONCE (single-use referral code).
// Rohan Verma (DG10008) has 8 names under him (1 per level: Sunita -> Priya).
// Sunita Patel (DG20001) has 8 names under her (1 per level: Amit -> Rahul).
// =======================================================================
export const INITIAL_USERS = [
  // 1. Company Root Founder
  {
    id: "usr-000",
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@directgrow.com",
    phone: "+91 98201 11000",
    referralCode: "DG10000",
    sponsorCode: null,
    rank: "Crown Diamond Ambassador",
    joinedDate: "2025-01-10",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 14580, totalEarned: 28450, pendingCommissions: 0, totalWithdrawn: 13870 },
    kyc: { status: "VERIFIED", pan: "ABCDE1234F", aadhar: "XXXX-XXXX-8921", bankVerified: true },
    bankDetails: { accountHolder: "Dr. Rajesh Sharma", accountNumber: "910283746501", ifsc: "HDFC0000123", bankName: "HDFC Bank", upiId: "rajesh.sharma@okhdfcbank" },
    address: { line: "102, Green Park Avenue", city: "Mumbai", state: "Maharashtra", pincode: "400050" }
  },

  // 2. Primary Logged-in Distributor: Rohan Verma
  // Has 8 names under him (Level 1: Sunita -> Level 8: Priya Sharma)
  {
    id: "usr-008",
    name: "Rohan Verma",
    email: "rohan.v@example.com",
    phone: "+91 98209 99008",
    referralCode: "DG10008",
    sponsorCode: "DG10000",
    rank: "Active Distributor",
    joinedDate: "2025-08-01",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    wallet: {
      balance: 290,
      totalEarned: 290,
      pendingCommissions: 0,
      totalWithdrawn: 0
    },
    kyc: { status: "VERIFIED", pan: "IJKLM9012N", aadhar: "XXXX-XXXX-2233", bankVerified: true },
    bankDetails: { accountHolder: "Rohan Verma", accountNumber: "765432109876", ifsc: "MAHB0000431", bankName: "Bank of Maharashtra", upiId: "rohanverma@okmahb" },
    address: { line: "Plot 42, Shivaji Nagar", city: "Pune", state: "Maharashtra", pincode: "411005" }
  },

  // 3. Level 1 under Rohan: Sunita Patel
  {
    id: "usr-101",
    name: "Sunita Patel",
    email: "sunita.p@example.com",
    phone: "+91 98201 11001",
    referralCode: "DG20001",
    sponsorCode: "DG10008", // Sponsored by Rohan Verma
    rank: "Executive Leader",
    joinedDate: "2025-08-05",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 280, totalEarned: 280, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "BCDEF2001A", aadhar: "XXXX-XXXX-1001", bankVerified: true },
    bankDetails: { accountHolder: "Sunita Patel", accountNumber: "100200300101", ifsc: "SBIN0001234", bankName: "State Bank of India", upiId: "sunitapatel@oksbi" },
    address: { line: "B-404, Shivalik Heights", city: "Ahmedabad", state: "Gujarat", pincode: "380015" }
  },

  // 4. Level 2 under Rohan, Level 1 under Sunita: Amit Verma
  {
    id: "usr-102",
    name: "Amit Verma",
    email: "amit.v@example.com",
    phone: "+91 98202 22002",
    referralCode: "DG20002",
    sponsorCode: "DG20001", // Sponsored by Sunita Patel
    rank: "Senior Distributor",
    joinedDate: "2025-08-12",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 270, totalEarned: 270, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "CDEFG2002B", aadhar: "XXXX-XXXX-1002", bankVerified: true },
    bankDetails: { accountHolder: "Amit Verma", accountNumber: "100200300102", ifsc: "ICIC0002345", bankName: "ICICI Bank", upiId: "amitverma@icici" },
    address: { line: "15, Civil Lines", city: "Jaipur", state: "Rajasthan", pincode: "302006" }
  },

  // 5. Level 3 under Rohan, Level 2 under Sunita: Pooja Hegde
  {
    id: "usr-103",
    name: "Pooja Hegde",
    email: "pooja.h@example.com",
    phone: "+91 98203 33003",
    referralCode: "DG20003",
    sponsorCode: "DG20002", // Sponsored by Amit Verma
    rank: "Distributor Leader",
    joinedDate: "2025-08-20",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 250, totalEarned: 250, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "DEFGH2003C", pan: "DEFGH2003C", aadhar: "XXXX-XXXX-1003", bankVerified: true },
    bankDetails: { accountHolder: "Pooja Hegde", accountNumber: "100200300103", ifsc: "UTIB0003456", bankName: "Axis Bank", upiId: "pooja.h@axis" },
    address: { line: "78, Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034" }
  },

  // 6. Level 4 under Rohan, Level 3 under Sunita: Vikram Malhotra
  {
    id: "usr-104",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 98204 44004",
    referralCode: "DG20004",
    sponsorCode: "DG20003", // Sponsored by Pooja Hegde
    rank: "Distributor",
    joinedDate: "2025-08-28",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 220, totalEarned: 220, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "EFGHI2004D", aadhar: "XXXX-XXXX-1004", bankVerified: true },
    bankDetails: { accountHolder: "Vikram Malhotra", accountNumber: "100200300104", ifsc: "KKBK0004567", bankName: "Kotak Mahindra Bank", upiId: "vikram.m@kotak" },
    address: { line: "C-12, Defence Colony", city: "New Delhi", state: "Delhi", pincode: "110024" }
  },

  // 7. Level 5 under Rohan, Level 4 under Sunita: Neha Singhania
  {
    id: "usr-105",
    name: "Neha Singhania",
    email: "neha.s@example.com",
    phone: "+91 98205 55005",
    referralCode: "DG20005",
    sponsorCode: "DG20004", // Sponsored by Vikram Malhotra
    rank: "Distributor",
    joinedDate: "2025-09-05",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 180, totalEarned: 180, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "FGHIJ2005E", aadhar: "XXXX-XXXX-1005", bankVerified: true },
    bankDetails: { accountHolder: "Neha Singhania", accountNumber: "100200300105", ifsc: "BARB0VJNAR", bankName: "Bank of Baroda", upiId: "neha.s@baroda" },
    address: { line: "45, Park Street", city: "Kolkata", state: "West Bengal", pincode: "700016" }
  },

  // 8. Level 6 under Rohan, Level 5 under Sunita: Karan Kapoor
  {
    id: "usr-106",
    name: "Karan Kapoor",
    email: "karan.k@example.com",
    phone: "+91 98206 66006",
    referralCode: "DG20006",
    sponsorCode: "DG20005", // Sponsored by Neha Singhania
    rank: "Distributor",
    joinedDate: "2025-09-15",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 130, totalEarned: 130, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "GHIJK2006F", aadhar: "XXXX-XXXX-1006", bankVerified: true },
    bankDetails: { accountHolder: "Karan Kapoor", accountNumber: "100200300106", ifsc: "PUNB0123400", bankName: "Punjab National Bank", upiId: "karan.k@pnb" },
    address: { line: "Sector 17, Model Town", city: "Chandigarh", state: "Punjab", pincode: "160017" }
  },

  // 9. Level 7 under Rohan, Level 6 under Sunita: Meera Nair
  {
    id: "usr-107",
    name: "Meera Nair",
    email: "meera.n@example.com",
    phone: "+91 98207 77007",
    referralCode: "DG20007",
    sponsorCode: "DG20006", // Sponsored by Karan Kapoor
    rank: "Distributor",
    joinedDate: "2025-09-25",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 100, totalEarned: 100, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "HIJKL2007G", aadhar: "XXXX-XXXX-1007", bankVerified: true },
    bankDetails: { accountHolder: "Meera Nair", accountNumber: "100200300107", ifsc: "FDRL0001122", bankName: "Federal Bank", upiId: "meeranair@federal" },
    address: { line: "12, Marine Drive", city: "Kochi", state: "Kerala", pincode: "682011" }
  },

  // 10. Level 8 under Rohan: Priya Sharma
  // (THE LAST MEMBER IN THE CHAIN - CANNOT REFER ANYONE!)
  {
    id: "usr-108",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+91 98208 88008",
    referralCode: "DG20008",
    sponsorCode: "DG20007", // Sponsored by Meera Nair
    rank: "Distributor",
    joinedDate: "2025-10-05",
    isQualified: true,
    hasFirstPurchase: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 0, totalEarned: 0, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "VERIFIED", pan: "IJKLM2008H", aadhar: "XXXX-XXXX-1008", bankVerified: true },
    bankDetails: { accountHolder: "Priya Sharma", accountNumber: "100200300108", ifsc: "MAHB0000432", bankName: "Bank of Maharashtra", upiId: "priya.s@mahb" },
    address: { line: "88, Salt Lake Sector 1", city: "Kolkata", state: "West Bengal", pincode: "700064" }
  },

  // 11. Test Persona: Pending Member (Unpaid ₹2,000 Mandatory Activation Package)
  // Not qualified, membershipStatus: 'PENDING', isActivated: false, referral code locked
  {
    id: "usr-109",
    name: "Arjun Verma (Pending)",
    email: "arjun.pending@example.com",
    phone: "+91 98209 99009",
    referralCode: "DG20009",
    sponsorCode: "DG20007",
    rank: "Pending Member",
    membershipStatus: "PENDING",
    isActivated: false,
    referralCodeLocked: true,
    joinedDate: "2026-11-06",
    isQualified: false,
    hasFirstPurchase: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    wallet: { balance: 0, totalEarned: 0, pendingCommissions: 0, totalWithdrawn: 0 },
    kyc: { status: "PENDING", pan: "", aadhar: "", bankVerified: false },
    bankDetails: { accountHolder: "Arjun Verma", accountNumber: "", ifsc: "", bankName: "", upiId: "" },
    address: { line: "14, Civil Lines Road", city: "Jaipur", state: "Rajasthan", pincode: "302006" }
  }
];

// =======================================================================
// INITIAL TRANSACTIONS: COMMISSION CREDITS ACROSS 8 TIERS
// =======================================================================
export const INITIAL_TRANSACTIONS = [
  // Rohan Verma's 8 Levels Commissions (Total: ₹290)
  {
    id: "tx-r1",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 100,
    type: "COMMISSION_CREDIT",
    level: 1,
    fromUserName: "Sunita Patel",
    fromUserCode: "DG20001",
    orderId: "ORD-101",
    date: "2025-08-05 14:30",
    status: "COMPLETED",
    description: "Level 1 (5%) Direct Sponsor commission from Sunita Patel"
  },
  {
    id: "tx-r2",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 60,
    type: "COMMISSION_CREDIT",
    level: 2,
    fromUserName: "Amit Verma",
    fromUserCode: "DG20002",
    orderId: "ORD-102",
    date: "2025-08-12 16:15",
    status: "COMPLETED",
    description: "Level 2 (3%) 2nd Gen commission from Amit Verma"
  },
  {
    id: "tx-r3",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 40,
    type: "COMMISSION_CREDIT",
    level: 3,
    fromUserName: "Pooja Hegde",
    fromUserCode: "DG20003",
    orderId: "ORD-103",
    date: "2025-08-20 11:20",
    status: "COMPLETED",
    description: "Level 3 (2%) 3rd Gen commission from Pooja Hegde"
  },
  {
    id: "tx-r4",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 30,
    type: "COMMISSION_CREDIT",
    level: 4,
    fromUserName: "Vikram Malhotra",
    fromUserCode: "DG20004",
    orderId: "ORD-104",
    date: "2025-08-28 15:40",
    status: "COMPLETED",
    description: "Level 4 (1.5%) 4th Gen commission from Vikram Malhotra"
  },
  {
    id: "tx-r5",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 20,
    type: "COMMISSION_CREDIT",
    level: 5,
    fromUserName: "Neha Singhania",
    fromUserCode: "DG20005",
    orderId: "ORD-105",
    date: "2025-09-05 10:10",
    status: "COMPLETED",
    description: "Level 5 (1%) 5th Gen commission from Neha Singhania"
  },
  {
    id: "tx-r6",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 20,
    type: "COMMISSION_CREDIT",
    level: 6,
    fromUserName: "Karan Kapoor",
    fromUserCode: "DG20006",
    orderId: "ORD-106",
    date: "2025-09-15 13:25",
    status: "COMPLETED",
    description: "Level 6 (1%) 6th Gen commission from Karan Kapoor"
  },
  {
    id: "tx-r7",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 10,
    type: "COMMISSION_CREDIT",
    level: 7,
    fromUserName: "Meera Nair",
    fromUserCode: "DG20007",
    orderId: "ORD-107",
    date: "2025-09-25 17:50",
    status: "COMPLETED",
    description: "Level 7 (0.5%) 7th Gen commission from Meera Nair"
  },
  {
    id: "tx-r8",
    userId: "usr-008",
    userName: "Rohan Verma",
    amount: 10,
    type: "COMMISSION_CREDIT",
    level: 8,
    fromUserName: "Priya Sharma",
    fromUserCode: "DG20008",
    orderId: "ORD-108",
    date: "2025-10-05 12:05",
    status: "COMPLETED",
    description: "Level 8 (0.5%) 8th Gen commission from Priya Sharma"
  },

  // Sunita Patel's 8 Levels Commissions (Total: ₹290)
  {
    id: "tx-s1",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 100,
    type: "COMMISSION_CREDIT",
    level: 1,
    fromUserName: "Amit Verma",
    fromUserCode: "DG20002",
    orderId: "ORD-102",
    date: "2025-08-12 16:15",
    status: "COMPLETED",
    description: "Level 1 (5%) Direct Sponsor commission from Amit Verma"
  },
  {
    id: "tx-s2",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 60,
    type: "COMMISSION_CREDIT",
    level: 2,
    fromUserName: "Pooja Hegde",
    fromUserCode: "DG20003",
    orderId: "ORD-103",
    date: "2025-08-20 11:20",
    status: "COMPLETED",
    description: "Level 2 (3%) 2nd Gen commission from Pooja Hegde"
  },
  {
    id: "tx-s3",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 40,
    type: "COMMISSION_CREDIT",
    level: 3,
    fromUserName: "Vikram Malhotra",
    fromUserCode: "DG20004",
    orderId: "ORD-104",
    date: "2025-08-28 15:40",
    status: "COMPLETED",
    description: "Level 3 (2%) 3rd Gen commission from Vikram Malhotra"
  },
  {
    id: "tx-s4",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 30,
    type: "COMMISSION_CREDIT",
    level: 4,
    fromUserName: "Neha Singhania",
    fromUserCode: "DG20005",
    orderId: "ORD-105",
    date: "2025-09-05 10:10",
    status: "COMPLETED",
    description: "Level 4 (1.5%) 4th Gen commission from Neha Singhania"
  },
  {
    id: "tx-s5",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 20,
    type: "COMMISSION_CREDIT",
    level: 5,
    fromUserName: "Karan Kapoor",
    fromUserCode: "DG20006",
    orderId: "ORD-106",
    date: "2025-09-15 13:25",
    status: "COMPLETED",
    description: "Level 5 (1%) 5th Gen commission from Karan Kapoor"
  },
  {
    id: "tx-s6",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 20,
    type: "COMMISSION_CREDIT",
    level: 6,
    fromUserName: "Meera Nair",
    fromUserCode: "DG20007",
    orderId: "ORD-107",
    date: "2025-09-25 17:50",
    status: "COMPLETED",
    description: "Level 6 (1%) 6th Gen commission from Meera Nair"
  },
  {
    id: "tx-s7",
    userId: "usr-101",
    userName: "Sunita Patel",
    amount: 10,
    type: "COMMISSION_CREDIT",
    level: 7,
    fromUserName: "Priya Sharma",
    fromUserCode: "DG20008",
    orderId: "ORD-108",
    date: "2025-10-05 12:05",
    status: "COMPLETED",
    description: "Level 7 (0.5%) 7th Gen commission from Priya Sharma"
  }
];

// =======================================================================
// INITIAL ORDERS: QUALIFYING ORDERS
// =======================================================================
export const INITIAL_ORDERS = [
  { id: "ORD-101", userId: "usr-101", userName: "Sunita Patel", date: "2025-08-05 14:30" },
  { id: "ORD-102", userId: "usr-102", userName: "Amit Verma", date: "2025-08-12 16:15" },
  { id: "ORD-103", userId: "usr-103", userName: "Pooja Hegde", date: "2025-08-20 11:20" },
  { id: "ORD-104", userId: "usr-104", userName: "Vikram Malhotra", date: "2025-08-28 15:40" },
  { id: "ORD-105", userId: "usr-105", userName: "Neha Singhania", date: "2025-09-05 10:10" },
  { id: "ORD-106", userId: "usr-106", userName: "Karan Kapoor", date: "2025-09-15 13:25" },
  { id: "ORD-107", userId: "usr-107", userName: "Meera Nair", date: "2025-09-25 17:50" },
  { id: "ORD-108", userId: "usr-108", userName: "Priya Sharma", date: "2025-10-05 12:05" }
].map(o => ({
  id: o.id,
  userId: o.userId,
  userName: o.userName,
  items: [{ productId: "prod-starter-pack", name: "Starter Pack", price: 2000, quantity: 1, image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80" }],
  subtotal: 2000,
  discount: 0,
  shipping: 0,
  total: 2000,
  isQualifying: true,
  commissionDistributed: true,
  distributedTotal: 290,
  status: "DELIVERED",
  paymentMethod: "UPI",
  createdAt: o.date,
  shippingAddress: { name: o.userName, phone: "+91 98000 00000", address: "Main Road", city: "Pune", state: "Maharashtra", pincode: "411001" }
}));

// Initial Withdrawal Requests Seed
export const INITIAL_WITHDRAWALS = [
  {
    id: "WTH-501",
    userId: "usr-000",
    userName: "Dr. Rajesh Sharma",
    userCode: "DG10000",
    amount: 2500,
    method: "BANK_TRANSFER",
    details: "HDFC A/C: 910283746501 (IFSC: HDFC0000123)",
    requestedAt: "2025-10-20 11:20",
    status: "PROCESSED",
    processedAt: "2025-10-21 15:45",
    transactionRef: "UTR98327491024"
  }
];
