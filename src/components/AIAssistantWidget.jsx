import React, { useState } from 'react'
import { MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react'

const FAQ = [
  {
    category: 'Buying a Car',
    items: [
      {
        q: 'How do I contact a seller?',
        a: 'Open any used car listing and click "Contact Seller" — it opens a pre-filled email to the seller directly.',
      },
      {
        q: 'Are the cars inspected?',
        a: 'Yes. Every listing on Executive Cars carries our inspection badge, meaning our team has physically verified the vehicle.',
      },
      {
        q: 'Can I negotiate the price?',
        a: 'Used car listings are fixed-price. For auction cars, you bid competitively against other members.',
      },
    ],
  },
  {
    category: 'Selling a Car',
    items: [
      {
        q: 'How do I sell my car?',
        a: 'Click "Sell Your Car" in the top navigation, complete the 3-step form, and book an inspection slot. Our team will reach out within 24 hours.',
      },
      {
        q: 'How long does the process take?',
        a: 'After your inspection is approved (usually 1–2 business days), you\'ll receive seller credentials by email and can manage your listing from the seller dashboard.',
      },
      {
        q: 'Is there a fee to list?',
        a: 'There is no upfront listing fee. Executive Cars charges a small commission only when your car sells.',
      },
    ],
  },
  {
    category: 'Auction',
    items: [
      {
        q: 'How do I join auctions?',
        a: 'Go to the Auction page and sign up for a membership (PKR 4,999/year). Once payment is confirmed, you get immediate access to all live auctions.',
      },
      {
        q: 'What happens when I win a bid?',
        a: 'You\'ll be notified via the auction dashboard. Our team will contact you within 24 hours to arrange payment and vehicle handover.',
      },
      {
        q: 'Can I cancel a bid?',
        a: 'Bids are binding. Please bid only if you intend to purchase. Contact us immediately if there is an exceptional circumstance.',
      },
    ],
  },
  {
    category: 'Account & Login',
    items: [
      {
        q: 'I forgot my password. What do I do?',
        a: 'Use the "Forgot password?" link on the login page. A reset link will be sent to your registered email.',
      },
      {
        q: 'Why can\'t I access the auction dashboard?',
        a: 'Auction dashboard access requires an active membership. If you\'ve already paid, ensure you\'re logged in with the email used during sign-up.',
      },
    ],
  },
  {
    category: 'Price Predictor',
    items: [
      {
        q: 'How accurate is the Price Predictor?',
        a: 'The predictor uses market data from recent transactions in Pakistan. It provides an estimate — actual prices vary based on condition, history, and demand.',
      },
      {
        q: 'Where do I find the Price Predictor?',
        a: 'Visit /price-predictor directly, or look for the "Try Price Predictor" hint shown on the Sell Your Car form and on individual car listing pages.',
      },
    ],
  },
]

function Accordion({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full text-left py-3 px-1 flex items-center justify-between gap-3 hover:text-blue-600 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-gray-800 text-sm font-medium">{item.q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <p className="text-gray-500 text-sm pb-3 px-1 leading-relaxed">{item.a}</p>
      )}
    </div>
  )
}

export default function AIAssistantWidget() {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 max-h-[480px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Help Center</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-blue-200 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-3 py-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
            {FAQ.map((cat, i) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeCategory === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {FAQ[activeCategory].items.map(item => (
              <Accordion key={item.q} item={item} />
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs">
              Still need help?{' '}
              <a href="mailto:info@executivecars.pk" className="text-blue-600 hover:underline font-medium">
                Email us
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open Help Center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
