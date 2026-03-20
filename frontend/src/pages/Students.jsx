// frontend/src/pages/Students.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api'

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

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics']

  return (
    <div>
      <h2 className="page-title">👥 All Students</h2>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="🔍 Search by name..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '9px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <select
            value={department} onChange={e => setDepartment(e.target.value)}
            style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setDepartment('') }}>
            Clear
          </button>
        </div>
      </div>

      {message && <div className="alert alert-error">{message}</div>}

      {/* Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>{students.length} student(s) found</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-student')}>
            ➕ Add Student
          </button>
        </div>

        {students.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '30px 0' }}>No students found.</p>
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
                {students.map(s => (
                  <tr key={s.student_id}>
                    <td>{s.student_id}</td>
                    <td>{s.name}</td>
                    <td>
                      <span style={{
                        background: '#e8ecff', color: '#4361ee',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                      }}>
                        {s.department}
                      </span>
                    </td>
                    <td><strong>{s.total_marks}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
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
                          🗑️ Delete
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