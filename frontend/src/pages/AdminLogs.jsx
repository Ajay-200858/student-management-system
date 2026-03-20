// frontend/src/pages/AdminLogs.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function AdminLogs() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    // Only admin can access this page
    if (user?.role !== 'admin') {
      navigate('/')
      return
    }
    axios.get(`${API}/admin/logs`)
      .then(res => setLogs(res.data))
      .catch(() => setError('Failed to load logs'))
  }, [])

  const roleColor = { admin: '#e63946', teacher: '#4361ee', student: '#2dc653' }

  return (
    <div>
      <h2 className="page-title">📋 Login Logs (Admin Only)</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
          Total logins recorded: <strong>{logs.length}</strong>
        </p>

        {logs.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>No login records yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>#</th><th>Username</th><th>Role</th><th>Login Time</th></tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id}>
                    <td>{i + 1}</td>
                    <td><strong>{log.username}</strong></td>
                    <td>
                      <span style={{
                        background: `${roleColor[log.role] || '#999'}20`,
                        color: roleColor[log.role] || '#999',
                        padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {log.role}
                      </span>
                    </td>
                    <td style={{ color: '#666' }}>{log.login_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}