import React from 'react'
import SellerLayout from '../../components/SellerLayout.jsx'
import { formatPKR } from '../../utils/format.js'

const MY_LISTINGS = [
  {
    id: 1, car: 'Toyota Corolla 2020', type: 'Auction', price: 3800000,
    status: 'Live', currentBid: 4100000, bidders: 7,
    img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&q=80',
  },
  {
    id: 2, car: 'Honda Civic 2019', type: 'Used Car', price: 3500000,
    status: 'Listed', currentBid: null, bidders: null,
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&q=80',
  },
  {
    id: 3, car: 'Kia Sportage 2021', type: 'Used Car', price: 6500000,
    status: 'Pending Review', currentBid: null, bidders: null,
    img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=200&q=80',
  },
]

const statusClass = { Live: 'badge-green', Listed: 'badge-blue', 'Pending Review': 'badge-yellow' }

export default function SellerListingsPage() {
  return (
    <SellerLayout title="My Listings">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {MY_LISTINGS.map(listing => (
          <div key={listing.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm card-hover">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={listing.img} alt={listing.car} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`${statusClass[listing.status] || 'badge-blue'} text-xs px-2.5 py-1 rounded-full font-medium`}>
                  {listing.status}
                </span>
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">{listing.type}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-gray-900 font-bold">{listing.car}</h3>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{listing.currentBid ? 'Current Bid' : 'Asking Price'}</p>
                  <p className="text-blue-600 font-black text-lg">
                    PKR {formatPKR(listing.currentBid ?? listing.price)}
                  </p>
                </div>
                {listing.bidders !== null && (
                  <p className="text-gray-400 text-xs">{listing.bidders} bidders</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SellerLayout>
  )
}
