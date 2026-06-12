import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Car, ClipboardCheck, Gavel, TrendingUp, LogOut, Bell,
  CheckCircle, Clock, XCircle, Eye, ArrowUpRight, Plus,
  LayoutDashboard, FileText, BarChart3, User
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const MY_BOOKINGS = [
  { id: 1, car: 'Toyota Corolla 2020', date: '2026-05-20', branch: 'F-10 Branch', status: 'Approved', submittedOn: '2026-05-10' },
  { id: 2, car: 'Honda Civic 2019', date: '2026-06-05', branch: 'G-11 Branch', status: 'Pending', submittedOn: '2026-05-12' },
]

const MY_LISTINGS = [
  { id: 1, car: 'Toyota Corolla 2020', type: 'Auction', price: 3800000, status: 'Live', currentBid: 4100000, bidders: 7, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&q=80' },
  { id: 2, car: 'Honda Civic 2019', type: 'Used Car', price: 3500000, status: 'Listed', currentBid: null, bidders: null, img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&q=80' },
]

const PRICE_HISTORY = [
  { month: 'Jan', price: 3600000 },
  { month: 'Feb', price: 3750000 },
  { month: 'Mar', price: 3800000 },
  { month: 'Apr', price: 3950000 },
  { month: 'May', price: 4100000 },
]

function formatPKR(n) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`
  return n.toLocaleString()
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/seller/dashboard', active: true },
  { icon: ClipboardCheck, label: 'My Bookings', to: '/seller/dashboard' },
  { icon: Car, label: 'My Listings', to: '/seller/dashboard' },
  { icon: Gavel, label: 'Auction Status', to: '/seller/dashboard' },
  { icon: TrendingUp, label: 'Price Predictor', to: '/price-predictor' },
  { icon: User, label: 'My Profile', to: '/seller/dashboard' },
]

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => { logout(); navigate('/seller/login') }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 shrink-0">
        <div className="p-5 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#2563eb"/>
              <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="white"/>
              <circle cx="20" cy="20" r="3" fill="#2563eb"/>
            </svg>
            <div>
              <span className="text-gray-900 font-bold text-sm block">Executive <span className="primary-text">Cars</span></span>
              <span className="text-gray-400 text-xs">Seller Portal</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all w-full">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-gray-900 font-bold text-lg">Seller Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, <span className="text-blue-600 font-medium">{user?.name || 'Muhammad Hasnain Ali'}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/become-a-seller" className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Booking
            </Link>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1">Your Car is Getting Attention! 🚗</h2>
                <p className="text-blue-100 text-sm">Toyota Corolla 2020 has 7 active bidders. Current bid: PKR 41 Lac</p>
              </div>
              <Link to="/auction/car/1" className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors shrink-0">
                View Auction
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'My Bookings', value: MY_BOOKINGS.length, icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
              { label: 'Active Listings', value: MY_LISTINGS.length, icon: Car, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
              { label: 'Total Bids Received', value: '7', icon: Gavel, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
              { label: 'Estimated Value', value: 'PKR 41L', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            ].map(s => (
              <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm`}>
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
                <div className="text-gray-600 text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* My Inspection Bookings */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-blue-500" />
                  <h3 className="text-gray-900 font-bold">My Inspection Bookings</h3>
                </div>
                <Link to="/become-a-seller" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                  + New <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {MY_BOOKINGS.map(b => (
                  <div key={b.id} className="px-5 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{b.car}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{b.branch} · {b.date}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        b.status === 'Approved' ? 'badge-green' :
                        b.status === 'Rejected' ? 'badge-red' : 'badge-yellow'
                      }`}>{b.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {b.status === 'Approved' && (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Inspection confirmed — bring your car on {b.date}
                        </div>
                      )}
                      {b.status === 'Pending' && (
                        <div className="flex items-center gap-1.5 text-yellow-600 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          Awaiting admin review — submitted {b.submittedOn}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-gray-100">
                <Link to="/become-a-seller" className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-center block">
                  Book New Inspection
                </Link>
              </div>
            </div>

            {/* My Listings */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-green-500" />
                  <h3 className="text-gray-900 font-bold">My Car Listings</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {MY_LISTINGS.map(l => (
                  <div key={l.id} className="flex items-center gap-4 px-5 py-4">
                    <img src={l.img} alt={l.car} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-sm">{l.car}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.type === 'Auction' ? 'badge-blue' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                          {l.type}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${l.status === 'Live' ? 'badge-green' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                          {l.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-blue-600 font-bold text-sm">PKR {formatPKR(l.currentBid || l.price)}</p>
                      {l.bidders && <p className="text-gray-400 text-xs">{l.bidders} bidders</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Trend */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h3 className="text-gray-900 font-bold">Toyota Corolla 2020 — Price Trend</h3>
              </div>
              <Link to="/price-predictor" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                Predict Price <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-end gap-3 h-32">
              {PRICE_HISTORY.map((p, i) => {
                const max = Math.max(...PRICE_HISTORY.map(x => x.price))
                const pct = (p.price / max) * 100
                return (
                  <div key={p.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-gray-500 text-xs font-medium">PKR {formatPKR(p.price)}</span>
                    <div className="w-full rounded-t-lg bg-blue-600 transition-all" style={{ height: `${pct * 0.7}%`, minHeight: '20px' }} />
                    <span className="text-gray-400 text-xs">{p.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Current Market Value</p>
                <p className="text-blue-600 font-black text-2xl">PKR 41 Lac</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Change (3 months)</p>
                <p className="text-green-600 font-bold text-lg">+PKR 5 Lac ↑</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { icon: ClipboardCheck, label: 'Book Inspection', to: '/become-a-seller', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { icon: TrendingUp, label: 'Price Predictor', to: '/price-predictor', color: 'bg-green-50 text-green-600 border-green-200' },
              { icon: Gavel, label: 'View Auctions', to: '/auction', color: 'bg-purple-50 text-purple-600 border-purple-200' },
              { icon: Car, label: 'Browse Used Cars', to: '/used-cars', color: 'bg-orange-50 text-orange-600 border-orange-200' },
            ].map(a => (
              <Link key={a.label} to={a.to}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${a.color} hover:shadow-md transition-all text-center`}>
                <a.icon className="w-6 h-6" />
                <span className="text-sm font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
