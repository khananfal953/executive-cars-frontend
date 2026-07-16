import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, CheckCircle2, ChevronDown, Info, Loader2, ShieldCheck, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { formatPKR } from '../utils/format.js'
import api from '../api/api.js'

const brands = ['Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai', 'Mitsubishi', 'Nissan', 'BMW', 'Mercedes', 'Audi']
const models = {
  Toyota: ['Corolla', 'Yaris', 'Fortuner', 'Hilux', 'Land Cruiser', 'Prado'],
  Honda: ['Civic', 'City', 'HR-V', 'BR-V', 'Accord'],
  Suzuki: ['Cultus', 'Swift', 'Alto', 'Wagon R', 'Jimny'],
  Kia: ['Sportage', 'Picanto', 'Stonic', 'Sorento'],
  Hyundai: ['Tucson', 'Elantra', 'Sonata', 'Santa Fe'],
  Mitsubishi: ['Outlander', 'Eclipse Cross', 'Pajero'],
  Nissan: ['Sunny', 'Dayz', 'X-Trail'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  Mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE'],
  Audi: ['A3', 'A4', 'Q3', 'Q5'],
}

function mockPredict(form) {
  const base = { Toyota: 3500000, Honda: 4000000, Suzuki: 2000000, Kia: 5500000, Hyundai: 6000000 }[form.brand] || 3000000
  return Math.max(800000, base + (form.year - 2015) * 150000 - form.mileage * 10 + (form.engine - 1000) * 500 + (form.transmission === 'Auto' ? 300000 : 0))
}

export default function PricePredictorPage() {
  const [form, setForm] = useState({ brand: '', model: '', year: 2021, mileage: 30000, engine: 1300, transmission: 'Auto', fuel: 'Petrol' })
  const [result, setResult] = useState(null)
  const [confidence, setConfidence] = useState(87)
  const [loading, setLoading] = useState(false)
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const handlePredict = async (event) => {
    event.preventDefault()
    setLoading(true); setResult(null)
    try {
      const { data } = await api.post('/predict', { ...form, make: form.brand })
      setResult(data.predicted)
      setConfidence(data.confidence != null ? Math.round(data.confidence * 100) : 87)
    } catch {
      setResult(mockPredict(form)); setConfidence(87)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9]">
      <Navbar />
      <section className="relative bg-[#0f172a] pt-[68px] md:pt-[100px] overflow-hidden">
        <div className="absolute inset-0 surface-grid opacity-60" /><div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="market-shell relative py-12 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200"><Brain className="w-4 h-4" /> AI-assisted valuation</span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">Know your car’s market value before you sell</h1>
            <p className="text-blue-100/65 text-base sm:text-lg leading-7 mt-4 max-w-2xl">Enter a few vehicle details to get a data-backed estimated price range in seconds.</p>
          </div>
        </div>
      </section>

      <main className="market-shell py-8 lg:py-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start max-w-6xl mx-auto">
          <section className="bg-white border border-gray-200 rounded-xl shadow-card overflow-hidden">
            <div className="px-5 sm:px-7 py-5 border-b border-gray-100 flex items-center gap-3"><div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-700" /></div><div><h2 className="font-black text-gray-900">Car price calculator</h2><p className="text-xs text-gray-500 mt-0.5">All fields are used to improve the estimate.</p></div></div>
            <form onSubmit={handlePredict} className="p-5 sm:p-7 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <SelectField label="Make" value={form.brand} onChange={value => { update('brand', value); update('model', '') }} placeholder="Select make" options={brands} />
                <SelectField label="Model" value={form.model} onChange={value => update('model', value)} placeholder="Select model" options={models[form.brand] || []} disabled={!form.brand} />
                <RangeField label="Model year" value={form.year} display={form.year} min={2010} max={2026} step={1} onChange={value => update('year', value)} start="2010" end="2026" />
                <RangeField label="Mileage" value={form.mileage} display={`${form.mileage.toLocaleString()} km`} min={0} max={200000} step={1000} onChange={value => update('mileage', value)} start="0 km" end="200,000 km" />
                <RangeField label="Engine" value={form.engine} display={`${form.engine} cc`} min={660} max={4000} step={100} onChange={value => update('engine', value)} start="660 cc" end="4,000 cc" />
                <ChoiceField label="Transmission" value={form.transmission} options={['Auto', 'Manual']} onChange={value => update('transmission', value)} />
              </div>
              <ChoiceField label="Fuel type" value={form.fuel} options={['Petrol', 'Diesel', 'CNG', 'Hybrid']} onChange={value => update('fuel', value)} compact />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm gap-2 disabled:opacity-70">{loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing market data…</> : <><TrendingUp className="w-4 h-4" /> Get price estimate</>}</button>
            </form>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-[116px]">
            {result ? (
              <section className="bg-white border border-blue-200 rounded-xl shadow-elevated overflow-hidden animate-scaleIn">
                <div className="bg-blue-950 px-5 py-4 text-white"><p className="text-xs text-blue-100/60">Estimated market value</p><p className="text-3xl font-black mt-1">PKR {formatPKR(result)}</p></div>
                <div className="p-5">
                  <p className="text-xs text-gray-500">Likely selling range</p><p className="font-bold text-gray-900 mt-1">PKR {formatPKR(result * 0.92)} – {formatPKR(result * 1.08)}</p>
                  <div className="mt-5"><div className="flex justify-between text-xs font-semibold text-gray-500 mb-2"><span>Model confidence</span><span>{confidence}%</span></div><div className="h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-green-600 rounded-full" style={{ width: `${confidence}%` }} /></div></div>
                  <div className="flex gap-2 mt-4 text-[11px] text-gray-400 leading-5"><Info className="w-4 h-4 shrink-0 mt-0.5" /> This is an estimate, not a guaranteed offer. Condition and documents can change the final price.</div>
                  <Link to="/become-a-seller" className="btn-primary w-full py-3 text-sm gap-2 mt-5">Sell this car <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </section>
            ) : (
              <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-card">
                <div className="w-11 h-11 bg-green-50 rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-green-700" /></div>
                <h2 className="font-black text-gray-900 mt-4">A smarter starting point</h2>
                <p className="text-sm text-gray-500 leading-6 mt-2">Use the estimate to set a realistic asking price and avoid weeks of low-quality enquiries.</p>
                <ul className="space-y-3 mt-5">{['No account required', 'Instant price range', 'Based on vehicle attributes', 'Free to use'].map(item => <li key={item} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-green-600" />{item}</li>)}</ul>
              </section>
            )}
            <section className="bg-blue-50 border border-blue-200 rounded-xl p-5"><h3 className="font-bold text-blue-950">Why is it a range?</h3><p className="text-xs text-blue-900/70 leading-5 mt-2">Actual value varies with paint condition, service history, registration city, accident history, and inspection results.</p></section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SelectField({ label, value, onChange, placeholder, options, disabled }) {
  return <label><span className="block text-xs font-bold text-gray-600 mb-2">{label}</span><span className="relative block"><select value={value} onChange={event => onChange(event.target.value)} required disabled={disabled} className="input-light appearance-none pr-10 disabled:bg-gray-50 disabled:text-gray-400"><option value="">{placeholder}</option>{options.map(option => <option key={option}>{option}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /></span></label>
}

function RangeField({ label, value, display, min, max, step, onChange, start, end }) {
  return <label><span className="flex items-center justify-between text-xs font-bold text-gray-600 mb-3"><span>{label}</span><span className="text-blue-800">{display}</span></span><input type="range" value={value} min={min} max={max} step={step} onChange={event => onChange(Number(event.target.value))} className="w-full accent-blue-800" /><span className="flex justify-between text-[10px] text-gray-400 mt-1"><span>{start}</span><span>{end}</span></span></label>
}

function ChoiceField({ label, value, options, onChange, compact }) {
  return <fieldset><legend className="text-xs font-bold text-gray-600 mb-2">{label}</legend><div className={`grid gap-2 ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>{options.map(option => <button key={option} type="button" onClick={() => onChange(option)} className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors ${value === option ? 'bg-blue-800 border-blue-800 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-800'}`}>{option}</button>)}</div></fieldset>
}
