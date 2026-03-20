// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import EditStudent from './pages/EditStudent'
import Marks from './pages/Marks'
import AdminLogs from './pages/AdminLogs'
import Sidebar from './components/Sidebar'

// ── Redirect to login if not logged in ────────────────────
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user ? children : <Navigate to="/login" />
}

// ── Wrap page with sidebar ────────────────────────────────
function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
        } />
        <Route path="/students" element={
          <PrivateRoute><Layout><Students /></Layout></PrivateRoute>
        } />
        <Route path="/add-student" element={
          <PrivateRoute><Layout><AddStudent /></Layout></PrivateRoute>
        } />
        <Route path="/edit-student/:id" element={
          <PrivateRoute><Layout><EditStudent /></Layout></PrivateRoute>
        } />
        <Route path="/marks/:id" element={
          <PrivateRoute><Layout><Marks /></Layout></PrivateRoute>
        } />
        <Route path="/admin/logs" element={
          <PrivateRoute><Layout><AdminLogs /></Layout></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App