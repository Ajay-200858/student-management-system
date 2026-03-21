// frontend/src/components/Sidebar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/dashboard',   icon: '🏠', label: 'Dashboard' },
  { path: '/students',    icon: '👥', label: 'Students' },
  { path: '/add-student', icon: '➕', label: 'Add Student' },
  { path: '/progress',    icon: '📈', label: 'Progress' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  let user = null
  try { user = JSON.parse(localStorage.getItem('user') || 'null') } catch {}

  const active = (path) => location.pathname === path

  return (
    <div style={{
      width: 220, minWidth: 220,
      background: 'linear-gradient(180deg, #12102e 0%, #0e0c26 100%)',
      minHeight: '100vh',
      padding: '0 0 24px',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(139,92,246,0.15)',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🎓</div>
          <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>Student MS</span>
        </div>

        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 10, padding: '8px 12px',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user?.username}</div>
            <div style={{ color: '#7c3aed', fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{
        padding: '8px 20px 4px', fontSize: 10,
        color: '#4b5563', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Navigation
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV.map(({ path, icon, label }) => (
          <Link key={path} to={path} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            color: active(path) ? '#fff' : '#8b9cc8',
            textDecoration: 'none',
            borderRadius: 10, marginBottom: 2,
            background: active(path)
              ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))'
              : 'transparent',
            border: active(path)
              ? '1px solid rgba(139,92,246,0.3)'
              : '1px solid transparent',
            fontWeight: active(path) ? 600 : 400,
            fontSize: 14, transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
            {active(path) && (
              <div style={{
                marginLeft: 'auto', width: 6, height: 6,
                borderRadius: '50%', background: '#7c3aed',
              }} />
            )}
          </Link>
        ))}

        {/* Admin only */}
        {user?.role === 'admin' && (
          <>
            <div style={{
              padding: '12px 12px 4px', fontSize: 10,
              color: '#4b5563', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Admin
            </div>
            <Link to="/admin/logs" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              color: active('/admin/logs') ? '#fff' : '#8b9cc8',
              textDecoration: 'none',
              borderRadius: 10, marginBottom: 2,
              background: active('/admin/logs')
                ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))'
                : 'transparent',
              border: active('/admin/logs')
                ? '1px solid rgba(139,92,246,0.3)'
                : '1px solid transparent',
              fontWeight: active('/admin/logs') ? 600 : 400,
              fontSize: 14,
            }}>
              <span style={{ fontSize: 16 }}>📋</span>
              Login Logs
              {active('/admin/logs') && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
              )}
            </Link>
          </>
        )}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0 12px' }}>
        <button
          onClick={() => { localStorage.removeItem('user'); navigate('/') }}
          style={{
            width: '100%', padding: '11px',
            background: 'rgba(230,57,70,0.15)',
            color: '#f87171',
            border: '1px solid rgba(230,57,70,0.3)',
            borderRadius: 10, cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}