import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Home',      to: '/' },
    { label: 'Used Cars', to: '/used-cars' },
    { label: 'Auction',   to: '/auction' },
  ]

  const isActive = (to) => location.pathname === to

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-lg leading-none">Executive</span>
                <span className="text-primary text-xs font-semibold leading-none">Cars</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to) ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" className="text-gray-600 text-sm font-medium hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/become-a-seller" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold">
                Sell Your Car
              </Link>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <span className="font-bold text-gray-900">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to) ? 'text-primary bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Link to="/login" className="block w-full py-3 rounded-lg text-sm font-semibold text-center text-gray-700 hover:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link to="/become-a-seller" className="btn-primary w-full py-3 rounded-lg text-sm font-semibold text-center block">
                Sell Your Car
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
