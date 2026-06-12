import React, { useState } from 'react'
import { Search, Plus, Pencil, Trash2, X, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout.jsx'

const USED_CARS = [
  { id: 1, make: 'Toyota', model: 'Corolla', year: 2021, km: 42000, price: 3800000, listed: '2026-04-10' },
  { id: 2, make: 'Honda', model: 'City', year: 2020, km: 55000, price: 2900000, listed: '2026-04-15' },
  { id: 3, make: 'Suzuki', model: 'Cultus', year: 2022, km: 18000, price: 2100000, listed: '2026-04-20' },
  { id: 4, make: 'Kia', model: 'Picanto', year: 2021, km: 30000, price: 2600000, listed: '2026-04-25' },
  { id: 5, make: 'Toyota', model: 'Yaris', year: 2023, km: 12000, price: 3200000, listed: '2026-05-01' },
  { id: 6, make: 'Honda', model: 'BR-V', year: 2020, km: 61000, price: 3500000, listed: '2026-05-05' },
]

function formatPKR(n) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`
  return n.toLocaleString()
}

export default function AdminUsedCarsListPage() {
  const [cars, setCars] = useState(USED_CARS)
  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000000)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const filtered = cars.filter(c => {
    const matchSearch = `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase())
    const matchPrice = c.price <= maxPrice
    return matchSearch && matchPrice
  })

  const confirmDelete = () => {
    setCars(prev => prev.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <AdminLayout title="Used Cars List">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search car..."
              className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 w-52"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm whitespace-nowrap">Max Price:</span>
            <input
              type="range" min={500000} max={10000000} step={100000}
              value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              className="w-28 accent-blue-600"
            />
            <span className="text-primary text-sm font-medium whitespace-nowrap">{formatPKR(maxPrice)}</span>
          </div>
        </div>
        <Link to="/admin/upload-used-car" className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add New Used Car
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {['Car', 'Year', 'Mileage', 'Price', 'Date Listed', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-4 text-gray-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-lg flex items-center justify-center text-primary/40 font-black text-sm">
                        {c.make[0]}
                      </div>
                      <span className="text-gray-900 font-medium text-sm">{c.make} {c.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-sm">{c.year}</td>
                  <td className="px-4 py-4 text-gray-500 text-sm">{c.km.toLocaleString()} km</td>
                  <td className="px-4 py-4 text-primary font-bold text-sm">PKR {formatPKR(c.price)}</td>
                  <td className="px-4 py-4 text-gray-500 text-sm">{c.listed}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditTarget(c)}
                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No cars found.</p>
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
            <h3 className="text-gray-900 font-bold text-xl mb-2">Delete Car?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Remove <span className="text-gray-900 font-medium">{deleteTarget.make} {deleteTarget.model}</span> from used cars?
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
              <h3 className="text-gray-900 font-bold text-lg">Edit Used Car</h3>
              <button onClick={() => setEditTarget(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Make', value: editTarget.make },
                { label: 'Model', value: editTarget.model },
                { label: 'Year', value: editTarget.year },
                { label: 'Mileage (km)', value: editTarget.km },
                { label: 'Price (PKR)', value: editTarget.price },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">{f.label}</label>
                  <input
                    defaultValue={f.value}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              ))}
              <button onClick={() => setEditTarget(null)} className="btn-primary w-full py-3 rounded-xl font-bold text-sm mt-4">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
