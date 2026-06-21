import React from 'react'
import { Gavel } from 'lucide-react'
import SellerLayout from '../../components/SellerLayout.jsx'
import { formatPKR } from '../../utils/format.js'

const MY_AUCTIONS = [
  { id: 1, car: 'Toyota Corolla 2020', startBid: 3500000, currentBid: 4100000, bidders: 7, endsIn: '2h 34m', status: 'Live' },
  { id: 2, car: 'Honda Civic 2019', startBid: 3200000, currentBid: 3200000, bidders: 0, endsIn: '5 days', status: 'Upcoming' },
]

const statusClass = { Live: 'badge-green', Upcoming: 'badge-blue', Ended: 'badge-red' }

export default function SellerAuctionStatusPage() {
  return (
    <SellerLayout title="Auction Status">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-gray-900 font-bold text-lg">My Cars in Auction</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track live bids on your vehicles.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Car', 'Start Bid', 'Current Bid', 'Bidders', 'Ends In', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MY_AUCTIONS.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-900 font-medium">{a.car}</td>
                  <td className="px-5 py-4 text-gray-600">PKR {formatPKR(a.startBid)}</td>
                  <td className="px-5 py-4 text-blue-600 font-bold">PKR {formatPKR(a.currentBid)}</td>
                  <td className="px-5 py-4 text-gray-600">
                    <span className="flex items-center gap-1"><Gavel className="w-3 h-3" />{a.bidders}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{a.endsIn}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 ${statusClass[a.status]} text-xs px-2.5 py-1 rounded-full font-medium`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  )
}
