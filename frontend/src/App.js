import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import EditStudent from './pages/EditStudent'
import Marks from './pages/Marks'
import AdminLogs from './pages/AdminLogs'
import AdminFeedback from './pages/AdminFeedback'
import Progress from './pages/Progress'
import StudentProgress from './pages/StudentProgress'
import StudentDetails from './pages/StudentDetails'
import Sidebar from './components/Sidebar'
import Chatbot from './components/Chatbot'
import Feedback from './components/Feedback'

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user ? children : <Navigate to="/login" />
}

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0 }}>
        {children}
      </div>
      <Chatbot />
      <Feedback />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login"   element={<Login />} />

          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><Layout><Students /></Layout></PrivateRoute>} />
          <Route path="/add-student" element={<PrivateRoute><Layout><AddStudent /></Layout></PrivateRoute>} />
          <Route path="/edit-student/:id" element={<PrivateRoute><Layout><EditStudent /></Layout></PrivateRoute>} />
          <Route path="/marks/:id" element={<PrivateRoute><Layout><Marks /></Layout></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><Layout><Progress /></Layout></PrivateRoute>} />
          <Route path="/progress/:id" element={<PrivateRoute><Layout><StudentProgress /></Layout></PrivateRoute>} />
          <Route path="/student-details/:id" element={<PrivateRoute><Layout><StudentDetails /></Layout></PrivateRoute>} />
          <Route path="/admin/logs" element={<PrivateRoute><Layout><AdminLogs /></Layout></PrivateRoute>} />
          <Route path="/admin/feedback" element={<PrivateRoute><Layout><AdminFeedback /></Layout></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}