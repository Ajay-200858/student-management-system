// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
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

  const cardStyle = {
    background: 'white', borderRadius: '10px',
    padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    flex: 1, textAlign: 'center',
  }

  return (
    <div>
      <h2 className="page-title">
        👋 Welcome, {user?.username}!
      </h2>
      <p style={{ color: '#666', marginBottom: '28px', fontSize: '14px' }}>
        Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
      </p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, borderTop: '4px solid #4361ee' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#4361ee' }}>{stats.total}</div>
          <div style={{ color: '#666', marginTop: '6px' }}>Total Students</div>
        </div>
        <div style={{ ...cardStyle, borderTop: '4px solid #2dc653' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#2dc653' }}>{stats.departments}</div>
          <div style={{ color: '#666', marginTop: '6px' }}>Departments</div>
        </div>
        {user?.role === 'admin' && (
          <div style={{ ...cardStyle, borderTop: '4px solid #e63946' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#e63946' }}>⚙️</div>
            <div style={{ color: '#666', marginTop: '6px' }}>Admin Access</div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '12px', color: '#333' }}>🚀 Quick Guide</h3>
        <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '20px', fontSize: '14px' }}>
          <li>Go to <strong>Students</strong> to view, search, and manage all students</li>
          <li>Go to <strong>Add Student</strong> to enroll a new student</li>
          <li>Click <strong>Marks</strong> on any student to view/add their marks</li>
          {user?.role === 'admin' && <li>Go to <strong>Login Logs</strong> to see who logged in</li>}
        </ul>
      </div>
    </div>
  )
}