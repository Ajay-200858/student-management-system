import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const NAV = [
  { to: '/',            icon: '⊞',  label: 'Dashboard'   },
  { to: '/students',    icon: '◎',  label: 'Students'    },
  { to: '/add-student', icon: '⊕',  label: 'Add Student' },
  { to: '/progress',    icon: '📈', label: 'Progress'    },
]
const ADMIN_NAV = [
  { to: '/admin/logs',  icon: '◷',  label: 'Login Logs'  },
]

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)

const ROLE_COLORS = { admin: '#dc2626', teacher: '#0891b2', student: '#059669' }

export default function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { theme, toggleTheme } = useTheme()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('user')
    navigate('/landing')
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const roleColor = ROLE_COLORS[user?.role] || '#6366f1'
  const initials  = (user?.username || 'U').slice(0, 2).toUpperCase()

  return (
    <aside style={{
      width: '224px',
      minHeight: '100vh',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--glass-border)',
      padding: '20px 14px',
      boxShadow: '2px 0 20px rgba(99,102,241,0.05)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px', marginBottom: '20px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '11px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', boxShadow: '0 4px 12px rgba(99,102,241,0.35)', flexShrink: 0,
        }}>🎓</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Student MS</div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '500' }}>Management System</div>
        </div>
      </div>

      {/* User card */}
      <div style={{
        padding: '12px', borderRadius: '14px',
        background: 'var(--primary-light)',
        border: '1px solid rgba(99,102,241,0.15)',
        marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: `linear-gradient(135deg, ${roleColor}30, ${roleColor}15)`,
          border: `1.5px solid ${roleColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '800', fontSize: '13px', color: roleColor, flexShrink: 0,
        }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.username}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: roleColor, boxShadow: `0 0 0 2px ${roleColor}30` }} />
            <span style={{ fontSize: '11px', color: roleColor, fontWeight: '700', textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px', textTransform: 'uppercase' }}>
          MENU
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[...NAV, ...(user?.role === 'admin' ? ADMIN_NAV : [])].map(item => {
            const active = isActive(item.to)
            return (
              <Link key={item.to} to={item.to} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '12px',
                textDecoration: 'none',
                background: active ? 'var(--primary-light)' : 'transparent',
                borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: active ? '700' : '500',
                fontSize: '13.5px',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--glass-bg-strong)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
              >
                <span style={{ fontSize: '15px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Dark mode toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', borderRadius: '12px',
        background: 'var(--glass-bg-strong)',
        border: '1px solid var(--card-border)',
        marginBottom: '10px',
        cursor: 'pointer',
      }} onClick={toggleTheme}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{theme === 'light' ? <MoonIcon /> : <SunIcon />}</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Dark Mode</span>
        </div>
        <div style={{
          width: '36px', height: '20px', borderRadius: '10px',
          background: theme === 'dark' ? 'var(--primary)' : 'var(--table-border)',
          position: 'relative', transition: 'background 0.25s', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: '3px',
            left: theme === 'dark' ? '17px' : '3px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            transition: 'left 0.25s',
          }} />
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout} style={{
        width: '100%', padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'transparent', border: '1px solid var(--card-border)',
        borderRadius: '12px', color: 'var(--text-secondary)',
        fontSize: '13.5px', fontWeight: '600',
        fontFamily: 'var(--font-body)', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#dc2626' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        <LogoutIcon />
        Sign Out
      </button>
    </aside>
  )
}