import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Heart, Eye, Fuel, Settings, Gauge, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { formatPKR } from '../utils/format.js'
import { CARS } from '../data/cars.js'

const brands = ['All', 'Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai']
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Hybrid']

function FilterPanel({ selectedBrands, toggleBrand, priceRange, setPriceRange, mileageMax, setMileageMax, transmission, setTransmission, selectedFuels, toggleFuel }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-gray-900 font-semibold text-sm mb-3">Brand</h4>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <button key={b} onClick={() => toggleBrand(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedBrands.includes(b) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-gray-900 font-semibold text-sm mb-2">Price Range: <span className="text-blue-600">PKR {formatPKR(priceRange[1])}</span></h4>
        <input type="range" min={0} max={10000000} step={100000} value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} className="w-full accent-blue-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>1 Cr</span></div>
      </div>
      <div>
        <h4 className="text-gray-900 font-semibold text-sm mb-2">Max Mileage: <span className="text-blue-600">{mileageMax.toLocaleString()} km</span></h4>
        <input type="range" min={0} max={150000} step={5000} value={mileageMax} onChange={e => setMileageMax(+e.target.value)} className="w-full accent-blue-600" />
      </div>
      <div>
        <h4 className="text-gray-900 font-semibold text-sm mb-3">Transmission</h4>
        <div className="flex gap-2">
          {['All', 'Auto', 'Manual'].map(t => (
            <button key={t} onClick={() => setTransmission(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                transmission === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}>{t}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-gray-900 font-semibold text-sm mb-3">Fuel Type</h4>
        <div className="space-y-2">
          {fuelTypes.map(f => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selectedFuels.includes(f)} onChange={() => toggleFuel(f)} className="accent-blue-600" />
              <span className="text-gray-600 text-sm">{f}</span>
            </label>
          ))}
        </div>
      </div>
      <button className="btn-primary w-full py-3 rounded-xl font-semibold text-sm">Apply Filters</button>
    </div>
  )
}

export default function UsedCarsPage() {
  const [selectedBrands, setSelectedBrands] = useState(['All'])
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [mileageMax, setMileageMax] = useState(100000)
  const [transmission, setTransmission] = useState('All')
  const [selectedFuels, setSelectedFuels] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [saved, setSaved] = useState([])
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const PER_PAGE = 6

  const toggleBrand = (b) => {
    if (b === 'All') { setSelectedBrands(['All']); return }
    const next = selectedBrands.filter(x => x !== 'All')
    setSelectedBrands(next.includes(b) ? (next.filter(x => x !== b).length ? next.filter(x => x !== b) : ['All']) : [...next, b])
  }
  const toggleFuel = (f) => setSelectedFuels(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  const toggleSave = (id) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const filtered = CARS.filter(c => {
    if (!selectedBrands.includes('All') && !selectedBrands.includes(c.make)) return false
    if (c.price > priceRange[1]) return false
    if (c.km > mileageMax) return false
    if (transmission !== 'All' && c.transmission !== transmission) return false
    if (selectedFuels.length > 0 && !selectedFuels.includes(c.fuel)) return false
    if (search && !`${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'km-asc') return a.km - b.km
    return b.year - a.year
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900">Used <span className="primary-text">Cars</span></h1>
            <p className="text-gray-500 mt-1">All vehicles are professionally inspected and verified.</p>
          </div>

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search make or model..."
                  className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 w-64 shadow-sm" />
              </div>
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">{filtered.length} results</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm">
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="km-asc">Lowest Mileage</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-60 shrink-0">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-20 shadow-sm">
                <FilterPanel
                  selectedBrands={selectedBrands} toggleBrand={toggleBrand}
                  priceRange={priceRange} setPriceRange={setPriceRange}
                  mileageMax={mileageMax} setMileageMax={setMileageMax}
                  transmission={transmission} setTransmission={setTransmission}
                  selectedFuels={selectedFuels} toggleFuel={toggleFuel}
                />
              </div>
            </aside>

            {/* Cards */}
            <div className="flex-1">
              {paginated.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No cars match your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map(car => (
                    <div key={car.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden card-hover group shadow-sm">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={car.img} alt={`${car.make} ${car.model}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {car.inspected && (
                            <span className="badge-green text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                              <CheckCircle className="w-3 h-3" /> Inspected
                            </span>
                          )}
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">{car.year}</span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">{car.km.toLocaleString()} km</span>
                        </div>
                        <button onClick={() => toggleSave(car.id)}
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition-all hover:scale-110">
                          <Heart className={`w-4 h-4 ${saved.includes(car.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-gray-900 font-bold text-base">{car.make} {car.model}</h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Settings className="w-3 h-3" />{car.engine}</span>
                          <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel}</span>
                          <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{car.transmission}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-blue-600 font-black text-lg">PKR {formatPKR(car.price)}</span>
                          <Link to={`/used-cars/${car.id}`} className="btn-ghost px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                            <Eye className="w-3 h-3" /> View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <FilterPanel
              selectedBrands={selectedBrands} toggleBrand={toggleBrand}
              priceRange={priceRange} setPriceRange={setPriceRange}
              mileageMax={mileageMax} setMileageMax={setMileageMax}
              transmission={transmission} setTransmission={setTransmission}
              selectedFuels={selectedFuels} toggleFuel={toggleFuel}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
