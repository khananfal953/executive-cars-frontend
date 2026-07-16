import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calculator, Camera, Car, CheckCircle2, ChevronRight, ClipboardCheck, Fuel, Gavel, Gauge, MapPin, Search, Settings, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { formatPKR } from '../utils/format.js'
import api from '../api/api.js'

const services = [
  { icon: Car, title: 'Used Cars', desc: 'Search verified used cars published by Executive Cars.', to: '/used-cars' },
  { icon: Sparkles, title: 'Sell Your Car', desc: 'Choose self-managed submission or our managed selling service.', to: '/sell-car' },
  { icon: Calculator, title: 'Price Predictor', desc: 'Estimate a realistic market value before you list or buy.', to: '/price-predictor' },
  { icon: Gavel, title: 'Car Auctions', desc: 'Join the member platform to bid on inspected auction cars.', to: '/auction' },
]

const makes = ['Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai', 'BMW']
const budgets = [
  { label: 'Under 20 Lacs', value: 2000000 },
  { label: 'Under 40 Lacs', value: 4000000 },
  { label: 'Under 70 Lacs', value: 7000000 },
  { label: 'Under 1 Crore', value: 10000000 },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [budget, setBudget] = useState('')
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/products')
      .then(response => { if (active) setCars(Array.isArray(response.data) ? response.data.slice(0, 4) : []) })
      .catch(() => { if (active) setCars([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (budget) params.set('budget', budget)
    navigate(`/used-cars${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative bg-[#0f172a] pt-[68px] md:pt-[100px] overflow-hidden">
        <div className="absolute inset-0 surface-grid opacity-35" /><div className="absolute right-0 top-0 w-[520px] h-[520px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="relative market-shell py-14 lg:py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-full px-4 py-2 text-xs font-semibold text-blue-200"><ShieldCheck className="w-4 h-4" /> Verified cars and transparent buying</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mt-5">Find Used Cars in Pakistan</h1>
          <p className="text-slate-400 text-base sm:text-lg mt-3">Search inspected listings and find the right car for your budget.</p>

          <form onSubmit={submitSearch} className="max-w-4xl mx-auto mt-8 bg-white rounded-xl p-2.5 shadow-2xl grid sm:grid-cols-[1.5fr_1fr_auto] gap-2" aria-label="Search used cars">
            <label className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><span className="sr-only">Car make or model</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Car make or model" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500" /></label>
            <label><span className="sr-only">Maximum budget</span><select value={budget} onChange={event => setBudget(event.target.value)} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg px-4 text-sm text-gray-700 focus:outline-none focus:border-blue-500"><option value="">Any Budget</option>{budgets.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <button className="btn-search h-12 px-7 gap-2"><Search className="w-4 h-4" /> Search Cars</button>
          </form>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs text-slate-400"><span className="font-semibold text-slate-300">Popular:</span>{makes.slice(0, 4).map(make => <Link key={make} to={`/used-cars?search=${make}`} className="hover:text-blue-300">{make}</Link>)}<Link to="/used-cars" className="text-blue-300 hover:text-white">Advanced Filters →</Link></div>
        </div>
      </section>

      <section className="py-14 bg-gray-50 border-b border-gray-200">
        <div className="market-shell">
          <div className="text-center mb-8"><h2 className="text-2xl sm:text-3xl font-black text-gray-900">Sell Your Car and Get the Best Price</h2><p className="text-sm text-gray-500 mt-2">Choose the same two-path selling model used by leading car marketplaces.</p></div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <SellCard icon={Camera} title="Sell It Myself" text="Submit your vehicle details, expected price, and documents. The ad is reviewed before marketplace publishing." points={['Prepare your own listing', 'Set your expected price', 'Connect with buyers']} action="Post Your Car" to="/become-a-seller?mode=self" />
            <SellCard icon={Sparkles} title="Sell It For Me" text="Book a professional inspection and let Executive Cars handle verification, pricing guidance, and listing preparation." points={['Professional inspection', 'Managed verified listing', 'Showroom support']} action="Help Me Sell My Car" to="/become-a-seller?mode=managed" featured />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-16 bg-white">
        <div className="market-shell">
          <div className="flex items-end justify-between gap-4 mb-7"><div><span className="eyebrow">Browse inventory</span><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Featured Used Cars</h2></div><Link to="/used-cars" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">View all used cars <ArrowRight className="w-4 h-4" /></Link></div>
          {loading ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{[1, 2, 3, 4].map(item => <div key={item} className="h-72 bg-gray-100 rounded-xl animate-pulse" />)}</div> : cars.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{cars.map(car => <CarCard key={car._id} car={car} />)}</div> : <div className="border border-dashed border-gray-300 rounded-xl py-12 text-center"><Car className="w-10 h-10 text-gray-300 mx-auto" /><p className="font-semibold text-gray-700 mt-3">No used cars are published yet</p><p className="text-sm text-gray-500 mt-1">Check the marketplace again after the admin publishes inventory.</p></div>}
        </div>
      </section>

      <section className="py-14 bg-gray-50 border-y border-gray-200">
        <div className="market-shell grid lg:grid-cols-2 gap-8">
          <BrowsePanel title="Browse Cars by Make">{makes.map(make => <Link key={make} to={`/used-cars?search=${make}`} className="browse-link">{make} Cars <ChevronRight className="w-4 h-4" /></Link>)}</BrowsePanel>
          <BrowsePanel title="Browse Cars by Budget">{budgets.map(item => <Link key={item.value} to={`/used-cars?budget=${item.value}`} className="browse-link">{item.label} <ChevronRight className="w-4 h-4" /></Link>)}</BrowsePanel>
        </div>
      </section>

      <section className="py-14 lg:py-16 bg-white">
        <div className="market-shell">
          <div className="text-center max-w-2xl mx-auto mb-9"><span className="eyebrow">Executive Cars offerings</span><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Everything you need to trade confidently</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{services.map(({ icon: Icon, title, desc, to }) => <Link key={title} to={to} className="group card card-hover p-5"><div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5" /></div><h3 className="font-bold text-gray-900 mt-5">{title}</h3><p className="text-sm text-gray-500 leading-6 mt-2">{desc}</p><span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-4">Explore <ChevronRight className="w-3.5 h-3.5" /></span></Link>)}</div>
        </div>
      </section>

      <section className="py-14 bg-blue-600">
        <div className="market-shell flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center shrink-0"><Gavel className="w-7 h-7 text-white" /></div>
          <div className="max-w-2xl"><h2 className="text-2xl sm:text-3xl font-black text-white">Join the inspected car auction platform</h2><p className="text-blue-100 leading-6 mt-2">Register as a member, activate the annual subscription, and bid on live cars with inspection details and transparent bid history.</p></div>
          <div className="lg:ml-auto flex flex-col sm:flex-row gap-3"><Link to="/account" className="btn-white px-6 py-3 text-sm">My Account</Link><Link to="/auction/signup" className="bg-[#0f172a] text-white hover:bg-slate-800 rounded-lg px-6 py-3 text-sm font-bold inline-flex items-center justify-center gap-2">Activate Auction Access <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function SellCard({ icon: Icon, title, text, points, action, to, featured }) {
  return <article className={`bg-white rounded-xl border ${featured ? 'border-blue-300 shadow-elevated' : 'border-gray-200 shadow-card'} p-6 sm:p-7`}><div className="flex items-start gap-4"><div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${featured ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}><Icon className="w-6 h-6" /></div><div><h3 className="text-xl font-black text-gray-900">{title}</h3><p className="text-sm text-gray-500 leading-6 mt-1">{text}</p></div></div><ul className="flex flex-wrap gap-x-5 gap-y-2 mt-5">{points.map(point => <li key={point} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-600" />{point}</li>)}</ul><Link to={to} className={`${featured ? 'btn-primary' : 'btn-ghost'} w-full sm:w-auto px-6 py-3 text-sm gap-2 mt-6`}>{action}<ArrowRight className="w-4 h-4" /></Link></article>
}

function CarCard({ car }) {
  const image = car.images?.[0]
  return <Link to={`/used-cars/${car._id}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-card hover:shadow-elevated hover:border-blue-200 transition-all"><div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">{image ? <img src={image} alt={`${car.make} ${car.model}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="h-full flex items-center justify-center"><Car className="w-10 h-10 text-gray-300" /></div>}<span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded"><ShieldCheck className="w-3 h-3" /> VERIFIED</span></div><div className="p-4"><h3 className="font-bold text-gray-900 group-hover:text-blue-600">{car.make} {car.model} {car.year}</h3><p className="font-black text-blue-600 mt-1.5">PKR {formatPKR(car.price)}</p><div className="flex items-center gap-3 text-[11px] text-gray-500 mt-3 pt-3 border-t border-gray-100"><span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{Number(car.km || 0).toLocaleString()} km</span><span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel}</span><span className="flex items-center gap-1 ml-auto"><Settings className="w-3 h-3" />{car.transmission}</span></div></div></Link>
}

function BrowsePanel({ title, children }) {
  return <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-card"><h2 className="text-xl font-black text-gray-900 mb-5">{title}</h2><div className="grid sm:grid-cols-2 gap-3">{children}</div></div>
}
