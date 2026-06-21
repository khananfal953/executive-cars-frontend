import React, { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'
import { formatPKR } from '../../utils/format.js'
import api from '../../api/api.js'

export default function AdminAuctionListPage() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  useEffect(() => {
    api.get('/admin/cars')
      .then(res => setAuctions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = auctions.filter(a => {
    const matchSearch = `${a.make} ${a.model}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/cars/${deleteTarget._id}`)
      setAuctions(prev => prev.filter(a => a._id !== deleteTarget._id))
    } catch {}
    setDeleteTarget(null)
  }

  const saveEdit = async () => {
    try {
      const payload = {
        make: editTarget.make,
        model: editTarget.model,
        year: Number(editTarget.year),
        basePrice: Number(editTarget.basePrice),
        auctionEnd: editTarget.auctionEnd,
      }
      const { data } = await api.put(`/admin/cars/${editTarget._id}`, payload)
      setAuctions(prev => prev.map(a => a._id === editTarget._id ? data : a))
    } catch {}
    setEditTarget(null)
  }

  const getDaysLeft = (endDate) => Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <AdminLayout title="Auction List">
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search car..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Ended'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'btn-primary' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <Link to="/admin/upload-auction" className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add New Auction
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading auctions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Car', 'Year', 'Base Price', 'Current Bid', 'End Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-4 text-gray-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-gray-400"><Search className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No auctions found.</p></td></tr>
                ) : filtered.map(a => {
                  const daysLeft = getDaysLeft(a.auctionEnd)
                  return (
                    <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-black text-sm">{a.make?.[0]}</div>
                          <span className="text-gray-900 font-medium text-sm">{a.make} {a.model}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500 text-sm">{a.year}</td>
                      <td className="px-4 py-4 text-gray-700 text-sm">PKR {formatPKR(a.basePrice)}</td>
                      <td className="px-4 py-4 text-blue-600 font-bold text-sm">PKR {formatPKR(a.currentBid)}</td>
                      <td className="px-4 py-4">
                        <div className="text-gray-500 text-sm">{a.auctionEnd ? new Date(a.auctionEnd).toLocaleDateString() : '—'}</div>
                        {a.status === 'active' && (
                          <span className={`text-xs font-medium ${daysLeft <= 2 ? 'text-red-400' : 'text-gray-500'}`}>
                            {daysLeft > 0 ? `${daysLeft}d left` : 'Ending today'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          a.status === 'active' ? 'bg-green-500/15 text-green-600 border-green-500/30' : 'bg-gray-500/15 text-gray-500 border-gray-300'
                        }`}>{a.status?.charAt(0).toUpperCase() + a.status?.slice(1)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEditTarget(a)} className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 flex items-center justify-center transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(a)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center transition-all">
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
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full animate-scaleIn text-center shadow-2xl">
            <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">Delete Auction?</h3>
            <p className="text-gray-500 text-sm mb-6">Remove <span className="text-gray-900 font-medium">{deleteTarget.make} {deleteTarget.model}</span> from auctions?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1 py-3 rounded-xl font-semibold text-sm">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

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
                { label: 'Make', key: 'make' },
                { label: 'Model', key: 'model' },
                { label: 'Year', key: 'year' },
                { label: 'Base Price (PKR)', key: 'basePrice' },
                { label: 'Auction End Date', key: 'auctionEnd', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">{f.label}</label>
                  <input type={f.type || 'text'}
                    value={f.type === 'date' && editTarget[f.key] ? new Date(editTarget[f.key]).toISOString().split('T')[0] : (editTarget[f.key] ?? '')}
                    onChange={e => setEditTarget(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors text-sm" />
                </div>
              ))}
              <button onClick={saveEdit} className="btn-primary w-full py-3 rounded-xl font-bold text-sm mt-4">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
