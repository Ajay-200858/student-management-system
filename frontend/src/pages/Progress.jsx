import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:5000/api'

// ── Colour palette ────────────────────────────────────────
const COLORS = ['#6366f1', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed']

const DEPT_EMOJIS = {
  'Computer Science': '💻',
  'Electronics': '⚡',
  'Mechanical': '⚙️',
  'Civil': '🏗️',
  'Mathematics': '📐',
  'Physics': '🔬',
}

function getGrade(pct) {
  if (pct >= 90) return { label: 'A+', color: '#059669' }
  if (pct >= 80) return { label: 'A',  color: '#0891b2' }
  if (pct >= 70) return { label: 'B',  color: '#6366f1' }
  if (pct >= 60) return { label: 'C',  color: '#d97706' }
  if (pct >= 50) return { label: 'D',  color: '#f97316' }
  return { label: 'F', color: '#dc2626' }
}

// ── Pure-SVG Pie Chart ────────────────────────────────────
function PieChart({ data, size = 220 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 28
  const total = data.reduce((s, d) => s + d.value, 0)

  let cumAngle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const largeArc = angle > Math.PI ? 1 : 0
    const midAngle = cumAngle - angle / 2
    const lx = cx + (r + 18) * Math.cos(midAngle)
    const ly = cy + (r + 18) * Math.sin(midAngle)
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: COLORS[i % COLORS.length], label: d.label, value: d.value, pct: Math.round((d.value / total) * 100), lx, ly }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity="0.88"
          style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.setAttribute('opacity', '1')}
          onMouseLeave={e => e.currentTarget.setAttribute('opacity', '0.88')}
        >
          <title>{s.label}: {s.value} student{s.value !== 1 ? 's' : ''} ({s.pct}%)</title>
        </path>
      ))}
      {/* Inner circle for donut */}
      <circle cx={cx} cy={cy} r={r * 0.52} fill="var(--card-bg)" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--text-primary)">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="600">Students</text>
    </svg>
  )
}

// ── Pure-SVG Bar Chart ────────────────────────────────────
function BarChart({ data, width = 480, height = 220 }) {
  const padL = 44, padR = 16, padT = 16, padB = 48
  const chartW = width - padL - padR
  const chartH = height - padT - padB
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barW = Math.min(44, (chartW / data.length) - 12)
  const gridLines = [0, 25, 50, 75, 100]

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {/* Grid */}
      {gridLines.map(v => {
        const y = padT + chartH - (v / 100) * chartH
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="var(--table-border)" strokeWidth="1" strokeDasharray="4 3" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">{v}%</text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const pct = Math.min((d.value / maxVal) * 100, 100)
        const barH = (pct / 100) * chartH
        const x = padL + (i / data.length) * chartW + (chartW / data.length - barW) / 2
        const y = padT + chartH - barH
        const color = COLORS[i % COLORS.length]
        return (
          <g key={d.label}>
            {/* Bar bg */}
            <rect x={x} y={padT} width={barW} height={chartH} rx="6" fill="var(--table-border)" opacity="0.4" />
            {/* Bar fill */}
            <rect x={x} y={y} width={barW} height={barH} rx="6" fill={color} opacity="0.85"
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.setAttribute('opacity', '1')}
              onMouseLeave={e => e.currentTarget.setAttribute('opacity', '0.85')}
            >
              <title>{d.label}: {d.value}%</title>
            </rect>
            {/* Value on top */}
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{d.value}%</text>
            {/* Label below */}
            <text x={x + barW / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)" transform={`rotate(-28, ${x + barW / 2}, ${height - 8})`}>
              {d.label.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main Component ────────────────────────────────────────
export default function Progress() {
  const [students, setStudents] = useState([])
  const [marksMap, setMarksMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/students/`)
      .then(async res => {
        const list = res.data
        setStudents(list)
        // Fetch marks for each student in parallel
        const results = await Promise.all(
          list.map(s =>
            axios.get(`${API}/marks/${s.student_id}`)
              .then(r => ({ id: s.student_id, ...r.data }))
              .catch(() => ({ id: s.student_id, marks: [], total: 0, percentage: 0 }))
          )
        )
        const map = {}
        results.forEach(r => { map[r.id] = r })
        setMarksMap(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // ── Derived stats ───────────────────────────────────────
  const deptGroups = {}
  students.forEach(s => {
    if (!deptGroups[s.department]) deptGroups[s.department] = []
    deptGroups[s.department].push(s)
  })

  const pieData = Object.entries(deptGroups).map(([dept, list]) => ({
    label: dept,
    value: list.length,
  }))

  // Avg % per department
  const barData = Object.entries(deptGroups).map(([dept, list]) => {
    const avgs = list.map(s => marksMap[s.student_id]?.percentage || 0)
    const avg = avgs.length ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : 0
    return { label: dept, value: avg }
  })

  // Grade distribution
  const gradeCount = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
  students.forEach(s => {
    const pct = marksMap[s.student_id]?.percentage || 0
    const g = getGrade(pct).label
    gradeCount[g] = (gradeCount[g] || 0) + 1
  })

  const topStudents = [...students]
    .map(s => ({ ...s, pct: marksMap[s.student_id]?.percentage || 0 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)

  const overallAvg = students.length
    ? Math.round(students.reduce((sum, s) => sum + (marksMap[s.student_id]?.percentage || 0), 0) / students.length)
    : 0

  const cardStyle = {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--card-border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--glass-shadow)',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--card-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            📈 Progress &amp; Analytics
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Academic performance overview across all departments
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.25)' }} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>Live Data</span>
        </div>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
        {[
          { icon: '👥', label: 'Total Students', value: students.length, color: '#6366f1' },
          { icon: '🏛', label: 'Departments', value: Object.keys(deptGroups).length, color: '#0891b2' },
          { icon: '📊', label: 'Overall Avg', value: `${overallAvg}%`, color: '#059669' },
          { icon: '🏆', label: 'Top Grade', value: getGrade(overallAvg).label, color: '#d97706' },
        ].map((c, i) => (
          <div key={c.label} style={{ ...cardStyle, textAlign: 'center', borderTop: `3px solid ${c.color}`, animation: `fadeInUp 0.4s ease ${i * 60}ms forwards`, opacity: 0 }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{c.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: c.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '600' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '16px', marginBottom: '20px' }}>

        {/* Pie Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            🥧 Students by Department
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>Distribution across departments</p>

          {pieData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '14px' }}>No student data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <PieChart data={pieData} size={200} />
              {/* Legend */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pieData.map((d, i) => {
                  const total = pieData.reduce((s, x) => s + x.value, 0)
                  const pct = Math.round((d.value / total) * 100)
                  return (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '12.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{DEPT_EMOJIS[d.label] || '📚'} {d.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', flexShrink: 0 }}>{d.value} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({pct}%)</span></span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            📊 Average Score by Department
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>Mean percentage per department</p>

          {barData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '14px' }}>No data available</div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <BarChart data={barData} width={480} height={230} />
            </div>
          )}

          {/* Department avg pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {barData.map((d, i) => {
              const g = getGrade(d.value)
              return (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: 'var(--glass-bg)', border: '1px solid var(--card-border)', fontSize: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.label.split(' ')[0]}</span>
                  <span style={{ fontWeight: '700', color: g.color }}>{g.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grade Distribution + Top Students */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '16px' }}>

        {/* Grade distribution */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>🎓 Grade Distribution</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>How students are spread across grades</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(gradeCount).map(([grade, count]) => {
              const g = getGrade(grade === 'A+' ? 95 : grade === 'A' ? 85 : grade === 'B' ? 75 : grade === 'C' ? 65 : grade === 'D' ? 55 : 30)
              const pct = students.length ? Math.round((count / students.length) * 100) : 0
              return (
                <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${g.color}20`, border: `1.5px solid ${g.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', color: g.color, flexShrink: 0 }}>{grade}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '8px', background: 'var(--table-border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: g.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', width: '24px', textAlign: 'right' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Students */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>🏆 Top Performers</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '20px' }}>Highest scoring students</p>
          {topStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '14px' }}>No students yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topStudents.map((s, i) => {
                const g = getGrade(s.pct)
                const initials = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={s.student_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '14px', background: i === 0 ? 'var(--primary-light)' : 'var(--glass-bg)', border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.2)' : 'var(--card-border)'}`, transition: 'all 0.2s' }}>
                    <div style={{ width: '28px', fontWeight: '800', fontSize: '14px', color: i < 3 ? ['#f59e0b', '#94a3b8', '#d97706'][i] : 'var(--text-muted)', flexShrink: 0, textAlign: 'center' }}>
                      {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${COLORS[i % COLORS.length]}25`, border: `1.5px solid ${COLORS[i % COLORS.length]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', color: COLORS[i % COLORS.length], flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '13.5px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{s.department}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: g.color }}>{s.pct}%</div>
                      <div style={{ fontSize: '11.5px', fontWeight: '700', color: g.color }}>{g.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}