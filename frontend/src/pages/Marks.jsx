// frontend/src/pages/Marks.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function getGrade(pct) {
  if (pct >= 90) return { label: 'A+', color: '#10b981' }
  if (pct >= 80) return { label: 'A',  color: '#34d399' }
  if (pct >= 70) return { label: 'B',  color: '#60a5fa' }
  if (pct >= 60) return { label: 'C',  color: '#f59e0b' }
  if (pct >= 50) return { label: 'D',  color: '#f97316' }
  return { label: 'F', color: '#f87171' }
}

export default function Marks() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [marksData, setMarksData] = useState({ marks: [], total: 0, percentage: 0 })
  const [form, setForm] = useState({ subject: '', marks: '' })
  const [message, setMessage] = useState({ text: '', type: '' })

  function loadData() {
    axios.get(`${API}/students/${id}`).then(r => setStudent(r.data))
    axios.get(`${API}/marks/${id}`).then(r => setMarksData(r.data))
  }

  useEffect(() => { loadData() }, [id])

  async function addMark(e) {
    e.preventDefault()
    try {
      await axios.post(`${API}/marks/`, {
        student_id: id,
        subject: form.subject,
        marks: parseInt(form.marks),
      })
      setMessage({ text: '✅ Mark added!', type: 'success' })
      setForm({ subject: '', marks: '' })
      loadData()
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to add mark', type: 'error' })
    }
  }

  async function deleteMark(markId) {
    if (!window.confirm('Delete this mark?')) return
    await axios.delete(`${API}/marks/${markId}`)
    loadData()
  }

  const grade = getGrade(marksData.percentage)

  const summaryCards = [
    { label: 'Total Marks',  value: marksData.total,              color: '#7c3aed' },
    { label: 'Percentage',   value: `${marksData.percentage}%`,  color: '#2563eb' },
    { label: 'Subjects',     value: marksData.marks.length,       color: '#059669' },
    { label: 'Grade',        value: grade.label,                   color: grade.color },
  ]

  return (
    <div>
      <button className="btn btn-secondary btn-sm"
        onClick={() => navigate('/students')}
        style={{ marginBottom: 20 }}>
        ← Back to Students
      </button>

      <h2 className="page-title">
        📊 Marks — {student?.name || `Student #${id}`}
      </h2>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {summaryCards.map(c => (
          <div key={c.label} className="card" style={{
            flex: 1, minWidth: 130, textAlign: 'center',
            borderTop: `3px solid ${c.color}`,
          }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Add mark form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 15, color: '#fff', fontWeight: 700 }}>➕ Add New Mark</h3>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={addMark} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a5b4fc' }}>Subject</label>
            <input
              type="text"
              placeholder="Subject name"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              required
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 8, fontSize: 14,
                color: '#e2e0ff', outline: 'none',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: '#a5b4fc' }}>Marks (0–100)</label>
            <input
              type="number"
              placeholder="e.g. 85"
              value={form.marks}
              min="0" max="100"
              onChange={e => setForm({ ...form, marks: e.target.value })}
              required
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 8, fontSize: 14,
                color: '#e2e0ff', outline: 'none',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Add
          </button>
        </form>
      </div>

      {/* Marks table */}
      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 15, color: '#fff', fontWeight: 700 }}>📋 Subject-wise Marks</h3>
        {marksData.marks.length === 0 ? (
          <p style={{ color: '#4b5563', textAlign: 'center', padding: '24px 0' }}>No marks added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th><th>Subject</th><th>Marks</th><th>Out of</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {marksData.marks.map((m, i) => (
                <tr key={m.id}>
                  <td style={{ color: '#4b5563' }}>{i + 1}</td>
                  <td style={{ color: '#e2e0ff', fontWeight: 500 }}>{m.subject}</td>
                  <td style={{ color: '#a78bfa', fontWeight: 700 }}>{m.marks}</td>
                  <td style={{ color: '#4b5563' }}>100</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteMark(m.id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}