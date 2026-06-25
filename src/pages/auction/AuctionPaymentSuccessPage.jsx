import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Sparkles } from 'lucide-react'

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    backgroundColor: ['#2563eb', '#60a5fa', '#ffffff', '#1d4ed8', '#93c5fd'][Math.floor(Math.random() * 5)],
    width: `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }))
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p, i) => (
        <div key={i} className="absolute top-0" style={{ ...p, animation: `confetti ${p.animationDuration} ${p.animationDelay} ease-in forwards` }} />
      ))}
    </div>
  )
}

export default function AuctionPaymentSuccessPage() {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      <Confetti />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className={`relative z-10 bg-white border border-gray-200 rounded-3xl p-10 max-w-md w-full text-center shadow-xl transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Animated check */}
        <div className="relative w-20 h-20 mx-auto mb-5">
          <svg className="w-20 h-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#dbeafe" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="6"
              strokeDasharray="283" strokeDashoffset="0" strokeLinecap="round"
              style={{ animation: 'drawCircle 1s ease forwards', transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map(i => (
            <Sparkles key={i} className="w-4 h-4 text-blue-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome to Executive Cars!</h1>
        <p className="text-gray-500 mb-6">Your membership is now active. Start bidding on exclusive cars.</p>

        <div className="flex flex-col gap-3">
          <Link to="/auction/dashboard" className="btn-primary py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-200">
            Go to Auction Dashboard
          </Link>
          <Link to="/" className="btn-ghost py-3.5 rounded-xl font-semibold text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
