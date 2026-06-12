import React, { useState } from 'react'
import { Eye, Check, X, Search, Calendar } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout.jsx'

const BOOKINGS = [
  { id: 1, seller: 'Muhammad Hasnain', phone: '+92 300 1234567', car: 'Toyota Corolla 2020', date: '2026-05-20', branch: 'F-10 Branch', status: 'Pending', cnic: 'CNIC_001.jpg', reg: 'REG_001.pdf' },
  { id: 2, seller: 'Anfal Ahmad', phone: '+92 311 9876543', car: 'Honda Civic 2019', date: '2026-05-22', branch: 'G-11 Branch', status: 'Approved', cnic: 'CNIC_002.jpg', reg: 'REG_002.pdf' },
  { id: 3, seller: 'Sara Khan', phone: '+92 321 4445678', car: 'Suzuki Cultus 2021', date: '2026-05-18', branch: 'Saddar Branch', status: 'Rejected', cnic: 'CNIC_003.jpg', reg: 'REG_003.pdf' },
  { id: 4, seller: 'Ahmed Raza', phone: '+92 345 7778901', car: 'Kia Sportage 2022', date: '2026-05-25', branch: 'F-10 Branch', status: 'Pending', cnic: 'CNIC_004.jpg', reg: 'REG_004.pdf' },
  { id: 5, seller: 'Usman Butt', phone: '+92 300 9990011', car: 'Hyundai Tucson 2021', date: '2026-05-28', branch: 'G-11 Branch', status: 'Pending', cnic: 'CNIC_005.jpg', reg: 'REG_005.pdf' },
  { id: 6, seller: 'Fatima Malik', phone: '+92 312 2223344', car: 'Toyota Yaris 2023', date: '2026-06-01', branch: 'F-10 Branch', status: 'Approved', cnic: 'CNIC_006.jpg', reg: 'REG_006.pdf' },
]

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(BOOKINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [preview, setPreview] = useState(null)

  const filtered = bookings.filter(b => {
    const matchSearch = b.seller.toLowerCase().includes(search.toLowerCase()) || b.car.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const statusColor = (s) => {
    if (s === 'Approved') return 'bg-green-500/15 text-green-400 border-green-500/30'
    if (s === 'Rejected') return 'bg-red-500/15 text-red-400 border-red-500/30'
    return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
  }

  return (
    <AdminLayout title="Inspection Bookings">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: 'text-yellow-400' },
          { label: 'Approved', value: bookings.filter(b => b.status === 'Approved').length, color: 'text-green-400' },
          { label: 'Rejected', value: bookings.filter(b => b.status === 'Rejected').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search seller or car..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s ? 'btn-primary' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['Seller', 'Car', 'Date', 'Branch', 'Documents', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-gray-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-gray-900 font-medium text-sm">{b.seller}</p>
                    <p className="text-gray-500 text-xs">{b.phone}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-700 text-sm">{b.car}</td>
                  <td className="px-4 py-4 text-gray-500 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {b.date}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-sm">{b.branch}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreview({ type: 'CNIC', name: b.cnic, seller: b.seller })}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Eye className="w-3 h-3" /> CNIC
                      </button>
                      <button
                        onClick={() => setPreview({ type: 'Registration', name: b.reg, seller: b.seller })}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Eye className="w-3 h-3" /> Reg
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {b.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(b.id, 'Approved')}
                          className="w-7 h-7 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 flex items-center justify-center transition-all"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, 'Rejected')}
                          className="w-7 h-7 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 flex items-center justify-center transition-all"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full animate-scaleIn shadow-2xl">
            <button onClick={() => setPreview(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-gray-900 font-bold text-lg mb-2">{preview.type} Document</h3>
            <p className="text-gray-500 text-sm mb-4">Seller: {preview.seller}</p>
            <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Eye className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">{preview.name}</p>
                <p className="text-gray-600 text-xs mt-1">Document preview</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
