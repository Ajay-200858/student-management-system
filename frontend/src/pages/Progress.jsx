// frontend/src/pages/Progress.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Chart from 'chart.js/auto'

const API = 'http://localhost:5000/api'

function getGrade(pct) {
  if (pct >= 90) return { label: 'A+', color: '#7c6cfc' }
  if (pct >= 80) return { label: 'A',  color: '#4dd9b0' }
  if (pct >= 70) return { label: 'B+', color: '#50b4ff' }
  if (pct >= 60) return { label: 'B',  color: '#f0c060' }
  if (pct >= 50) return { label: 'C',  color: '#f0a070' }
  return { label: 'F', color: '#ff6b7a' }
}

function getBarColor(marks) {
  if (marks >= 80) return '#4dd9b0'
  if (marks >= 60) return '#7c6cfc'
  if (marks >= 50) return '#f0a070'
  return '#ff6b7a'
}

function getRemark(pct) {
  if (pct >= 90) return 'Outstanding! Keep up the excellence.'
  if (pct >= 80) return 'Great work! A little more effort to reach the top.'
  if (pct >= 70) return 'Good standing. Focus on weaker subjects.'
  if (pct >= 50) return 'Passing, but needs consistent improvement.'
  return 'Below threshold. Immediate attention required.'
}

function RingChart({ pct, grade }) {
  const r    = 50
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ flexShrink: 0 }}>
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none" stroke={grade.color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ filter: `drop-shadow(0 0 8px ${grade.color})` }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize="20" fontWeight="700"
        fill={grade.color} fontFamily="Outfit,sans-serif">{pct}%</text>
      <text x="65" y="78" textAnchor="middle" fontSize="14" fontWeight="600"
        fill={grade.color} fontFamily="Outfit,sans-serif">{grade.label}</text>
    </svg>
  )
}

function StatCard({ label, value, sub, color, delay }) {
  return (
    <div style={{
      flex:'1', minWidth:'120px', padding:'18px 20px',
      background:'rgba(255,255,255,0.05)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px',
      position:'relative', overflow:'hidden',
      animation:`fadeUp 0.4s ${delay || 0}s ease-out both`,
    }}>
      <div style={{
        position:'absolute', top:'-20px', right:'-20px',
        width:'80px', height:'80px', borderRadius:'50%',
        background:`radial-gradient(circle, ${color}33 0%, transparent 70%)`,
        filter:'blur(15px)', pointerEvents:'none',
      }} />
      <div style={{ fontSize:'11px', color, fontWeight:'600', letterSpacing:'0.5px', marginBottom:'10px', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:'32px', fontWeight:'700', color:'rgba(255,255,255,0.92)', lineHeight:1, letterSpacing:'-0.5px', fontFamily:"'Outfit',sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginTop:'5px' }}>{sub}</div>}
    </div>
  )
}

const glass = {
  background:     'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border:         '1px solid rgba(255,255,255,0.10)',
  borderRadius:   '20px',
  padding:        '24px',
  boxShadow:      '0 8px 32px rgba(0,0,0,0.35)',
  position:       'relative',
  overflow:       'hidden',
}

export default function Progress() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [student,   setStudent]   = useState(null)
  const [marksData, setMarksData] = useState({ marks:[], total:0, percentage:0 })
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [ready,     setReady]     = useState(false)

  const barRef      = useRef(null)
  const radarRef    = useRef(null)
  const lineRef     = useRef(null)
  const doughnutRef = useRef(null)
  const charts      = useRef({})

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/students/${id}`),
      axios.get(`${API}/marks/${id}`),
    ])
      .then(([sRes, mRes]) => {
        setStudent(sRes.data)
        setMarksData(mRes.data)
        setLoading(false)
        setTimeout(() => setReady(true), 100)
      })
      .catch(() => { setError('Failed to load.'); setLoading(false) })
  }, [id])

  const drawCharts = useCallback(() => {
    const { marks } = marksData
    if (!marks.length) return
    Chart.defaults.color       = 'rgba(255,255,255,0.5)'
    Chart.defaults.borderColor = 'rgba(255,255,255,0.08)'
    Chart.defaults.font.family = "'Outfit',sans-serif"

    const tip = {
      backgroundColor:'rgba(20,20,40,0.95)', titleColor:'#fff',
      bodyColor:'rgba(255,255,255,0.7)', borderColor:'rgba(255,255,255,0.1)',
      borderWidth:1, padding:10, cornerRadius:10,
    }

    const subjects = marks.map(m => m.subject)
    const scores   = marks.map(m => m.marks)
    const passed   = marks.filter(m => m.marks >= 50).length

    // destroy old
    Object.values(charts.current).forEach(c => c?.destroy())
    charts.current = {}

    if (barRef.current) {
      charts.current.bar = new Chart(barRef.current, {
        type:'bar',
        data:{
          labels:subjects,
          datasets:[{
            label:'Score', data:scores,
            backgroundColor:scores.map(s=>getBarColor(s)+'cc'),
            borderColor:scores.map(getBarColor),
            borderWidth:1, borderRadius:6, borderSkipped:false,
          }],
        },
        options:{
          indexAxis:'y', responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{display:false}, tooltip:tip },
          scales:{
            x:{ min:0, max:100, ticks:{color:'rgba(255,255,255,0.4)',font:{size:11}}, grid:{color:'rgba(255,255,255,0.05)'} },
            y:{ ticks:{color:'rgba(255,255,255,0.7)',font:{size:12}}, grid:{display:false} },
          },
        },
      })
    }

    if (radarRef.current) {
      charts.current.radar = new Chart(radarRef.current, {
        type:'radar',
        data:{
          labels:subjects,
          datasets:[{
            label:student?.name||'Score', data:scores,
            backgroundColor:'rgba(124,108,252,0.15)',
            borderColor:'#7c6cfc', borderWidth:2,
            pointBackgroundColor:'#7c6cfc', pointBorderColor:'rgba(255,255,255,0.5)',
            pointRadius:5, pointHoverRadius:7,
          }],
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          scales:{r:{
            min:0, max:100,
            ticks:{stepSize:25,color:'rgba(255,255,255,0.3)',font:{size:10},backdropColor:'transparent'},
            grid:{color:'rgba(255,255,255,0.08)'},
            pointLabels:{color:'rgba(255,255,255,0.65)',font:{size:11}},
            angleLines:{color:'rgba(255,255,255,0.06)'},
          }},
          plugins:{legend:{display:false},tooltip:tip},
        },
      })
    }

    if (lineRef.current) {
      charts.current.line = new Chart(lineRef.current, {
        type:'line',
        data:{
          labels:subjects,
          datasets:[{
            label:'Trend', data:scores,
            borderColor:'#4dd9b0', backgroundColor:'rgba(77,217,176,0.08)',
            fill:true, tension:0.42, borderWidth:2.5,
            pointBackgroundColor:scores.map(getBarColor),
            pointBorderColor:'rgba(0,0,0,0.3)', pointRadius:6, pointHoverRadius:8,
          }],
        },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{legend:{display:false},tooltip:tip},
          scales:{
            y:{min:0,max:100,ticks:{color:'rgba(255,255,255,0.4)',font:{size:11}},grid:{color:'rgba(255,255,255,0.05)'}},
            x:{ticks:{color:'rgba(255,255,255,0.6)',font:{size:11}},grid:{display:false}},
          },
        },
      })
    }

    if (doughnutRef.current) {
      charts.current.doughnut = new Chart(doughnutRef.current, {
        type:'doughnut',
        data:{
          labels:['Passed','Failed'],
          datasets:[{
            data:[passed, marks.length-passed],
            backgroundColor:['rgba(77,217,176,0.8)','rgba(255,107,122,0.8)'],
            borderColor:['#4dd9b0','#ff6b7a'], borderWidth:1, hoverOffset:8,
          }],
        },
        options:{
          responsive:true, maintainAspectRatio:false, cutout:'68%',
          plugins:{legend:{display:false},tooltip:tip},
        },
      })
    }
  }, [marksData, student])

  useEffect(() => {
    if (ready && !loading) drawCharts()
  }, [ready, loading, drawCharts])

  useEffect(() => () => Object.values(charts.current).forEach(c=>c?.destroy()), [])

  const { marks, total, percentage } = marksData
  const pct     = Math.round(percentage)
  const grade   = getGrade(pct)
  const scores  = marks.map(m => m.marks)
  const passed  = marks.filter(m => m.marks >= 50).length
  const failed  = marks.length - passed
  const highest = marks.length ? Math.max(...scores) : 0
  const lowest  = marks.length ? Math.min(...scores) : 0

  return (
    <div style={{ animation:'fadeUp 0.4s ease-out both' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>

      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/students')} style={{ marginBottom:'22px' }}>
        ← Back to Students
      </button>
      <h2 className="page-title">📈 Progress Report</h2>

      {loading && (
        <div style={{ ...glass, display:'flex', alignItems:'center', gap:'14px', padding:'32px 28px' }}>
          <div style={{ width:'22px', height:'22px', borderRadius:'50%', border:'2px solid rgba(124,108,252,0.3)', borderTop:'2px solid #7c6cfc', animation:'spin 0.8s linear infinite' }} />
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px' }}>Loading progress data…</span>
        </div>
      )}

      {!loading && error && (
        <div style={{ ...glass, borderColor:'rgba(255,107,122,0.3)', color:'#ff6b7a', fontSize:'14px' }}>⚠ {error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Student banner */}
          <div style={{ ...glass, display:'flex', alignItems:'center', gap:'24px', marginBottom:'20px', flexWrap:'wrap', borderLeft:`3px solid ${grade.color}` }}>
            <RingChart pct={pct} grade={grade} />
            <div style={{ flex:1, minWidth:'200px' }}>
              <div style={{ fontSize:'22px', fontWeight:'700', color:'rgba(255,255,255,0.92)', letterSpacing:'-0.3px', marginBottom:'4px' }}>
                {student?.name || `Student #${id}`}
              </div>
              <span style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', padding:'2px 12px', borderRadius:'20px', fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>
                {student?.department}
              </span>
              <div style={{ marginTop:'12px', padding:'12px 16px', background:'rgba(255,255,255,0.04)', border:`1px solid ${grade.color}33`, borderLeft:`3px solid ${grade.color}`, borderRadius:'12px', fontSize:'13.5px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                {getRemark(pct)}
              </div>
            </div>
          </div>

          {/* Stat cards */}
          {marks.length > 0 && (
            <div style={{ display:'flex', gap:'14px', marginBottom:'20px', flexWrap:'wrap' }}>
              <StatCard label="Total Marks" value={total}    sub={`of ${marks.length*100} max`} color="#7c6cfc" delay={0}    />
              <StatCard label="Percentage"  value={`${pct}%`} sub="overall"                     color={grade.color} delay={0.05} />
              <StatCard label="Subjects"    value={marks.length} sub="recorded"                  color="#50b4ff" delay={0.1}  />
              <StatCard label="Highest"     value={highest}  sub={marks.find(m=>m.marks===highest)?.subject||''} color="#4dd9b0" delay={0.15} />
              <StatCard label="Lowest"      value={lowest}   sub={marks.find(m=>m.marks===lowest)?.subject||''}  color="#ff6b7a" delay={0.2}  />
            </div>
          )}

          {marks.length === 0 && (
            <div style={{ ...glass, textAlign:'center', padding:'48px', color:'rgba(255,255,255,0.35)' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px', opacity:0.4 }}>📊</div>
              <div>No marks recorded yet. Add marks from the student profile.</div>
            </div>
          )}

          {marks.length > 0 && (
            <>
              {/* Bar + Radar */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px' }}>
                <div style={glass}>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:'rgba(255,255,255,0.8)', marginBottom:'2px' }}>Subject-wise scores</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>Score out of 100</div>
                  <div style={{ height:`${Math.max(160, marks.length * 50)}px`, position:'relative' }}>
                    <canvas ref={barRef} />
                  </div>
                </div>
                <div style={glass}>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:'rgba(255,255,255,0.8)', marginBottom:'2px' }}>Performance radar</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>Strength profile</div>
                  <div style={{ height:'240px', position:'relative' }}>
                    <canvas ref={radarRef} />
                  </div>
                </div>
              </div>

              {/* Line + Doughnut */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'16px', marginBottom:'20px' }}>
                <div style={glass}>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:'rgba(255,255,255,0.8)', marginBottom:'2px' }}>Score trend</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>Marks in order added</div>
                  <div style={{ height:'200px', position:'relative' }}>
                    <canvas ref={lineRef} />
                  </div>
                </div>
                <div style={glass}>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:'rgba(255,255,255,0.8)', marginBottom:'2px' }}>Pass / Fail</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>Threshold: 50</div>
                  <div style={{ height:'160px', position:'relative' }}>
                    <canvas ref={doughnutRef} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'center', gap:'16px', marginTop:'12px' }}>
                    {[['#4dd9b0',`Passed (${passed})`],['#ff6b7a',`Failed (${failed})`]].map(([c,l])=>(
                      <div key={l} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'rgba(255,255,255,0.5)' }}>
                        <div style={{ width:'8px', height:'8px', borderRadius:'2px', background:c, boxShadow:`0 0 6px ${c}` }} />
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ ...glass, padding:'24px 0', overflow:'hidden' }}>
                <div style={{ fontSize:'14px', fontWeight:'600', color:'rgba(255,255,255,0.8)', padding:'0 24px', marginBottom:'16px' }}>
                  Subject breakdown
                </div>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        {['#','Subject','Marks','Grade','Status','Progress'].map(h=>(
                          <th key={h} style={{ padding:'10px 20px', textAlign:'left', background:'rgba(255,255,255,0.03)', fontSize:'10.5px', color:'rgba(255,255,255,0.32)', fontWeight:'600', letterSpacing:'0.8px', textTransform:'uppercase', borderBottom:'1px solid rgba(255,255,255,0.06)', whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((m,i)=>{
                        const g = getGrade(m.marks)
                        return (
                          <tr key={m.id}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          >
                            <td style={{ padding:'12px 20px', fontSize:'12px', color:'rgba(255,255,255,0.25)' }}>{i+1}</td>
                            <td style={{ padding:'12px 20px', fontSize:'14px', fontWeight:'500', color:'rgba(255,255,255,0.82)' }}>{m.subject}</td>
                            <td style={{ padding:'12px 20px', fontSize:'16px', fontWeight:'700', color:getBarColor(m.marks), fontFamily:"'Outfit',sans-serif" }}>{m.marks}</td>
                            <td style={{ padding:'12px 20px' }}>
                              <span style={{ background:`${g.color}22`, color:g.color, border:`1px solid ${g.color}44`, padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>{g.label}</span>
                            </td>
                            <td style={{ padding:'12px 20px' }}>
                              <span style={{ background:m.marks>=50?'rgba(77,217,176,0.15)':'rgba(255,107,122,0.15)', color:m.marks>=50?'#4dd9b0':'#ff6b7a', border:`1px solid ${m.marks>=50?'rgba(77,217,176,0.3)':'rgba(255,107,122,0.3)'}`, padding:'3px 10px', borderRadius:'20px', fontSize:'12px' }}>
                                {m.marks>=50?'Pass':'Fail'}
                              </span>
                            </td>
                            <td style={{ padding:'12px 20px', minWidth:'120px' }}>
                              <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:'6px', height:'7px', overflow:'hidden' }}>
                                <div style={{ height:'100%', width:`${m.marks}%`, background:`linear-gradient(90deg,${getBarColor(m.marks)}99,${getBarColor(m.marks)})`, borderRadius:'6px', boxShadow:`0 0 8px ${getBarColor(m.marks)}66` }} />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
