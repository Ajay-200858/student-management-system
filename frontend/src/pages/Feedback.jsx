// frontend/src/pages/Feedback.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function Feedback() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [feedback, setFeedback] = useState([])
  const [form, setForm] = useState({ message: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'view' : 'submit')

  useEffect(() => {
    if (user?.role === 'admin') {
      loadFeedback()
    }
  }, [])

  function loadFeedback() {
    axios.get(`${API}/feedback/`)
      .then(res => setFeedback(res.data))
      .catch(() => {})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.message.trim()) return
    setLoading(true)
    try {
      await axios.post(`${API}/feedback/`, {
        username: user?.username || 'anonymous',
        message: form.message.trim()
      })
      setMessage({ text: '✅ Thank you for your feedback!', type: 'success' })
      setForm({ message: '' })
    } catch {
      setMessage({ text: 'Failed to submit feedback.', type: 'error' })
    } finally {
      setLoading(false)
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const tabStyle = (tab) => ({
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: activeTab === tab ? '#4361ee' : '#f0f2f5',
    color: activeTab === tab ? '#fff' : '#555',
  })

  return (
    <div>
      <h2 className="page-title">💬 Feedback</h2>

      {/* Tabs for admin */}
      {user?.role === 'admin' && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button style={tabStyle('view')} onClick={() => setActiveTab('view')}>
            📋 View All Feedback ({feedback.length})
          </button>
          <button style={tabStyle('submit')} onClick={() => setActiveTab('submit')}>
            ✍️ Submit Feedback
          </button>
        </div>
      )}

      {/* Submit Form */}
      {activeTab === 'submit' && (
        <div className="card" style={{ maxWidth: '600px', borderTop: '4px solid #4361ee' }}>
          <h3 style={{ marginBottom: '8px' }}>✍️ Submit Your Feedback</h3>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
            Share your thoughts, suggestions, or report any issues with the system.
          </p>

          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Type your feedback here... (e.g., suggestions, issues, praise)"
                rows={5}
                required
                style={{
                  width: '100%', padding: '10px 14px', border: '1px solid #ddd',
                  borderRadius: '6px', fontSize: '14px', outline: 'none',
                  resize: 'vertical', fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : '📤 Submit Feedback'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View All (Admin Only) */}
      {activeTab === 'view' && user?.role === 'admin' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>All Feedback ({feedback.length})</h3>
            <button className="btn btn-secondary btn-sm" onClick={loadFeedback}>🔄 Refresh</button>
          </div>

          {feedback.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '30px 0' }}>
              No feedback submitted yet.
            </p>
          ) : (
            feedback.map(fb => (
              <div key={fb.id} style={{
                padding: '16px', borderRadius: '8px', background: '#f8f9fa',
                marginBottom: '12px', borderLeft: '4px solid #4361ee'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontWeight: '600', color: '#4361ee', fontSize: '14px'
                  }}>
                    👤 {fb.username}
                  </span>
                  <span style={{ color: '#888', fontSize: '12px' }}>{fb.created_at}</span>
                </div>
                <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {fb.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}