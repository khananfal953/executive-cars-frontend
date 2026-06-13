import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle, Crown, ArrowRight } from 'lucide-react'
import Logo from '../../components/Logo.jsx'

const perks = [
  'Access to all live car auctions',
  'Real-time bidding with instant updates',
  'Full inspection reports for every car',
  'Exclusive members-only listings',
  'Priority customer support',
  'Bid history and won cars tracking',
]

export default function AuctionSignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', terms: false })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/auction/payment')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-12">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <Logo className="w-9 h-9" />
            <span className="text-white font-black text-lg">Executive <span className="animated-gradient-text">Cars</span></span>
          </Link>

          <Crown className="w-12 h-12 text-blue-400 mb-5" />
          <h2 className="text-4xl font-black text-white mb-3">
            Join Executive<br /><span className="animated-gradient-text">Auctions</span>
          </h2>
          <p className="text-slate-400 mb-8">Pakistan's most transparent car auction platform.</p>

          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-300 text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-600 font-semibold">Account Details</span>
              <span className="text-gray-400">Payment</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-6">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Muhammad Hasnain Ali' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+92 300 1234567' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                  placeholder={f.placeholder} required className="input-light" />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min. 8 characters" required className="input-light pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={e => update('confirm', e.target.value)}
                  placeholder="Repeat password" required className="input-light pr-10" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={e => update('terms', e.target.checked)} required className="mt-0.5 accent-blue-600" />
              <span className="text-gray-500 text-sm">
                I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-200">
              Proceed to Payment <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already a member?{' '}
            <Link to="/auction/login" className="text-blue-600 font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
