import React, { useState } from 'react'
import { Search, Trash2, AlertTriangle, X } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout.jsx'

const MEMBERS = [
  { id: 1, name: 'Muhammad Hasnain Ali', email: 'hasnain@example.com', phone: '+92 300 1234567', status: 'Active', joined: '2026-01-15' },
  { id: 2, name: 'Anfal Ahmad', email: 'anfal@example.com', phone: '+92 311 9876543', status: 'Active', joined: '2026-02-03' },
  { id: 3, name: 'Waleed Tariq', email: 'waleed@example.com', phone: '+92 333 5551234', status: 'Active', joined: '2026-02-20' },
  { id: 4, name: 'Sara Khan', email: 'sara@example.com', phone: '+92 321 4445678', status: 'Expired', joined: '2025-11-10' },
  { id: 5, name: 'Ahmed Raza', email: 'ahmed@example.com', phone: '+92 345 7778901', status: 'Active', joined: '2026-03-05' },
  { id: 6, name: 'Fatima Malik', email: 'fatima@example.com', phone: '+92 312 2223344', status: 'Expired', joined: '2025-12-01' },
  { id: 7, name: 'Usman Butt', email: 'usman@example.com', phone: '+92 300 9990011', status: 'Active', joined: '2026-04-12' },
  { id: 8, name: 'Zara Hussain', email: 'zara@example.com', phone: '+92 322 6667788', status: 'Active', joined: '2026-04-28' },
]

function getInitials(name) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() }

export default function AdminUsersPage() {
  const [members, setMembers] = useState(MEMBERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 6

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (statusFilter === 'All' || m.status === statusFilter)
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const confirmDelete = () => { setMembers(prev => prev.filter(m => m.id !== deleteTarget.id)); setDeleteTarget(null) }

  return (
    <AdminLayout title="Members">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Members', value: members.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: members.filter(m => m.status === 'Active').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Expired', value: members.filter(m => m.status === 'Expired').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'This Month', value: 3, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 shadow-sm" />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Expired'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Member', 'Phone', 'Status', 'Joined', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(m => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm shrink-0">{getInitials(m.name)}</div>
                      <div>
                        <p className="text-gray-900 font-medium text-sm">{m.name}</p>
                        <p className="text-gray-500 text-xs">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-sm">{m.phone}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${m.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{m.status}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{m.joined}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setDeleteTarget(m)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center ml-auto transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
            <span className="text-gray-500 text-sm">{filtered.length} members</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm transition-all ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn text-center">
            <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">Delete Member?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete <span className="text-gray-900 font-medium">{deleteTarget.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-ghost flex-1 py-3 rounded-xl font-semibold text-sm">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
