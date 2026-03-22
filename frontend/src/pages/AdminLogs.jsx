import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

const roleConfig = {
  admin:   { bg: 'rgba(225,29,72,0.1)',   color: '#e11d48', dot: '#e11d48',  label: 'Admin' },
  teacher: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', dot: '#6366f1', label: 'Teacher' },
  student: { bg: 'rgba(5,150,105,0.1)',   color: '#059669', dot: '#059669', label: 'Student' },
}

function formatTime(timeStr) {
  try {
    const d = new Date(timeStr)
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return { date, time }
  } catch {
    return { date: timeStr, time: '' }
  }
}

export default function AdminLogs() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/')
      return
    }
    axios.get(`${API}/admin/logs`)
      .then(res => setLogs(res.data))
      .catch(() => setError('Failed to load login logs'))
      .finally(() => setLoading(false))
  }, [])

  const filteredLogs = filter
    ? logs.filter(l => l.role === filter)
    : logs

  const stats = {
    total: logs.length,
    admin: logs.filter(l => l.role === 'admin').length,
    teacher: logs.filter(l => l.role === 'teacher').length,
    student: logs.filter(l => l.role === 'student').length,
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="page-title">Login Activity</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Monitor all login events across the system
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          ⚠ {error}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '14px',
        marginBottom: '24px',
      }}>
        {[
          { label: 'Total Logins', value: stats.total, icon: '🔐', color: 'var(--primary)' },
          { label: 'Admin Logins', value: stats.admin, icon: '⚙️', color: '#e11d48' },
          { label: 'Teacher Logins', value: stats.teacher, icon: '👨‍🏫', color: '#6366f1' },
          { label: 'Student Logins', value: stats.student, icon: '📚', color: '#059669' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: 'var(--card-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '18px 20px',
              boxShadow: 'var(--glass-shadow)',
              animation: 'fadeInUp 0.4s ease forwards',
              opacity: 0,
            }}
          >
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '600',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span>{s.icon}</span> {s.label}
            </div>
            <div style={{
              fontSize: '30px',
              fontWeight: '800',
              color: s.color,
              letterSpacing: '-0.04em',
              lineHeight: '1.1',
            }}>
              {loading ? '—' : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Table */}
      <div style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--card-border)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 'var(--glass-shadow)',
        animation: 'fadeInUp 0.4s ease 0.2s forwards',
        opacity: 0,
      }}>
        {/* Table Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--table-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--table-header-bg)',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Login Records
            </h3>
            <span style={{
              fontSize: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontWeight: '600',
            }}>
              {filteredLogs.length}
            </span>
          </div>

          {/* Role filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['', 'admin', 'teacher', 'student'].map(r => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${filter === r ? 'var(--primary)' : 'var(--table-border)'}`,
                  background: filter === r ? 'var(--primary-light)' : 'transparent',
                  color: filter === r ? 'var(--primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s ease',
                  textTransform: 'capitalize',
                }}
              >
                {r || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', gap: '12px', alignItems: 'center' }}>
            <div className="spinner" />
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              No login records found
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--table-bg)' }}>
              <thead>
                <tr>
                  {['#', 'Username', 'Role', 'Date', 'Time'].map(h => (
                    <th key={h} style={{
                      padding: '12px 18px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-secondary)',
                      background: 'var(--table-header-bg)',
                      borderBottom: '1px solid var(--table-border)',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, i) => {
                  const rc = roleConfig[log.role] || roleConfig.student
                  const { date, time } = formatTime(log.login_time)
                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: i < filteredLogs.length - 1 ? '1px solid var(--table-border)' : 'none',
                        transition: 'background 0.15s ease',
                        animation: `fadeInUp 0.3s ease ${Math.min(i * 30, 300)}ms both`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--table-row-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '500' }}>
                          {i + 1}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: rc.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: rc.color,
                            flexShrink: 0,
                          }}>
                            {log.username.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {log.username}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 11px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: rc.bg,
                          color: rc.color,
                        }}>
                          <div style={{
                            width: '5px', height: '5px',
                            borderRadius: '50%', background: rc.dot, flexShrink: 0,
                          }} />
                          {rc.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {date}
                        </span>
                      </td>
                      <td style={{ padding: '13px 18px' }}>
                        <span style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: '500',
                          background: 'var(--glass-bg)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--table-border)',
                        }}>
                          {time}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}