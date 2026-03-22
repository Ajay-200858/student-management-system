import { useState, useRef, useEffect } from 'react'

// ⚠️ Add your Gemini API key here
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_CONTEXT = `You are a helpful assistant for a Student Management System. You help users manage students, marks, departments, and academic progress. Keep answers short, friendly, and helpful. If asked who you are, say you are the Student MS Assistant.`

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m your Student MS Assistant 👋\nHow can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text }] }
          ]
        })
      })
      const data = await res.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t understand that. Please try again.'
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error. Please check your internet connection.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button onClick={() => setOpen(o => !o)} title="Chat Assistant" style={{
        position: 'fixed', bottom: '24px', right: '24px',
        width: '50px', height: '50px', borderRadius: '50%',
        background: open ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none', boxShadow: '0 4px 18px rgba(99,102,241,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', cursor: 'pointer', zIndex: 1100,
        transition: 'all 0.25s',
      }}>
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '84px', right: '24px',
          width: '320px', maxHeight: '460px',
          background: 'var(--card-bg)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--card-border)', borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', zIndex: 1100,
          animation: 'fadeInUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--table-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💬</div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '13.5px', color: 'var(--text-primary)' }}>Chatbot</div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} /> Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--glass-bg)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--card-border)',
                  color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '13px', lineHeight: '1.55', whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--table-border)', display: 'flex', gap: '8px' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask me anything…" disabled={loading}
              style={{ flex: 1, padding: '9px 12px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading} style={{ width: '36px', height: '36px', borderRadius: '10px', background: input.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(99,102,241,0.3)', border: 'none', color: 'white', fontSize: '14px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}