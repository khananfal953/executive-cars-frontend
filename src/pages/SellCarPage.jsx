import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Camera, CheckCircle2, ClipboardCheck, MessageSquare, ShieldCheck, Sparkles, Users } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const options = [
  {
    title: 'Sell It Myself',
    subtitle: 'Create your own verified listing',
    description: 'Provide the car details, photos, documents, and asking price. Our team reviews the submission before it appears in search results.',
    icon: Camera,
    points: ['Prepare your own car details', 'Set your expected price', 'Connect with interested buyers', 'Admin-reviewed before publishing'],
    action: 'Post my car details',
    to: '/become-a-seller?mode=self',
  },
  {
    title: 'Sell It For Me',
    subtitle: 'Let Executive Cars handle the process',
    description: 'Book a showroom inspection and our team will help with valuation, verification, listing preparation, and buyer coordination.',
    icon: Sparkles,
    points: ['Professional inspection', 'Price guidance', 'Verified managed listing', 'Showroom team handles enquiries'],
    action: 'Help me sell my car',
    to: '/become-a-seller?mode=managed',
    featured: true,
  },
]

export default function SellCarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-[#0f172a] pt-[116px] md:pt-[140px] pb-16 relative overflow-hidden">
        <div className="absolute inset-0 surface-grid opacity-40" />
        <div className="relative market-shell text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 text-blue-200 rounded-full px-4 py-2 text-xs font-semibold"><BadgeCheck className="w-4 h-4" /> Two flexible ways to sell</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-5">Choose how you want to sell your car</h1>
          <p className="text-slate-400 text-base sm:text-lg leading-7 mt-4 max-w-2xl mx-auto">List the car yourself or let our showroom manage the process from inspection to buyer coordination.</p>
        </div>
      </section>

      <main className="market-shell py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto -mt-24 relative z-10">
          {options.map(option => <SellingOption key={option.title} {...option} />)}
        </div>

        <section className="max-w-5xl mx-auto mt-16">
          <div className="text-center max-w-2xl mx-auto"><span className="eyebrow">A reviewed marketplace</span><h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">What happens after submission?</h2><p className="text-sm text-gray-500 leading-6 mt-3">Every submission is reviewed before buyers see it. Executive Cars adds physical verification because all published inventory is inspection-led.</p></div>
          <div className="grid sm:grid-cols-3 gap-5 mt-9">
            {[
              { icon: ClipboardCheck, step: '01', title: 'Submit car details', text: 'Add owner information, vehicle specifications, and supporting documents.' },
              { icon: ShieldCheck, step: '02', title: 'Review & verification', text: 'Our team verifies the submission and confirms the inspection appointment.' },
              { icon: Users, step: '03', title: 'Publish & connect', text: 'Approved cars are prepared for the used-car marketplace or auction.' },
            ].map(({ icon: Icon, step, title, text }) => <div key={step} className="bg-white border border-gray-200 rounded-xl p-6 shadow-card"><div className="flex items-center justify-between"><div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Icon className="w-5 h-5" /></div><span className="text-2xl font-black text-blue-100">{step}</span></div><h3 className="font-bold text-gray-900 mt-5">{title}</h3><p className="text-sm text-gray-500 leading-6 mt-2">{text}</p></div>)}
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-12 rounded-xl bg-blue-600 p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0"><MessageSquare className="w-6 h-6" /></div>
          <div><h2 className="font-black text-xl">Already have an Executive Cars account?</h2><p className="text-blue-100 text-sm mt-1">Use the same account to track bookings, listings, purchases, and auction access.</p></div>
          <Link to="/account" className="md:ml-auto btn-white px-6 py-3 text-sm gap-2 whitespace-nowrap">My account <ArrowRight className="w-4 h-4" /></Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function SellingOption({ title, subtitle, description, icon: Icon, points, action, to, featured }) {
  return (
    <article className={`relative bg-white rounded-xl p-6 sm:p-8 shadow-elevated border-2 ${featured ? 'border-blue-500' : 'border-white'}`}>
      {featured && <span className="absolute top-4 right-4 bg-blue-600 text-white rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide">Managed service</span>}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${featured ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}><Icon className="w-7 h-7" /></div>
      <h2 className="text-2xl font-black text-gray-900 mt-6">{title}</h2><p className="text-sm font-semibold text-blue-600 mt-1">{subtitle}</p><p className="text-sm text-gray-500 leading-6 mt-4">{description}</p>
      <ul className="space-y-3 mt-6 mb-7">{points.map(point => <li key={point} className="flex items-center gap-2.5 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />{point}</li>)}</ul>
      <Link to={to} className={`${featured ? 'btn-primary' : 'btn-ghost'} w-full py-3 text-sm gap-2`}>{action}<ArrowRight className="w-4 h-4" /></Link>
    </article>
  )
}
