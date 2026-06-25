import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, Shield, Car, Gavel } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const ROLES = [
  { key: 'buyer',  label: 'Member',  icon: Gavel,  description: 'Bid on live auctions' },
  { key: 'seller', label: 'Seller',  icon: Car,    description: 'Track your listings' },
  { key: 'admin',  label: 'Admin',   icon: Shield, description: 'Manage the platform' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginSeller, loginAuction } = useAuth()
  const [role, setRole] = useState('buyer')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(false)

    let result
    if (role === 'admin') result = await login(form.email, form.password)
    else if (role === 'seller') result = await loginSeller(form.email, form.password)
    else result = await loginAuction(form.email, form.password)

    if (result.success) {
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'seller') navigate('/seller/dashboard')
      else navigate('/auction/dashboard')
    } else {
      setError(true)
    }
    setLoading(false)
  }

  const activeRole = ROLES.find(r => r.key === role)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col w-3/5 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-400/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <Logo className="w-10 h-10" />
            <div>
              <span className="text-white font-black text-xl block leading-none">Executive Cars</span>
              <span className="text-blue-400 text-xs font-medium">Sign In</span>
            </div>
          </Link>

          <activeRole.icon className="w-14 h-14 text-blue-400 mb-6" />
          <h2 className="text-4xl font-black text-white mb-3 leading-tight">
            Welcome Back<br /><span className="animated-gradient-text">{activeRole.label}</span>
          </h2>
          <p className="text-slate-400 text-base mb-10">{activeRole.description}</p>

          <div className="space-y-3">
            {ROLES.map(r => (
              <div key={r.key} className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                role === r.key ? 'bg-blue-600/15 border-blue-500/30' : 'bg-white/5 border-white/10'
              }`}>
                <r.icon className={`w-4 h-4 ${role === r.key ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className={`text-sm ${role === r.key ? 'text-blue-300 font-medium' : 'text-slate-400'}`}>{r.label} — {r.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">Choose your account type and sign in</p>
          </div>

          {/* Role tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(r => (
              <button key={r.key} type="button" onClick={() => { setRole(r.key); setError(false) }}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all border ${
                  role === r.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300'
                }`}>
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
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
                : <><Lock className="w-4 h-4" /> Sign In as {activeRole.label}</>
              }
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2">
            <p className="text-gray-500 text-sm">
              New here?{' '}
              <Link to="/auction/signup" className="text-blue-600 font-medium hover:underline">Become a Member →</Link>
            </p>
            <p className="text-gray-500 text-sm">
              Want to sell your car?{' '}
              <Link to="/become-a-seller" className="text-blue-600 font-medium hover:underline">Book an Inspection →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
