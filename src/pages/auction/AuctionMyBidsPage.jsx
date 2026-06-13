import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gavel, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react'
import AuctionLayout from '../../components/AuctionLayout.jsx'
import { formatPKR } from '../../utils/format.js'

const MY_BIDS = [
  { id: 1, car: 'Toyota Land Cruiser 2020', img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=200&q=80', myBid: 12500000, currentBid: 12500000, status: 'Leading',  endsIn: '2h 34m', bidders: 14 },
  { id: 2, car: 'Honda Civic 2022',         img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&q=80', myBid: 4000000,  currentBid: 4200000,  status: 'Outbid',   endsIn: '5h 10m', bidders: 8  },
  { id: 3, car: 'Kia Sportage 2021',        img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=200&q=80', myBid: 5500000,  currentBid: 5800000,  status: 'Outbid',   endsIn: '48m',    bidders: 11 },
  { id: 4, car: 'Toyota Fortuner 2019',     img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&q=80', myBid: 9100000,  currentBid: 9100000,  status: 'Leading',  endsIn: '12h 5m', bidders: 6  },
  { id: 5, car: 'BMW 3 Series 2020',        img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&q=80', myBid: 8200000,  currentBid: 8500000,  status: 'Outbid',   endsIn: '3h 15m', bidders: 7  },
  { id: 6, car: 'Hyundai Tucson 2021',      img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=80', myBid: 6700000,  currentBid: 6700000,  status: 'Won',      endsIn: 'Ended',  bidders: 9  },
]

const statusConfig = {
  Leading: { color: 'badge-green', icon: TrendingUp,   text: 'You are leading' },
  Outbid:  { color: 'badge-red',   icon: TrendingDown, text: 'You were outbid' },
  Won:     { color: 'bg-yellow-50 text-yellow-700 border border-yellow-200', icon: CheckCircle, text: 'You won!' },
}

export default function AuctionMyBidsPage() {
  const [filter, setFilter] = useState('All')

  const filtered = MY_BIDS.filter(b =>
    filter === 'All' || b.status === filter
  )

  const leading = MY_BIDS.filter(b => b.status === 'Leading').length
  const outbid  = MY_BIDS.filter(b => b.status === 'Outbid').length
  const won     = MY_BIDS.filter(b => b.status === 'Won').length

  return (
    <AuctionLayout title="My Bids">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Bids',  value: MY_BIDS.length, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
          { label: 'Leading',     value: leading,         color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
          { label: 'Outbid',      value: outbid,          color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'    },
        ].map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm text-center`}>
            <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['All', 'Leading', 'Outbid', 'Won'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}>{f}</button>
        ))}
      </div>

      {/* Bids list */}
      <div className="space-y-3">
        {filtered.map(bid => {
          const cfg = statusConfig[bid.status]
          const Icon = cfg.icon
          const isLeading = bid.status === 'Leading'
          const isOutbid  = bid.status === 'Outbid'

          return (
            <div key={bid.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4 ${
              isLeading ? 'border-green-200' : isOutbid ? 'border-red-200' : 'border-yellow-200'
            }`}>
              <img src={bid.img} alt={bid.car} className="w-20 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-900 font-bold text-sm truncate">{bid.car}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.color}`}>
                    {bid.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>My bid: <span className="font-semibold text-gray-700">PKR {formatPKR(bid.myBid)}</span></span>
                  <span>Current: <span className={`font-semibold ${isOutbid ? 'text-red-600' : 'text-blue-600'}`}>PKR {formatPKR(bid.currentBid)}</span></span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{bid.endsIn}</span>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                  isLeading ? 'text-green-600' : isOutbid ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  <Icon className="w-3 h-3" />{cfg.text}
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-2">
                {isOutbid && (
                  <Link to={`/auction/car/${bid.id}`}
                    className="btn-primary px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Gavel className="w-3 h-3" /> Rebid
                  </Link>
                )}
                {isLeading && (
                  <Link to={`/auction/car/${bid.id}`}
                    className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-green-100 transition-colors">
                    <ArrowUpRight className="w-3 h-3" /> View
                  </Link>
                )}
                {bid.status === 'Won' && (
                  <span className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Won
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No bids in this category.</p>
        </div>
      )}
    </AuctionLayout>
  )
}
