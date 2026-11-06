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
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'usr-008') {
          const fresh = INITIAL_USERS.find(u => u.id === 'usr-008');
          if (fresh) return { ...fresh, ...parsed, name: "Rohan Verma", wallet: fresh.wallet, isQualified: true };
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

  const login = (identifier, password) => {
    const clean = identifier.trim().toLowerCase();
    if (clean === 'admin@directgrow.com' || clean === 'admin') {
      setCurrentUser(ADMIN_USER);
      return { success: true, user: ADMIN_USER };
    }

    // Try finding by email or referral code in localStorage users or initial users
    let allUsers = INITIAL_USERS;
    try {
      const stored = localStorage.getItem('directgrow_users_v5');
      if (stored) allUsers = JSON.parse(stored);
    } catch (e) {}

    const found = allUsers.find(
      u => u.email.toLowerCase() === clean || u.referralCode.toLowerCase() === clean
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }

    return { success: false, message: "Invalid email, referral code, or credentials." };
  };

  const loginAsAdmin = () => {
    setCurrentUser(ADMIN_USER);
  };

  const loginAsUser = (userOrId) => {
    if (typeof userOrId === 'string') {
      let allUsers = INITIAL_USERS;
      try {
        const stored = localStorage.getItem('directgrow_users_v5') || localStorage.getItem('directgrow_users_v4');
        if (stored) allUsers = JSON.parse(stored);
      } catch (e) {}
      const target = allUsers.find(u => u.id === userOrId);
      if (target) {
        setCurrentUser(target);
      }
    } else if (userOrId) {
      setCurrentUser(userOrId);
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

