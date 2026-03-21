// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function Dashboard() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } })()
  const [stats, setStats] = useState({ total: 0, departments: 0 })

  useEffect(() => {
    axios.get(`${API}/students/`)
      .then(res => {
        const students = res.data
        const depts = new Set(students.map(s => s.department)).size
        setStats({ total: students.length, departments: depts })
      })
      .catch(() => {})
  }, [])

  const statCards = [
    { label: 'Total Students', value: stats.total, color: '#7c3aed', sub: 'Enrolled', icon: '👥' },
    { label: 'Departments',    value: stats.departments, color: '#059669', sub: 'Active', icon: '🏛️' },
    ...(user?.role === 'admin'
      ? [{ label: 'Access Level', value: 'Admin', color: '#b45309', sub: 'Full Control', icon: '⚙️' }]
      : []),
  ]

  const guides = [
    { icon: '👥', label: 'Students', desc: 'View, search, and manage all students' },
    { icon: '➕', label: 'Add Student', desc: 'Enroll a new student into the system' },
    { icon: '📊', label: 'Marks', desc: 'Click Marks on any student to view or add their marks' },
    ...(user?.role === 'admin'
      ? [{ icon: '📋', label: 'Login Logs', desc: 'See who logged in and when' }]
      : []),
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 100, padding: '4px 14px',
          fontSize: 11, color: '#34d399', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          Live Dashboard
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          Hello, {user?.username}! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>
          Here's what's happening with your students today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
        {statCards.map(c => (
          <div key={c.label} style={{
            flex: 1, minWidth: 200,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(139,92,246,0.15)`,
            borderRadius: 16, padding: '24px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${c.color}, transparent)`,
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{c.label}</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 12, color: '#4b5563', marginTop: 6 }}>{c.sub}</div>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `rgba(${c.color === '#7c3aed' ? '124,58,237' : c.color === '#059669' ? '5,150,105' : '180,83,9'},0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick guide */}
      <div className="card">
        <h3 style={{ marginBottom: 18, color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚡ Quick Guide
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {guides.map(g => (
            <div key={g.label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: 'rgba(139,92,246,0.05)',
              border: '1px solid rgba(139,92,246,0.1)',
              borderRadius: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(139,92,246,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                flexShrink: 0,
              }}>{g.icon}</div>
              <div>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Go to {g.label}</span>
                <span style={{ color: '#6b7280', fontSize: 13 }}> — {g.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}