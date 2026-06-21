import React from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import SellerLayout from '../../components/SellerLayout.jsx'

const MY_BOOKINGS = [
  { id: 1, car: 'Toyota Corolla 2020', date: '2026-05-20', branch: 'F-10 Branch', status: 'Approved', submittedOn: '2026-05-10' },
  { id: 2, car: 'Honda Civic 2019', date: '2026-06-05', branch: 'G-11 Branch', status: 'Pending', submittedOn: '2026-05-12' },
  { id: 3, car: 'Kia Sportage 2021', date: '2026-06-15', branch: 'Blue Area Branch', status: 'Pending', submittedOn: '2026-06-01' },
]

const statusConfig = {
  Approved: { icon: CheckCircle, class: 'badge-green' },
  Pending:  { icon: Clock,       class: 'badge-yellow' },
  Rejected: { icon: XCircle,     class: 'badge-red' },
}

export default function SellerBookingsPage() {
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
              {MY_BOOKINGS.map(b => {
                const { icon: Icon, class: cls } = statusConfig[b.status] || statusConfig.Pending
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-900 font-medium">{b.car}</td>
                    <td className="px-5 py-4 text-gray-600">{b.date}</td>
                    <td className="px-5 py-4 text-gray-600">{b.branch}</td>
                    <td className="px-5 py-4 text-gray-600">{b.submittedOn}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 ${cls} text-xs px-2.5 py-1 rounded-full font-medium`}>
                        <Icon className="w-3 h-3" /> {b.status}
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
