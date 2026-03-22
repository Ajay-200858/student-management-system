import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function Feedback() {
  const [open, setOpen]     = useState(false)
  const [text, setText]     = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg]       = useState('')

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  async function submit() {
    if (!text.trim()) return
    setSending(true)
    try {
      await axios.post(`${API}/feedback/`, {
        feedback_text: text.trim(),
        username: user?.username || 'anonymous',
      })
      setMsg('Thank you for your feedback! 🙏')
      setText('')
      setTimeout(() => { setMsg(''); setOpen(false) }, 2500)
    } catch (err) {
      const detail = err.response?.data?.error || 'Failed to send. Please try again.'
      setMsg(detail)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* ── Slim tab anchored at bottom-LEFT ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Send Feedback"
        style={{
          position: 'fixed',
          bottom: '0',
          left: '260px',          /* clears the sidebar */
          padding: '6px 16px',
          borderRadius: '10px 10px 0 0',
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--card-border)',
          borderBottom: 'none',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: '700',
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        ✉️ Feedback
      </button>

      {/* ── Pop-up panel (opens upward from the tab) ── */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '34px',          /* sits on top of the tab */
          left: '260px',
          width: '300px',
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--card-border)',
          borderRadius: '0 16px 0 0',
          padding: '18px',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
          zIndex: 1050,
          animation: 'fadeInUp 0.2s ease',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>
              Share Feedback
            </span>
            <button
              onClick={() => { setOpen(false); setMsg('') }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', lineHeight: 1, padding: '0 2px' }}
            >✕</button>
          </div>

          {/* Body */}
          {msg ? (
            <div style={{
              padding: '12px', borderRadius: '10px',
              background: msg.includes('Thank') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${msg.includes('Thank') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: msg.includes('Thank') ? '#15803d' : '#dc2626',
              fontSize: '13px', textAlign: 'center',
            }}>
              {msg}
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Tell us what you think or report an issue…"
                rows={4}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '10px',
                  border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)',
                  color: 'var(--text-primary)', fontSize: '13px',
                  fontFamily: 'var(--font-body)', outline: 'none',
                  resize: 'none', lineHeight: '1.55', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e  => e.target.style.borderColor = 'var(--card-border)'}
              />
              <button
                onClick={submit}
                disabled={!text.trim() || sending}
                style={{
                  marginTop: '10px', width: '100%', padding: '9px',
                  background: text.trim() && !sending
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'rgba(99,102,241,0.3)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-body)',
                  cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
                  boxShadow: text.trim() ? '0 3px 10px rgba(99,102,241,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {sending ? 'Sending…' : '✉️ Send Feedback'}
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}