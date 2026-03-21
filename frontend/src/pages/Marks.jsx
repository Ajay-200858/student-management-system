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
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

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
      setMessage({ text: '✅ Mark added successfully!', type: 'success' })
      setForm({ subject: '', marks: '' })
      loadData()
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to add mark', type: 'error' })
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  async function deleteMark(markId) {
    if (!window.confirm('Delete this mark?')) return
    await axios.delete(`${API}/marks/${markId}`)
    loadData()
  }

  async function startEdit(mark) {
    setEditingId(mark.id)
    setEditValue(String(mark.marks))
  }

  async function saveEdit(markId) {
    const val = parseInt(editValue)
    if (isNaN(val) || val < 0 || val > 100) {
      setMessage({ text: 'Marks must be between 0 and 100', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }
    try {
      await axios.put(`${API}/marks/${markId}`, { marks: val })
      setMessage({ text: '✅ Mark updated!', type: 'success' })
      setEditingId(null)
      loadData()
    } catch {
      setMessage({ text: 'Failed to update mark', type: 'error' })
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValue('')
  }

  async function clearAllMarks() {
    if (!window.confirm(`Clear ALL marks for ${student?.name}? This cannot be undone.`)) return
    try {
      await axios.delete(`${API}/marks/clear/${id}`)
      setMessage({ text: '✅ All marks cleared.', type: 'success' })
      loadData()
    } catch {
      setMessage({ text: 'Failed to clear marks', type: 'error' })
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  function getGrade(pct) {
    if (pct >= 90) return { label: 'A+', color: '#2dc653' }
    if (pct >= 80) return { label: 'A', color: '#4361ee' }
    if (pct >= 70) return { label: 'B', color: '#0096c7' }
    if (pct >= 60) return { label: 'C', color: '#f4a261' }
    if (pct >= 50) return { label: 'D', color: '#e76f51' }
    return { label: 'F', color: '#e63946' }
  }

  function getBarColor(marks) {
    if (marks >= 80) return '#2dc653'
    if (marks >= 60) return '#4361ee'
    if (marks >= 40) return '#f4a261'
    return '#e63946'
  }

  const grade = getGrade(marksData.percentage)
  const maxPossible = marksData.marks.length * 100

  return (
    <div>
      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')}>
          ← Back to Students
        </button>
        {marksData.marks.length > 0 && (
          <button className="btn btn-info btn-sm" onClick={() => navigate(`/progress/${id}`)}>
            📈 Full Progress Report
          </button>
        )}
        {marksData.marks.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clearAllMarks}>
            🗑️ Clear All Marks
          </button>
        )}
      </div>

      <h2 className="page-title">
        📊 Marks — {student?.name || `Student #${id}`}
      </h2>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Marks', value: marksData.total, color: '#4361ee' },
          { label: 'Max Possible', value: maxPossible, color: '#0096c7' },
          { label: 'Percentage', value: `${marksData.percentage}%`, color: '#2dc653' },
          { label: 'Subjects', value: marksData.marks.length, color: '#f4a261' },
          { label: 'Grade', value: grade.label, color: grade.color },
        ].map(card => (
          <div key={card.label} className="card" style={{
            flex: 1, minWidth: '100px', textAlign: 'center',
            borderTop: `4px solid ${card.color}`
          }}>
            <div style={{ fontSize: '26px', fontWeight: '700', color: card.color }}>{card.value}</div>
            <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Add Mark Form */}
      <div className="card" style={{ marginBottom: '24px', maxWidth: '560px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>➕ Add New Mark</h3>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={addMark} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2 }}>
            <input
              type="text" placeholder="Subject name (e.g. Mathematics)"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              style={{
                width: '100%', padding: '9px 14px', border: '1px solid #ddd',
                borderRadius: '6px', fontSize: '14px', outline: 'none'
              }}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: '100px' }}>
            <input
              type="number" placeholder="Marks (0–100)"
              value={form.marks} min="0" max="100"
              onChange={e => setForm({ ...form, marks: e.target.value })}
              style={{
                width: '100%', padding: '9px 14px', border: '1px solid #ddd',
                borderRadius: '6px', fontSize: '14px', outline: 'none'
              }}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">➕ Add</button>
        </form>
      </div>

      {/* Marks Table */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📋 Subject-wise Marks</h3>
        {marksData.marks.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '30px 0' }}>
            No marks added yet. Use the form above to add marks.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marksData.marks.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td><strong>{m.subject}</strong></td>
                    <td>
                      {editingId === m.id ? (
                        <input
                          type="number" min="0" max="100"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          style={{
                            width: '70px', padding: '4px 8px', border: '1px solid #4361ee',
                            borderRadius: '4px', fontSize: '14px', outline: 'none'
                          }}
                          autoFocus
                        />
                      ) : (
                        <strong style={{ fontSize: '16px' }}>{m.marks}</strong>
                      )}
                    </td>
                    <td style={{ minWidth: '120px' }}>
                      <div style={{ background: '#f0f2f5', borderRadius: '6px', height: '8px', overflow: 'hidden', width: '100px' }}>
                        <div style={{
                          height: '100%',
                          width: `${m.marks}%`,
                          background: getBarColor(m.marks),
                          borderRadius: '6px'
                        }} />
                      </div>
                    </td>
                    <td>
                      <span style={{
                        background: m.marks >= 50 ? '#e8fff0' : '#ffe6e6',
                        color: m.marks >= 50 ? '#2dc653' : '#e63946',
                        padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                      }}>
                        {m.marks >= 50 ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {editingId === m.id ? (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => saveEdit(m.id)}>💾</button>
                            <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>✕</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-info btn-sm" onClick={() => startEdit(m)}>✏️ Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteMark(m.id)}>🗑️</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}