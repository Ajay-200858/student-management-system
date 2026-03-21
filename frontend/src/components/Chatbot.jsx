// frontend/src/components/Chatbot.jsx
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './Chatbot.css'

const API = 'http://localhost:5000/api'

// ─────────────────────────────────────────────────────────
//  PASTE YOUR GEMINI API KEY BELOW
//  Get one free at: https://aistudio.google.com/app/apikey
// ─────────────────────────────────────────────────────────
const GEMINI_API_KEY = 'AIzaSyC32sVU_wGZ6_Zrgvnhi2BLjxgX24i1ujg'

const SUGGESTIONS = [
  'Show top 5 students',
  'Who scored highest in Math?',
  'Average marks per department',
  'Students at risk of failing',
  'Generate a summary report',
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your AI student assistant powered by Claude. Ask me about student performance, top scorers, department stats, or anything about your students.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const bottomRef = useRef(null)

  // Load student data when chatbot opens
  useEffect(() => {
    if (open && students.length === 0) {
      axios.get(`${API}/students/`).then(res => setStudents(res.data)).catch(() => {})
    }
  }, [open])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function buildContext(students) {
    if (!students.length) return 'No student data available yet.'
    const depts = {}
    students.forEach(s => {
      if (!depts[s.department]) depts[s.department] = { count: 0, total: 0 }
      depts[s.department].count++
      depts[s.department].total += s.total_marks
    })
    const deptSummary = Object.entries(depts)
      .map(([d, v]) => `${d}: ${v.count} students, avg ${Math.round(v.total / v.count)} marks`)
      .join(' | ')
    const sorted = [...students].sort((a, b) => b.total_marks - a.total_marks)
    const top3 = sorted.slice(0, 3).map(s => `${s.name} (${s.total_marks})`).join(', ')
    const atRisk = students.filter(s => s.total_marks < 50).map(s => s.name).join(', ') || 'none'
    return `Total students: ${students.length}. Departments: ${deptSummary}. Top 3: ${top3}. At-risk (below 50): ${atRisk}.`
  }

  async function callClaude(userMessage) {
    const context = buildContext(students)
    const systemPrompt = `You are an AI assistant for a Student Management System.
Here is the current student data summary:
${context}
Full student list: ${students.map(s => `${s.name} — ${s.department} — ${s.total_marks} marks`).join(', ')}

Answer questions about this data helpfully and concisely. Use bullet points for lists. Keep answers under 150 words unless a detailed report is requested.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })
    if (!response.ok) throw new Error('Claude API error')
    const data = await response.json()
    return data.content?.[0]?.text || 'No response from Claude.'
  }

  async function callGemini(userMessage) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') return null
    try {
      const context = buildContext(students)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a data analyst. Based on this student data: ${context}. Answer in 1 short sentence: "${userMessage}"`,
              }],
            }],
          }),
        }
      )
      if (!response.ok) return null
      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch {
      return null
    }
  }

  async function sendMessage(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      // Re-fetch fresh student data before answering
      const res = await axios.get(`${API}/students/`)
      setStudents(res.data)

      let reply = ''

      // Try Gemini for a quick data insight first
      const geminiSnippet = await callGemini(msg)
      if (geminiSnippet) reply += `📊 *Gemini insight:* ${geminiSnippet}\n\n`

      // Claude handles the full conversational answer
      const claudeReply = await callClaude(msg)
      reply += claudeReply

      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      // Graceful fallback using local data
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `I couldn't reach the AI right now. Here's what I know:\n\n${buildContext(students)}\n\nPlease check your API connection.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="cb-wrapper">
      {/* Chat window */}
      {open && (
        <div className="cb-window">
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">AI</div>
              <div>
                <div className="cb-title">Student Assistant</div>
                <div className="cb-subtitle">Claude + Gemini</div>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cb-msg cb-msg--${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="cb-msg-avatar">AI</div>
                )}
                <div className="cb-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="cb-msg cb-msg--assistant">
                <div className="cb-msg-avatar">AI</div>
                <div className="cb-bubble cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (show only on first message) */}
          {messages.length === 1 && (
            <div className="cb-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="cb-sugg" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="cb-input-row">
            <input
              className="cb-input"
              type="text"
              placeholder="Ask about students…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="cb-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button className="cb-fab" onClick={() => setOpen(o => !o)} title="AI Assistant">
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && <div className="cb-dot" />}
      </button>
    </div>
  )
}