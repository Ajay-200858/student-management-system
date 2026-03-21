// frontend/src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(139,92,246,${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const features = [
    { icon: '👥', title: 'Student Management', desc: 'Add, edit, and manage student profiles with department tracking and full CRUD operations.' },
    { icon: '📊', title: 'Marks & Analytics', desc: 'Record subject-wise marks, auto-calculate totals, percentage, and grade.' },
    { icon: '🔐', title: 'Role-Based Access', desc: 'Secure login with Admin, Teacher, and Student roles — each with tailored permissions.' },
    { icon: '📋', title: 'Login Audit Logs', desc: 'Admin-only access to full login history with timestamps and role-based filtering.' },
    { icon: '🔍', title: 'Search & Filter', desc: 'Instantly search students by name and filter by department in real-time.' },
    { icon: '⚡', title: 'Fast & Modern Stack', desc: 'Built with React 19, Flask, and MySQL — a powerful full-stack architecture.' },
  ]

  return (
    /* position:relative + overflow:hidden ensures canvas stays INSIDE this page only */
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0d1a 0%, #12102a 40%, #0f0f1f 100%)',
      fontFamily: "'DM Sans', sans-serif",
      color: '#e2e0ff',
      overflowX: 'hidden',
      position: 'relative',   // ← key fix: relative, NOT fixed
    }}>
      {/* Canvas — absolute inside this page, NOT fixed */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',   // ← was fixed, now absolute
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Gradient orbs — absolute, NOT fixed */}
      <div style={{
        position: 'absolute',  // ← was fixed
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)',
        top: -100, left: -100, zIndex: 0, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',  // ← was fixed
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)',
        bottom: 100, right: -80, zIndex: 0, pointerEvents: 'none',
      }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0,   // ← sticky inside this page, not fixed globally
        zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 48px',
        background: 'rgba(13,13,26,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🎓</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>Student MS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ color: '#a5b4fc', fontSize: 14, textDecoration: 'none' }}>Features</a>
          <a href="#stats"    style={{ color: '#a5b4fc', fontSize: 14, textDecoration: 'none' }}>Overview</a>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '9px 22px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
            }}
          >
            Sign In →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 100, paddingBottom: 80, textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 100, padding: '6px 18px',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
          color: '#c4b5fd', marginBottom: 32, textTransform: 'uppercase',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#10b981', display: 'inline-block',
            boxShadow: '0 0 8px #10b981',
          }} />
          Live Dashboard Active
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 76px)',
          fontWeight: 800, lineHeight: 1.1,
          color: '#fff', marginBottom: 24,
          letterSpacing: '-0.02em',
        }}>
          Manage Students
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #818cf8, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Smarter & Faster
          </span>
        </h1>

        <p style={{ fontSize: 18, color: '#a5b4fc', lineHeight: 1.7, maxWidth: 540, marginBottom: 40 }}>
          A complete student management system with marks tracking, role-based
          access, department analytics, and admin audit logs.
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 70, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '14px 36px', fontSize: 16, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
            }}
          >
            Get Started →
          </button>
          <button
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'rgba(139,92,246,0.08)',
              color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 14, padding: '14px 36px', fontSize: 16, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Explore Features
          </button>
        </div>

        {/* Dashboard preview card */}
        <div style={{
          width: '90%', maxWidth: 820,
          background: 'rgba(18,16,42,0.9)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 20, overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}>
          {/* card titlebar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 20px',
            background: 'rgba(139,92,246,0.07)',
            borderBottom: '1px solid rgba(139,92,246,0.12)',
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#a5b4fc' }}>🎓 Student MS — Live Dashboard</span>
          </div>

          {/* stats row */}
          <div style={{ padding: '20px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Students', val: '128', color: '#7c3aed' },
              { label: 'Departments',    val: '6',   color: '#059669' },
              { label: 'Access Level',   val: 'Admin', color: '#b45309' },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, minWidth: 120,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 10, padding: '12px 14px',
                borderTop: `3px solid ${s.color}`,
              }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* table */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.03)', borderRadius: 6,
              fontSize: 11, color: '#6b7280', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
            }}>
              <span>ID</span><span>Name</span><span>Department</span><span>Marks</span>
            </div>
            {[
              { id: '001', name: 'Arjun Kumar',  dept: 'Computer Science', marks: '487' },
              { id: '002', name: 'Priya Sharma', dept: 'Electronics',       marks: '412' },
              { id: '003', name: 'Rahul Patel',  dept: 'Mathematics',       marks: '378' },
            ].map(r => (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px',
                padding: '10px 12px', fontSize: 13,
                borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center',
              }}>
                <span style={{ color: '#6b7280', fontFamily: 'monospace' }}>#{r.id}</span>
                <span style={{ color: '#e2e0ff', fontWeight: 500 }}>{r.name}</span>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                  borderRadius: 20, padding: '2px 10px', fontSize: 11,
                }}>{r.dept}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>{r.marks}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'center', gap: 20,
        padding: '60px 48px', flexWrap: 'wrap',
        borderTop: '1px solid rgba(139,92,246,0.1)',
        borderBottom: '1px solid rgba(139,92,246,0.1)',
      }}>
        {[
          { value: '6+',   label: 'Departments' },
          { value: '3',    label: 'Access Roles' },
          { value: '100%', label: 'Secure Auth' },
          { value: '∞',   label: 'Students' },
        ].map(s => (
          <div key={s.label} style={{
            textAlign: 'center', padding: '20px 40px',
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: 16,
          }}>
            <div style={{
              fontSize: 44, fontWeight: 800,
              background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{
        position: 'relative', zIndex: 10,
        padding: '100px 48px', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.25)',
          color: '#a78bfa', borderRadius: 100,
          padding: '5px 18px', fontSize: 12, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
        }}>Everything You Need</div>

        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 800,
          color: '#fff', lineHeight: 1.2, marginBottom: 14,
        }}>
          Powerful Features,<br />Built for Educators
        </h2>
        <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto 60px' }}>
          Every tool an institution needs — from student enrollment to marks analytics.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20, maxWidth: 1000, margin: '0 auto', textAlign: 'left',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'rgba(18,16,42,0.7)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 18, padding: '28px',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.2s, border-color 0.2s',
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e2e0ff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center', padding: '100px 48px',
        borderTop: '1px solid rgba(139,92,246,0.1)',
      }}>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 36 }}>
          Sign in with your credentials and take full control of your institution's data.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: '#fff', border: 'none', borderRadius: 14,
            padding: '14px 36px', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
          }}
        >
          Launch Dashboard 🚀
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '40px 48px',
        borderTop: '1px solid rgba(139,92,246,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎓</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>Student MS</span>
        </div>
        <p style={{ fontSize: 13, color: '#374151' }}>Built with React · Flask · MySQL</p>
        <p style={{ fontSize: 13, color: '#374151' }}>© 2026 Student Management System</p>
      </footer>
    </div>
  )
}