import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gavel, Flame, Search, SlidersHorizontal } from 'lucide-react'
import AuctionLayout from '../../components/AuctionLayout.jsx'
import CountdownTimer from '../../components/CountdownTimer.jsx'
import { formatPKR } from '../../utils/format.js'

const ALL_AUCTIONS = [
  { id: 1, make: 'Toyota',   model: 'Land Cruiser', year: 2020, km: 45000,  engine: '4000cc', currentBid: 12500000, baseBid: 11000000, bidders: 14, endsIn: { h: 2,  m: 34, s: 12 }, hot: true,  img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80' },
  { id: 2, make: 'Honda',    model: 'Civic',        year: 2022, km: 18000,  engine: '1500cc', currentBid: 4200000,  baseBid: 3800000,  bidders: 8,  endsIn: { h: 5,  m: 10, s: 45 }, hot: false, img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80' },
  { id: 3, make: 'Kia',      model: 'Sportage',     year: 2021, km: 38000,  engine: '2000cc', currentBid: 5800000,  baseBid: 5200000,  bidders: 11, endsIn: { h: 0,  m: 48, s: 30 }, hot: true,  img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80' },
  { id: 4, make: 'Toyota',   model: 'Fortuner',     year: 2019, km: 78000,  engine: '2700cc', currentBid: 9100000,  baseBid: 8500000,  bidders: 6,  endsIn: { h: 12, m: 5,  s: 0  }, hot: false, img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80' },
  { id: 5, make: 'Hyundai',  model: 'Tucson',       year: 2021, km: 44000,  engine: '2000cc', currentBid: 6700000,  baseBid: 6000000,  bidders: 9,  endsIn: { h: 1,  m: 22, s: 18 }, hot: true,  img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80' },
  { id: 6, make: 'Suzuki',   model: 'Jimny',        year: 2023, km: 12000,  engine: '1300cc', currentBid: 4900000,  baseBid: 4500000,  bidders: 5,  endsIn: { h: 8,  m: 0,  s: 0  }, hot: false, img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80' },
  { id: 7, make: 'BMW',      model: '3 Series',     year: 2020, km: 35000,  engine: '2000cc', currentBid: 8500000,  baseBid: 7800000,  bidders: 7,  endsIn: { h: 3,  m: 15, s: 0  }, hot: true,  img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=80' },
  { id: 8, make: 'Honda',    model: 'HR-V',         year: 2021, km: 28000,  engine: '1800cc', currentBid: 5200000,  baseBid: 4800000,  bidders: 4,  endsIn: { h: 6,  m: 40, s: 0  }, hot: false, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80' },
  { id: 9, make: 'Toyota',   model: 'Yaris',        year: 2023, km: 8000,   engine: '1300cc', currentBid: 3100000,  baseBid: 2800000,  bidders: 3,  endsIn: { h: 24, m: 0,  s: 0  }, hot: false, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
]

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
