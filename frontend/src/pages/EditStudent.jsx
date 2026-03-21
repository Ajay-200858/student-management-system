// frontend/src/pages/EditStudent.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'
const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics']

export default function EditStudent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', department: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${API}/students/${id}`)
      .then(res => setForm({ name: res.data.name, department: res.data.department }))
      .catch(() => setMessage({ text: 'Student not found', type: 'error' }))
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`${API}/students/${id}`, form)
      setMessage({ text: '✅ Student updated!', type: 'success' })
      setTimeout(() => navigate('/students'), 1500)
    } catch {
      setMessage({ text: 'Update failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="page-title">✏️ Edit Student (ID: {id})</h2>

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
              placeholder="Full name"
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
              {loading ? 'Saving...' : '💾 Save Changes'}
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