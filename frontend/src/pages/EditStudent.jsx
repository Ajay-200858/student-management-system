import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function EditStudent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', college_id: '', department: '', details: '' })
  const [original, setOriginal] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${API}/students/${id}`).then(res => {
      const d = { name: res.data.name || '', college_id: res.data.college_id || '', department: res.data.department || '', details: res.data.details || '' }
      setForm(d)
      setOriginal(d)
    }).catch(() => setMessage({ text: 'Student not found', type: 'error' }))
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const hasChanges = original ? JSON.stringify(form) !== JSON.stringify(original) : false

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

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '7px', textTransform: 'uppercase' }
  const focusH = e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }
  const blurH  = e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', animation: 'fadeInUp 0.35s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '6px' }}>✏️ Edit Student</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>ID: #{id}</p>
      </div>

      {hasChanges && (
        <div style={{ padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '13px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ You have unsaved changes
        </div>
      )}

      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--glass-shadow)' }}>
        {message.text && (
          <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '13.5px', fontWeight: '500', background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: message.type === 'success' ? '#15803d' : '#dc2626' }}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Student Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} onFocus={focusH} onBlur={blurH} />
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>College / Student ID</label>
            <input type="text" name="college_id" value={form.college_id} onChange={handleChange} placeholder="e.g. 713525AD006" style={inputStyle} onFocus={focusH} onBlur={blurH} />
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Department *</label>
            <input type="text" name="department" value={form.department} onChange={handleChange} required style={inputStyle} onFocus={focusH} onBlur={blurH} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ ...labelStyle }}>Student Details <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--text-muted)', background: 'var(--glass-bg)', padding: '2px 7px', borderRadius: '20px', border: '1px solid var(--card-border)', textTransform: 'none', letterSpacing: 0 }}>optional</span></label>
            <textarea name="details" value={form.details} onChange={handleChange} placeholder="Any notes about this student…" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} onFocus={focusH} onBlur={blurH} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading || !hasChanges} style={{ flex: 1, padding: '12px', background: hasChanges ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(99,102,241,0.3)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14.5px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: hasChanges ? 'pointer' : 'not-allowed', boxShadow: hasChanges ? '0 4px 12px rgba(99,102,241,0.3)' : 'none', transition: 'all 0.2s' }}>
              {loading ? 'Saving…' : '💾 Save Changes'}
            </button>
            <button type="button" onClick={() => navigate('/students')} style={{ padding: '12px 20px', background: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1.5px solid var(--card-border)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}