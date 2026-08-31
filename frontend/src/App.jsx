import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AirSelection from './pages/AirSelection';
import AQIDashboard from './pages/AQIDashboard';
import HealthAssessment from './pages/HealthAssessment';
import CombinedResults from './pages/CombinedResults';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/air/select" element={<AirSelection />} />
        <Route path="/air/dashboard" element={<AQIDashboard />} />
        <Route path="/health/assessment" element={<HealthAssessment />} />
        <Route path="/results" element={<CombinedResults />} />
        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/air/dashboard" replace />} />
        <Route path="/health-assessment" element={<Navigate to="/health/assessment" replace />} />
        <Route path="/health-dashboard" element={<Navigate to="/results" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
