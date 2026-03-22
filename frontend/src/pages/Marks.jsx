import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function getGradeInfo(pct) {
  if (pct >= 90) return { label: 'A+', color: '#059669', bg: 'rgba(5,150,105,0.1)', desc: 'Outstanding' }
  if (pct >= 80) return { label: 'A',  color: '#6366f1', bg: 'rgba(99,102,241,0.1)', desc: 'Excellent' }
  if (pct >= 70) return { label: 'B',  color: '#0891b2', bg: 'rgba(8,145,178,0.1)', desc: 'Good' }
  if (pct >= 60) return { label: 'C',  color: '#d97706', bg: 'rgba(217,119,6,0.1)', desc: 'Average' }
  if (pct >= 50) return { label: 'D',  color: '#ea580c', bg: 'rgba(234,88,12,0.1)', desc: 'Below Average' }
  return { label: 'F', color: '#e11d48', bg: 'rgba(225,29,72,0.1)', desc: 'Fail' }
}

function StatMini({ label, value, icon, color }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: 'var(--glass-shadow)',
      flex: 1,
      minWidth: '120px',
    }}>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontWeight: '500',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span>{icon}</span> {label}
      </div>
      <div style={{
        fontSize: '26px',
        fontWeight: '800',
        color: color || 'var(--text-primary)',
        letterSpacing: '-0.04em',
        lineHeight: '1.1',
      }}>
        {value}
      </div>
    </div>
  )
}

export default function Marks() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [marksData, setMarksData] = useState({ marks: [], total: 0, percentage: 0 })
  const [form, setForm] = useState({ subject: '', marks: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  function loadData() {
    Promise.all([
      axios.get(`${API}/students/${id}`),
      axios.get(`${API}/marks/${id}`),
    ]).then(([sRes, mRes]) => {
      setStudent(sRes.data)
      setMarksData(mRes.data)
    }).catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [id])

  async function addMark(e) {
    e.preventDefault()
    setAdding(true)
    try {
      await axios.post(`${API}/marks/`, {
        student_id: id,
        subject: form.subject,
        marks: parseInt(form.marks),
      })
      setMessage({ text: 'Mark added successfully!', type: 'success' })
      setForm({ subject: '', marks: '' })
      loadData()
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err) {
      setMessage({ text: err.response?.data?.error || 'Failed to add mark', type: 'error' })
    } finally {
      setAdding(false)
    }
  }

  async function deleteMark(markId) {
    if (!window.confirm('Delete this mark?')) return
    setDeletingId(markId)
    await axios.delete(`${API}/marks/${markId}`)
    loadData()
    setDeletingId(null)
  }

  const grade = getGradeInfo(marksData.percentage)
  const scoreColor = parseInt(form.marks) >= 50 ? '#059669' : parseInt(form.marks) > 0 ? '#e11d48' : 'var(--text-muted)'

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '12px' }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text-muted)' }}>Loading marks...</span>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onClick={() => navigate('/students')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--table-border)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.2s ease',
            marginBottom: '16px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--primary-light)'
            e.currentTarget.style.color = 'var(--primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--glass-bg)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to Students
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: '800',
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}>
            {student?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '24px' }}>
              {student?.name || `Student #${id}`}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {student?.department} · ID #{id}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatMini
          label="Total Marks"
          value={marksData.total}
          icon="📊"
          color="var(--primary)"
        />
        <StatMini
          label="Percentage"
          value={`${marksData.percentage}%`}
          icon="📈"
          color={grade.color}
        />
        <StatMini
          label="Subjects"
          value={marksData.marks.length}
          icon="📚"
        />
        {/* Grade Card */}
        <div style={{
          background: grade.bg,
          border: `1px solid ${grade.color}25`,
          borderRadius: '16px',
          padding: '20px',
          flex: 1,
          minWidth: '120px',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <div style={{ fontSize: '13px', color: grade.color, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🏆 Grade
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: grade.color,
              letterSpacing: '-0.04em',
              lineHeight: '1.1',
            }}>
              {grade.label}
            </div>
            <span style={{ fontSize: '13px', color: grade.color, fontWeight: '600', opacity: 0.8 }}>
              {grade.desc}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {marksData.marks.length > 0 && (
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '18px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--glass-shadow)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Overall Performance
            </span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: grade.color }}>
              {marksData.percentage}%
            </span>
          </div>
          <div style={{
            height: '10px',
            background: 'var(--table-border)',
            borderRadius: '5px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${marksData.percentage}%`,
              background: `linear-gradient(90deg, ${grade.color}, ${grade.color}aa)`,
              borderRadius: '5px',
              transition: 'width 0.8s ease',
              boxShadow: `0 0 8px ${grade.color}50`,
            }} />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        {/* Marks Table */}
        <div>
          <div style={{
            background: 'var(--table-bg)',
            borderRadius: '20px',
            border: '1px solid var(--table-border)',
            overflow: 'hidden',
            boxShadow: 'var(--glass-shadow)',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--table-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--table-header-bg)',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Subject-wise Marks
              </h3>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                background: 'var(--primary-light)',
                padding: '3px 10px',
                borderRadius: '20px',
                fontWeight: '600',
              }}>
                {marksData.marks.length} subject{marksData.marks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {marksData.marks.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '50px 20px',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  No marks yet
                </p>
                <p style={{ fontSize: '13px' }}>Add subject marks using the form →</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#', 'Subject', 'Score', 'Out of', 'Grade', ''].map(h => (
                      <th key={h} style={{
                        padding: '12px 18px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--text-secondary)',
                        background: 'var(--table-header-bg)',
                        borderBottom: '1px solid var(--table-border)',
                        whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marksData.marks.map((m, i) => {
                    const g = getGradeInfo(m.marks)
                    return (
                      <tr
                        key={m.id}
                        style={{
                          borderBottom: i < marksData.marks.length - 1 ? '1px solid var(--table-border)' : 'none',
                          transition: 'background 0.15s ease',
                          animation: `fadeInUp 0.3s ease ${i * 40}ms both`,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--table-row-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {i + 1}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {m.subject}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              height: '6px',
                              width: '50px',
                              background: 'var(--table-border)',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${m.marks}%`,
                                background: g.color,
                                borderRadius: '3px',
                              }} />
                            </div>
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>
                              {m.marks}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '13px' }}>
                          100
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: g.bg,
                            color: g.color,
                          }}>
                            {g.label}
                          </span>
                        </td>
                        <td style={{ padding: '13px 18px' }}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteMark(m.id)}
                            disabled={deletingId === m.id}
                          >
                            {deletingId === m.id ? (
                              <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Add Mark Form */}
        <div style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--glass-shadow)',
          animation: 'fadeInUp 0.4s ease 0.1s forwards',
          opacity: 0,
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>➕</span> Add Mark
          </h3>

          {message.text && (
            <div className={`alert alert-${message.type}`} style={{ fontSize: '13px', padding: '10px 14px' }}>
              {message.type === 'success' ? '✓ ' : '⚠ '}
              {message.text}
            </div>
          )}

          <form onSubmit={addMark} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-secondary)', marginBottom: '6px',
              }}>
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                required
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'var(--input-bg)',
                  border: '1.5px solid var(--input-border)',
                  borderRadius: '11px', fontSize: '14px',
                  fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
                  outline: 'none', transition: 'all 0.2s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--input-focus-border)'
                  e.target.style.boxShadow = 'var(--input-focus-shadow)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--input-border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-secondary)', marginBottom: '6px',
              }}>
                Score (0 – 100)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="Enter score"
                  value={form.marks}
                  min="0" max="100"
                  onChange={e => setForm({ ...form, marks: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '11px 50px 11px 14px',
                    background: 'var(--input-bg)',
                    border: '1.5px solid var(--input-border)',
                    borderRadius: '11px', fontSize: '14px',
                    fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
                    outline: 'none', transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--input-focus-border)'
                    e.target.style.boxShadow = 'var(--input-focus-shadow)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--input-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {form.marks !== '' && (
                  <span style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px', fontWeight: '700',
                    color: scoreColor,
                  }}>
                    {form.marks >= 50 ? '✓' : '✗'} {getGradeInfo(form.marks).label}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={adding}
              style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', border: 'none', borderRadius: '11px',
                fontSize: '14px', fontWeight: '700',
                fontFamily: 'var(--font-body)',
                cursor: adding ? 'not-allowed' : 'pointer',
                opacity: adding ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => {
                if (!adding) e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {adding && (
                <div className="spinner" style={{
                  width: '14px', height: '14px', borderWidth: '2px',
                  borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white',
                }} />
              )}
              {adding ? 'Adding...' : '+ Add Mark'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}