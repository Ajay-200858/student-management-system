import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

function getGrade(pct) {
  if (pct >= 90) return { label: 'A+', color: '#059669' }
  if (pct >= 80) return { label: 'A',  color: '#0891b2' }
  if (pct >= 70) return { label: 'B',  color: '#6366f1' }
  if (pct >= 60) return { label: 'C',  color: '#d97706' }
  if (pct >= 50) return { label: 'D',  color: '#ea580c' }
  return { label: 'F', color: '#dc2626' }
}

// Simple animated bar chart for subject marks
function SubjectBarChart({ marks }) {
  const max = 100
  const COLORS = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#7c3aed','#db2777','#0d9488']

  if (!marks.length) return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>No marks added yet</div>

  return (
    <div style={{ padding: '8px 0' }}>
      {marks.map((m, i) => {
        const pct = Math.round((m.marks / max) * 100)
        const g   = getGrade(m.marks)
        const c   = COLORS[i % COLORS.length]
        return (
          <div key={m.id} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{m.subject}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: g.color, background: `${g.color}15`, padding: '1px 7px', borderRadius: '20px' }}>{g.label}</span>
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{m.marks}<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>/100</span></span>
              </div>
            </div>
            <div style={{ height: '10px', borderRadius: '20px', background: 'var(--table-border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, borderRadius: '20px', background: `linear-gradient(90deg, ${c}, ${c}bb)`, transition: 'width 1s ease' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Donut chart showing grade distribution
function DonutChart({ marks }) {
  if (!marks.length) return null
  const grades = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
  const colors  = { 'A+': '#059669', 'A': '#0891b2', 'B': '#6366f1', 'C': '#d97706', 'D': '#ea580c', 'F': '#dc2626' }
  marks.forEach(m => { grades[getGrade(m.marks).label]++ })

  const total = marks.length
  let cumAngle = 0
  const cx = 70, cy = 70, r = 55, inner = 35
  const slices = Object.entries(grades).filter(([,v]) => v > 0).map(([label, count]) => {
    const angle = (count / total) * 360
    const start = cumAngle
    cumAngle += angle
    return { label, count, angle, start, color: colors[label] }
  })

  function arcPath(startDeg, endDeg, cx, cy, r, ir) {
    const toRad = d => (d - 90) * Math.PI / 180
    const s1 = toRad(startDeg), e1 = toRad(endDeg)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M ${cx + r * Math.cos(s1)} ${cy + r * Math.sin(s1)}
            A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(e1)} ${cy + r * Math.sin(e1)}
            L ${cx + ir * Math.cos(e1)} ${cy + ir * Math.sin(e1)}
            A ${ir} ${ir} 0 ${large} 0 ${cx + ir * Math.cos(s1)} ${cy + ir * Math.sin(s1)} Z`
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 140 140" width={140} height={140}>
        {slices.map(sl => (
          <path key={sl.label} d={arcPath(sl.start, sl.start + sl.angle, cx, cy, r, inner)} fill={sl.color} />
        ))}
        <circle cx={cx} cy={cy} r={inner} fill="var(--card-bg)" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--text-primary)">{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="9" fill="var(--text-muted)">subjects</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {slices.map(sl => (
          <div key={sl.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: sl.color, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Grade {sl.label}: <strong style={{ color: 'var(--text-primary)' }}>{sl.count}</strong></span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StudentProgress() {
  const { id }  = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [marksData, setMarksData] = useState({ marks: [], total: 0, percentage: 0 })

  useEffect(() => {
    axios.get(`${API}/students/${id}`).then(r => setStudent(r.data))
    axios.get(`${API}/marks/${id}`).then(r => setMarksData(r.data))
  }, [id])

  if (!student) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>

  const g = getGrade(marksData.percentage)
  const numSubjects = marksData.marks.length
  const highest = numSubjects ? Math.max(...marksData.marks.map(m => m.marks)) : 0
  const lowest  = numSubjects ? Math.min(...marksData.marks.map(m => m.marks)) : 0
  const avg     = numSubjects ? Math.round(marksData.marks.reduce((a, m) => a + m.marks, 0) / numSubjects) : 0

  const DEPT_COLORS = ['#6366f1','#0891b2','#059669','#d97706','#dc2626','#7c3aed']
  const deptColor   = s => DEPT_COLORS[Math.abs([...s].reduce((a,c) => a + c.charCodeAt(0), 0)) % DEPT_COLORS.length]
  const getInitials = n => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const color       = deptColor(student.department || 'x')

  return (
    <div style={{ animation: 'fadeInUp 0.35s ease' }}>
      {/* Back */}
      <button onClick={() => navigate('/students')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', fontFamily: 'var(--font-body)', cursor: 'pointer', marginBottom: '20px' }}>
        ← Back to Students
      </button>

      {/* Student Header */}
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px 28px', boxShadow: 'var(--glass-shadow)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, ${color}30, ${color}15)`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color, flexShrink: 0 }}>
            {getInitials(student.name)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>{student.name}</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {student.college_id && <span style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '7px', border: '1px solid var(--card-border)' }}>{student.college_id}</span>}
              <span style={{ fontSize: '12.5px', fontWeight: '600', color, background: `${color}15`, padding: '3px 10px', borderRadius: '8px' }}>{student.department}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 20px', background: `${g.color}10`, border: `2px solid ${g.color}30`, borderRadius: '16px' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: g.color, letterSpacing: '-0.04em' }}>{g.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Overall Grade</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Percentage', value: `${marksData.percentage}%`, color: '#6366f1' },
          { label: 'Total Marks', value: marksData.total, color: '#0891b2' },
          { label: 'Subjects', value: numSubjects, color: '#059669' },
          { label: 'Avg / Subject', value: avg, color: '#d97706' },
          { label: 'Highest', value: highest, color: '#059669' },
          { label: 'Lowest', value: lowest, color: lowest < 50 ? '#dc2626' : '#ea580c' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px 18px', boxShadow: 'var(--glass-shadow)', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: c.color, letterSpacing: '-0.02em' }}>{c.value}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '3px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px 28px', boxShadow: 'var(--glass-shadow)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>Overall Performance</span>
          <span style={{ fontWeight: '800', fontSize: '15px', color: g.color }}>{marksData.percentage}%</span>
        </div>
        <div style={{ height: '14px', borderRadius: '20px', background: 'var(--table-border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${marksData.percentage}%`, borderRadius: '20px', background: `linear-gradient(90deg, ${g.color}, ${g.color}bb)`, transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0%</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>100%</span>
        </div>
      </div>

      {/* Two column: bar chart + donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px 28px', boxShadow: 'var(--glass-shadow)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px' }}>📊 Subject-wise Marks</h3>
          <SubjectBarChart marks={marksData.marks} />
        </div>
        <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px 28px', boxShadow: 'var(--glass-shadow)', minWidth: '260px' }}>
          <h3 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '16px' }}>🎯 Grade Distribution</h3>
          <DonutChart marks={marksData.marks} />
        </div>
      </div>

      {/* Student Details if present */}
      {student.details && (
        <div style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px 28px', boxShadow: 'var(--glass-shadow)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px' }}>👤 Student Details</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{student.details}</p>
        </div>
      )}
    </div>
  )
}