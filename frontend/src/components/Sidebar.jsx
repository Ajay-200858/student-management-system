// frontend/src/components/Sidebar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const linkStyle = (path) => ({
    display: 'block',
    padding: '10px 16px',
    color: location.pathname === path ? '#fff' : '#c8d3f5',
    textDecoration: 'none',
    borderRadius: '6px',
    marginBottom: '4px',
    background: location.pathname === path ? 'rgba(255,255,255,0.2)' : 'transparent',
    fontWeight: location.pathname === path ? '600' : '400',
    fontSize: '14px',
    transition: 'background 0.2s',
  })

  return (
    <div style={{
      width: '220px',
      background: '#1a237e',
      minHeight: '100vh',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* App Title */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>
          🎓 Student MS
        </div>
        <div style={{ color: '#9fa8da', fontSize: '12px', marginTop: '4px' }}>
          {user?.role?.toUpperCase()} — {user?.username}
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1 }}>
        <Link to="/" style={linkStyle('/')}>🏠 Dashboard</Link>
        <Link to="/students" style={linkStyle('/students')}>👥 Students</Link>
        <Link to="/add-student" style={linkStyle('/add-student')}>➕ Add Student</Link>

        {/* Admin-only link */}
        {user?.role === 'admin' && (
          <Link to="/admin/logs" style={linkStyle('/admin/logs')}>📋 Login Logs</Link>
        )}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          width: '100%', padding: '10px', background: '#e63946',
          color: 'white', border: 'none', borderRadius: '6px',
          cursor: 'pointer', fontSize: '14px', fontWeight: '500',
        }}
      >
        🚪 Logout
      </button>
    </div>
  )
}