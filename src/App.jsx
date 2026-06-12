import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import LoginHintBanner from './components/LoginHintBanner.jsx'

// Public Pages
import HomePage from './pages/HomePage.jsx'
import BecomeSellerPage from './pages/BecomeSellerPage.jsx'
import UsedCarsPage from './pages/UsedCarsPage.jsx'
import PricePredictorPage from './pages/PricePredictorPage.jsx'
import AIAssistantPage from './pages/AIAssistantPage.jsx'

// Auction Pages
import AuctionGatePage from './pages/auction/AuctionGatePage.jsx'
import AuctionSignupPage from './pages/auction/AuctionSignupPage.jsx'
import AuctionPaymentPage from './pages/auction/AuctionPaymentPage.jsx'
import AuctionPaymentSuccessPage from './pages/auction/AuctionPaymentSuccessPage.jsx'
import AuctionLoginPage from './pages/auction/AuctionLoginPage.jsx'
import AuctionDashboardPage from './pages/auction/AuctionDashboardPage.jsx'
import AuctionLiveAuctionsPage from './pages/auction/AuctionLiveAuctionsPage.jsx'
import AuctionMyBidsPage from './pages/auction/AuctionMyBidsPage.jsx'
import AuctionWonCarsPage from './pages/auction/AuctionWonCarsPage.jsx'
import AuctionProfilePage from './pages/auction/AuctionProfilePage.jsx'
import AuctionCarDetailPage from './pages/auction/AuctionCarDetailPage.jsx'

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx'
import AdminAuctionListPage from './pages/admin/AdminAuctionListPage.jsx'
import AdminUsedCarsListPage from './pages/admin/AdminUsedCarsListPage.jsx'
import AdminUploadAuctionPage from './pages/admin/AdminUploadAuctionPage.jsx'
import AdminUploadUsedCarPage from './pages/admin/AdminUploadUsedCarPage.jsx'

// Seller Pages
import SellerLoginPage from './pages/seller/SellerLoginPage.jsx'
import SellerDashboardPage from './pages/seller/SellerDashboardPage.jsx'

function BannerWrapper() {
  const location = useLocation()
  const hidePaths = [
    '/auction/dashboard', '/auction/live', '/auction/my-bids',
    '/auction/won-cars', '/auction/profile', '/auction/car',
    '/admin/', '/seller/dashboard',
  ]
  const hide = hidePaths.some(p => location.pathname.startsWith(p))
  return hide ? null : <LoginHintBanner />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BannerWrapper />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/become-a-seller" element={<BecomeSellerPage />} />
          <Route path="/used-cars" element={<UsedCarsPage />} />
          <Route path="/price-predictor" element={<PricePredictorPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />

          {/* Auction */}
          <Route path="/auction" element={<AuctionGatePage />} />
          <Route path="/auction/signup" element={<AuctionSignupPage />} />
          <Route path="/auction/payment" element={<AuctionPaymentPage />} />
          <Route path="/auction/payment-success" element={<AuctionPaymentSuccessPage />} />
          <Route path="/auction/login" element={<AuctionLoginPage />} />
          <Route path="/auction/dashboard" element={<AuctionDashboardPage />} />
          <Route path="/auction/live" element={<AuctionLiveAuctionsPage />} />
          <Route path="/auction/my-bids" element={<AuctionMyBidsPage />} />
          <Route path="/auction/won-cars" element={<AuctionWonCarsPage />} />
          <Route path="/auction/profile" element={<AuctionProfilePage />} />
          <Route path="/auction/car/:id" element={<AuctionCarDetailPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/auction-list" element={<AdminAuctionListPage />} />
          <Route path="/admin/used-cars-list" element={<AdminUsedCarsListPage />} />
          <Route path="/admin/upload-auction" element={<AdminUploadAuctionPage />} />
          <Route path="/admin/upload-used-car" element={<AdminUploadUsedCarPage />} />

          {/* Seller */}
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
