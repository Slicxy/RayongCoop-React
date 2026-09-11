import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Layout
import TopBar from './components/layout/TopBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import QuickActionDock from './components/layout/QuickActionDock';
import AuthModal from './components/member/AuthModal';
import CampaignModal from './components/common/CampaignModal';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BoardPage from './pages/BoardPage';
import StatisticsPage from './pages/StatisticsPage';
import DepositsPage from './pages/DepositsPage';
import LoansPage from './pages/LoansPage';
import CalculatorPage from './pages/CalculatorPage';
import LoanChecklistPage from './pages/LoanChecklistPage';
import WelfarePage from './pages/WelfarePage';
import EServicePage from './pages/EServicePage';
import DocumentsPage from './pages/DocumentsPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import VerifyReceiptPage from './pages/VerifyReceiptPage';
import MemberDashboardPage from './pages/MemberDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top component on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <TopBar />
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          
          <Route path="/deposits" element={<DepositsPage />} />
          <Route path="/rates" element={<DepositsPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/loan-checklist" element={<LoanChecklistPage />} />
          <Route path="/loan-readiness" element={<LoanChecklistPage />} />
          <Route path="/loans/checklist" element={<LoanChecklistPage />} />
          <Route path="/dividend-estimator" element={<CalculatorPage />} />
          
          <Route path="/welfare" element={<WelfarePage />} />
          <Route path="/eservice" element={<EServicePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/announcements" element={<NewsPage />} />
          <Route path="/events" element={<NewsPage />} />
          <Route path="/calendar" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/complaints" element={<ContactPage />} />
          <Route path="/faqs" element={<ContactPage />} />
          
          <Route path="/verify-receipt" element={<VerifyReceiptPage />} />
          <Route path="/verify-receipt/:token" element={<VerifyReceiptPage />} />
          
          <Route path="/member/dashboard" element={<MemberDashboardPage />} />
          <Route path="/member/profile" element={<MemberDashboardPage />} />
          <Route path="/member/shares" element={<MemberDashboardPage />} />
          <Route path="/member/deposits" element={<MemberDashboardPage />} />
          <Route path="/member/loans" element={<MemberDashboardPage />} />
          <Route path="/member/receipts" element={<MemberDashboardPage />} />
          <Route path="/portal" element={<MemberDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <QuickActionDock />
      <AuthModal />
      <CampaignModal />
    </div>
  );
}
