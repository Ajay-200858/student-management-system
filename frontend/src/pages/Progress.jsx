// frontend/src/pages/Progress.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

const PALETTE = [
  '#7c3aed','#2563eb','#059669','#dc2626',
  '#d97706','#0891b2','#be185d','#4f46e5',
  '#16a34a','#9333ea','#ea580c','#0284c7',
]

const DEPT_COLORS = {
  'Computer Science': '#7c3aed',
  'Electronics':      '#2563eb',
  'Mechanical':       '#b45309',
  'Civil':            '#059669',
  'Mathematics':      '#dc2626',
  'Physics':          '#0891b2',
}

function getGrade(pct) {
  if (pct >= 90) return { label: 'A+', color: '#10b981' }
  if (pct >= 80) return { label: 'A',  color: '#34d399' }
  if (pct >= 70) return { label: 'B',  color: '#60a5fa' }
  if (pct >= 60) return { label: 'C',  color: '#f59e0b' }
  if (pct >= 50) return { label: 'D',  color: '#f97316' }
  return           { label: 'F',  color: '#f87171' }
}

/* ── Donut Pie Chart ─────────────────────────────────────── */
function PieChart({ marks }) {
  const SIZE = 130, CX = 65, CY = 65, R = 52, INNER = 30
  const total = marks.reduce((s, m) => s + m.marks, 0)

  if (total === 0) return (
    <svg width={SIZE} height={SIZE}>
      <circle cx={CX} cy={CY} r={R} fill="rgba(255,255,255,0.05)" />
      <circle cx={CX} cy={CY} r={INNER} fill="#13111e" />
      <text x={CX} y={CY+4} textAnchor="middle" fill="#4b5563" fontSize="9">No data</text>
    </svg>
  )

  let angle = -Math.PI / 2
  const slices = marks.map((m, i) => {
    const frac = m.marks / total
    const start = angle
    angle += frac * 2 * Math.PI
    return { ...m, frac, start, end: angle, color: PALETTE[i % PALETTE.length] }
  })

  function arc(s) {
    const x1  = CX + R     * Math.cos(s.start)
    const y1  = CY + R     * Math.sin(s.start)
    const x2  = CX + R     * Math.cos(s.end)
    const y2  = CY + R     * Math.sin(s.end)
    const ix1 = CX + INNER * Math.cos(s.start)
    const iy1 = CY + INNER * Math.sin(s.start)
    const ix2 = CX + INNER * Math.cos(s.end)
    const iy2 = CY + INNER * Math.sin(s.end)
    const lg  = s.frac > 0.5 ? 1 : 0
    return `M${x1} ${y1} A${R} ${R} 0 ${lg} 1 ${x2} ${y2} L${ix2} ${iy2} A${INNER} ${INNER} 0 ${lg} 0 ${ix1} ${iy1}Z`
  }

  const pct = Math.round((total / (marks.length * 100)) * 100)
  return (
    <svg width={SIZE} height={SIZE}>
      {slices.map((s, i) => (
        <path key={i} d={arc(s)} fill={s.color} stroke="#13111e" strokeWidth="2">
          <title>{s.subject}: {s.marks}/100</title>
        </path>
      ))}
      <circle cx={CX} cy={CY} r={INNER} fill="#13111e" />
      <text x={CX} y={CY-4}  textAnchor="middle" fill="#fff"    fontSize="13" fontWeight="bold">{pct}%</text>
      <text x={CX} y={CY+10} textAnchor="middle" fill="#6b7280" fontSize="8">avg score</text>
    </svg>
  )
}

/* ── Bar Chart ───────────────────────────────────────────── */
function BarChart({ marks }) {
  const W=300, H=130, PL=28, PR=8, PT=12, PB=36
  const CW = W - PL - PR, CH = H - PT - PB

  if (!marks.length) return (
    <svg width={W} height={H}>
      <text x={W/2} y={H/2} textAnchor="middle" fill="#4b5563" fontSize="11">No marks yet</text>
    </svg>
  )

  const gap  = 6
  const barW = Math.min(32, (CW - gap * (marks.length - 1)) / marks.length)
  const totalW = marks.length * barW + (marks.length - 1) * gap
  const startX = PL + (CW - totalW) / 2

  const yPos = v => PT + CH - (v / 100) * CH
  const trunc = (str, n) => str.length > n ? str.slice(0, n) + '…' : str

  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {[0,25,50,75,100].map(v => (
        <g key={v}>
          <line x1={PL} y1={yPos(v)} x2={PL+CW} y2={yPos(v)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            strokeDasharray={v===50 ? '3 3' : ''}
          />
          <text x={PL-3} y={yPos(v)+3} textAnchor="end" fill="#4b5563" fontSize="7">{v}</text>
        </g>
      ))}

      {marks.map((m, i) => {
        const x     = startX + i * (barW + gap)
        const bH    = (m.marks / 100) * CH
        const y     = yPos(m.marks)
        const color = PALETTE[i % PALETTE.length]
        return (
          <g key={i}>
            <rect x={x} y={PT} width={barW} height={CH} fill="rgba(255,255,255,0.03)" rx="3"/>
            <rect x={x} y={y} width={barW} height={bH} fill={color} rx="3" opacity="0.9">
              <title>{m.subject}: {m.marks}/100</title>
            </rect>
            <text x={x+barW/2} y={y-3} textAnchor="middle" fill={color} fontSize="8" fontWeight="bold">{m.marks}</text>
            <text
              x={x+barW/2} y={PT+CH+10}
              textAnchor="end" fill="#6b7280" fontSize="7"
              transform={`rotate(-38, ${x+barW/2}, ${PT+CH+10})`}
            >{trunc(m.subject, 8)}</text>
          </g>
        )
      })}

      <line x1={PL} y1={PT+CH} x2={PL+CW} y2={PT+CH} stroke="rgba(139,92,246,0.2)" strokeWidth="1"/>
      <line x1={PL} y1={PT} x2={PL} y2={PT+CH} stroke="rgba(139,92,246,0.2)" strokeWidth="1"/>
    </svg>
  )
}

/* ── Main Page ───────────────────────────────────────────── */
export default function Progress() {
  const navigate = useNavigate()
  const [students,   setStudents]   = useState([])
  const [marksMap,   setMarksMap]   = useState({})
  const [loading,    setLoading]    = useState(true)
  const [activeTab,  setActiveTab]  = useState('overview')
  const [expanded,   setExpanded]   = useState({})   // student_id → bool

  useEffect(() => {
    axios.get(`${API}/students/`).then(async res => {
      const list = res.data
      setStudents(list)
      const map = {}
      await Promise.all(list.map(s =>
        axios.get(`${API}/marks/${s.student_id}`)
          .then(r  => { map[s.student_id] = r.data })
          .catch(() => { map[s.student_id] = { marks: [], total: 0, percentage: 0 } })
      ))
      setMarksMap(map)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  /* computed */
  const totalStudents   = students.length
  const withMarks       = students.filter(s => (marksMap[s.student_id]?.marks?.length || 0) > 0)
  const avgPercentage   = withMarks.length
    ? Math.round(withMarks.reduce((sum, s) => sum + (marksMap[s.student_id]?.percentage || 0), 0) / withMarks.length)
    : 0
  const passingStudents = withMarks.filter(s => (marksMap[s.student_id]?.percentage || 0) >= 50).length
  const failingStudents = withMarks.length - passingStudents

  const gradeDist = { 'A+':0, 'A':0, 'B':0, 'C':0, 'D':0, 'F':0 }
  withMarks.forEach(s => { gradeDist[getGrade(marksMap[s.student_id]?.percentage||0).label]++ })
  const maxGradeCount = Math.max(...Object.values(gradeDist), 1)

  const deptMap = {}
  students.forEach(s => {
    const d = s.department || 'Unknown'
    if (!deptMap[d]) deptMap[d] = { count:0, totalPct:0 }
    deptMap[d].count++
    deptMap[d].totalPct += marksMap[s.student_id]?.percentage || 0
  })

  const tabs = [
    { id: 'overview',    label: '📊 Overview' },
    { id: 'leaderboard', label: '🏆 Leaderboard' },
    { id: 'departments', label: '🏛️ Departments' },
  ]

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{ color:'#a78bfa', fontSize:16 }}>Loading progress data...</div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 className="page-title">📈 Student Progress</h2>
        <p style={{ color:'#6b7280', fontSize:14 }}>
          Analytics and performance insights across all students.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display:'flex', gap:16, marginBottom:28, flexWrap:'wrap' }}>
        {[
          { label:'Total Students', value: totalStudents,       color:'#7c3aed', icon:'👥', sub:'Enrolled' },
          { label:'Avg Score',      value: `${avgPercentage}%`, color:'#2563eb', icon:'📊', sub:'Class average' },
          { label:'Passing',        value: passingStudents,     color:'#059669', icon:'✅', sub:'≥ 50%' },
          { label:'Need Attention', value: failingStudents,     color:'#dc2626', icon:'⚠️', sub:'< 50%' },
        ].map(c => (
          <div key={c.label} style={{
            flex:1, minWidth:160,
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(139,92,246,0.15)',
            borderRadius:14, padding:'20px',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:3,
              background:`linear-gradient(90deg, ${c.color}, transparent)`,
            }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:12, color:'#6b7280', marginBottom:6 }}>{c.label}</div>
                <div style={{ fontSize:36, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
                <div style={{ fontSize:11, color:'#4b5563', marginTop:5 }}>{c.sub}</div>
              </div>
              <div style={{
                fontSize:24, width:42, height:42, borderRadius:10,
                background:`${c.color}20`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:'9px 20px', borderRadius:10, fontSize:13, fontWeight:600,
            cursor:'pointer', border:'none', transition:'all 0.2s',
            background: activeTab===t.id
              ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
              : 'rgba(255,255,255,0.05)',
            color: activeTab===t.id ? '#fff' : '#6b7280',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

          <div className="card">
            <h3 style={{ color:'#fff', fontSize:15, fontWeight:700, marginBottom:20 }}>🎓 Grade Distribution</h3>
            {Object.entries(gradeDist).map(([grade, count]) => {
              const colors = { 'A+':'#10b981','A':'#34d399','B':'#60a5fa','C':'#f59e0b','D':'#f97316','F':'#f87171' }
              const color  = colors[grade]
              const pct    = (count / maxGradeCount) * 100
              return (
                <div key={grade} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ color, fontWeight:700, fontSize:14, width:28 }}>{grade}</span>
                    <span style={{ color:'#6b7280', fontSize:13 }}>{count} student{count!==1?'s':''}</span>
                  </div>
                  <div style={{ height:10, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}88)`, borderRadius:99 }}/>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <h3 style={{ color:'#fff', fontSize:15, fontWeight:700, marginBottom:20 }}>✅ Pass / Fail Ratio</h3>
            {withMarks.length === 0 ? (
              <p style={{ color:'#4b5563', textAlign:'center', padding:'24px 0' }}>No marks data yet.</p>
            ) : (
              <>
                <div style={{ height:28, borderRadius:99, overflow:'hidden', marginBottom:20, display:'flex' }}>
                  <div style={{ width:`${(passingStudents/withMarks.length)*100}%`, background:'linear-gradient(90deg,#059669,#34d399)', transition:'width 0.8s' }}/>
                  <div style={{ flex:1, background:'linear-gradient(90deg,#dc2626,#f87171)' }}/>
                </div>
                <div style={{ display:'flex', gap:16 }}>
                  {[
                    { n: passingStudents, label:'Passing ✅', color:'#10b981', bg:'rgba(5,150,105,0.1)', border:'rgba(5,150,105,0.25)' },
                    { n: failingStudents, label:'Failing ⚠️',  color:'#f87171', bg:'rgba(220,38,38,0.1)',  border:'rgba(220,38,38,0.25)'  },
                  ].map(item => (
                    <div key={item.label} style={{
                      flex:1, background:item.bg, border:`1px solid ${item.border}`,
                      borderRadius:12, padding:'16px', textAlign:'center',
                    }}>
                      <div style={{ fontSize:32, fontWeight:800, color:item.color }}>{item.n}</div>
                      <div style={{ fontSize:12, color:item.color, marginTop:4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16, color:'#6b7280', fontSize:13, textAlign:'center' }}>
                  Pass rate: <strong style={{ color:'#10b981' }}>
                    {Math.round((passingStudents/withMarks.length)*100)}%
                  </strong>
                </div>
              </>
            )}
          </div>

          <div className="card" style={{ gridColumn:'1 / -1' }}>
            <h3 style={{ color:'#fff', fontSize:15, fontWeight:700, marginBottom:20 }}>📉 Score Range Breakdown</h3>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[
                { range:'90–100%', min:90, max:101, label:'Excellent', color:'#10b981' },
                { range:'75–89%',  min:75, max:90,  label:'Good',      color:'#34d399' },
                { range:'60–74%',  min:60, max:75,  label:'Average',   color:'#f59e0b' },
                { range:'50–59%',  min:50, max:60,  label:'Pass',      color:'#f97316' },
                { range:'0–49%',   min:0,  max:50,  label:'Fail',      color:'#f87171' },
              ].map(b => {
                const cnt = withMarks.filter(s => {
                  const p = marksMap[s.student_id]?.percentage || 0
                  return p >= b.min && p < b.max
                }).length
                return (
                  <div key={b.range} style={{
                    flex:1, minWidth:120,
                    background:`${b.color}10`, border:`1px solid ${b.color}30`,
                    borderRadius:12, padding:'16px', textAlign:'center',
                  }}>
                    <div style={{ fontSize:28, fontWeight:800, color:b.color }}>{cnt}</div>
                    <div style={{ fontSize:11, color:b.color, fontWeight:600, marginTop:4 }}>{b.range}</div>
                    <div style={{ fontSize:11, color:'#4b5563', marginTop:2 }}>{b.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {activeTab === 'leaderboard' && (
        <div className="card">
          <h3 style={{ color:'#fff', fontSize:15, fontWeight:700, marginBottom:20 }}>🏆 Student Rankings</h3>

          {students.length === 0 ? (
            <p style={{ color:'#4b5563', textAlign:'center', padding:'32px 0' }}>No students yet.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[...students]
                .sort((a,b) => (marksMap[b.student_id]?.percentage||0) - (marksMap[a.student_id]?.percentage||0))
                .map((s, idx) => {
                  const md   = marksMap[s.student_id] || { marks:[], total:0, percentage:0 }
                  const g    = getGrade(md.percentage)
                  const rank = idx===0 ? '🥇' : idx===1 ? '🥈' : idx===2 ? '🥉' : `#${idx+1}`
                  const dc   = DEPT_COLORS[s.department] || '#7c3aed'
                  const isOpen = !!expanded[s.student_id]

                  return (
                    <div key={s.student_id} style={{
                      borderRadius:12, overflow:'hidden',
                      background: idx<3
                        ? `rgba(${idx===0?'255,215,0':idx===1?'192,192,192':'205,127,50'},0.06)`
                        : 'rgba(255,255,255,0.03)',
                      border:`1px solid ${idx<3
                        ? `rgba(${idx===0?'255,215,0':idx===1?'192,192,192':'205,127,50'},0.2)`
                        : 'rgba(139,92,246,0.1)'}`,
                    }}>
                      {/* Row */}
                      <div style={{
                        display:'flex', alignItems:'center', gap:14,
                        padding:'14px 18px', cursor: md.marks.length > 0 ? 'pointer' : 'default',
                      }}
                        onClick={() => md.marks.length > 0 && toggleExpand(s.student_id)}
                      >
                        {/* Rank */}
                        <div style={{ fontSize:idx<3?22:15, fontWeight:700, color:'#6b7280', width:32, textAlign:'center', flexShrink:0 }}>
                          {rank}
                        </div>

                        {/* Avatar */}
                        <div style={{
                          width:38, height:38, borderRadius:'50%', flexShrink:0,
                          background:`linear-gradient(135deg,${dc},${dc}88)`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:15, fontWeight:700, color:'#fff',
                        }}>
                          {s.name?.[0]?.toUpperCase()}
                        </div>

                        {/* Name + dept */}
                        <div style={{ flex:1 }}>
                          <div style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{s.name}</div>
                          <div style={{ display:'flex', gap:6, marginTop:3 }}>
                            <span style={{
                              background:`${dc}20`, color:dc,
                              padding:'1px 8px', borderRadius:20, fontSize:11, fontWeight:600,
                            }}>{s.department}</span>
                            {md.marks.length > 0 && (
                              <span style={{ color:'#4b5563', fontSize:11 }}>
                                {md.marks.length} subject{md.marks.length!==1?'s':''}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ width:120, flexShrink:0 }}>
                          <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
                            <div style={{
                              height:'100%', width:`${md.percentage}%`,
                              background:`linear-gradient(90deg,${g.color},${g.color}88)`,
                              borderRadius:99,
                            }}/>
                          </div>
                        </div>

                        {/* Stats */}
                        <span style={{
                          background:`${g.color}20`, color:g.color,
                          padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:700, flexShrink:0,
                        }}>{g.label}</span>
                        <span style={{ color:'#a78bfa', fontWeight:800, fontSize:15, minWidth:48, textAlign:'right', flexShrink:0 }}>
                          {md.percentage}%
                        </span>

                        {/* Expand toggle */}
                        {md.marks.length > 0 && (
                          <span style={{ color:'#4b5563', fontSize:13, flexShrink:0, marginLeft:4 }}>
                            {isOpen ? '▲' : '▼'}
                          </span>
                        )}

                        {/* View button */}
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/marks/${s.student_id}`) }}
                          className="btn btn-info btn-sm"
                          style={{ flexShrink:0 }}
                        >
                          Marks
                        </button>
                      </div>

                      {/* ── Expanded charts ── */}
                      {isOpen && md.marks.length > 0 && (
                        <div style={{
                          borderTop:'1px solid rgba(139,92,246,0.12)',
                          padding:'20px 24px',
                          background:'rgba(0,0,0,0.2)',
                          display:'flex', gap:0, flexWrap:'wrap',
                        }}>

                          {/* PIE */}
                          <div style={{
                            flex:'0 0 auto', paddingRight:28,
                            borderRight:'1px solid rgba(139,92,246,0.12)',
                            marginRight:28, marginBottom:12,
                          }}>
                            <div style={{ color:'#6b7280', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                              🥧 Subject Share
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                              <PieChart marks={md.marks} />
                              {/* Legend */}
                              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                                {md.marks.map((m, i) => (
                                  <div key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
                                    <div style={{
                                      width:9, height:9, borderRadius:2, flexShrink:0,
                                      background: PALETTE[i % PALETTE.length],
                                    }}/>
                                    <span style={{ color:'#8b9cc8', fontSize:12 }}>{m.subject}</span>
                                    <span style={{
                                      color: PALETTE[i % PALETTE.length],
                                      fontSize:12, fontWeight:700, marginLeft:'auto', paddingLeft:10,
                                    }}>{m.marks} pts</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* BAR */}
                          <div style={{ flex:1, minWidth:260 }}>
                            <div style={{ color:'#6b7280', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>
                              📊 Marks per Subject <span style={{ color:'#374151', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(out of 100)</span>
                            </div>
                            <BarChart marks={md.marks} />

                            {/* Subject pills */}
                            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:14 }}>
                              {md.marks.map((m, i) => {
                                const sg = getGrade(m.marks)
                                return (
                                  <div key={i} style={{
                                    display:'flex', alignItems:'center', gap:5,
                                    padding:'3px 10px',
                                    background:`${PALETTE[i%PALETTE.length]}12`,
                                    border:`1px solid ${PALETTE[i%PALETTE.length]}28`,
                                    borderRadius:20,
                                  }}>
                                    <div style={{ width:7,height:7,borderRadius:'50%', background:PALETTE[i%PALETTE.length], flexShrink:0 }}/>
                                    <span style={{ color:'#8b9cc8', fontSize:11 }}>{m.subject}</span>
                                    <span style={{ color:PALETTE[i%PALETTE.length], fontSize:11, fontWeight:700 }}>{m.marks}/100</span>
                                    <span style={{ color:sg.color, fontSize:10, fontWeight:700, background:`${sg.color}20`, padding:'1px 5px', borderRadius:8 }}>{sg.label}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {/* ── DEPARTMENTS ── */}
      {activeTab === 'departments' && (
        <div className="card">
          <h3 style={{ color:'#fff', fontSize:15, fontWeight:700, marginBottom:20 }}>🏛️ Department Performance</h3>
          {Object.keys(deptMap).length === 0 ? (
            <p style={{ color:'#4b5563', textAlign:'center', padding:'32px 0' }}>No departments found.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {Object.entries(deptMap)
                .sort(([,a],[,b]) => (b.totalPct/b.count)-(a.totalPct/a.count))
                .map(([dept, data], idx) => {
                  const avgPct = data.count>0 ? Math.round(data.totalPct/data.count) : 0
                  const g      = getGrade(avgPct)
                  const color  = DEPT_COLORS[dept] || '#7c3aed'
                  return (
                    <div key={dept} style={{
                      padding:'20px',
                      background:'rgba(255,255,255,0.03)',
                      border:`1px solid ${color}25`,
                      borderRadius:14, borderLeft:`4px solid ${color}`,
                    }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{
                            width:38, height:38, borderRadius:10,
                            background:`${color}20`,
                            display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                          }}>
                            {['🖥️','⚡','⚙️','🏗️','🔢','🔬'][idx%6]}
                          </div>
                          <div>
                            <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{dept}</div>
                            <div style={{ color:'#6b7280', fontSize:12 }}>{data.count} student{data.count!==1?'s':''}</div>
                          </div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:28, fontWeight:800, color }}>{avgPct}%</div>
                          <span style={{ background:`${g.color}20`, color:g.color, padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>{g.label}</span>
                        </div>
                      </div>
                      <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${avgPct}%`, background:`linear-gradient(90deg,${color},${color}70)`, borderRadius:99 }}/>
                      </div>
                      <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
                        {students.filter(s => s.department===dept).map(s => {
                          const pct = marksMap[s.student_id]?.percentage||0
                          const sg  = getGrade(pct)
                          return (
                            <div key={s.student_id} onClick={() => navigate(`/marks/${s.student_id}`)}
                              style={{
                                display:'flex', alignItems:'center', gap:6,
                                padding:'4px 10px',
                                background:`${color}10`, border:`1px solid ${color}25`,
                                borderRadius:20, cursor:'pointer', fontSize:12,
                              }}>
                              <span style={{ color:'#fff' }}>{s.name}</span>
                              <span style={{ color:sg.color, fontWeight:700 }}>{pct}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}