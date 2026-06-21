import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCheck, TrendingUp, Gavel, Car, Shield, Zap, CheckCircle, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

const services = [
  { icon: ClipboardCheck, title: 'Become A Seller', desc: 'Schedule a free inspection at our Rawalpindi showroom. Get your car listed with a verified report — no advertising cost.', to: '/become-a-seller', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { icon: TrendingUp, title: 'Car Price Predictor', desc: 'AI-powered price estimation trained on PakWheels 2025 data. Get an accurate market value in seconds.', to: '/price-predictor', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: Gavel, title: 'Auction Platform', desc: 'Members-only real-time bidding on inspected vehicles. Transparent, competitive, and fully digital.', to: '/auction', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: Car, title: 'Used Cars', desc: 'Browse verified used cars with full inspection reports. Every listing is quality-checked and fairly priced.', to: '/used-cars', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
]

const stats = [
  { value: 500, suffix: '+', label: 'Cars Sold' },
  { value: 100, suffix: '%', label: 'Inspected' },
  { value: 1200, suffix: '+', label: 'Happy Buyers' },
  { value: 3, suffix: ' yrs', label: 'In Business' },
]

const trustPoints = [
  { icon: Shield, title: 'Full Transparency', desc: 'Every car comes with a detailed inspection report and verified excise records.' },
  { icon: Zap, title: 'AI-Driven Pricing', desc: 'Our ML model trained on 2025 PakWheels data ensures fair, data-backed valuations.' },
  { icon: CheckCircle, title: 'Verified Listings', desc: 'All vehicles pass a professional multi-point inspection before being listed.' },
]

const CAR_IMAGES = [
  { make: 'Toyota', model: 'Corolla', year: 2022, price: '38 Lac', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
  { make: 'Honda', model: 'Civic', year: 2021, price: '42 Lac', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80' },
  { make: 'Kia', model: 'Sportage', year: 2022, price: '65 Lac', img: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80' },
  { make: 'Suzuki', model: 'Cultus', year: 2023, price: '21 Lac', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80' },
]

export default function HomePage() {
  const [heroRef, heroInView] = useInView(0.1)
  const [aboutRef, aboutInView] = useInView(0.1)
  const [servicesRef, servicesInView] = useInView(0.1)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative bg-[#0f172a] pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div className={`transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-300 text-sm font-medium">Pakistan's Smartest Car Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                From Inspection<br />
                to Auction —<br />
                <span className="animated-gradient-text">Everything Smart</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg mb-8 leading-relaxed">
                Executive Cars combines AI-powered pricing, professional inspections, and real-time auctions to make car trading transparent and trustworthy.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auction" className="btn-primary px-7 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2 primary-glow">
                  <Gavel className="w-5 h-5" /> Explore Auctions
                </Link>
                <Link to="/become-a-seller" className="btn-white px-7 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" /> Sell Your Car
                </Link>
              </div>
              {/* Trust row */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
                {stats.map(s => (
                  <div key={s.label}>
                    <div className="text-white font-black text-xl"><AnimatedCounter target={s.value} suffix={s.suffix} /></div>
                    <div className="text-slate-400 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: car grid */}
            <div className={`transition-all duration-700 delay-200 ${heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="grid grid-cols-2 gap-3">
                {CAR_IMAGES.map((car, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden group cursor-pointer">
                    <img src={car.img} alt={`${car.make} ${car.model}`} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm">{car.make} {car.model}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-xs">{car.year}</span>
                        <span className="text-blue-300 font-bold text-xs">PKR {car.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Link to="/used-cars" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  View all listings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section ref={servicesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mt-2">
              Our <span className="primary-text">Services</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              A complete ecosystem for buying and selling cars — powered by AI and built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <Link key={s.title} to={s.to}
                className={`group card p-6 card-hover transition-all duration-500 ${servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <div className="h-0.5 w-0 bg-blue-500 group-hover:w-full transition-all duration-400 mb-3 rounded-full" />
                <h3 className="text-gray-900 font-bold text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section ref={aboutRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <div className={`relative transition-all duration-700 ${aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-100 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80"
                  alt="Executive Cars Showroom"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-gray-700 text-xs font-medium">Executive Cars — Rawalpindi</p>
                </div>
              </div>
              {/* Stat badges */}
              <div className="absolute -top-4 -right-4 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 animate-float">
                <div className="text-blue-600 font-black text-2xl"><AnimatedCounter target={500} suffix="+" /></div>
                <div className="text-gray-500 text-xs">Cars Sold</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-blue-600 font-black text-2xl">100%</div>
                <div className="text-gray-500 text-xs">Inspected</div>
              </div>
            </div>

            {/* Right: Content */}
            <div className={`transition-all duration-700 delay-200 ${aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
                <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">Who We Are</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-5">
                Rawalpindi's <span className="primary-text">Smartest</span><br />Car Showroom
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Executive Cars is a real Rawalpindi-based showroom that has gone fully digital. We've built an AI-powered platform that combines professional vehicle inspections, data-driven price predictions, and a transparent auction system.
              </p>
              <div className="space-y-5">
                {trustPoints.map((tp) => (
                  <div key={tp.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                      <tp.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-semibold mb-1">{tp.title}</h4>
                      <p className="text-gray-500 text-sm">{tp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-14 bg-blue-600">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-[#0f172a] rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
            <div className="relative z-10">
              <Gavel className="w-12 h-12 text-blue-400 mx-auto mb-5" />
              <h2 className="text-3xl font-black text-white mb-3">
                Ready to <span className="animated-gradient-text">Trade Smarter?</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join hundreds of buyers and sellers who trust Executive Cars for transparent, AI-driven vehicle trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auction" className="btn-primary px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2">
                  <Gavel className="w-5 h-5" /> Join Auction
                </Link>
                <Link to="/price-predictor" className="btn-white px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Predict My Car Price
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
