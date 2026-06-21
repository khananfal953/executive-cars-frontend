import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react'
import Logo from './Logo.jsx'

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Logo className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-base leading-none">Executive</span>
                <span className="text-primary text-xs font-semibold leading-none">Cars</span>
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              From Inspection to Auction, Everything Smart. Pakistan's premier AI-powered car trading platform.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-5 text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Used Cars', to: '/used-cars' },
                { label: 'Price Predictor', to: '/price-predictor' },
                { label: 'AI Assistant', to: '/ai-assistant' },
                { label: 'Auction Platform', to: '/auction' },
                { label: 'Sell Your Car', to: '/become-a-seller' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-600 text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-5 text-sm">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-gray-600 text-sm">Stadium Road, Rawalpindi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-gray-600 text-sm">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-gray-600 text-sm">info@executivecars.pk</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-5 text-sm">Newsletter</h4>
            <p className="text-gray-600 text-sm mb-4">Stay updated with new listings and auction alerts.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="btn-primary px-3 py-2.5 rounded-lg shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Executive Cars. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Instagram, href: '#' },
              { Icon: Facebook, href: '#' },
              { Icon: Youtube, href: '#' },
              { Icon: Linkedin, href: '#' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-primary transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
