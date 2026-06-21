import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Gavel, Shield, Star, CheckCircle, Car } from 'lucide-react'
import Logo from '../../components/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const TEST_ACCOUNTS = [
  { name: 'Ahmed Raza',        email: 'buyer@executivecars.pk', password: 'buyer123' },
  { name: 'Muhammad Hasnain', email: 'hasnain@test.com',        password: 'test123'  },
  { name: 'Anfal Ahmad',      email: 'anfal@test.com',          password: 'test123'  },
]

export default function AuctionLoginPage() {
  const navigate = useNavigate()
  const { loginAuction } = useAuth()
  const [form, setForm] = useState({ email: import.meta.env.DEV ? 'buyer@executivecars.pk' : '', password: import.meta.env.DEV ? 'buyer123' : '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const fillAccount = (acc) => setForm(f => ({ ...f, email: acc.email, password: acc.password }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(false)
    const result = await loginAuction(form.email, form.password)
    if (result.success) navigate('/auction/dashboard')
    else { setError(true); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col w-3/5 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-400/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <Logo className="w-10 h-10" />
            <div>
              <span className="text-white font-black text-xl block leading-none">Executive Cars</span>
              <span className="text-blue-400 text-xs font-medium">Auction Platform</span>
            </div>
          </Link>

          <Gavel className="w-14 h-14 text-blue-400 mb-5" />
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">
            Welcome Back<br /><span className="animated-gradient-text">Bidder</span>
          </h2>
          <p className="text-slate-400 text-base mb-8">Access live auctions and place real-time bids on inspected vehicles.</p>

          <div className="flex flex-wrap gap-3 mb-10">
            {[{ icon: Gavel, label: 'Live Auctions' }, { icon: Shield, label: 'Secure Bids' }, { icon: Star, label: 'Verified Cars' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-2">
                <Icon className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Test accounts */}
          {import.meta.env.DEV && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Test Accounts — Click to Fill</p>
              <div className="space-y-2">
                {TEST_ACCOUNTS.map(acc => (
                  <button key={acc.email} onClick={() => fillAccount(acc)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 transition-all group">
                    <div className="text-left">
                      <p className="text-slate-200 text-sm font-medium">{acc.name}</p>
                      <p className="text-slate-400 text-xs font-mono">{acc.email}</p>
                    </div>
                    <span className="badge-blue text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Use</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Auction Login</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to bid on live auctions</p>
          </div>

          {/* Quick fill hint */}
          {import.meta.env.DEV && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-xs font-semibold">Pre-filled test account</p>
                <p className="text-blue-600 text-xs mt-0.5 font-mono">buyer@executivecars.pk / buyer123</p>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
            </div>
          )}

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
                Invalid credentials. Use a test account above.
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="relative group flex items-center gap-2">
                <input type="checkbox" disabled className="accent-blue-600 opacity-50 cursor-not-allowed" />
                <span className="text-gray-500 text-sm opacity-50 cursor-not-allowed">Remember me</span>
                <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Available after backend integration
                </div>
              </div>
              <div className="relative group inline-block">
                <button type="button" disabled className="text-blue-600 text-sm font-medium opacity-50 cursor-not-allowed">
                  Forgot Password?
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Available after backend integration
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200">
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><LogIn className="w-4 h-4" /> Login to Auction</>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2">
            <p className="text-gray-500 text-sm">
              New here?{' '}
              <Link to="/auction/signup" className="text-blue-600 font-medium hover:underline">Become a Member →</Link>
            </p>
            <p className="text-gray-400 text-xs">
              Admin?{' '}
              <Link to="/admin" className="text-blue-500 hover:underline">Admin Portal</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
