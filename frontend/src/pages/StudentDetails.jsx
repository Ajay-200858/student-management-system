import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function StudentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [editing, setEditing] = useState(false)
  const [details, setDetails] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    axios.get(`${API}/students/${id}`).then(r => {
      setStudent(r.data)
      setDetails(r.data.details || '')
    })
  }, [id])

  async function saveDetails() {
    setSaving(true)
    try {
      await axios.put(`${API}/students/${id}`, { ...student, details })
      setStudent(s => ({ ...s, details }))
      setEditing(false)
      setMsg('Details saved!')
      setTimeout(() => setMsg(''), 2500)
    } catch {
      setMsg('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!student) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>

  const DEPT_COLORS = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#7c3aed']
  const color = DEPT_COLORS[Math.abs([...(student.department||'x')].reduce((a,c) => a + c.charCodeAt(0), 0)) % DEPT_COLORS.length]
  const initials = student.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', animation: 'fadeInUp 0.35s ease' }}>
      <button onClick={() => navigate('/students')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', fontFamily: 'var(--font-body)', cursor: 'pointer', marginBottom: '20px' }}>
        ← Back to Students
      </button>

      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--glass-shadow)' }}>
        {/* Student Profile */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--table-border)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `linear-gradient(135deg, ${color}30, ${color}15)`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color, flexShrink: 0 }}>{initials}</div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>{student.name}</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {student.college_id && <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '7px', border: '1px solid var(--card-border)' }}>{student.college_id}</span>}
              <span style={{ fontSize: '12px', fontWeight: '600', color, background: `${color}15`, padding: '3px 10px', borderRadius: '8px' }}>{student.department}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Student ID', value: `#${student.student_id}` },
            { label: 'College ID', value: student.college_id || '—' },
            { label: 'Department', value: student.department },
            { label: 'Total Marks', value: student.total_marks ?? '—' },
          ].map(row => (
            <div key={row.label} style={{ padding: '14px 16px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{row.label}</div>
              <div style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-primary)' }}>{row.value}</div>
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>📝 Student Details</h3>
            <button onClick={() => { setEditing(!editing); setDetails(student.details || '') }} style={{ padding: '6px 12px', background: editing ? 'rgba(239,68,68,0.1)' : 'var(--primary-light)', border: `1px solid ${editing ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.2)'}`, borderRadius: '8px', color: editing ? '#dc2626' : 'var(--primary)', fontSize: '12.5px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
              {editing ? '✕ Cancel' : '✏️ Edit'}
            </button>
          </div>

          {msg && <div style={{ padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#15803d' }}>{msg}</div>}

          {editing ? (
            <>
              <textarea value={details} onChange={e => setDetails(e.target.value)} rows={6}
                placeholder="Write about this student — achievements, background, contact, notes…"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--primary)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', lineHeight: '1.6', boxSizing: 'border-box' }} />
              <button onClick={saveDetails} disabled={saving} style={{ marginTop: '10px', padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13.5px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                {saving ? 'Saving…' : '💾 Save Details'}
              </button>
            </>
          ) : (
            <div style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', minHeight: '80px' }}>
              {student.details
                ? <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{student.details}</p>
                : <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No details added yet. Click Edit to add information about this student.</p>
              }
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--table-border)', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(`/progress/${id}`)} style={{ padding: '9px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', color: '#6366f1', fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>📈 View Progress</button>
          <button onClick={() => navigate(`/marks/${id}`)} style={{ padding: '9px 16px', background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.25)', borderRadius: '10px', color: '#0891b2', fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>📊 Manage Marks</button>
          <button onClick={() => navigate(`/edit-student/${id}`)} style={{ padding: '9px 16px', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '10px', color: '#d97706', fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>✏️ Edit Student</button>
        </div>
      </div>
    </div>
  )
}