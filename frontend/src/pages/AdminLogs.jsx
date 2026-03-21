// frontend/src/pages/AdminLogs.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

const roleStyle = {
  admin:   { bg: 'rgba(220,38,38,0.15)',   color: '#f87171' },
  teacher: { bg: 'rgba(37,99,235,0.15)',   color: '#60a5fa' },
  student: { bg: 'rgba(5,150,105,0.15)',   color: '#34d399' },
}

export default function AdminLogs() {
  const navigate = useNavigate()
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } })()
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return }
    axios.get(`${API}/admin/logs`)
      .then(res => setLogs(res.data))
      .catch(() => setError('Failed to load logs'))
  }, [])

  return (
    <div>
      <h2 className="page-title">📋 Login Logs</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 18 }}>
          Total logins recorded: <strong style={{ color: '#a78bfa' }}>{logs.length}</strong>
        </p>

        {logs.length === 0 ? (
          <p style={{ color: '#4b5563', textAlign: 'center', padding: '24px 0' }}>No login records yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>#</th><th>Username</th><th>Role</th><th>Login Time</th></tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const rs = roleStyle[log.role] || { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' }
                  return (
                    <tr key={log.id}>
                      <td style={{ color: '#4b5563' }}>{i + 1}</td>
                      <td style={{ color: '#fff', fontWeight: 600 }}>{log.username}</td>
                      <td>
                        <span style={{
                          background: rs.bg, color: rs.color,
                          padding: '3px 12px', borderRadius: 20,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {log.role}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280', fontSize: 13 }}>{log.login_time}</td>
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