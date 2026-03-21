// frontend/src/components/Chatbot.jsx

import { useState, useRef, useEffect } from 'react'

// ─────────────────────────────────────────────────────────────
//  🔑  PASTE YOUR GEMINI API KEY HERE
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'
// ─────────────────────────────────────────────────────────────

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_CONTEXT = `You are a helpful assistant for a Student Management System. 
You help users manage students, marks, departments, and understand the system. 
Keep answers short and friendly. The system has: Students, Marks, Progress analytics, Login Logs (admin only).`

/* ── tiny markdown-ish renderer ── */
function MsgText({ text }) {
  const lines = text.split('\n')
  return (
    <div>
      {lines.map((line, i) => {
        // bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} style={{ color: '#c4b5fd' }}>{p.slice(2, -2)}</strong>
            : p
        )
        return <div key={i} style={{ marginBottom: line === '' ? 6 : 2 }}>{parts}</div>
      })}
    </div>
  )
}

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Hi! I\'m your Student MS assistant.\nAsk me anything about students, marks, or the system!',
    },
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [dots,    setDots]    = useState('.')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /* animated dots */
  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 400)
    return () => clearInterval(t)
  }, [loading])

  /* focus input when opened */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // Build conversation history for Gemini
      const history = messages
        .filter(m => m.role !== 'error')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }))

      const body = {
        system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
        contents: [
          ...history,
          { role: 'user', parts: [{ text }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }

      const res  = await fetch(GEMINI_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        const errMsg = data?.error?.message || 'API error'
        throw new Error(errMsg)
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.'
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'error',
        text: `⚠️ ${err.message}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  /* ── styles ── */
  const glass = {
    background:   'rgba(18, 16, 46, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border:       '1px solid rgba(139, 92, 246, 0.25)',
  }

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position:   'fixed',
          bottom:     88,
          right:      28,
          width:      370,
          height:     520,
          borderRadius: 20,
          display:    'flex',
          flexDirection: 'column',
          overflow:   'hidden',
          zIndex:     9999,
          boxShadow:  '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.2)',
          ...glass,
        }}>

          {/* Header */}
          <div style={{
            padding:      '16px 18px',
            borderBottom: '1px solid rgba(139,92,246,0.2)',
            background:   'rgba(124,58,237,0.15)',
            display:      'flex', alignItems: 'center', gap: 12,
          }}>
            {/* Avatar */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
              boxShadow: '0 0 12px rgba(124,58,237,0.5)',
            }}>🤖</div>

            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                Student MS Assistant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }}/>
                <span style={{ color: '#10b981', fontSize: 11 }}>
                  {loading ? 'Typing…' : 'Online'}
                </span>
              </div>
            </div>

            {/* Powered by */}
            <div style={{
              fontSize: 10, color: '#6b7280',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '3px 9px',
            }}>
              Gemini ✨
            </div>

            {/* Close */}
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, width: 28, height: 28,
              color: '#9ca3af', cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', gap: 12,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(139,92,246,0.3) transparent',
          }}>
            {messages.map((msg, i) => {
              const isUser  = msg.role === 'user'
              const isError = msg.role === 'error'
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end', gap: 8,
                }}>
                  {/* Bot avatar */}
                  {!isUser && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: isError
                        ? 'rgba(220,38,38,0.3)'
                        : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13,
                    }}>
                      {isError ? '⚠️' : '🤖'}
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '78%',
                    padding: '10px 14px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: 13, lineHeight: 1.55,
                    background: isUser
                      ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                      : isError
                        ? 'rgba(220,38,38,0.15)'
                        : 'rgba(255,255,255,0.07)',
                    border: isUser
                      ? 'none'
                      : isError
                        ? '1px solid rgba(220,38,38,0.3)'
                        : '1px solid rgba(139,92,246,0.18)',
                    color: isUser ? '#fff' : isError ? '#f87171' : '#e2e0ff',
                    boxShadow: isUser
                      ? '0 4px 15px rgba(124,58,237,0.3)'
                      : 'none',
                  }}>
                    <MsgText text={msg.text} />
                  </div>

                  {/* User avatar */}
                  {isUser && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(139,92,246,0.3)',
                      border: '1px solid rgba(139,92,246,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13,
                    }}>
                      👤
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                }}>🤖</div>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(139,92,246,0.18)',
                  borderRadius: '18px 18px 18px 4px',
                  color: '#a78bfa', fontSize: 13,
                }}>
                  Thinking{dots}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div style={{
              padding: '0 14px 10px',
              display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {[
                'How do I add a student?',
                'What is the pass mark?',
                'How to view marks?',
                'Explain progress tab',
              ].map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 0) }}
                  style={{
                    padding: '5px 11px', fontSize: 11,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 20, color: '#a78bfa',
                    cursor: 'pointer',
                  }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(139,92,246,0.18)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex', gap: 8, alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything… (Enter to send)"
              rows={1}
              style={{
                flex: 1,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 12,
                color: '#e2e0ff',
                fontSize: 13,
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                maxHeight: 90,
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: loading || !input.trim()
                  ? 'rgba(124,58,237,0.2)'
                  : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#fff', fontSize: 16, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: loading || !input.trim() ? 'none' : '0 4px 15px rgba(124,58,237,0.35)',
              }}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}

      {/* ── FAB button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position:   'fixed',
          bottom:     28,
          right:      28,
          width:      56,
          height:     56,
          borderRadius: '50%',
          background: open
            ? 'rgba(220,38,38,0.8)'
            : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          border:     '2px solid rgba(139,92,246,0.4)',
          color:      '#fff',
          fontSize:   24,
          cursor:     'pointer',
          zIndex:     10000,
          display:    'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow:  open
            ? '0 8px 30px rgba(220,38,38,0.4)'
            : '0 8px 30px rgba(124,58,237,0.5), 0 0 0 6px rgba(124,58,237,0.1)',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
        }}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Pulse ring when closed */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28,
          width: 56, height: 56,
          borderRadius: '50%',
          border: '2px solid rgba(124,58,237,0.4)',
          zIndex: 9998,
          animation: 'chatPulse 2s infinite',
          pointerEvents: 'none',
        }}/>
      )}

      <style>{`
        @keyframes chatPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(1.5); opacity: 0;   }
          100% { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </>
  )
}