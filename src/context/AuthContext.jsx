import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';

const AuthContext = createContext();

export const ADMIN_USER = {
  id: "admin-root",
  name: "DirectGrow Super Admin",
  email: "admin@directgrow.com",
  phone: "+91 1800-AYUR-GROW",
  role: "ADMIN",
  rank: "System Administrator",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

export const AuthProvider = ({ children }) => {
  // Default to Rohan Verma (usr-008) so the tester is immediately logged in as an active distributor,
  // or can easily switch between any upline sponsor or admin.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_current_user_v5');
      if (saved) {
        let parsed = JSON.parse(saved);
        // Hydrate latest wallet directly from directgrow_users_v5 to prevent stale wallet values
        const usersSaved = localStorage.getItem('directgrow_users_v5');
        if (usersSaved) {
          try {
            const allUsers = JSON.parse(usersSaved);
            const match = allUsers.find(u => u.id === parsed.id || u.referralCode === parsed.referralCode);
            if (match) {
              parsed = { ...parsed, ...match };
            }
          } catch (e) {}
        }
        // If user has placed any order or has made first purchase or is qualified, guarantee ACTIVE status
        const ordersSaved = localStorage.getItem('directgrow_orders_v5');
        let hasOrder = false;
        if (ordersSaved) {
          try {
            const allOrders = JSON.parse(ordersSaved);
            if (Array.isArray(allOrders) && allOrders.some(o => o.userId === parsed.id)) {
              hasOrder = true;
            }
          } catch (e) {}
        }
        if (parsed?.id === 'usr-008') {
          const fresh = INITIAL_USERS.find(u => u.id === 'usr-008');
          if (fresh) return { ...fresh, ...parsed, name: "Rohan Verma", wallet: parsed.wallet || fresh.wallet, isQualified: true, membershipStatus: 'ACTIVE', isActivated: true, referralCodeLocked: false };
        }
        if (parsed?.id !== 'usr-109' && (parsed?.isQualified || parsed?.hasFirstPurchase || hasOrder || parsed?.membershipStatus === 'ACTIVE')) {
          return { ...parsed, membershipStatus: 'ACTIVE', isActivated: true, isQualified: true, hasFirstPurchase: true, referralCodeLocked: false };
        }
        return parsed;
      }
    } catch (e) {}
    // Default active user is usr-008 (Rohan Verma) with full 8-level tree
    return INITIAL_USERS.find(u => u.id === 'usr-008') || INITIAL_USERS[0];
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('directgrow_current_user_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.role === 'ADMIN';
      }
    } catch (e) {}
    return false;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('directgrow_current_user_v5', JSON.stringify(currentUser));
      setIsAdmin(currentUser.role === 'ADMIN');
    } else {
      localStorage.removeItem('directgrow_current_user_v5');
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Synchronize across multiple browser tabs and restore on tab focus / visibility return
  useEffect(() => {
    const syncUserFromStorage = () => {
      try {
        const saved = localStorage.getItem('directgrow_current_user_v5');
        if (saved) {
          let parsed = JSON.parse(saved);
          const usersSaved = localStorage.getItem('directgrow_users_v5');
          if (usersSaved) {
            try {
              const allUsers = JSON.parse(usersSaved);
              const match = allUsers.find(u => u.id === parsed.id || u.referralCode === parsed.referralCode);
              if (match) {
                parsed = { ...parsed, ...match };
              }
            } catch (e) {}
          }
          const ordersSaved = localStorage.getItem('directgrow_orders_v5');
          let hasOrder = false;
          if (ordersSaved) {
            try {
              const allOrders = JSON.parse(ordersSaved);
              if (Array.isArray(allOrders) && allOrders.some(o => o.userId === parsed.id)) {
                hasOrder = true;
              }
            } catch (e) {}
          }
          if (parsed?.id !== 'usr-109' && (parsed?.isQualified || parsed?.hasFirstPurchase || hasOrder || parsed?.membershipStatus === 'ACTIVE')) {
            parsed = { ...parsed, membershipStatus: 'ACTIVE', isActivated: true, isQualified: true, hasFirstPurchase: true, referralCodeLocked: false };
          }
          setCurrentUser(prev => {
            if (
              !prev || 
              prev.id !== parsed.id || 
              prev.referralCode !== parsed.referralCode ||
              prev.wallet?.totalEarned !== parsed.wallet?.totalEarned ||
              prev.wallet?.balance !== parsed.wallet?.balance
            ) {
              return parsed;
            }
            return prev;
          });
          setIsAdmin(parsed?.role === 'ADMIN');
        }
      } catch (e) {}
    };

    const handleStorageChange = (e) => {
      if (e.key === 'directgrow_current_user_v5') {
        syncUserFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncUserFromStorage);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncUserFromStorage();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncUserFromStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const login = (identifier, password) => {
    const clean = identifier.trim().toLowerCase();
    if (clean === 'admin@directgrow.com' || clean === 'admin') {
      setCurrentUser(ADMIN_USER);
      try {
        localStorage.setItem('directgrow_current_user_v5', JSON.stringify(ADMIN_USER));
      } catch (e) {}
      return { success: true, user: ADMIN_USER };
    }

    // Try finding by name, email, or referral code in localStorage users or initial users
    let allUsers = INITIAL_USERS;
    try {
      const stored = localStorage.getItem('directgrow_users_v5');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) allUsers = parsed;
      }
    } catch (e) {}

    // 1. Exact match on email, referral code, or full name
    let found = allUsers.find(
      u => u.email?.toLowerCase() === clean || 
           u.referralCode?.toLowerCase() === clean ||
           u.name?.toLowerCase() === clean ||
           (u.phone && u.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, ''))
    );

    // 2. Partial match on name (e.g. typing "Rohan" matches "Rohan Verma", or "Sunita" matches "Sunita Patel")
    if (!found) {
      found = allUsers.find(
        u => u.name?.toLowerCase().includes(clean) || clean.includes(u.name?.toLowerCase())
      );
    }

    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem('directgrow_current_user_v5', JSON.stringify(found));
      } catch (e) {}
      return { success: true, user: found };
    }

    return { success: false, message: "Invalid name, email address, or referral code. Please check and try again." };
  };

  const loginAsAdmin = () => {
    setCurrentUser(ADMIN_USER);
    try {
      localStorage.setItem('directgrow_current_user_v5', JSON.stringify(ADMIN_USER));
    } catch (e) {}
  };

  const loginAsUser = (userOrId) => {
    let allUsers = INITIAL_USERS;
    try {
      const stored = localStorage.getItem('directgrow_users_v5') || localStorage.getItem('directgrow_users_v4');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) allUsers = parsed;
      }
    } catch (e) {}

    let target = null;
    if (typeof userOrId === 'string') {
      const clean = userOrId.trim().toLowerCase();
      target = allUsers.find(u => 
        u.id === userOrId || 
        u.referralCode?.toLowerCase() === clean ||
        u.name?.toLowerCase() === clean ||
        u.name?.toLowerCase().includes(clean)
      );
    } else if (userOrId) {
      target = userOrId;
    }

    if (target) {
      setCurrentUser(target);
      try {
        localStorage.setItem('directgrow_current_user_v5', JSON.stringify(target));
      } catch (e) {}
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAdmin,
        login,
        loginAsAdmin,
        loginAsUser,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

