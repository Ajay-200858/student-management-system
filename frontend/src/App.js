// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing     from './pages/Landing'
import Login       from './pages/Login'
import Dashboard   from './pages/Dashboard'
import Students    from './pages/Students'
import AddStudent  from './pages/AddStudent'
import EditStudent from './pages/EditStudent'
import Marks       from './pages/Marks'
import Progress    from './pages/Progress'
import AdminLogs   from './pages/AdminLogs'
import Sidebar     from './components/Sidebar'
import Chatbot     from './components/Chatbot'

function PrivateRoute({ children }) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user ? children : <Navigate to="/login" replace />
  } catch {
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }
}

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0f1a' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#0d0f1a' }}>
        {children}
      </div>
      {/* Chatbot floats on every protected page */}
      <Chatbot />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                 element={<Landing />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/dashboard"        element={<PrivateRoute><Layout><Dashboard   /></Layout></PrivateRoute>} />
        <Route path="/students"         element={<PrivateRoute><Layout><Students    /></Layout></PrivateRoute>} />
        <Route path="/add-student"      element={<PrivateRoute><Layout><AddStudent  /></Layout></PrivateRoute>} />
        <Route path="/edit-student/:id" element={<PrivateRoute><Layout><EditStudent /></Layout></PrivateRoute>} />
        <Route path="/marks/:id"        element={<PrivateRoute><Layout><Marks       /></Layout></PrivateRoute>} />
        <Route path="/progress"         element={<PrivateRoute><Layout><Progress    /></Layout></PrivateRoute>} />
        <Route path="/admin/logs"       element={<PrivateRoute><Layout><AdminLogs   /></Layout></PrivateRoute>} />
        <Route path="*"                 element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}