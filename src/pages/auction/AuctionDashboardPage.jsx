import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gavel, TrendingUp, Trophy, Clock, Flame, ArrowUpRight } from 'lucide-react'
import AuctionLayout from '../../components/AuctionLayout.jsx'
import CountdownTimer from '../../components/CountdownTimer.jsx'
import { formatPKR } from '../../utils/format.js'

const AUCTIONS = [
  { id: 1, make: 'Toyota',  model: 'Land Cruiser', year: 2020, currentBid: 12500000, bidders: 14, endsIn: { h: 2, m: 34, s: 12 }, hot: true,  img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80' },
  { id: 2, make: 'Honda',   model: 'Civic',        year: 2022, currentBid: 4200000,  bidders: 8,  endsIn: { h: 5, m: 10, s: 45 }, hot: false, img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80' },
  { id: 3, make: 'Kia',     model: 'Sportage',     year: 2021, currentBid: 5800000,  bidders: 11, endsIn: { h: 0, m: 48, s: 30 }, hot: true,  img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80' },
  { id: 4, make: 'Toyota',  model: 'Fortuner',     year: 2019, currentBid: 9100000,  bidders: 6,  endsIn: { h: 12, m: 5, s: 0 },  hot: false, img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80' },
  { id: 5, make: 'Hyundai', model: 'Tucson',       year: 2021, currentBid: 6700000,  bidders: 9,  endsIn: { h: 1, m: 22, s: 18 }, hot: true,  img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
  { id: 6, make: 'Suzuki',  model: 'Jimny',        year: 2023, currentBid: 4900000,  bidders: 5,  endsIn: { h: 8, m: 0, s: 0 },   hot: false, img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80' },
]

const stats = [
  { icon: Gavel,     label: 'Active Auctions', value: 6,   bg: 'bg-blue-50',   color: 'text-blue-600',   border: 'border-blue-200'   },
  { icon: TrendingUp,label: 'My Total Bids',   value: 12,  bg: 'bg-green-50',  color: 'text-green-600',  border: 'border-green-200'  },
  { icon: Trophy,    label: 'Auctions Won',    value: 2,   bg: 'bg-yellow-50', color: 'text-yellow-600', border: 'border-yellow-200' },
  { icon: Clock,     label: 'Days Left',       value: 287, bg: 'bg-purple-50', color: 'text-purple-600', border: 'border-purple-200' },
]

export default function AuctionDashboardPage() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'Hot'
    ? AUCTIONS.filter(a => a.hot)
    : filter === 'Ending Soon'
    ? AUCTIONS.filter(a => a.endsIn.h < 2)
    : AUCTIONS

  return (
    <AuctionLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live Auctions header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-gray-900 font-bold text-xl">Live Auctions</h2>
          <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['All', 'Hot', 'Ending Soon'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>{f}</button>
            ))}
          </div>
          <Link to="/auction/live" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 ml-2">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Auction cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(car => (
          <Link key={car.id} to={`/auction/car/${car.id}`}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden card-hover group shadow-sm">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={car.img} alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                {car.hot && (
                  <span className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                    <Flame className="w-3 h-3" /> Hot
                  </span>
                )}
                <span className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <CountdownTimer endsIn={car.endsIn} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 font-bold">{car.make} {car.model} {car.year}</h3>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-gray-400 text-xs">Current Bid</p>
                  <p className="text-blue-600 font-black text-lg">PKR {formatPKR(car.currentBid)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">{car.bidders} bidders</p>
                  <button className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold mt-1 flex items-center gap-1">
                    <Gavel className="w-3 h-3" /> Bid Now
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AuctionLayout>
  )
}
