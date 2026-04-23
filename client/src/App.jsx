import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RouteBuilder from './pages/RouteBuilder.jsx'
import LearningMode from './pages/LearningMode.jsx'
import CompareAlgorithms from './pages/CompareAlgorithms.jsx'
import History from './pages/History.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-muted">Loading...</div></div>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/route-builder" element={<ProtectedRoute><RouteBuilder /></ProtectedRoute>} />
          <Route path="/learning" element={<ProtectedRoute><LearningMode /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><CompareAlgorithms /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
