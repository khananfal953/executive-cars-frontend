import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react'

const benefits = [
  'Unlimited bids on all auctions',
  'Full inspection reports access',
  'Priority customer support',
  'Exclusive members-only listings',
  'Real-time bidding notifications',
]

export default function AuctionPaymentPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: 'Ahmed Raza', card: '4111 1111 1111 1111', expiry: '12/27', cvv: '123' })
  const [cardType, setCardType] = useState('Visa')
  const [loading, setLoading] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4)
    return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }
  const detectCard = (val) => {
    const d = val.replace(/\s/g, '')
    if (d.startsWith('4')) setCardType('Visa')
    else if (d.startsWith('5')) setCardType('Mastercard')
    else setCardType('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    navigate('/auction/payment-success')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#2563eb"/>
              <path d="M12 20L20 12L28 20L20 28L12 20Z" fill="white"/>
              <circle cx="20" cy="20" r="3" fill="#2563eb"/>
            </svg>
            <span className="text-gray-900 font-bold text-lg">Executive <span className="primary-text">Cars</span></span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="w-16 h-1 bg-blue-600 rounded-full" />
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
          </div>
          <div className="flex justify-center gap-16 text-xs">
            <span className="text-blue-600 font-semibold">Account</span>
            <span className="text-blue-600 font-semibold">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-gray-900 font-bold text-lg mb-6">Order Summary</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-900 font-bold">Executive Auction Membership</span>
                <span className="text-blue-600 font-black text-xl">PKR 4,999</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Annual membership — full platform access</p>
              <ul className="space-y-2">
                {benefits.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-blue-600 font-black text-xl">PKR 4,999</span>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
              {[{ icon: Lock, label: 'SSL Secured' }, { icon: Shield, label: 'Stripe Protected' }, { icon: CheckCircle, label: 'Verified' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900 font-bold text-lg">Payment Details</h3>
            </div>
            <p className="text-gray-400 text-xs mb-6">Pre-filled with test card — just click Pay</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="input-light" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                <div className="relative">
                  <input type="text" value={form.card}
                    onChange={e => { const v = formatCard(e.target.value); update('card', v); detectCard(v) }}
                    required className="input-light pr-20 font-mono" />
                  {cardType && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
                      {cardType}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                  <input type="text" value={form.expiry} onChange={e => update('expiry', formatExpiry(e.target.value))}
                    placeholder="MM/YY" required className="input-light font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                  <input type="text" value={form.cvv} onChange={e => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••" required className="input-light font-mono" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-200">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  : <><Lock className="w-4 h-4" /> Pay PKR 4,999</>
                }
              </button>
              <p className="text-center text-gray-400 text-xs flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secured with 256-bit SSL encryption
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
