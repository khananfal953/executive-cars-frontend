import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, X, ChevronDown, ChevronUp, Shield, Car, Gavel } from 'lucide-react'

const ACCOUNTS = [
  {
    role: 'Admin',
    icon: Shield,
    email: 'admin@executivecars.pk',
    password: 'admin123',
    path: '/admin',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-500',
  },
  {
    role: 'Seller',
    icon: Car,
    email: 'seller@executivecars.pk',
    password: 'seller123',
    path: '/seller/login',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  {
    role: 'Buyer',
    icon: Gavel,
    email: 'buyer@executivecars.pk',
    password: 'buyer123',
    path: '/auction/login',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  {
    role: 'Buyer 2',
    icon: Gavel,
    email: 'hasnain@test.com',
    password: 'test123',
    path: '/auction/login',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500',
  },
]

export default function LoginHintBanner() {
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState(true)

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
    >
      <KeyRound className="w-4 h-4" /> Test Logins
    </button>
  )

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">Test Credentials</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg hover:bg-blue-500 transition-colors text-white"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-blue-500 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 space-y-2">
          {ACCOUNTS.map(acc => (
            <Link
              key={acc.email}
              to={acc.path}
              className={`flex items-center gap-3 p-3 rounded-xl border ${acc.bg} ${acc.border} hover:opacity-80 transition-all group`}
            >
              <div className={`w-8 h-8 rounded-lg ${acc.badge} flex items-center justify-center shrink-0`}>
                <acc.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${acc.badge}`}>
                    {acc.role}
                  </span>
                </div>
                <p className="text-gray-600 text-xs font-mono truncate">{acc.email}</p>
                <p className="text-gray-400 text-xs font-mono">pw: {acc.password}</p>
              </div>
              <span className="text-gray-400 text-xs group-hover:text-blue-600 transition-colors shrink-0">→</span>
            </Link>
          ))}
          <p className="text-gray-400 text-xs text-center pt-1">Click any account to go to its login page</p>
        </div>
      )}

      {!expanded && (
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex gap-1">
            {ACCOUNTS.map(acc => (
              <span key={acc.role} className={`w-2 h-2 rounded-full ${acc.dot}`} />
            ))}
          </div>
          <button onClick={() => setExpanded(true)} className="text-blue-600 text-xs font-semibold hover:underline">
            Show credentials
          </button>
        </div>
      )}
    </div>
  )
}
