// frontend/src/pages/AddStudent.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'
const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics']

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', department: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API}/students/`, form)
      setMessage({ text: '✅ Student added successfully!', type: 'success' })
      setForm({ name: '', department: '' })
      setTimeout(() => navigate('/students'), 1500)
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to add student', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="page-title">➕ Add New Student</h2>

      <div className="card" style={{ maxWidth: 500 }}>
        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Kumar"
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : '✅ Add Student'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/students')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}