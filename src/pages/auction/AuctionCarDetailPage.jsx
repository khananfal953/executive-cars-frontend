import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeft, Gavel, FileText, Download, Users, Timer,
  Settings, Fuel, Gauge, Calendar, Palette, CheckCircle, Car,
  TrendingUp, Zap, Bell
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import CountdownTimer from '../../components/CountdownTimer.jsx'
import { formatPKR } from '../../utils/format.js'

// ── Dummy bidders that auto-bid ──────────────────────────────────────────────
const AUTO_BIDDERS = [
  { name: 'AH***', avatar: 'AH' },
  { name: 'MK***', avatar: 'MK' },
  { name: 'SA***', avatar: 'SA' },
  { name: 'WT***', avatar: 'WT' },
  { name: 'RB***', avatar: 'RB' },
  { name: 'ZK***', avatar: 'ZK' },
]

const CAR_DATA = {
  1: {
    make: 'Toyota', model: 'Land Cruiser', year: 2020, km: 45000,
    engine: '4000cc', fuel: 'Petrol', transmission: 'Auto', color: 'White',
    startBid: 11000000, bidders: 14,
    endsIn: { d: 0, h: 2, m: 34, s: 12 },
    img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
    ],
    desc: 'Excellent condition Toyota Land Cruiser with full service history. Single owner, all original parts. Comprehensive inspection report available. Islamabad registered, all taxes paid.',
  },
  2: {
    make: 'Honda', model: 'Civic', year: 2022, km: 18000,
    engine: '1500cc', fuel: 'Petrol', transmission: 'Auto', color: 'Black',
    startBid: 3800000, bidders: 8,
    endsIn: { d: 0, h: 5, m: 10, s: 45 },
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80',
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80',
    ],
    desc: 'Low mileage Honda Civic in pristine condition. Fully inspected with all documents clear. Original paint, no accidents.',
  },
  3: {
    make: 'Kia', model: 'Sportage', year: 2021, km: 38000,
    engine: '2000cc', fuel: 'Petrol', transmission: 'Auto', color: 'Red',
    startBid: 5200000, bidders: 11,
    endsIn: { d: 0, h: 0, m: 48, s: 30 },
    img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
    ],
    desc: 'Kia Sportage in excellent condition. Full service history, original parts. Islamabad registered.',
  },
}

export default function AuctionCarDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const car = CAR_DATA[id] || CAR_DATA[1]

  const [currentBid, setCurrentBid] = useState(car.startBid + 500000)
  const [bidAmount, setBidAmount] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [bidHistory, setBidHistory] = useState([
    { user: AUTO_BIDDERS[0].name, avatar: AUTO_BIDDERS[0].avatar, amount: car.startBid + 500000, time: '2 min ago', isMe: false },
    { user: AUTO_BIDDERS[1].name, avatar: AUTO_BIDDERS[1].avatar, amount: car.startBid + 300000, time: '8 min ago', isMe: false },
    { user: AUTO_BIDDERS[2].name, avatar: AUTO_BIDDERS[2].avatar, amount: car.startBid + 150000, time: '15 min ago', isMe: false },
    { user: AUTO_BIDDERS[3].name, avatar: AUTO_BIDDERS[3].avatar, amount: car.startBid + 50000, time: '22 min ago', isMe: false },
  ])
  const [totalBidders, setTotalBidders] = useState(car.bidders)
  const [myBidPlaced, setMyBidPlaced] = useState(false)
  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidError, setBidError] = useState('')
  const [liveActivity, setLiveActivity] = useState(null)
  const bidListRef = useRef(null)

  const minBid = currentBid + 50000

  // ── Auto-bid simulation: random bidder bids every 8-20 seconds ──────────────
  useEffect(() => {
    const schedule = () => {
      const delay = 8000 + Math.random() * 12000
      return setTimeout(() => {
        const bidder = AUTO_BIDDERS[Math.floor(Math.random() * AUTO_BIDDERS.length)]
        const increment = [50000, 100000, 150000, 200000][Math.floor(Math.random() * 4)]
        setCurrentBid(prev => {
          const newBid = prev + increment
          const entry = {
            user: bidder.name,
            avatar: bidder.avatar,
            amount: newBid,
            time: 'Just now',
            isMe: false,
          }
          setBidHistory(h => [entry, ...h.slice(0, 9)])
          setTotalBidders(b => b + (Math.random() > 0.6 ? 1 : 0))
          setLiveActivity(`${bidder.name} just bid PKR ${formatPKR(newBid)}!`)
          setTimeout(() => setLiveActivity(null), 4000)
          return newBid
        })
        timerRef.current = schedule()
      }, delay)
    }
    const timerRef = { current: schedule() }
    return () => clearTimeout(timerRef.current)
  }, [])

  // Scroll bid list to top on new bid
  useEffect(() => {
    bidListRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [bidHistory])

  const handleBid = (e) => {
    e.preventDefault()
    setBidError('')
    const amount = Number(bidAmount)
    if (amount < minBid) {
      setBidError(`Minimum bid is PKR ${formatPKR(minBid)}`)
      return
    }
    const myName = user?.name ? user.name.split(' ')[0] + '***' : 'You***'
    const entry = {
      user: myName,
      avatar: (user?.name || 'ME').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      amount,
      time: 'Just now',
      isMe: true,
    }
    setCurrentBid(amount)
    setBidHistory(h => [entry, ...h.slice(0, 9)])
    setMyBidPlaced(true)
    setBidSuccess(true)
    setBidAmount('')
    setTimeout(() => setBidSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/auction/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:block">Back to Auctions</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            {/* Live activity toast */}
            {liveActivity && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-full animate-fadeInUp font-medium">
                <Zap className="w-3 h-3 text-blue-500" />
                {liveActivity}
              </div>
            )}
            <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE AUCTION
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Images + Specs ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Gallery */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={car.imgs[activeImg]} alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex gap-2 p-3 bg-gray-50">
                {car.imgs.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-blue-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car title + specs */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h1 className="text-gray-900 font-black text-2xl mb-1">{car.make} {car.model} {car.year}</h1>
              <p className="text-gray-500 text-sm mb-5">{car.km.toLocaleString()} km · {car.color} · {car.transmission}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Settings, label: 'Engine', value: car.engine },
                  { icon: Fuel, label: 'Fuel', value: car.fuel },
                  { icon: Gauge, label: 'Transmission', value: car.transmission },
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: `${car.km.toLocaleString()} km` },
                  { icon: Palette, label: 'Color', value: car.color },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                    <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">{label}</p>
                      <p className="text-gray-900 text-sm font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspection Report */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900 font-bold">Inspection Report</h3>
                  <span className="badge-green text-xs px-2 py-0.5 rounded-full font-medium">Verified</span>
                </div>
                <button className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download PDF
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Engine Condition', score: 9 },
                  { label: 'Body Condition', score: 8 },
                  { label: 'Interior', score: 9 },
                  { label: 'Tyres', score: 7 },
                  { label: 'Brakes', score: 9 },
                  { label: 'AC System', score: 10 },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gray-700 text-xs font-medium">{item.label}</span>
                      <span className="text-green-600 text-xs font-bold">{item.score}/10</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.score * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{car.desc}</p>
            </div>
          </div>

          {/* ── RIGHT: Live Bid Panel ── */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-sm sticky top-20">

              {/* Current bid */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Current Highest Bid</p>
                <p className="text-blue-600 font-black text-4xl leading-none">PKR {formatPKR(currentBid)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{totalBidders} bidders</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+PKR {formatPKR(currentBid - car.startBid)} above start</span>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700 text-sm font-semibold">Auction ends in</span>
                </div>
                <CountdownTimer endsIn={car.endsIn} showDays={true} />
              </div>

              {/* Bid form */}
              {bidSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-4 animate-scaleIn">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-bold text-sm">Bid Placed Successfully!</p>
                  <p className="text-green-600 text-xs mt-1">You are the highest bidder</p>
                </div>
              ) : (
                <form onSubmit={handleBid} className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Your Bid <span className="text-gray-400 font-normal">(min: PKR {formatPKR(minBid)})</span>
                    </label>
                    <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                      min={minBid} step={50000} placeholder={`PKR ${formatPKR(minBid)}`}
                      className={`input-light ${bidError ? 'border-red-400' : ''}`} />
                    {bidError && <p className="text-red-500 text-xs mt-1">{bidError}</p>}
                  </div>
                  {/* Quick bid buttons */}
                  <div className="flex gap-2">
                    {[minBid, minBid + 100000, minBid + 200000].map(amt => (
                      <button key={amt} type="button" onClick={() => setBidAmount(String(amt))}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                        {formatPKR(amt)}
                      </button>
                    ))}
                  </div>
                  <button type="submit"
                    className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200">
                    <Gavel className="w-4 h-4" /> Place Bid
                  </button>
                </form>
              )}

              {myBidPlaced && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                  <Bell className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-blue-700 text-xs">You'll be notified if someone outbids you.</p>
                </div>
              )}

              {/* Live bid history */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gray-900 font-bold text-sm">Live Bid Feed</h4>
                  <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                  </span>
                </div>
                <div ref={bidListRef} className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {bidHistory.map((bid, i) => (
                    <div key={i}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        i === 0 ? 'bg-blue-50 border border-blue-200' :
                        bid.isMe ? 'bg-green-50 border border-green-200' :
                        'bg-gray-50 border border-gray-100'
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        bid.isMe ? 'bg-green-600 text-white' :
                        i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {bid.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-900 text-xs font-semibold">{bid.user}</span>
                          {bid.isMe && <span className="text-green-600 text-xs">(You)</span>}
                          {i === 0 && !bid.isMe && <span className="text-blue-600 text-xs">🏆 Leading</span>}
                        </div>
                        <p className="text-gray-400 text-xs">{bid.time}</p>
                      </div>
                      <span className={`font-bold text-sm shrink-0 ${
                        bid.isMe ? 'text-green-600' : i === 0 ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        PKR {formatPKR(bid.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
