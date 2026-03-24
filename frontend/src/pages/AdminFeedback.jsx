import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function AdminFeedback() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return }
    axios.get(`${API}/feedback/`)
      .then(res => setFeedback(res.data))
      .catch(() => setError('Failed to load feedback'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = feedback.filter(f =>
    f.message?.toLowerCase().includes(search.toLowerCase()) ||
    f.username?.toLowerCase().includes(search.toLowerCase())
  )

  const ROLE_COLORS = { admin: '#dc2626', teacher: '#0891b2', student: '#059669' }
  const getInitials = name => (name || 'A').slice(0, 2).toUpperCase()

  function formatDate(dt) {
    if (!dt) return '—'
    const d = new Date(dt)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            ✉️ User Feedback
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>All feedback submitted by users</p>
        </div>
        {/* Stats pill */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: feedback.length, color: '#6366f1' },
            { label: 'Today', value: feedback.filter(f => new Date(f.created_at).toDateString() === new Date().toDateString()).length, color: '#059669' },
          ].map(s => (
            <div key={s.label} style={{ padding: '10px 18px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', backdropFilter: 'blur(12px)', boxShadow: 'var(--glass-shadow)', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', boxShadow: 'var(--glass-shadow)' }}>
        <input
          type="text"
          placeholder="🔍 Search by username or message…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', fontSize: '13.5px' }}>{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--card-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
          Loading feedback…
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', boxShadow: 'var(--glass-shadow)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✉️</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '600' }}>
            {search ? 'No matching feedback found' : 'No feedback submitted yet'}
          </p>
        </div>
      )}

      {/* Feedback Cards */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((f, i) => {
            const roleColor = ROLE_COLORS[f.role] || '#6366f1'
            const isToday = new Date(f.created_at).toDateString() === new Date().toDateString()
            return (
              <div key={f.id} style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--card-border)',
                borderRadius: '18px',
                padding: '20px 24px',
                boxShadow: 'var(--glass-shadow)',
                borderLeft: '4px solid var(--primary)',
                animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Left: avatar + user info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                      background: `linear-gradient(135deg, ${roleColor}25, ${roleColor}10)`,
                      border: `1.5px solid ${roleColor}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '800', color: roleColor,
                    }}>
                      {getInitials(f.username)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{f.username}</div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>#{f.id}</span>
                        {isToday && (
                          <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '1px 7px', borderRadius: '20px', border: '1px solid rgba(5,150,105,0.2)' }}>
                            Today
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: timestamp */}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', whiteSpace: 'nowrap' }}>
                    🕐 {formatDate(f.created_at)}
                  </div>
                </div>

                {/* Message */}
                <div style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.65',
                  whiteSpace: 'pre-wrap',
                }}>
                  {f.message}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}