// frontend/src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function Login() {
  const navigate = useNavigate()
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
        setMessage({
          text: `✅ Account created! Password: ${form.role === 'student' ? 'student123' : 'JD'}`,
          type: 'success',
        })
        setIsRegister(false)
      } else {
        const res = await axios.post(`${API}/auth/login`, {
          username: form.username,
          password: form.password,
        })
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/dashboard')
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Something went wrong', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d0f1a 0%, #12102a 100%)',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: 400,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 20, padding: 36,
        backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 14px',
          }}>🎓</div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>
            Student Management
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            {isRegister ? 'Create a new account' : 'Sign in to continue'}
          </p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text" name="username"
              value={form.username} onChange={handleChange}
              placeholder="Enter username" required
            />
          </div>

          {!isRegister && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" name="password"
                value={form.password} onChange={handleChange}
                placeholder="Enter password" required
              />
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}
            disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: '#6b7280' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => { setIsRegister(!isRegister); setMessage({ text: '', type: '' }) }}
            style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>

        <p style={{ textAlign: 'center', marginTop: 10 }}>
          <span onClick={() => navigate('/')}
            style={{ fontSize: 13, color: '#4b5563', cursor: 'pointer' }}>
            ← Back to Home
          </span>
        </p>
      </div>
    </div>
  )
}