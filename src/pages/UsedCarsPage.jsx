import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Bell, CheckCircle2, ChevronLeft, ChevronRight, Fuel, Gauge, Heart, MapPin,
  Search, Settings, ShieldCheck, SlidersHorizontal, X,
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { formatPKR } from '../utils/format.js'
import api from '../api/api.js'

const brands = ['All', 'Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai']
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Hybrid']
function FilterPanel({ filters, actions, onDone }) {
  const { selectedBrands, priceMax, mileageMax, transmission, selectedFuels } = filters
  const { toggleBrand, setPriceMax, setMileageMax, setTransmission, toggleFuel, resetFilters } = actions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Filter results</h3>
        <button type="button" onClick={resetFilters} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Reset all</button>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">Make</h4>
        <div className="flex flex-wrap gap-2">
          {brands.map(brand => (
            <button key={brand} type="button" onClick={() => toggleBrand(brand)} className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${selectedBrands.includes(brand) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>{brand}</button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Maximum price</h4>
        <p className="text-sm font-bold text-blue-600 mb-2">PKR {formatPKR(priceMax)}</p>
        <input type="range" min={1000000} max={20000000} step={250000} value={priceMax} onChange={event => setPriceMax(Number(event.target.value))} className="w-full accent-blue-600" />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>10 Lacs</span><span>2 Crore</span></div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Maximum mileage</h4>
        <p className="text-sm font-bold text-blue-600 mb-2">{mileageMax.toLocaleString()} km</p>
        <input type="range" min={5000} max={200000} step={5000} value={mileageMax} onChange={event => setMileageMax(Number(event.target.value))} className="w-full accent-blue-600" />
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">Transmission</h4>
        <div className="grid grid-cols-3 gap-2">
          {['All', 'Auto', 'Manual'].map(option => (
            <button key={option} type="button" onClick={() => setTransmission(option)} className={`py-2 rounded-md text-xs font-semibold border ${transmission === option ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-200 hover:border-blue-300'}`}>{option}</button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">Fuel type</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {fuelTypes.map(fuel => (
            <label key={fuel} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={selectedFuels.includes(fuel)} onChange={() => toggleFuel(fuel)} className="w-4 h-4 rounded accent-blue-600" />{fuel}
            </label>
          ))}
        </div>
      </div>

      {onDone && <button type="button" onClick={onDone} className="btn-primary w-full py-3 text-sm">Show results</button>}
    </div>
  )
}

export default function UsedCarsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryBudget = Number(searchParams.get('budget')) || 20000000
  const [selectedBrands, setSelectedBrands] = useState(['All'])
  const [priceMax, setPriceMax] = useState(queryBudget)
  const [mileageMax, setMileageMax] = useState(200000)
  const [transmission, setTransmission] = useState('All')
  const [selectedFuels, setSelectedFuels] = useState([])
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('newest')
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ec_wishlist') || '[]') } catch { return [] }
  })
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const PER_PAGE = 6

  useEffect(() => {
    let active = true
    api.get('/products')
      .then(response => {
        if (!active) return
        setCars(Array.isArray(response.data) ? response.data : [])
      })
      .catch(() => { if (active) { setCars([]); setLoadError(true) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => setPage(1), [selectedBrands, priceMax, mileageMax, transmission, selectedFuels, search, sort])

  const toggleBrand = (brand) => {
    if (brand === 'All') return setSelectedBrands(['All'])
    setSelectedBrands(current => {
      const clean = current.filter(item => item !== 'All')
      if (clean.includes(brand)) {
        const next = clean.filter(item => item !== brand)
        return next.length ? next : ['All']
      }
      return [...clean, brand]
    })
  }
  const toggleFuel = (fuel) => setSelectedFuels(current => current.includes(fuel) ? current.filter(item => item !== fuel) : [...current, fuel])
  const toggleSave = (id) => setSaved(current => {
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    localStorage.setItem('ec_wishlist', JSON.stringify(next))
    return next
  })
  const resetFilters = () => {
    setSelectedBrands(['All']); setPriceMax(20000000); setMileageMax(200000)
    setTransmission('All'); setSelectedFuels([]); setSearch('')
    setSearchParams({})
  }

  const filtered = useMemo(() => cars.filter(car => {
    if (!selectedBrands.includes('All') && !selectedBrands.includes(car.make)) return false
    if (Number(car.price) > priceMax) return false
    if (Number(car.km) > mileageMax) return false
    if (transmission !== 'All' && car.transmission !== transmission) return false
    if (selectedFuels.length && !selectedFuels.includes(car.fuel)) return false
    if (search && !`${car.make} ${car.model} ${car.year}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'km-asc') return a.km - b.km
    return (b.createdAt ? new Date(b.createdAt).getTime() : b.year) - (a.createdAt ? new Date(a.createdAt).getTime() : a.year)
  }), [cars, selectedBrands, priceMax, mileageMax, transmission, selectedFuels, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const filterCount = (selectedBrands.includes('All') ? 0 : selectedBrands.length) + selectedFuels.length + (transmission === 'All' ? 0 : 1) + (priceMax < 20000000 ? 1 : 0) + (mileageMax < 200000 ? 1 : 0)

  const filters = { selectedBrands, priceMax, mileageMax, transmission, selectedFuels }
  const actions = { toggleBrand, setPriceMax, setMileageMax, setTransmission, toggleFuel, resetFilters }

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <Navbar />
      <div className="pt-[68px] md:pt-[100px]">
        <div className="bg-white border-b border-gray-200">
          <div className="market-shell py-6">
            <nav className="text-xs text-gray-400 mb-3"><Link to="/" className="hover:text-blue-700">Home</Link><span className="mx-2">/</span><span>Used Cars</span></nav>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div><h1 className="text-2xl sm:text-3xl font-black text-gray-900">Used cars for sale in Pakistan</h1><p className="text-sm text-gray-500 mt-1.5">Browse inspected listings from verified sellers and our showroom.</p></div>
              <Link to="/sell-car" className="btn-primary px-5 py-2.5 text-sm self-start lg:self-auto">Sell Your Car</Link>
            </div>
          </div>
        </div>

        <div className="market-shell py-6 lg:py-8">
          <div className="bg-blue-600 rounded-xl p-3 sm:p-4 shadow-card mb-6 flex gap-3">
            <label className="relative flex-1">
              <span className="sr-only">Search cars</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by make, model, or year" className="w-full h-12 bg-white border-0 rounded-lg pl-11 pr-4 text-sm focus:outline-none" />
            </label>
            <button className="btn-white h-12 px-7 gap-2"><Search className="w-4 h-4" /> Search cars</button>
          </div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost px-3 py-2.5 text-sm gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters {filterCount > 0 && <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">{filterCount}</span>}</button>
            <p className="text-sm text-gray-500"><strong className="text-gray-900">{filtered.length}</strong> cars found</p>
            <div className="flex items-center gap-2 ml-auto">
              <button type="button" className="hidden sm:inline-flex btn-ghost px-3 py-2.5 text-xs gap-1.5"><Bell className="w-3.5 h-3.5" /> Create alert</button>
              <label className="sr-only" htmlFor="sort-cars">Sort cars</label>
              <select id="sort-cars" value={sort} onChange={event => setSort(event.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400">
                <option value="newest">Recently added</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="km-asc">Lowest mileage</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <aside className="hidden lg:block w-64 shrink-0 bg-white border border-gray-200 rounded-xl p-5 shadow-card sticky top-[116px]">
              <FilterPanel filters={filters} actions={actions} />
            </aside>

            <main className="flex-1 min-w-0">
              {loading ? <LoadingListings /> : loadError ? (
                <div className="bg-white border border-red-200 rounded-xl py-16 text-center shadow-card"><p className="font-bold text-gray-900">Could not load the marketplace</p><p className="text-sm text-gray-500 mt-1">Please confirm that the backend API is running and try again.</p><button type="button" onClick={() => window.location.reload()} className="btn-primary px-5 py-2.5 text-sm mt-5">Retry</button></div>
              ) : paginated.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl py-20 text-center shadow-card">
                  <Search className="w-12 h-12 mx-auto text-gray-300" /><h2 className="font-bold text-gray-900 mt-4">No cars match those filters</h2><p className="text-sm text-gray-500 mt-1">Try increasing your budget or clearing a filter.</p><button type="button" onClick={resetFilters} className="btn-brand px-5 py-2.5 text-sm mt-5">Clear filters</button>
                </div>
              ) : (
                <div className="space-y-4">{paginated.map(car => <ListingCard key={car._id} car={car} saved={saved} onSave={toggleSave} />)}</div>
              )}

              {!loading && filtered.length > PER_PAGE && (
                <div className="flex items-center justify-center gap-2 mt-7">
                  <button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1} className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-35 hover:border-blue-300" aria-label="Previous page"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({ length: totalPages }, (_, index) => <button type="button" key={index} onClick={() => setPage(index + 1)} className={`w-10 h-10 rounded-lg text-sm font-bold ${page === index + 1 ? 'bg-blue-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}>{index + 1}</button>)}
                  <button type="button" onClick={() => setPage(current => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-35 hover:border-blue-300" aria-label="Next page"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button className="absolute inset-0 bg-[#061b2f]/70" onClick={() => setSidebarOpen(false)} aria-label="Close filters" />
          <aside className="absolute right-0 top-0 h-full w-[min(90vw,360px)] bg-white overflow-y-auto shadow-2xl p-5">
            <div className="flex items-center justify-between mb-6"><h2 className="font-black text-lg text-gray-900">Search filters</h2><button onClick={() => setSidebarOpen(false)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center" aria-label="Close filters"><X className="w-4 h-4" /></button></div>
            <FilterPanel filters={filters} actions={actions} onDone={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
      <Footer />
    </div>
  )
}

function ListingCard({ car, saved, onSave }) {
  const id = car._id
  const image = car.images?.[0]
  const isSaved = saved.includes(id)
  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-card hover:border-blue-200 hover:shadow-elevated transition-all">
      <div className="grid sm:grid-cols-[230px_1fr] lg:grid-cols-[250px_1fr]">
        <Link to={`/used-cars/${id}`} className="relative block h-52 sm:h-full min-h-[188px] overflow-hidden bg-gray-100">
          {image ? <img src={image} alt={`${car.make} ${car.model}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="h-full flex items-center justify-center text-gray-300"><Settings className="w-10 h-10" /></div>}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3" /> INSPECTED</span>
        </Link>
        <div className="p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-4">
            <div className="min-w-0">
              <Link to={`/used-cars/${id}`}><h2 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{car.make} {car.model} {car.year}</h2></Link>
              <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5"><MapPin className="w-3.5 h-3.5 text-blue-500" /> Executive Cars, Rawalpindi</p>
            </div>
            <button type="button" onClick={() => onSave(id)} className="ml-auto w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-colors" aria-label={isSaved ? 'Remove from saved cars' : 'Save car'}><Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} /></button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 max-w-md">
            <Spec icon={Gauge} value={`${Number(car.km || 0).toLocaleString()} km`} />
            <Spec icon={Fuel} value={car.fuel || 'Petrol'} />
            <Spec icon={Settings} value={car.transmission || 'Auto'} />
          </div>

          <div className="mt-auto pt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div><p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Asking price</p><p className="text-xl font-black text-blue-600 mt-0.5">PKR {formatPKR(car.price)}</p></div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-700"><ShieldCheck className="w-4 h-4" /> Verified listing</span>
              <Link to={`/used-cars/${id}`} className="btn-brand px-4 py-2.5 text-xs">View details</Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function Spec({ icon: Icon, value }) {
  return <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-md px-2.5 py-2 text-[11px] text-gray-600"><Icon className="w-3.5 h-3.5 text-blue-600" />{value}</span>
}

function LoadingListings() {
  return <div className="space-y-4">{[1, 2, 3].map(item => <div key={item} className="bg-white border border-gray-200 rounded-xl h-52 animate-pulse grid grid-cols-[240px_1fr] overflow-hidden"><div className="bg-gray-200" /><div className="p-5 space-y-4"><div className="h-5 bg-gray-200 rounded w-1/2" /><div className="h-3 bg-gray-100 rounded w-1/4" /><div className="h-10 bg-gray-100 rounded w-2/3 mt-7" /></div></div>)}</div>
}
