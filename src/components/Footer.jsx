import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, ShieldCheck, Youtube } from 'lucide-react'
import Logo from './Logo.jsx'

const columns = [
  { title: 'Buy a Car', links: [{ label: 'Used Cars', to: '/used-cars' }, { label: 'Live Auctions', to: '/auction' }, { label: 'Price Predictor', to: '/price-predictor' }] },
  { title: 'Sell a Car', links: [{ label: 'Choose How to Sell', to: '/sell-car' }, { label: 'Book Inspection', to: '/become-a-seller?mode=managed' }, { label: 'Selling Dashboard', to: '/seller/dashboard' }] },
  { title: 'Account', links: [{ label: 'Sign In', to: '/login' }, { label: 'Create Account', to: '/signup' }, { label: 'My Account', to: '/account' }] },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="market-shell py-12 lg:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-9">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5"><Logo className="w-10 h-10" /><div className="leading-none"><span className="block font-black text-gray-900">Executive</span><span className="block text-blue-600 font-bold text-[10px] tracking-[0.2em] mt-1">CARS</span></div></Link>
            <p className="text-sm text-gray-500 leading-6 mt-4">A verified used-car marketplace for inspections, fair pricing, and transparent auctions.</p>
            <div className="flex gap-2 mt-5">{[Instagram, Facebook, Youtube, Linkedin].map((Icon, index) => <a key={index} href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600" aria-label="Social media"><Icon className="w-4 h-4" /></a>)}</div>
          </div>
          {columns.map(column => <div key={column.title}><h3 className="font-bold text-gray-900 text-sm mb-5">{column.title}</h3><ul className="space-y-3">{column.links.map(link => <li key={link.label}><Link to={link.to} className="text-sm text-gray-500 hover:text-blue-600">{link.label}</Link></li>)}</ul></div>)}
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-5">Contact & Alerts</h3>
            <ul className="space-y-3 text-sm text-gray-500"><li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-blue-600 mt-0.5" /> Stadium Road, Rawalpindi</li><li><a href="tel:+923001234567" className="flex items-center gap-2 hover:text-blue-600"><Phone className="w-4 h-4 text-blue-600" /> +92 300 1234567</a></li><li><a href="mailto:info@executivecars.pk" className="flex items-center gap-2 hover:text-blue-600"><Mail className="w-4 h-4 text-blue-600" /> info@executivecars.pk</a></li></ul>
            <form onSubmit={event => { event.preventDefault(); setEmail('') }} className="flex mt-4"><input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Listing alerts" className="min-w-0 flex-1 bg-white border border-gray-300 rounded-l-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500" /><button className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-lg" aria-label="Subscribe"><Send className="w-4 h-4" /></button></form>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-11 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400"><p>© 2026 Executive Cars. All rights reserved.</p><span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-600" /> Verified marketplace</span></div>
      </div>
    </footer>
  )
}
