import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, Plus, Bot, User, Sparkles, Car, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

const SUGGESTIONS = [
  'Compare Corolla vs Civic',
  'Best SUV under 50 Lac',
  'Maintenance tips for Cultus',
  'Toyota Yaris pros and cons',
  'Which car has best resale value?',
  'Fuel efficient cars in Pakistan',
]

const MOCK_RESPONSES = {
  default: "I'm the Executive Cars AI Assistant. I can help you compare vehicles, estimate prices, and provide maintenance guidance. What would you like to know?",
  'compare corolla vs civic': "Toyota Corolla vs Honda Civic:\n\nCorolla: More fuel-efficient (12-14 km/L), lower maintenance cost, better resale value in Pakistan. Great for daily commuting.\n\nCivic: Sportier feel, better performance, more premium interior. Higher maintenance cost but excellent build quality.\n\nVerdict: For budget-conscious buyers → Corolla. For performance & style → Civic.",
  'best suv under 50 lac': "Top SUVs Under 50 Lac (2025):\n\n1. Kia Sportage (~45-48 Lac) — Best value, great features\n2. Hyundai Tucson (~47-50 Lac) — Premium feel, reliable\n3. Toyota Fortuner (used) (~40-48 Lac) — Legendary reliability\n4. MG HS (~42-46 Lac) — Feature-packed, modern tech",
  'maintenance tips for cultus': "Suzuki Cultus Maintenance Tips:\n\n• Oil change every 5,000 km (use 10W-30)\n• Air filter check every 10,000 km\n• Spark plugs replace every 30,000 km\n• Timing belt inspect at 60,000 km\n• Brake pads check every 20,000 km\n\nTip: Use genuine Suzuki parts for best performance.",
}

function getResponse(msg) {
  const lower = msg.toLowerCase()
  for (const [key, val] of Object.entries(MOCK_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return val
  }
  return MOCK_RESPONSES.default
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-blue-600' : 'bg-white border border-gray-200 shadow-sm'}`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Car className="w-4 h-4 text-blue-600" />}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'
      }`}>
        {msg.content.split('\n').map((line, i) => <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>{line}</p>)}
        <span className="text-xs opacity-50 mt-1 block">{msg.time}</span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
        <Car className="w-4 h-4 text-blue-600" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: MOCK_RESPONSES.default, time: 'Now' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [chatHistory] = useState([
    { title: 'Corolla vs Civic comparison', time: '2 hrs ago' },
    { title: 'Best SUV recommendations', time: 'Yesterday' },
    { title: 'Cultus maintenance guide', time: '2 days ago' },
  ])
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', content: msg, time }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
    setTyping(false)
    setMessages(prev => [...prev, { role: 'assistant', content: getResponse(msg), time }])
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shrink-0">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900 font-bold">AI Assistant</span>
            </div>
            <button className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Suggested Prompts</p>
            <div className="space-y-1">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 group">
                  <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Recent Chats</p>
            <div className="space-y-1">
              {chatHistory.map((h, i) => (
                <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all">
                  <p className="text-gray-700 text-sm truncate">{h.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{h.time}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold">Executive Cars AI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-500 text-xs">Online — Ready to help</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 lg:px-8 py-4 bg-white border-t border-gray-200">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {SUGGESTIONS.slice(0, 3).map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs hover:bg-blue-100 transition-all font-medium">
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about any car, price, or maintenance..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => sendMessage()} disabled={!input.trim()}
                className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
