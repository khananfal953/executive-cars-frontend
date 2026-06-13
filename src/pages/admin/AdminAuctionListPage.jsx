import React, { useState } from 'react'
import { Search, Plus, Pencil, Trash2, X, AlertTriangle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { formatPKR } from '../../utils/format.js'

const AUCTIONS = [
  { id: 1, make: 'Toyota', model: 'Land Cruiser', year: 2020, basePrice: 11000000, currentBid: 12500000, endDate: '2026-05-20', status: 'Active' },
  { id: 2, make: 'Honda', model: 'Civic', year: 2022, basePrice: 3800000, currentBid: 4200000, endDate: '2026-05-22', status: 'Active' },
  { id: 3, make: 'Kia', model: 'Sportage', year: 2021, basePrice: 5200000, currentBid: 5800000, endDate: '2026-05-15', status: 'Ended' },
  { id: 4, make: 'Toyota', model: 'Fortuner', year: 2019, basePrice: 8500000, currentBid: 9100000, endDate: '2026-05-28', status: 'Active' },
  { id: 5, make: 'Hyundai', model: 'Tucson', year: 2021, basePrice: 6000000, currentBid: 6700000, endDate: '2026-05-18', status: 'Ended' },
]

export default function AdminAuctionListPage() {
  const [auctions, setAuctions] = useState(AUCTIONS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const filtered = auctions.filter(a => {
    const matchSearch = `${a.make} ${a.model}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const confirmDelete = () => {
    setAuctions(prev => prev.filter(a => a.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <AdminLayout title="Auction List">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search car..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Ended'].map(s => (
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
        <Link to="/admin/upload-auction" className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add New Auction
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['Car', 'Year', 'Base Price', 'Current Bid', 'End Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-gray-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const daysLeft = getDaysLeft(a.endDate)
                return (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-lg flex items-center justify-center text-primary/40 font-black text-sm">
                          {a.make[0]}
                        </div>
                        <span className="text-gray-900 font-medium text-sm">{a.make} {a.model}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">{a.year}</td>
                    <td className="px-4 py-4 text-gray-700 text-sm">PKR {formatPKR(a.basePrice)}</td>
                    <td className="px-4 py-4 text-primary font-bold text-sm">PKR {formatPKR(a.currentBid)}</td>
                    <td className="px-4 py-4">
                      <div className="text-gray-500 text-sm">{a.endDate}</div>
                      {a.status === 'Active' && (
                        <span className={`text-xs font-medium ${daysLeft <= 2 ? 'text-red-400' : 'text-gray-500'}`}>
                          {daysLeft > 0 ? `${daysLeft}d left` : 'Ending today'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        a.status === 'Active'
                          ? 'bg-green-500/15 text-green-400 border-green-500/30'
                          : 'bg-gray-500/15 text-gray-400 border-gray-500/30'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditTarget(a)}
                          className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No auctions found.</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full animate-scaleIn text-center shadow-2xl">
            <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">Delete Auction?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Remove <span className="text-gray-900 font-medium">{deleteTarget.make} {deleteTarget.model}</span> from auctions?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1 py-3 rounded-xl font-semibold text-sm">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative w-full max-w-md bg-white border-l border-gray-200 h-full overflow-y-auto p-6 animate-fadeInRight">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold text-lg">Edit Auction</h3>
              <button onClick={() => setEditTarget(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Make', value: editTarget.make },
                { label: 'Model', value: editTarget.model },
                { label: 'Year', value: editTarget.year },
                { label: 'Base Price (PKR)', value: editTarget.basePrice },
                { label: 'End Date', value: editTarget.endDate },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">{f.label}</label>
                  <input
                    defaultValue={f.value}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => setEditTarget(null)}
                className="btn-primary w-full py-3 rounded-xl font-bold text-sm mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
