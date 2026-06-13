import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gavel, Flame, Search, SlidersHorizontal } from 'lucide-react'
import AuctionLayout from '../../components/AuctionLayout.jsx'
import CountdownTimer from '../../components/CountdownTimer.jsx'
import { formatPKR } from '../../utils/format.js'
import { ALL_AUCTIONS } from '../../data/auctions.js'

export default function AuctionLiveAuctionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('ending')

  const filtered = ALL_AUCTIONS
    .filter(a => {
      const matchSearch = `${a.make} ${a.model}`.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'All' || (filter === 'Hot' && a.hot) || (filter === 'Ending Soon' && a.endsIn.h < 2)
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      if (sort === 'ending') return (a.endsIn.h * 3600 + a.endsIn.m * 60 + a.endsIn.s) - (b.endsIn.h * 3600 + b.endsIn.m * 60 + b.endsIn.s)
      if (sort === 'bid-high') return b.currentBid - a.currentBid
      if (sort === 'bid-low') return a.currentBid - b.currentBid
      return b.bidders - a.bidders
    })

  return (
    <AuctionLayout title="Live Auctions">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search make or model..."
              className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 w-52 shadow-sm" />
          </div>
          <div className="flex gap-1">
            {['All', 'Hot', 'Ending Soon'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">{filtered.length} auctions</span>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm">
            <option value="ending">Ending Soonest</option>
            <option value="bid-high">Highest Bid</option>
            <option value="bid-low">Lowest Bid</option>
            <option value="bidders">Most Bidders</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(car => (
          <Link key={car.id} to={`/auction/car/${car.id}`}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden card-hover group shadow-sm">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={car.img} alt={`${car.make} ${car.model}`} loading="lazy"
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
              <div className="absolute bottom-3 left-3 bg-black/50 rounded-lg px-2 py-1">
                <CountdownTimer endsIn={car.endsIn} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 font-bold">{car.make} {car.model} {car.year}</h3>
              <p className="text-gray-400 text-xs mt-0.5">{car.km.toLocaleString()} km · {car.engine}</p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-gray-400 text-xs">Current Bid</p>
                  <p className="text-blue-600 font-black text-lg">PKR {formatPKR(car.currentBid)}</p>
                  <p className="text-gray-400 text-xs">Base: PKR {formatPKR(car.baseBid)}</p>
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

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No auctions match your search.</p>
        </div>
      )}
    </AuctionLayout>
  )
}
