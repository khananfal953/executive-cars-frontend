import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Calendar, Gavel, Car, TrendingUp, CheckCircle,
  Clock, DollarSign, ArrowUpRight, Eye, Plus, BarChart3
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { formatPKR } from '../../utils/format.js'

const stats = [
  { label: 'Total Members', value: '248', change: '+12 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { label: 'Pending Bookings', value: '14', change: '3 need action', icon: Calendar, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { label: 'Active Auctions', value: '6', change: '2 ending today', icon: Gavel, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { label: 'Used Cars Listed', value: '34', change: '+5 this week', icon: Car, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { label: 'Total Revenue', value: 'PKR 2.4Cr', change: '+18% vs last month', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { label: 'Auctions Won', value: '89', change: 'All time', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
]

const recentBookings = [
  { seller: 'Ahmed Raza', car: 'Kia Sportage 2022', date: '2026-05-25', branch: 'F-10', status: 'Pending' },
  { seller: 'Usman Butt', car: 'Hyundai Tucson 2021', date: '2026-05-28', branch: 'G-11', status: 'Pending' },
  { seller: 'Zara Hussain', car: 'Toyota Yaris 2023', date: '2026-06-01', branch: 'F-10', status: 'Pending' },
  { seller: 'Anfal Ahmad', car: 'Honda Civic 2019', date: '2026-05-22', branch: 'G-11', status: 'Approved' },
]

const liveAuctions = [
  { make: 'Toyota', model: 'Land Cruiser', year: 2020, currentBid: 12500000, bidders: 14, endsIn: '2h 34m', img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=200&q=80' },
  { make: 'Honda', model: 'Civic', year: 2022, currentBid: 4200000, bidders: 8, endsIn: '5h 10m', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&q=80' },
  { make: 'Kia', model: 'Sportage', year: 2021, currentBid: 5800000, bidders: 11, endsIn: '48m', img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=200&q=80' },
]

const recentMembers = [
  { name: 'Muhammad Hasnain Ali', email: 'hasnain@example.com', joined: '2026-01-15', status: 'Active' },
  { name: 'Waleed Tariq', email: 'waleed@example.com', joined: '2026-02-20', status: 'Active' },
  { name: 'Sara Khan', email: 'sara@example.com', joined: '2025-11-10', status: 'Expired' },
  { name: 'Ahmed Raza', email: 'ahmed@example.com', joined: '2026-03-05', status: 'Active' },
]

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome back, Admin 👋</h2>
            <p className="text-blue-100 text-sm">Here's what's happening on Executive Cars today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/admin/upload-auction" className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Auction
            </Link>
            <Link to="/admin/upload-used-car" className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-400 transition-colors flex items-center gap-2 border border-blue-400">
              <Car className="w-4 h-4" /> Add Used Car
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300" />
            </div>
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-gray-700 text-sm font-medium">{s.label}</div>
            <div className="text-gray-400 text-xs mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <h3 className="text-gray-900 font-bold">Recent Bookings</h3>
            </div>
            <Link to="/admin/bookings" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-gray-900 font-medium text-sm">{b.seller}</p>
                  <p className="text-gray-500 text-xs">{b.car} · {b.branch} · {b.date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  b.status === 'Approved' ? 'badge-green' :
                  b.status === 'Rejected' ? 'badge-red' : 'badge-yellow'
                }`}>{b.status}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <Link to="/admin/bookings" className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-center block">
              Manage All Bookings
            </Link>
          </div>
        </div>

        {/* Live Auctions */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-purple-500" />
              <h3 className="text-gray-900 font-bold">Live Auctions</h3>
              <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
              </span>
            </div>
            <Link to="/admin/auction-list" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {liveAuctions.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <img src={a.img} alt={a.make} className="w-14 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm">{a.make} {a.model} {a.year}</p>
                  <p className="text-gray-500 text-xs">{a.bidders} bidders · ends in {a.endsIn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-blue-600 font-bold text-sm">PKR {formatPKR(a.currentBid)}</p>
                  <p className="text-gray-400 text-xs">current bid</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <Link to="/admin/auction-list" className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-center block">
              Manage All Auctions
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-900 font-bold">Recent Members</h3>
          </div>
          <Link to="/admin/users" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 text-xs font-semibold uppercase">Member</th>
                <th className="text-left px-5 py-3 text-gray-500 text-xs font-semibold uppercase hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-gray-500 text-xs font-semibold uppercase">Status</th>
                <th className="text-right px-5 py-3 text-gray-500 text-xs font-semibold uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((m, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium text-sm">{m.name}</p>
                        <p className="text-gray-400 text-xs">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm hidden md:table-cell">{m.joined}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{m.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Eye className="w-4 h-4 inline" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
