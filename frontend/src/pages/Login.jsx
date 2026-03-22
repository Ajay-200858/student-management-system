import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'

const API = 'http://localhost:5000/api'

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

export default function Login() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', role: 'student' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      if (isRegister) {
        await axios.post(`${API}/auth/register`, { username: form.username, role: form.role })
        setMessage({ text: 'Account created! You can now sign in.', type: 'success' })
        setIsRegister(false)
      } else {
        const res = await axios.post(`${API}/auth/login`, { username: form.username, password: form.password })
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/')
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Something went wrong', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)',
    color: 'var(--text-primary)', fontSize: '14.5px', fontFamily: 'var(--font-body)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  }
  const labelStyle = {
    display: 'block', fontSize: '11.5px', fontWeight: '700',
    color: 'var(--text-muted)', letterSpacing: '0.07em',
    marginBottom: '7px', textTransform: 'uppercase',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      {/* Blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '8%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{ position: 'fixed', top: '20px', right: '20px', padding: '9px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: 'var(--glass-shadow)', zIndex: 100 }}>
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>

      {/* Back to landing */}
      <Link to="/landing" style={{ position: 'fixed', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', fontWeight: '600', boxShadow: 'var(--glass-shadow)', zIndex: 100 }}>
        ← Home
      </Link>

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.45s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>🎓</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            {isRegister ? 'Create account' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {isRegister ? 'Register to get access' : 'Sign in to your account to continue'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--glass-shadow)' }}>
          {message.text && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13.5px', fontWeight: '500', background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: message.type === 'success' ? '#15803d' : '#dc2626' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange}
                placeholder="Enter your username" required style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Password — always hidden, no toggle */}
            {!isRegister && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="Enter your password" required style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            )}

            {/* Role selector for register */}
            {isRegister && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['student', 'teacher'].map(r => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, role: r })} style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${form.role === r ? 'var(--primary)' : 'var(--card-border)'}`, background: form.role === r ? 'var(--primary-light)' : 'var(--glass-bg)', color: form.role === r ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '13.5px', fontWeight: '700', fontFamily: 'var(--font-body)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      {r === 'student' ? '🎓' : '👩‍🏫'} {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.45)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)' }}
            >
              {loading
                ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Please wait…</>
                : isRegister ? 'Create Account' : 'Sign In'
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => { setIsRegister(!isRegister); setMessage({ text: '', type: '' }) }} style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>
              {isRegister ? 'Sign In' : 'Register'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}