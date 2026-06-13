import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Car, Lock, CheckCircle, ClipboardCheck, TrendingUp, Gavel } from 'lucide-react'
import Logo from '../../components/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function SellerLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: 'seller@executivecars.pk', password: 'seller123' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(false)
    await new Promise(r => setTimeout(r, 800))
    const result = login(form.email, form.password)
    if (result.success && result.role === 'seller') {
      navigate('/seller/dashboard')
    } else {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col w-3/5 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <Logo className="w-10 h-10" />
            <div>
              <span className="text-white font-black text-xl block leading-none">Executive Cars</span>
              <span className="text-blue-400 text-xs font-medium">Seller Portal</span>
            </div>
          </Link>

          <Car className="w-14 h-14 text-blue-400 mb-6" />
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">
            Sell Your Car<br /><span className="animated-gradient-text">The Smart Way</span>
          </h2>
          <p className="text-slate-400 text-base mb-10">Track your inspection bookings, listings, and auction results all in one place.</p>

          <div className="space-y-4">
            {[
              { icon: ClipboardCheck, text: 'Track your inspection booking status' },
              { icon: Car, text: 'View your listed cars on the platform' },
              { icon: Gavel, text: 'Monitor auction bids on your vehicles' },
              { icon: TrendingUp, text: 'See AI-predicted price for your car' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Test Credentials</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm font-mono">seller@executivecars.pk</p>
                <p className="text-slate-200 text-sm font-mono">seller123</p>
              </div>
              <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full font-semibold">Seller</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Seller Login</h2>
            <p className="text-gray-500 text-sm mt-1">Access your seller dashboard</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center justify-between">
            <div>
              <p className="text-green-700 text-xs font-semibold">Pre-filled test credentials</p>
              <p className="text-green-600 text-xs mt-0.5">seller@executivecars.pk / seller123</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
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
                : <><Lock className="w-4 h-4" /> Sign In to Seller Portal</>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-center">
            <p className="text-gray-500 text-sm">
              New seller?{' '}
              <Link to="/become-a-seller" className="text-blue-600 font-medium hover:underline">Book an Inspection →</Link>
            </p>
            <p className="text-gray-500 text-sm">
              Admin?{' '}
              <Link to="/admin" className="text-blue-600 font-medium hover:underline">Admin Login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
