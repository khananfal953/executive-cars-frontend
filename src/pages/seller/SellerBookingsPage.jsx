import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import SellerLayout from '../../components/SellerLayout.jsx'
import api from '../../api/api.js'

const statusConfig = {
  approved: { icon: CheckCircle, class: 'badge-green' },
  pending:  { icon: Clock,       class: 'badge-yellow' },
  rejected: { icon: XCircle,     class: 'badge-red' },
}

export default function SellerBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/bookings')
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <SellerLayout title="My Bookings">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-gray-900 font-bold text-lg">Inspection Bookings</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track your vehicle inspection requests.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Car', 'Inspection Date', 'Branch', 'Submitted On', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No bookings yet</td></tr>
              ) : bookings.map(b => {
                const { icon: Icon, class: cls } = statusConfig[b.status] || statusConfig.pending
                return (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-900 font-medium">{b.carMake} {b.carModel} {b.carYear}</td>
                    <td className="px-5 py-4 text-gray-600">{b.date}</td>
                    <td className="px-5 py-4 text-gray-600">{b.branch}</td>
                    <td className="px-5 py-4 text-gray-600">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 ${cls} text-xs px-2.5 py-1 rounded-full font-medium`}>
                        <Icon className="w-3 h-3" /> {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  )
}
