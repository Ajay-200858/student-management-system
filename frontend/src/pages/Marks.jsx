// frontend/src/pages/Marks.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

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
        marks: parseInt(form.marks)
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

  function getGrade(pct) {
    if (pct >= 90) return { label: 'A+', color: '#2dc653' }
    if (pct >= 80) return { label: 'A',  color: '#4361ee' }
    if (pct >= 70) return { label: 'B',  color: '#0096c7' }
    if (pct >= 60) return { label: 'C',  color: '#f4a261' }
    if (pct >= 50) return { label: 'D',  color: '#e76f51' }
    return { label: 'F', color: '#e63946' }
  }

  const grade = getGrade(marksData.percentage)

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')} style={{ marginBottom: '16px' }}>
        ← Back to Students
      </button>

      <h2 className="page-title">
        📊 Marks — {student?.name || `Student #${id}`}
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Marks', value: marksData.total, color: '#4361ee' },
          { label: 'Percentage', value: `${marksData.percentage}%`, color: '#0096c7' },
          { label: 'Subjects', value: marksData.marks.length, color: '#2dc653' },
          { label: 'Grade', value: grade.label, color: grade.color },
        ].map(card => (
          <div key={card.label} className="card" style={{ flex: 1, minWidth: '120px', textAlign: 'center', borderTop: `4px solid ${card.color}` }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: card.color }}>{card.value}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Add Mark Form */}
      <div className="card" style={{ marginBottom: '24px', maxWidth: '480px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>➕ Add New Mark</h3>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={addMark} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2 }}>
            <input
              type="text" placeholder="Subject name" value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              style={{ width: '100%', padding: '9px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="number" placeholder="Marks (0-100)" value={form.marks} min="0" max="100"
              onChange={e => setForm({ ...form, marks: e.target.value })}
              style={{ width: '100%', padding: '9px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Add</button>
        </form>
      </div>

      {/* Marks Table */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📋 Subject-wise Marks</h3>
        {marksData.marks.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>No marks added yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>#</th><th>Subject</th><th>Marks</th><th>Out of</th><th>Action</th></tr>
            </thead>
            <tbody>
              {marksData.marks.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.subject}</td>
                  <td><strong>{m.marks}</strong></td>
                  <td>100</td>
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