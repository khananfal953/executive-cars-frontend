import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Fuel, Settings, Gauge, Calendar, Mail, Shield } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { formatPKR } from '../utils/format.js'
import api from '../api/api.js'

export default function UsedCarDetailPage() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setCar(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
        <Footer />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Car not found.</p>
            <Link to="/used-cars" className="btn-primary px-6 py-2.5 rounded-xl font-semibold">Back to Listings</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const images = car.images?.length ? car.images : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/used-cars" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Used Cars
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: images + specs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={images[activeImg]} alt={`${car.make} ${car.model}`} loading="lazy"
                    className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-blue-600' : 'border-transparent'}`}>
                        <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Calendar,  label: 'Year',         value: car.year },
                    { icon: Gauge,     label: 'Mileage',      value: `${car.km?.toLocaleString()} km` },
                    { icon: Fuel,      label: 'Fuel',         value: car.fuel },
                    { icon: Settings,  label: 'Transmission', value: car.transmission },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="text-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-gray-400 text-xs">{label}</p>
                      <p className="text-gray-900 font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-gray-900 font-bold text-lg mb-4">Full Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Make',         value: car.make },
                    { label: 'Model',        value: car.model },
                    { label: 'Year',         value: car.year },
                    { label: 'Engine',       value: car.engine ? `${car.engine} cc` : '—' },
                    { label: 'Color',        value: car.color },
                    { label: 'Fuel Type',    value: car.fuel },
                    { label: 'Transmission', value: car.transmission },
                    { label: 'Mileage',      value: `${car.km?.toLocaleString()} km` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="text-gray-900 text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {car.description && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h2 className="text-gray-900 font-bold text-lg mb-3">Description</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
                </div>
              )}
            </div>

            {/* Right: price panel + seller info */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="text-gray-900 font-black text-xl">{car.make} {car.model}</h1>
                </div>
                <span className="inline-flex items-center gap-1 badge-green text-xs px-3 py-1.5 rounded-full font-medium mb-4">
                  <CheckCircle className="w-3 h-3" /> Executive Inspected
                </span>
                <div className="text-3xl font-black primary-text mb-1">PKR {formatPKR(car.price)}</div>
                <p className="text-gray-400 text-xs mb-5">Fixed price listing</p>

                <div className="space-y-3">
                  <Link to="/become-a-seller" className="btn-primary w-full py-3 rounded-xl font-semibold text-center block">
                    Book Inspection
                  </Link>
                  <a href={`mailto:${car.sellerEmail}`} className="btn-ghost w-full py-3 rounded-xl font-semibold text-center block">
                    Contact Seller
                  </a>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-gray-900 font-bold mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(car.sellerEmail || '??').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm break-all">{car.sellerEmail}</p>
                    <p className="text-blue-600 text-xs">Verified Seller</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4 shrink-0" /> {car.sellerEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 shrink-0" /> Identity Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
