import React from 'react'
import { Trophy, Download, Phone, CheckCircle, Calendar } from 'lucide-react'
import AuctionLayout from '../../components/AuctionLayout.jsx'
import { formatPKR } from '../../utils/format.js'

const WON_CARS = [
  {
    id: 6,
    car: 'Hyundai Tucson 2021',
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
    wonBid: 6700000,
    wonDate: '2026-05-10',
    status: 'Payment Pending',
    contact: '+92 300 1234567',
    specs: { km: '44,000 km', engine: '2000cc', transmission: 'Auto', color: 'Grey' },
  },
  {
    id: 99,
    car: 'Toyota Corolla 2021',
    img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
    wonBid: 3900000,
    wonDate: '2026-04-22',
    status: 'Completed',
    contact: '+92 311 9876543',
    specs: { km: '42,000 km', engine: '1800cc', transmission: 'Auto', color: 'White' },
  },
]

export default function AuctionWonCarsPage() {
  return (
    <AuctionLayout title="Won Cars">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Won',        value: WON_CARS.length,                                          color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
          { label: 'Payment Pending',  value: WON_CARS.filter(c => c.status === 'Payment Pending').length, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'    },
          { label: 'Completed',        value: WON_CARS.filter(c => c.status === 'Completed').length,    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
        ].map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm text-center`}>
            <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {WON_CARS.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-lg text-gray-500">No won cars yet</p>
          <p className="text-sm mt-1">Start bidding on live auctions to win your first car!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {WON_CARS.map(car => (
            <div key={car.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
              car.status === 'Completed' ? 'border-green-200' : 'border-yellow-200'
            }`}>
              <div className="flex flex-col sm:flex-row">
                <img src={car.img} alt={car.car} className="w-full sm:w-48 h-36 object-cover shrink-0" />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <h3 className="text-gray-900 font-bold text-lg">{car.car}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          car.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>{car.status}</span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Won on {car.wonDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Winning Bid</p>
                      <p className="text-blue-600 font-black text-2xl">PKR {formatPKR(car.wonBid)}</p>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {Object.entries(car.specs).map(([k, v]) => (
                      <span key={k} className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-lg font-medium">
                        {v}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <div className="relative group">
                      <button disabled className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed">
                        <Download className="w-4 h-4" /> Download Invoice
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Available after backend integration
                      </div>
                    </div>
                    <a href={`tel:${car.contact}`}
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-green-100 transition-colors">
                      <Phone className="w-4 h-4" /> Contact Seller
                    </a>
                    {car.status === 'Completed' && (
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Transfer Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AuctionLayout>
  )
}
