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
        // REGISTER
       // Validate password matches the role's fixed password
const expectedPassword = form.role === 'student' ? 'student123' : 'JD'
if (form.password !== expectedPassword) {
  setMessage({ text: '❌ Wrong password for this role. Ask your administrator.', type: 'error' })
  setLoading(false)
  return
}
await axios.post(`${API}/auth/register`, {
  username: form.username,
  role: form.role
})
setMessage({ text: '✅ Account created successfully! Please login.', type: 'success' })
        setIsRegister(false)
      } else {
        // LOGIN
        const res = await axios.post(`${API}/auth/login`, {
          username: form.username,
          password: form.password
        })
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/')
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
      background: 'linear-gradient(135deg, #1a237e, #4361ee)',
    }}>
      <div className="card" style={{ width: '380px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '6px', color: '#1a237e' }}>
          🎓 Student Management
        </h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '24px' }}>
          {isRegister ? 'Create a new account' : 'Sign in to continue'}
        </p>

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
  <>
    <div className="form-group">
      <label>Role</label>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
    </div>
    <div className="form-group">
      <label>Password</label>
      <input
        type="password" name="password"
        value={form.password} onChange={handleChange}
        placeholder="Enter your password" required
      />
    </div>
  </>
)}

          <button
            type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Login')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => { setIsRegister(!isRegister); setMessage({ text: '', type: '' }) }}
            style={{ color: '#4361ee', cursor: 'pointer', fontWeight: '600' }}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  )
}