import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock, Car, Users, BarChart3, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: 'admin@executivecars.pk', password: 'admin123' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(false)
    await new Promise(r => setTimeout(r, 800))
    const result = login(form.email, form.password)
    if (result.success && result.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-3/5 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#2563eb"/>
              <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="white"/>
              <circle cx="20" cy="20" r="3.5" fill="#2563eb"/>
            </svg>
            <div>
              <span className="text-white font-black text-xl block leading-none">Executive Cars</span>
              <span className="text-blue-400 text-xs font-medium">Admin Portal</span>
            </div>
          </Link>

          <Shield className="w-14 h-14 text-blue-400 mb-6" />
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">
            Manage Everything<br /><span className="animated-gradient-text">From One Place</span>
          </h2>
          <p className="text-slate-400 text-base mb-10">Full control over listings, members, bookings, and auctions.</p>

          <div className="space-y-4">
            {[
              { icon: Users, text: 'Manage auction members & subscriptions' },
              { icon: BarChart3, text: 'View real-time auction bids & stats' },
              { icon: CheckCircle, text: 'Approve/reject seller inspection bookings' },
              { icon: Car, text: 'Upload & manage car listings' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Credentials hint */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Test Credentials</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm font-mono">admin@executivecars.pk</p>
                <p className="text-slate-200 text-sm font-mono">admin123</p>
              </div>
              <span className="badge-blue text-xs px-2 py-1 rounded-full font-semibold">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">Secure access — authorized personnel only</p>
          </div>

          {/* Quick fill hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-xs font-semibold">Pre-filled test credentials</p>
              <p className="text-blue-600 text-xs mt-0.5">admin@executivecars.pk / admin123</p>
            </div>
            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
                className={`input-light ${error ? 'border-red-400' : ''}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} required
                  className={`input-light pr-10 ${error ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
                Invalid credentials. Please try again.
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-200">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Lock className="w-4 h-4" /> Sign In to Admin Portal</>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">Are you a seller?{' '}
              <Link to="/seller/login" className="text-blue-600 font-medium hover:underline">Seller Login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
