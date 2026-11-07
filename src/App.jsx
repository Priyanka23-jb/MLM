import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MLMProvider } from './context/MLMContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CommissionCelebrationModal } from './components/common/CommissionCelebrationModal';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { JoinNowPage } from './pages/JoinNowPage';
import { MembershipActivationPage } from './pages/MembershipActivationPage';
import { LoginPage } from './pages/LoginPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <ScrollToTop />
      
      {/* Show Public Navbar on all public pages except dedicated /account, /wallet and full-screen /login */}
      {!isAdminRoute && location.pathname !== '/account' && location.pathname !== '/wallet' && location.pathname !== '/login' && <Navbar />}

      {/* Main Routed Page Content */}
      <main className="flex-1">
        <Routes>
          {/* Public Customer Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/join" element={<JoinNowPage />} />
          <Route path="/activate" element={<MembershipActivationPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Removed screens gracefully redirect to home */}
          <Route path="/opportunity" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Navigate to="/" replace />} />
          <Route path="/privacy" element={<Navigate to="/" replace />} />
          <Route path="/terms" element={<Navigate to="/" replace />} />

          {/* Integrated Public Customer Account & Wallet Module */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wallet" element={<AccountPage initialTab="wallet" />} />

          {/* Private Administrator Dashboard */}
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </main>

      {/* Show Public Footer on all public pages except dedicated dashboards & full-screen /login */}
      {!isAdminRoute && location.pathname !== '/account' && location.pathname !== '/wallet' && location.pathname !== '/login' && <Footer />}

      {/* Global Interactive Testing & Commission Modals */}
      <CommissionCelebrationModal />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MLMProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </MLMProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

