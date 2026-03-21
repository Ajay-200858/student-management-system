// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import EditStudent from './pages/EditStudent'
import Marks from './pages/Marks'
import AdminLogs from './pages/AdminLogs'
import Sidebar from './components/Sidebar'

function PrivateRoute({ children }) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user ? children : <Navigate to="/login" replace />
  } catch {
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }
}

// Explicit white/light background so Landing page canvas never bleeds through
function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f0f2f5',
      position: 'relative',
      zIndex: 999,
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: '30px',
        overflowY: 'auto',
        background: '#f0f2f5',
      }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<Landing />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/dashboard"      element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/students"       element={<PrivateRoute><Layout><Students /></Layout></PrivateRoute>} />
        <Route path="/add-student"    element={<PrivateRoute><Layout><AddStudent /></Layout></PrivateRoute>} />
        <Route path="/edit-student/:id" element={<PrivateRoute><Layout><EditStudent /></Layout></PrivateRoute>} />
        <Route path="/marks/:id"      element={<PrivateRoute><Layout><Marks /></Layout></PrivateRoute>} />
        <Route path="/admin/logs"     element={<PrivateRoute><Layout><AdminLogs /></Layout></PrivateRoute>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App