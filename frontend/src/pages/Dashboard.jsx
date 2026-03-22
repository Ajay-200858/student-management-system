import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function StatCard({ icon, value, label, color, delay = 0 }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: 'var(--glass-shadow)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      animation: `fadeInUp 0.5s ease ${delay}ms forwards`,
      opacity: 0,
      transition: 'all 0.3s ease',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--glass-shadow-hover)'
      e.currentTarget.style.transform = 'translateY(-3px)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--glass-shadow)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: color.replace(')', ', 0.08)').replace('rgb', 'rgba'),
        opacity: 0.5,
      }} />

      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '16px',
        background: color.replace(')', ', 0.12)').replace('rgb', 'rgba'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        flexShrink: 0,
        border: `1px solid ${color.replace(')', ', 0.2)').replace('rgb', 'rgba')}`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '32px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          lineHeight: '1.1',
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          marginTop: '4px',
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, description, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '18px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--table-border)',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        fontFamily: 'var(--font-body)',
        width: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--card-bg)'
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--glass-bg)'
        e.currentTarget.style.borderColor = 'var(--table-border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: `${color}15`,
        border: `1px solid ${color}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '3px',
        }}>
          {label}
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          {description}
        </div>
      </div>
    </button>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [stats, setStats] = useState({ total: 0, departments: 0 })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    axios.get(`${API}/students/`)
      .then(res => {
        const students = res.data
        const depts = new Set(students.map(s => s.department)).size
        setStats({ total: students.length, departments: depts })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const greeting = () => {
    const h = currentTime.getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = (d) => d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontWeight: '500',
            marginBottom: '4px',
          }}>
            {formatDate(currentTime)}
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: '1.2',
          }}>
            {greeting()}, {user?.username}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '5px' }}>
            Here's what's happening in your system today.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          border: '1px solid var(--table-border)',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 0 2px rgba(34,197,94,0.3)',
          }} />
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <StatCard
          icon="👥"
          value={loading ? '—' : stats.total}
          label="Total Students"
          color="rgb(99,102,241)"
          delay={0}
        />
        <StatCard
          icon="🏛"
          value={loading ? '—' : stats.departments}
          label="Departments"
          color="rgb(5,150,105)"
          delay={80}
        />
        <StatCard
          icon="📊"
          value="Active"
          label="System Status"
          color="rgb(8,145,178)"
          delay={160}
        />
        {user?.role === 'admin' && (
          <StatCard
            icon="⚙️"
            value="Admin"
            label="Access Level"
            color="rgb(225,29,72)"
            delay={240}
          />
        )}
      </div>

      {/* Quick Actions + Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
      }}>
        {/* Quick Actions */}
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--glass-shadow)',
          animation: 'fadeInUp 0.5s ease 0.3s forwards',
          opacity: 0,
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <QuickAction
              icon="👥"
              label="View All Students"
              description="Browse, search and manage enrolled students"
              onClick={() => navigate('/students')}
              color="#6366f1"
            />
            <QuickAction
              icon="➕"
              label="Add New Student"
              description="Enroll a new student into the system"
              onClick={() => navigate('/add-student')}
              color="#059669"
            />
            {user?.role === 'admin' && (
              <QuickAction
                icon="📋"
                label="Login Activity"
                description="View recent login records and access logs"
                onClick={() => navigate('/admin/logs')}
                color="#e11d48"
              />
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--glass-shadow)',
          animation: 'fadeInUp 0.5s ease 0.4s forwards',
          opacity: 0,
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>🚀</span>
            Getting Started
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: '1', text: 'Navigate to Students to view and manage all enrolled students', icon: '👥' },
              { step: '2', text: 'Use Add Student to enroll new students with department info', icon: '📝' },
              { step: '3', text: 'Click Marks on any student to view or add subject marks', icon: '📊' },
              ...(user?.role === 'admin'
                ? [{ step: '4', text: 'Check Login Logs for complete access history', icon: '🔐' }]
                : []),
            ].map(item => (
              <div key={item.step} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '11px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  {item.step}
                </div>
                <p style={{
                  fontSize: '13.5px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0,
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}