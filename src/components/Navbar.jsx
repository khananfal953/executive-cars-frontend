import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calculator, Car, Gavel, MapPin, Menu, Phone, Search, UserRound, X } from 'lucide-react'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const navigation = [
  { label: 'Used Cars', to: '/used-cars', icon: Search },
  { label: 'Price Predictor', to: '/price-predictor', icon: Calculator },
  { label: 'Auctions', to: '/auction', icon: Gavel },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])
  const isActive = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="hidden md:block h-8 bg-blue-600">
          <div className="market-shell h-full flex items-center justify-between text-[11px] text-blue-100">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Rawalpindi, Pakistan</span>
              <a href="tel:+923001234567" className="inline-flex items-center gap-1.5 hover:text-white"><Phone className="w-3 h-3" /> +92 300 1234567</a>
            </div>
            <Link to={user?.role === 'user' ? '/account' : '/login'} className="inline-flex items-center gap-1.5 font-semibold hover:text-white"><UserRound className="w-3 h-3" /> {user?.role === 'user' ? `Hi, ${user.name?.split(' ')[0]}` : 'Sign In'}</Link>
          </div>
        </div>

        <nav className="h-[68px] border-b border-gray-200" aria-label="Primary navigation">
          <div className="market-shell h-full flex items-center">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Executive Cars home">
              <Logo className="w-10 h-10" />
              <div className="leading-none"><span className="block text-gray-900 font-black text-[17px] tracking-tight">Executive</span><span className="block text-blue-600 font-bold text-[11px] tracking-[0.2em] mt-1">CARS</span></div>
            </Link>

            <div className="hidden lg:flex items-center ml-10 h-full">
              {navigation.map(link => <Link key={link.to} to={link.to} className={`h-full px-4 inline-flex items-center text-[13px] font-semibold border-b-[3px] transition-colors ${isActive(link.to) ? 'text-blue-600 border-blue-600 bg-blue-50/60' : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'}`}>{link.label}</Link>)}
            </div>

            <div className="ml-auto hidden lg:flex items-center gap-3">
              <Link to={user?.role === 'user' ? '/account' : '/login'} className="text-sm font-semibold text-gray-600 hover:text-blue-600">{user?.role === 'user' ? 'My Account' : 'Login'}</Link>
              <Link to="/sell-car" className="btn-primary px-5 py-2.5 text-sm gap-2"><Car className="w-4 h-4" /> Sell Your Car</Link>
            </div>

            <button type="button" onClick={() => setMobileOpen(open => !open)} className="ml-auto lg:hidden w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </nav>
      </header>

      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
        <aside className={`absolute top-0 right-0 h-full w-[min(88vw,360px)] bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="px-5 py-5 border-b border-gray-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5"><Logo className="w-9 h-9" /><span className="font-black text-gray-900">Executive <span className="text-blue-600">Cars</span></span></Link>
            <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center" aria-label="Close menu"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4">
            <Link to="/" className={`flex items-center gap-3 px-3 py-3.5 rounded-lg text-sm font-semibold mb-1 ${location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}><Car className="w-4 h-4" /> Home</Link>
            {navigation.map(({ label, to, icon: Icon }) => <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-3.5 rounded-lg text-sm font-semibold mb-1 ${isActive(to) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}><Icon className="w-4 h-4" />{label}</Link>)}
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2"><Link to={user?.role === 'user' ? '/account' : '/login'} className="btn-ghost w-full py-3 text-sm gap-2"><UserRound className="w-4 h-4" /> {user?.role === 'user' ? 'My Account' : 'Sign In'}</Link><Link to="/sell-car" className="btn-primary w-full py-3 text-sm gap-2"><Car className="w-4 h-4" /> Sell Your Car</Link></div>
          </div>
        </aside>
      </div>
    </>
  )
}
