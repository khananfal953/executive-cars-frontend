import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Car, CheckCircle2, Eye, EyeOff, Gavel, Lock, Search, UserRound } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginAccount } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true); setError('')
    const result = await loginAccount(form.email, form.password)
    if (result.success) navigate(location.state?.from || '/account', { replace: true })
    else setError(result.message || 'Invalid credentials. Please try again.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 grid lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden lg:flex flex-col justify-center bg-[#0f172a] relative overflow-hidden px-16">
        <div className="absolute inset-0 surface-grid opacity-30" /><div className="absolute right-0 top-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="relative max-w-xl">
          <Link to="/" className="inline-flex items-center gap-3 mb-14"><Logo className="w-11 h-11" /><div><span className="text-white font-black text-xl block leading-none">Executive Cars</span><span className="text-blue-400 text-xs font-semibold">One account for everything</span></div></Link>
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">Buy, sell, and bid with one account</h1>
          <p className="text-slate-400 leading-7 mt-4">Your profile, selling activity, saved marketplace journey, and auction membership all stay under one customer identity.</p>
          <div className="grid grid-cols-3 gap-3 mt-9">
            {[
              { icon: Search, label: 'Browse cars' },
              { icon: Car, label: 'Sell a car' },
              { icon: Gavel, label: 'Join auctions' },
            ].map(({ icon: Icon, label }) => <div key={label} className="bg-white/[0.06] border border-white/10 rounded-xl p-4"><Icon className="w-5 h-5 text-blue-400" /><p className="text-sm font-semibold text-white mt-3">{label}</p></div>)}
          </div>
        </div>
      </section>

      <main className="flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-10"><Logo className="w-10 h-10" /><span className="font-black text-gray-900">Executive <span className="text-blue-600">Cars</span></span></Link>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center"><UserRound className="w-6 h-6 text-blue-600" /></div>
          <h2 className="text-3xl font-black text-gray-900 mt-5">Sign in to your account</h2>
          <p className="text-sm text-gray-500 mt-2">The same login works for buying, selling, and auction membership.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</span><input type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} required autoComplete="email" className={`input-light ${error ? 'border-red-400' : ''}`} /></label>
            <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">Password</span><span className="relative block"><input type={showPass ? 'text' : 'password'} value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} required autoComplete="current-password" className={`input-light pr-11 ${error ? 'border-red-400' : ''}`} /><button type="button" onClick={() => setShowPass(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPass ? 'Hide password' : 'Show password'}>{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></span></label>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm gap-2 disabled:opacity-60">{loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>

          <div className="mt-7 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">New to Executive Cars? <Link to="/signup" className="font-bold text-blue-600 hover:underline">Create one account</Link></p>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400"><CheckCircle2 className="w-4 h-4 text-green-600" /> No separate buyer or seller registration</div>
            <p className="text-xs text-gray-400 text-center mt-5">Administrator? <Link to="/admin/login" className="text-blue-600 hover:underline">Use secure admin login</Link></p>
          </div>
        </div>
      </main>
    </div>
  )
}
