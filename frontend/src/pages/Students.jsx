// frontend/src/pages/Students.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [minMarks, setMinMarks] = useState('')
  const [maxMarks, setMaxMarks] = useState('')
  const [sortBy, setSortBy] = useState('student_id')
  const [sortDir, setSortDir] = useState('desc')
  const [message, setMessage] = useState('')

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics']

  const loadStudents = useCallback(() => {
    axios.get(`${API}/students/`, { params: { search, department } })
      .then(res => setStudents(res.data))
      .catch(() => setMessage('Failed to load students'))
  }, [search, department])

  useEffect(() => { loadStudents() }, [loadStudents])

  function clearFilters() {
    setSearch('')
    setDepartment('')
    setMinMarks('')
    setMaxMarks('')
    setSortBy('student_id')
    setSortDir('desc')
  }

  function deleteStudent(id, name) {
    if (!window.confirm(`Delete student "${name}"? This will also delete their marks.`)) return
    axios.delete(`${API}/students/${id}`)
      .then(() => loadStudents())
      .catch(() => setMessage('Failed to delete'))
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const filtered = students
    .filter(s => {
      if (minMarks !== '' && s.total_marks < parseInt(minMarks)) return false
      if (maxMarks !== '' && s.total_marks > parseInt(maxMarks)) return false
      return true
    })
    .sort((a, b) => {
      let valA = a[sortBy] ?? 0
      let valB = b[sortBy] ?? 0
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span style={{ color: '#ccc' }}> ↕</span>
    return <span style={{ color: '#4361ee' }}> {sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const deptColors = {
    'Computer Science': '#e8ecff',
    'Electronics': '#e8fff0',
    'Mechanical': '#fff3e0',
    'Civil': '#e0f4ff',
    'Mathematics': '#f3e8ff',
    'Physics': '#fff0e8',
  }

  return (
    <div>
      <h2 className="page-title">👥 All Students</h2>

      {/* Search & Filter Panel */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <input
            type="text" placeholder="🔍 Search by name..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              flex: 2, minWidth: '160px', padding: '9px 14px', border: '1px solid #ddd',
              borderRadius: '6px', fontSize: '14px', outline: 'none'
            }}
          />
          <select
            value={department} onChange={e => setDepartment(e.target.value)}
            style={{ flex: 1, minWidth: '140px', padding: '9px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#666' }}>Marks:</label>
            <input
              type="number" placeholder="Min" value={minMarks}
              onChange={e => setMinMarks(e.target.value)} min="0"
              style={{ width: '70px', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            />
            <span style={{ color: '#888' }}>–</span>
            <input
              type="number" placeholder="Max" value={maxMarks}
              onChange={e => setMaxMarks(e.target.value)} min="0"
              style={{ width: '70px', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <select
            value={`${sortBy}-${sortDir}`}
            onChange={e => {
              const [field, dir] = e.target.value.split('-')
              setSortBy(field)
              setSortDir(dir)
            }}
            style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
          >
            <option value="student_id-desc">Sort: ID (Newest)</option>
            <option value="student_id-asc">Sort: ID (Oldest)</option>
            <option value="name-asc">Sort: Name A–Z</option>
            <option value="name-desc">Sort: Name Z–A</option>
            <option value="total_marks-desc">Sort: Marks (High–Low)</option>
            <option value="total_marks-asc">Sort: Marks (Low–High)</option>
          </select>
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
            ✕ Clear All
          </button>
        </div>
      </div>

      {message && <div className="alert alert-error">{message}</div>}

      {/* Students Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>
            {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-student')}>
            ➕ Add Student
          </button>
        </div>

        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
            No students found matching your criteria.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleSort('student_id')} style={{ cursor: 'pointer' }}>
                    ID <SortIcon field="student_id" />
                  </th>
                  <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                    Name <SortIcon field="name" />
                  </th>
                  <th>Department</th>
                  <th onClick={() => toggleSort('total_marks')} style={{ cursor: 'pointer' }}>
                    Total Marks <SortIcon field="total_marks" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.student_id}>
                    <td style={{ color: '#888', fontSize: '13px' }}>#{s.student_id}</td>
                    <td>
                      <strong>{s.name}</strong>
                    </td>
                    <td>
                      <span style={{
                        background: deptColors[s.department] || '#f0f2f5',
                        color: '#4361ee',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'
                      }}>
                        {s.department}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '16px' }}>{s.total_marks}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="btn btn-info btn-sm"
                          onClick={() => navigate(`/marks/${s.student_id}`)}>
                          📊 Marks
                        </button>
                        <button className="btn btn-success btn-sm"
                          onClick={() => navigate(`/progress/${s.student_id}`)}>
                          📈 Progress
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}