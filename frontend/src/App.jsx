import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AirSelection from './pages/AirSelection';
import AQIDashboard from './pages/AQIDashboard';
import HealthAssessment from './pages/HealthAssessment';
import CombinedResults from './pages/CombinedResults';
import HealthHistory from './pages/HealthHistory';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/air/select"
            element={
              <ProtectedRoute>
                <AirSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/air/dashboard"
            element={
              <ProtectedRoute>
                <AQIDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/assessment"
            element={
              <ProtectedRoute>
                <HealthAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <CombinedResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health/history"
            element={
              <ProtectedRoute>
                <HealthHistory />
              </ProtectedRoute>
            }
          />

          <Route path="/dashboard" element={<Navigate to="/air/dashboard" replace />} />
          <Route path="/health-assessment" element={<Navigate to="/health/assessment" replace />} />
          <Route path="/health-dashboard" element={<Navigate to="/results" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
