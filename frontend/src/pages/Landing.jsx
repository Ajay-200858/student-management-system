import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const features = [
  { icon: '👥', title: 'Student Management', desc: 'Enroll, edit, and organise students across multiple departments with ease.' },
  { icon: '📊', title: 'Marks & Grades', desc: 'Track subject-wise marks, calculate percentages and auto-assign letter grades.' },
  { icon: '📈', title: 'Progress Analytics', desc: 'Visual charts and reports to monitor performance trends at a glance.' },
  { icon: '🔐', title: 'Role-Based Access', desc: 'Admin, Teacher and Student roles each get tailored permissions and views.' },
  { icon: '🌙', title: 'Dark / Light Mode', desc: 'Smooth theme switching stored in your browser — your preference, always.' },
  { icon: '⚡', title: 'Real-time Updates', desc: 'Instant data sync across all pages without full-page reloads.' },
]

const stats = [
  { value: '6+', label: 'Departments' },
  { value: '3', label: 'User Roles' },
  { value: '100%', label: 'Open Source' },
  { value: 'A+', label: 'Grade System' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '14px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: '0 1px 24px rgba(99,102,241,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
          }}>🎓</div>
          <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Student<span style={{ color: 'var(--primary)' }}>MS</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={toggleTheme} style={{
            padding: '8px', borderRadius: '10px',
            border: '1px solid var(--table-border)', background: 'var(--glass-bg)',
            color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', transition: 'all 0.2s',
          }}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {user ? (
            <button onClick={() => navigate('/')} style={{
              padding: '9px 20px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontSize: '13.5px', fontWeight: '700', fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            }}>
              Go to Dashboard →
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{
                padding: '9px 18px', borderRadius: '10px',
                border: '1px solid var(--table-border)', background: 'transparent',
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontSize: '13.5px', fontWeight: '600', fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--table-border)' }}
              >
                Sign In
              </button>
              <button onClick={() => navigate('/login')} style={{
                padding: '9px 20px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', border: 'none', cursor: 'pointer',
                fontSize: '13.5px', fontWeight: '700', fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}>
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'pulse 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '8%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'pulse 8s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '20px',
          background: 'var(--primary-light)',
          border: '1px solid rgba(99,102,241,0.25)',
          marginBottom: '24px',
          animation: 'fadeInUp 0.5s ease forwards',
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.3)' }} />
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.04em' }}>
            STUDENT MANAGEMENT SYSTEM
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          lineHeight: '1.08',
          maxWidth: '820px',
          marginBottom: '20px',
          animation: 'fadeInUp 0.5s ease 0.1s forwards', opacity: 0,
        }}>
          Manage Students
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Smarter &amp; Faster
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px', color: 'var(--text-secondary)',
          maxWidth: '540px', lineHeight: '1.7',
          marginBottom: '36px',
          animation: 'fadeInUp 0.5s ease 0.2s forwards', opacity: 0,
        }}>
          A modern platform for schools and colleges to track enrollments,
          subject marks, and academic progress — all in one place.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeInUp 0.5s ease 0.3s forwards', opacity: 0,
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontSize: '15px', fontWeight: '700', fontFamily: 'var(--font-body)',
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)' }}
          >
            Start Now — It's Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <button
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '14px 28px',
              background: 'var(--glass-bg)', color: 'var(--text-primary)',
              border: '1px solid var(--card-border)', borderRadius: '14px',
              fontSize: '15px', fontWeight: '600', fontFamily: 'var(--font-body)',
              cursor: 'pointer', backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Explore Features ↓
          </button>
        </div>

        {/* Hero Preview Card */}
        <div style={{
          marginTop: '64px',
          maxWidth: '780px', width: '100%',
          background: 'var(--glass-bg-strong)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 24px 80px rgba(99,102,241,0.12), 0 1px 0 rgba(255,255,255,0.7) inset',
          animation: 'fadeInUp 0.6s ease 0.4s forwards', opacity: 0,
        }}>
          {/* Fake mini dashboard */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Students', val: '248', color: '#6366f1', icon: '👥' },
              { label: 'Departments', val: '6', color: '#059669', icon: '🏛' },
              { label: 'Avg Score', val: '74%', color: '#0891b2', icon: '📊' },
              { label: 'Top Grade', val: 'A+', color: '#d97706', icon: '🏆' },
            ].map(c => (
              <div key={c.label} style={{
                flex: '1 1 130px',
                background: 'var(--glass-bg)', border: '1px solid var(--card-border)',
                borderRadius: '14px', padding: '14px 16px',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{c.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: c.color, letterSpacing: '-0.04em' }}>{c.val}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', marginTop: '2px' }}>{c.label}</div>
              </div>
            ))}
          </div>
          {/* Fake progress bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { dept: 'Computer Science', pct: 88, color: '#6366f1' },
              { dept: 'Electronics', pct: 72, color: '#0891b2' },
              { dept: 'Mathematics', pct: 65, color: '#7c3aed' },
            ].map(r => (
              <div key={r.dept} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', width: '130px', flexShrink: 0 }}>{r.dept}</span>
                <div style={{ flex: 1, height: '8px', background: 'var(--table-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-primary)', width: '34px', textAlign: 'right' }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section style={{ padding: '60px 40px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              background: 'var(--card-bg)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--card-border)', borderRadius: '20px',
              padding: '28px 20px', textAlign: 'center',
              boxShadow: 'var(--glass-shadow)',
              animation: `fadeInUp 0.5s ease ${i * 80}ms forwards`, opacity: 0,
            }}>
              <div style={{
                fontSize: '40px', fontWeight: '800',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.04em', marginBottom: '6px',
              }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" style={{ padding: '60px 40px 80px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '20px',
              background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)',
              marginBottom: '14px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.06em' }}>FEATURES</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800',
              color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '12px',
            }}>
              Everything you need
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: '1.7' }}>
              A complete toolkit built for academic institutions — from enrolment to analytics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                background: 'var(--card-bg)', backdropFilter: 'blur(12px)',
                border: '1px solid var(--card-border)', borderRadius: '20px',
                padding: '28px 24px',
                boxShadow: 'var(--glass-shadow)',
                transition: 'all 0.28s ease',
                cursor: 'default',
                animation: `fadeInUp 0.5s ease ${i * 80}ms forwards`, opacity: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)' }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', marginBottom: '16px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section style={{ padding: '40px 40px 100px' }}>
        <div style={{
          maxWidth: '820px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '28px', padding: '56px 48px',
          textAlign: 'center',
          boxShadow: '0 16px 48px rgba(99,102,241,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: '800',
            color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '14px',
          }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px', lineHeight: '1.7' }}>
            Sign in or create an account to start managing your students today.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontSize: '15px', fontWeight: '700', fontFamily: 'var(--font-body)',
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99,102,241,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)' }}
          >
            Sign In to Dashboard →
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--table-border)',
        padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎓</span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>StudentMS</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Built with ❤️ for modern academic management
        </p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  )
}