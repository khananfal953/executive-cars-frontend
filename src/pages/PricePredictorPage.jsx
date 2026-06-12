import React, { useState } from 'react'
import { Brain, TrendingUp, ChevronDown, Loader2, Info } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

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

function formatPKR(n) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`
  return n.toLocaleString()
}

function mockPredict(form) {
  const base = { Toyota: 3500000, Honda: 4000000, Suzuki: 2000000, Kia: 5500000, Hyundai: 6000000 }[form.brand] || 3000000
  const result = base + (form.year - 2015) * 150000 - form.mileage * 10 + (form.engine - 1000) * 500 + (form.transmission === 'Auto' ? 300000 : 0)
  return Math.max(800000, result)
}

export default function PricePredictorPage() {
  const [form, setForm] = useState({ brand: '', model: '', year: 2020, mileage: 30000, engine: 1300, transmission: 'Auto', fuel: 'Petrol' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    await new Promise(r => setTimeout(r, 1800))
    setResult(mockPredict(form)); setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-5">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm font-medium">Trained on PakWheels 2025 Dataset</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
              AI <span className="primary-text">Price Estimator</span>
            </h1>
            <p className="text-gray-500 text-lg">Get an accurate market value for your car in seconds.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-xl">Car Price Predictor</h2>
                <p className="text-gray-500 text-sm">Fill in your car details below</p>
              </div>
            </div>

            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                  <div className="relative">
                    <select value={form.brand} onChange={e => { update('brand', e.target.value); update('model', '') }} required
                      className="input-light appearance-none pr-10">
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
                  <div className="relative">
                    <select value={form.model} onChange={e => update('model', e.target.value)} required disabled={!form.brand}
                      className="input-light appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">Select Model</option>
                      {(models[form.brand] || []).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Year: <span className="text-blue-600 font-semibold">{form.year}</span></label>
                  <input type="range" min={2010} max={2025} step={1} value={form.year} onChange={e => update('year', +e.target.value)} className="w-full accent-blue-600 mt-2" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2010</span><span>2025</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mileage: <span className="text-blue-600 font-semibold">{form.mileage.toLocaleString()} km</span></label>
                  <input type="range" min={0} max={200000} step={1000} value={form.mileage} onChange={e => update('mileage', +e.target.value)} className="w-full accent-blue-600 mt-2" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0 km</span><span>200,000 km</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Engine CC: <span className="text-blue-600 font-semibold">{form.engine}cc</span></label>
                  <input type="range" min={660} max={4000} step={100} value={form.engine} onChange={e => update('engine', +e.target.value)} className="w-full accent-blue-600 mt-2" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>660cc</span><span>4000cc</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <div className="flex gap-2 mt-2">
                    {['Auto', 'Manual'].map(t => (
                      <button key={t} type="button" onClick={() => update('transmission', t)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${form.transmission === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Petrol', 'Diesel', 'CNG', 'Hybrid'].map(f => (
                    <button key={f} type="button" onClick={() => update('fuel', f)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${form.fuel === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70 primary-glow">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Market Data...</> : <><TrendingUp className="w-5 h-5" /> Predict Price</>}
              </button>
            </form>

            {result && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 animate-scaleIn">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">Estimated Market Value</p>
                  <div className="text-5xl font-black text-blue-600 mb-1">PKR {formatPKR(result)}</div>
                  <p className="text-gray-500 text-sm mb-4">Range: PKR {formatPKR(result * 0.92)} – PKR {formatPKR(result * 1.08)}</p>
                  <div className="max-w-xs mx-auto">
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Confidence</span><span>87%</span></div>
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-400">
                    <Info className="w-3 h-3" /> Powered by ML model trained on PakWheels dataset 2025
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
