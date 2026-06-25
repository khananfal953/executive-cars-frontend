import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginHintBanner from './components/LoginHintBanner.jsx'

// Public Pages
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import BecomeSellerPage from './pages/BecomeSellerPage.jsx'
import UsedCarsPage from './pages/UsedCarsPage.jsx'
import PricePredictorPage from './pages/PricePredictorPage.jsx'
import BookingConfirmedPage from './pages/BookingConfirmedPage.jsx'

// Auction Pages
import AuctionGatePage from './pages/auction/AuctionGatePage.jsx'
import AuctionSignupPage from './pages/auction/AuctionSignupPage.jsx'
import AuctionPaymentPage from './pages/auction/AuctionPaymentPage.jsx'
import AuctionPaymentSuccessPage from './pages/auction/AuctionPaymentSuccessPage.jsx'
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
import SellerDashboardPage from './pages/seller/SellerDashboardPage.jsx'
import SellerBookingsPage from './pages/seller/SellerBookingsPage.jsx'
import SellerListingsPage from './pages/seller/SellerListingsPage.jsx'
import SellerAuctionStatusPage from './pages/seller/SellerAuctionStatusPage.jsx'
import SellerProfilePage from './pages/seller/SellerProfilePage.jsx'

import UsedCarDetailPage from './pages/UsedCarDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const PORTAL_PATHS = [
  '/auction/dashboard', '/auction/live', '/auction/my-bids',
  '/auction/won-cars', '/auction/profile', '/auction/car',
  '/admin/', '/seller/',
]

function BannerWrapper() {
  const location = useLocation()
  const hide = PORTAL_PATHS.some(p => location.pathname.startsWith(p))
  return hide ? null : <LoginHintBanner />
}

function AdminGate() {
  const { user } = useAuth()
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BannerWrapper />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/become-a-seller" element={<BecomeSellerPage />} />
          <Route path="/used-cars" element={<UsedCarsPage />} />
          <Route path="/used-cars/:id" element={<UsedCarDetailPage />} />
          <Route path="/price-predictor" element={<PricePredictorPage />} />
          <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />

          {/* Auction */}
          <Route path="/auction" element={<AuctionGatePage />} />
          <Route path="/auction/signup" element={<AuctionSignupPage />} />
          <Route path="/auction/payment" element={<AuctionPaymentPage />} />
          <Route path="/auction/payment-success" element={<AuctionPaymentSuccessPage />} />
          <Route path="/auction/dashboard" element={<ProtectedRoute role="buyer"><AuctionDashboardPage /></ProtectedRoute>} />
          <Route path="/auction/live"      element={<ProtectedRoute role="buyer"><AuctionLiveAuctionsPage /></ProtectedRoute>} />
          <Route path="/auction/my-bids"   element={<ProtectedRoute role="buyer"><AuctionMyBidsPage /></ProtectedRoute>} />
          <Route path="/auction/won-cars"  element={<ProtectedRoute role="buyer"><AuctionWonCarsPage /></ProtectedRoute>} />
          <Route path="/auction/profile"   element={<ProtectedRoute role="buyer"><AuctionProfilePage /></ProtectedRoute>} />
          <Route path="/auction/car/:id"   element={<ProtectedRoute role="buyer"><AuctionCarDetailPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminGate />} />
          <Route path="/admin/login"           element={<AdminLoginPage />} />
          <Route path="/admin/dashboard"       element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users"           element={<ProtectedRoute role="admin"><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/bookings"        element={<ProtectedRoute role="admin"><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/admin/auction-list"    element={<ProtectedRoute role="admin"><AdminAuctionListPage /></ProtectedRoute>} />
          <Route path="/admin/used-cars-list"  element={<ProtectedRoute role="admin"><AdminUsedCarsListPage /></ProtectedRoute>} />
          <Route path="/admin/upload-auction"  element={<ProtectedRoute role="admin"><AdminUploadAuctionPage /></ProtectedRoute>} />
          <Route path="/admin/upload-used-car" element={<ProtectedRoute role="admin"><AdminUploadUsedCarPage /></ProtectedRoute>} />

          {/* Seller */}
          <Route path="/seller/dashboard"      element={<ProtectedRoute role="seller"><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/seller/bookings"       element={<ProtectedRoute role="seller"><SellerBookingsPage /></ProtectedRoute>} />
          <Route path="/seller/listings"       element={<ProtectedRoute role="seller"><SellerListingsPage /></ProtectedRoute>} />
          <Route path="/seller/auction-status" element={<ProtectedRoute role="seller"><SellerAuctionStatusPage /></ProtectedRoute>} />
          <Route path="/seller/profile"        element={<ProtectedRoute role="seller"><SellerProfilePage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
