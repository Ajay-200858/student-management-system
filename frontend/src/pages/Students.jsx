import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function GradeChip({ marks }) {
  const pct = Math.min(100, Math.round(marks))
  const getGrade = p => {
    if (p >= 90) return { label: 'A+', color: '#059669', bg: 'rgba(5,150,105,0.1)' }
    if (p >= 80) return { label: 'A',  color: '#0891b2', bg: 'rgba(8,145,178,0.1)' }
    if (p >= 70) return { label: 'B',  color: '#6366f1', bg: 'rgba(99,102,241,0.1)' }
    if (p >= 60) return { label: 'C',  color: '#d97706', bg: 'rgba(217,119,6,0.1)' }
    if (p >= 50) return { label: 'D',  color: '#ea580c', bg: 'rgba(234,88,12,0.1)' }
    return { label: 'F', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' }
  }
  const g = getGrade(pct)
  return <span style={{ padding: '2px 9px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '800', color: g.color, background: g.bg }}>{g.label}</span>
}

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [message, setMessage] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  function loadStudents() {
    axios.get(`${API}/students/`, { params: { search, department } })
      .then(res => setStudents(res.data))
      .catch(() => setMessage('Failed to load students'))
  }

  useEffect(() => { loadStudents() }, [search, department])

  async function deleteStudent(id, name) {
    if (!window.confirm(`Delete student "${name}"? This will also delete their marks.`)) return
    setDeletingId(id)
    try {
      await axios.delete(`${API}/students/${id}`)
      loadStudents()
    } catch {
      setMessage('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const getInitials = name => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const DEPT_COLORS = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#7c3aed','#db2777']
  const deptColor = dept => DEPT_COLORS[Math.abs([...dept].reduce((a,c) => a + c.charCodeAt(0), 0)) % DEPT_COLORS.length]

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>👥 All Students</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{students.length} student{students.length !== 1 ? 's' : ''} found</p>
        </div>
        <button onClick={() => navigate('/add-student')} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13.5px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ➕ Add Student
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', boxShadow: 'var(--glass-shadow)' }}>
        <input type="text" placeholder="🔍 Search by name…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 2, minWidth: '180px', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'var(--font-body)', outline: 'none' }} />
        <input type="text" placeholder="Filter by department…" value={department} onChange={e => setDepartment(e.target.value)}
          style={{ flex: 2, minWidth: '180px', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'var(--font-body)', outline: 'none' }} />
        {(search || department) && (
          <button onClick={() => { setSearch(''); setDepartment('') }} style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid var(--card-border)', background: 'var(--glass-bg)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
            ✕ Clear
          </button>
        )}
      </div>

      {message && <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', fontSize: '13.5px' }}>{message}</div>}

      {/* Table */}
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', boxShadow: 'var(--glass-shadow)', overflow: 'hidden' }}>
        {students.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No students found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
                  {['Student', 'College ID', 'Department', 'Marks', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', background: 'var(--table-bg)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => {
                  const color = deptColor(s.department || 'x')
                  return (
                    <tr key={s.student_id} style={{ borderBottom: idx < students.length - 1 ? '1px solid var(--table-border)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      {/* Student */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: `linear-gradient(135deg, ${color}30, ${color}15)`, border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color, flexShrink: 0 }}>
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{s.name}</div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>#{s.student_id}</div>
                          </div>
                        </div>
                      </td>

                      {/* College ID */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '3px 9px', borderRadius: '7px', border: '1px solid var(--card-border)' }}>
                          {s.college_id || '—'}
                        </span>
                      </td>

                      {/* Department */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '600', color, background: `${color}15`, padding: '4px 10px', borderRadius: '8px', border: `1px solid ${color}25`, whiteSpace: 'nowrap' }}>
                          {s.department}
                        </span>
                      </td>

                      {/* Marks */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{s.total_marks}</span>
                          <GradeChip marks={s.total_marks} />
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {/* Progress */}
                          <button onClick={() => navigate(`/progress/${s.student_id}`)} title="View Progress" style={{ padding: '6px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', color: '#6366f1', fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            📈 Progress
                          </button>
                          {/* Marks */}
                          <button onClick={() => navigate(`/marks/${s.student_id}`)} title="View Marks" style={{ padding: '6px 10px', background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.25)', borderRadius: '8px', color: '#0891b2', fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            📊 Marks
                          </button>
                          {/* Details */}
                          <button onClick={() => navigate(`/student-details/${s.student_id}`)} title="Student Details" style={{ padding: '6px 10px', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: '8px', color: '#059669', fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            👤 Details
                          </button>
                          {/* Edit */}
                          <button onClick={() => navigate(`/edit-student/${s.student_id}`)} title="Edit" style={{ padding: '6px 10px', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '8px', color: '#d97706', fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
                            ✏️
                          </button>
                          {/* Delete */}
                          <button onClick={() => deleteStudent(s.student_id, s.name)} disabled={deletingId === s.student_id} title="Delete" style={{ padding: '6px 10px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', color: '#dc2626', fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
                            {deletingId === s.student_id ? '…' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}