// frontend/src/pages/Students.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'
const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics']

const deptColors = {
  'Computer Science': '#7c3aed',
  'Electronics':      '#2563eb',
  'Mechanical':       '#b45309',
  'Civil':            '#059669',
  'Mathematics':      '#dc2626',
  'Physics':          '#7c3aed',
}

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [message, setMessage] = useState('')

  function loadStudents() {
    axios.get(`${API}/students/`, { params: { search, department } })
      .then(res => setStudents(res.data))
      .catch(() => setMessage('Failed to load students'))
  }

  useEffect(() => { loadStudents() }, [search, department])

  function deleteStudent(id, name) {
    if (!window.confirm(`Delete student "${name}"? This will also delete their marks.`)) return
    axios.delete(`${API}/students/${id}`)
      .then(() => loadStudents())
      .catch(() => setMessage('Failed to delete'))
  }

  return (
    <div>
      <h2 className="page-title">👥 All Students</h2>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, padding: '10px 14px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 8, fontSize: 14,
              color: '#e2e0ff', outline: 'none',
            }}
          />
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            style={{
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: 8, fontSize: 14,
              color: '#e2e0ff', outline: 'none',
            }}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setSearch(''); setDepartment('') }}
          >
            Clear
          </button>
        </div>
      </div>

      {message && <div className="alert alert-error">{message}</div>}

      {/* Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ color: '#6b7280', fontSize: 14 }}>{students.length} student(s) found</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-student')}>
            ➕ Add Student
          </button>
        </div>

        {students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#4b5563' }}>
            No students found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Total Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const c = deptColors[s.department] || '#7c3aed'
                  return (
                    <tr key={s.student_id}>
                      <td style={{ color: '#4b5563', fontFamily: 'monospace' }}>#{s.student_id}</td>
                      <td style={{ color: '#fff', fontWeight: 500 }}>{s.name}</td>
                      <td>
                        <span style={{
                          background: `rgba(${c === '#7c3aed' ? '124,58,237' : c === '#2563eb' ? '37,99,235' : c === '#b45309' ? '180,83,9' : c === '#059669' ? '5,150,105' : '220,38,38'},0.15)`,
                          color: c, padding: '3px 10px',
                          borderRadius: 20, fontSize: 12, fontWeight: 600,
                        }}>
                          {s.department}
                        </span>
                      </td>
                      <td style={{ color: '#a78bfa', fontWeight: 700 }}>{s.total_marks}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-info btn-sm"
                            onClick={() => navigate(`/marks/${s.student_id}`)}>
                            📊 Marks
                          </button>
                          <button className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/edit-student/${s.student_id}`)}>
                            ✏️ Edit
                          </button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => deleteStudent(s.student_id, s.name)}>
                            🗑️
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