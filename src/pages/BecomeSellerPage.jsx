import React, { useState } from 'react'
import { useNavigate, Link, Navigate, useSearchParams } from 'react-router-dom'
import { ClipboardCheck, FileText, CheckCircle, Upload, ChevronRight, X, RefreshCw, Car } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SellerLayout from '../components/SellerLayout.jsx'
import api from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const steps = [
  { icon: ClipboardCheck, label: 'Fill Form', desc: 'Provide your personal and car details' },
  { icon: FileText, label: 'Documents', desc: 'Upload CNIC and vehicle registration' },
  { icon: CheckCircle, label: 'Admin Approval', desc: 'Our team reviews and confirms your slot' },
]
const branches = ['Rawalpindi - Stadium Road Branch', 'Rawalpindi - Saddar Branch']

export default function BecomeSellerPage({ sellerView = false }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'self' ? 'self' : 'managed'
  const flowSteps = mode === 'self'
    ? [
        { icon: ClipboardCheck, label: 'Create Ad', desc: 'Provide your car, price, and contact details' },
        { icon: FileText, label: 'Verify', desc: 'Upload documents and schedule verification' },
        { icon: CheckCircle, label: 'Review', desc: 'Our team reviews the ad before publishing' },
      ]
    : steps
  const [step, setStep] = useState(1)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(60)
  const [otpError, setOtpError] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', cnic: '', email: user?.email || '', make: '', model: '', year: '', mileage: '', engine: '', cnicFile: null, regFile: null, date: '', branch: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (!sellerView && user?.role === 'user') {
    const query = searchParams.toString()
    return <Navigate to={`/seller/book-inspection${query ? `?${query}` : ''}`} replace />
  }

  const startOtpTimer = () => {
    setOtpTimer(60)
    const timer = setInterval(() => {
      setOtpTimer(t => { if (t <= 1) { clearInterval(timer); return 0 } return t - 1 })
    }, 1000)
  }

  const handleResendOtp = async () => {
    try {
      const { data } = await api.post('/bookings/send-otp', { email: form.email })
      setDevOtp(data.devOtp || '')
      startOtpTimer()
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP.')
    }
  }

  const handleVerifyOtp = async () => {
    setOtpError('')
    setVerifying(true)
    try {
      await api.post('/bookings/verify-otp', { email: form.email, otp: otp.join('') })
      setDevOtp('')
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      fd.append('cnic', form.cnic)
      fd.append('email', form.email)
      fd.append('carMake', form.make)
      fd.append('carModel', form.model)
      fd.append('carYear', form.year)
      fd.append('mileage', form.mileage)
      fd.append('engineCC', form.engine)
      fd.append('date', form.date)
      fd.append('branch', form.branch)
      if (form.cnicFile) fd.append('cnicImage', form.cnicFile)
      if (form.regFile) fd.append('regDoc', form.regFile)
      setSubmitting(true)
      await api.post('/bookings', fd)
      setShowOTP(false)
      navigate(sellerView ? '/seller/bookings' : '/booking-confirmed', {
        state: {
          date: form.date,
          branch: form.branch,
          email: form.email,
          bookingCreated: sellerView,
        },
      })
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired OTP.')
    }
    setVerifying(false)
    setSubmitting(false)
  }

  const validateStep = (stepNum) => {
    const e = {}
    if (stepNum === 1) {
      if (!form.name?.trim()) e.name = 'Full name is required.'
      if (!form.phone?.trim()) e.phone = 'Phone number is required.'
      const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
      if (form.cnic && !cnicRegex.test(form.cnic)) e.cnic = 'CNIC format must be XXXXX-XXXXXXX-X.'
    }
    if (stepNum === 3) {
      if (!form.date) e.date = 'Inspection date is required.'
      else if (new Date(form.date) < new Date()) e.date = 'Inspection date cannot be in the past.'
      if (!form.branch) e.branch = 'Please select a branch.'
    }
    return e
  }

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }
    setFieldErrors({})
    if (step < 3) { setStep(s => s + 1); return }
    try {
      const { data } = await api.post('/bookings/send-otp', { email: form.email })
      setDevOtp(data.devOtp || '')
      setShowOTP(true)
      startOtpTimer()
    } catch (err) {
      setFieldErrors({ date: err.response?.data?.message || 'Failed to send OTP. Try again.' })
    }
  }

  const page = (
    <div className={sellerView ? '' : 'min-h-screen bg-gray-50'}>
      {!sellerView && <Navbar />}

      {/* Hero */}
      {!sellerView ? <section className="bg-[#0f172a] pt-28 md:pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 rounded-full px-4 py-1.5 mb-5">
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">{mode === 'self' ? 'Sell It Myself — Submit Your Car Ad' : 'Sell It For Me — Managed Showroom Service'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            {mode === 'self' ? <>Create Your <span className="animated-gradient-text">Verified Car Ad</span></> : <>Get Your Car <span className="animated-gradient-text">Inspected & Listed</span></>}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {mode === 'self' ? 'Add your car details and documents, then schedule verification. Approved submissions are prepared for marketplace publishing.' : 'Book an inspection slot at our nearest branch. We handle everything — from inspection to listing.'}
          </p>
          <Link to="/sell-car" className="inline-flex text-blue-300 hover:text-white text-xs font-semibold mt-5">← Change selling method</Link>
        </div>

        {/* Step Indicator */}
        <div className="max-w-lg mx-auto px-4 mt-10">
          <div className="flex items-center justify-center">
            {flowSteps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step > i + 1 ? 'bg-blue-500 text-white' :
                    step === i + 1 ? 'bg-white text-blue-800 border-2 border-blue-300' :
                    'bg-white/10 text-slate-400 border-2 border-white/20'
                  }`}>
                    {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step === i + 1 ? 'text-blue-300' : 'text-slate-500'}`}>{s.label}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mb-5 transition-all ${step > i + 1 ? 'bg-blue-500' : 'bg-white/15'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section> : (
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Selling Tools</p>
              <h2 className="text-2xl font-black mt-1">{mode === 'self' ? 'Submit Your Car for Verification' : 'Book a Vehicle Inspection'}</h2>
              <p className="text-blue-100 text-sm leading-6 mt-2 max-w-2xl">
                {mode === 'self'
                  ? 'Add your vehicle details and documents. Your request will stay linked to this account while the team reviews it.'
                  : 'Choose a preferred date and branch. You can track the request from My Bookings without leaving the seller portal.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main */}
      <section className={sellerView ? 'pb-2' : 'py-12'}>
        <div className={sellerView ? 'w-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
              {flowSteps.map((s, i) => (
                <div key={s.label} className="flex gap-5 mb-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      step > i + 1 ? 'bg-blue-600' : step === i + 1 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-100'
                    }`}>
                      <s.icon className={`w-6 h-6 ${step > i + 1 ? 'text-white' : step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    {i < flowSteps.length - 1 && <div className="w-px flex-1 bg-gray-200 my-2" />}
                  </div>
                  <div className="pb-8">
                    <h3 className={`font-bold mb-1 ${step === i + 1 ? 'text-blue-600' : 'text-gray-900'}`}>Step {i + 1}: {s.label}</h3>
                    <p className="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-2">
                <h4 className="text-gray-900 font-semibold mb-3">What to Expect</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Free professional inspection at our branch', 'Detailed inspection report generated', 'Car listed on platform at no cost', 'OTP verification for security', 'Admin approval within 24 hours'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="mb-7">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Step {step} of 3</span>
                  <span>{Math.round((step / 3) * 100)}% Complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <>
                    <h3 className="text-gray-900 font-bold text-xl mb-5">Personal Information</h3>
                    {[
                      { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Muhammad Hasnain Ali' },
                      { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+92 300 1234567' },
                      { label: 'CNIC Number', key: 'cnic', type: 'text', placeholder: '35202-1234567-1' },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                        <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} required readOnly={f.key === 'email' && user?.role === 'user'} className={`input-light ${fieldErrors[f.key] ? 'border-red-400' : ''} ${f.key === 'email' && user?.role === 'user' ? 'bg-gray-50 text-gray-500' : ''}`} />
                        {fieldErrors[f.key] && <p className="text-red-600 text-xs mt-1">{fieldErrors[f.key]}</p>}
                      </div>
                    ))}
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="text-gray-900 font-bold text-xl mb-5">Vehicle & Price Details</h3>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
                      <span className="text-gray-600 text-sm">Not sure what your car is worth?</span>
                      <Link to="/price-predictor" className="text-blue-600 text-sm font-semibold hover:underline shrink-0">
                        Try Price Predictor →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Car Make', key: 'make', placeholder: 'Toyota' },
                        { label: 'Model', key: 'model', placeholder: 'Corolla' },
                        { label: 'Year', key: 'year', placeholder: '2020' },
                        { label: 'Mileage (km)', key: 'mileage', placeholder: '45000' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                          <input type="text" value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} required className="input-light" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Engine CC</label>
                      <input type="text" value={form.engine} onChange={e => update('engine', e.target.value)} placeholder="1800" required className="input-light" />
                    </div>
                    {mode === 'self' && <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">Your predicted market value can be used as the expected price. The showroom team confirms the final listing price during review.</p>}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="text-gray-900 font-bold text-xl mb-5">Documents & Verification</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload CNIC Image</label>
                      <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                        <span className="text-gray-500 text-sm">{form.cnicFile ? form.cnicFile.name : 'Drag & drop or click to upload CNIC'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => update('cnicFile', e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Registration Document</label>
                      <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                        <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                        <span className="text-gray-500 text-sm">{form.regFile ? form.regFile.name : 'Drag & drop or click to upload Registration'}</span>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => update('regFile', e.target.files[0])} />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Inspection Date</label>
                      <input type="date" value={form.date} onChange={e => update('date', e.target.value)} required className={`input-light ${fieldErrors.date ? 'border-red-400' : ''}`} />
                      {fieldErrors.date && <p className="text-red-600 text-xs mt-1">{fieldErrors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Branch</label>
                      <select value={form.branch} onChange={e => update('branch', e.target.value)} required className={`input-light ${fieldErrors.branch ? 'border-red-400' : ''}`}>
                        <option value="">Choose a verification branch...</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      {fieldErrors.branch && <p className="text-red-600 text-xs mt-1">{fieldErrors.branch}</p>}
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost px-6 py-3 rounded-xl font-semibold text-sm">Back</button>
                  )}
                  <button type="submit" className="btn-primary flex-1 py-3 rounded-xl font-semibold text-sm gap-2">
                    {step < 3 ? <>Next Step <ChevronRight className="w-4 h-4" /></> : <>{mode === 'self' ? 'Submit Ad for Review' : 'Book Inspection'} <CheckCircle className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* OTP Modal */}
      {showOTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOTP(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-scaleIn">
            <button onClick={() => setShowOTP(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 font-bold text-xl">Verify Your Email</h3>
              <p className="text-gray-500 text-sm mt-2">Enter the 6-digit OTP sent to {form.email}</p>
            </div>
            <div className="flex gap-2 justify-center mb-4">
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)}
                  className="w-11 h-12 bg-gray-50 border-2 border-gray-200 rounded-lg text-center text-gray-900 text-lg font-bold focus:outline-none focus:border-blue-500 transition-colors" />
              ))}
            </div>
            {devOtp && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-center">
                <p className="text-amber-800 text-xs font-semibold">Local email delivery is unavailable</p>
                <p className="text-amber-950 font-black tracking-[0.25em] text-xl mt-1">{devOtp}</p>
                <p className="text-amber-700 text-[11px] mt-1">Development only — production never exposes the OTP.</p>
              </div>
            )}
            {otpError && <p className="text-red-600 text-xs text-center mb-3">{otpError}</p>}
            <button onClick={handleVerifyOtp} disabled={verifying || submitting} className="btn-primary w-full py-3 rounded-xl font-semibold text-sm mb-3">
              {verifying || submitting ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center text-sm text-gray-500">
              {otpTimer > 0 ? <span>Resend in {otpTimer}s</span> : (
                <button onClick={handleResendOtp} className="text-blue-600 flex items-center gap-1 mx-auto hover:underline">
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!sellerView && <Footer />}
    </div>
  )

  return sellerView ? <SellerLayout title="Book Inspection">{page}</SellerLayout> : page
}
