import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, FileText, CheckCircle, Car, ChevronDown } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { BRANDS, MODELS } from '../../data/carBrands.js'
const colors = ['White', 'Black', 'Silver', 'Grey', 'Red', 'Blue', 'Brown', 'Green', 'Orange']

export default function AdminUploadUsedCarPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    make: '', model: '', year: '', mileage: '', engine: '',
    transmission: 'Auto', fuel: 'Petrol', color: '',
    price: '', condition: 'Excellent', notes: '',
  })
  const [images, setImages] = useState([])
  const [report, setReport] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files].slice(0, 6))
  }

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    setSaving(false)
    setSaved(true)
    setForm({
      make: '', model: '', year: '', mileage: '', engine: '',
      transmission: 'Auto', fuel: 'Petrol', color: '',
      price: '', condition: 'Excellent', notes: '',
    })
    setImages([])
    setReport(null)
    setResetKey(k => k + 1)
    setTimeout(() => setSaved(false), 4000)
  }

  return (
    <AdminLayout title="Upload Car to Used Cars">
      <form onSubmit={handleSubmit}>
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Car listed in used cars!</p>
              <p className="text-xs text-green-600 mt-0.5">Fill the form again to list another car.</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-5 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" /> Vehicle Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Car Make</label>
                  <div className="relative">
                    <select
                      value={form.make}
                      onChange={e => { update('make', e.target.value); update('model', '') }}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 text-sm appearance-none"
                    >
                      <option value="">Select Make</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Model</label>
                  <div className="relative">
                    <select
                      value={form.model}
                      onChange={e => update('model', e.target.value)}
                      required
                      disabled={!form.make}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 text-sm appearance-none disabled:opacity-40"
                    >
                      <option value="">Select Model</option>
                      {(MODELS[form.make] || []).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Year</label>
                  <select
                    value={form.year}
                    onChange={e => update('year', e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 16 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Mileage (km)</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={e => update('mileage', e.target.value)}
                    placeholder="45000"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Engine CC</label>
                  <input
                    type="number"
                    value={form.engine}
                    onChange={e => update('engine', e.target.value)}
                    placeholder="1800"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Color</label>
                  <div className="relative">
                    <select
                      value={form.color}
                      onChange={e => update('color', e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 text-sm appearance-none"
                    >
                      <option value="">Select Color</option>
                      {colors.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 font-medium mb-2">Transmission</label>
                <div className="flex gap-2">
                  {['Auto', 'Manual'].map(t => (
                    <button key={t} type="button" onClick={() => update('transmission', t)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${form.transmission === t ? 'btn-primary' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 font-medium mb-2">Fuel Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Petrol', 'Diesel', 'CNG', 'Hybrid'].map(f => (
                    <button key={f} type="button" onClick={() => update('fuel', f)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${form.fuel === f ? 'btn-primary' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Condition */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-5">Pricing & Condition</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Selling Price (PKR)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                    placeholder="3500000"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-2">Condition</label>
                  <div className="flex gap-2">
                    {['Excellent', 'Good', 'Fair'].map(c => (
                      <button key={c} type="button" onClick={() => update('condition', c)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${form.condition === c ? 'btn-primary' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1.5">Notes / Description</label>
                  <textarea
                    value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                    rows={3}
                    placeholder="Additional details..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-5">Car Images</h3>
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors group mb-4">
                <Upload className="w-10 h-10 text-gray-500 group-hover:text-primary mx-auto mb-3 transition-colors" />
                <p className="text-gray-500 text-sm">Drag & drop images or click to upload</p>
                <p className="text-gray-600 text-xs mt-1">Max 6 images, JPG/PNG</p>
                <input key={resetKey} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">{img.name}</div>
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-5">Inspection Report</h3>
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors group">
                <FileText className="w-8 h-8 text-gray-500 group-hover:text-primary mx-auto mb-2 transition-colors" />
                <p className="text-gray-500 text-sm">{report ? report.name : 'Upload inspection report PDF'}</p>
                <input key={`pdf-${resetKey}`} type="file" accept=".pdf" className="hidden" onChange={e => setReport(e.target.files[0])} />
              </label>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1 py-3.5 rounded-xl font-bold text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving || saved}
                className="btn-primary flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                {saved ? (
                  <><CheckCircle className="w-4 h-4" /> Listed!</>
                ) : saving ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Listing...</>
                ) : (
                  <><Car className="w-4 h-4" /> List on Used Cars</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
