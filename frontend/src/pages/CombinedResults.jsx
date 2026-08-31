import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoDownload, IoMedical, IoCloud, IoHeart } from 'react-icons/io5';
import FlowStepper from '../components/layout/FlowStepper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import AQIGauge from '../components/aqi/AQIGauge';
import PollutantCard from '../components/aqi/PollutantCard';
import WeatherCard from '../components/weather/WeatherCard';
import RiskGauge from '../components/health/RiskGauge';
import HealthRangeComparison from '../components/health/HealthRangeComparison';
import DoctorFinder from '../components/health/DoctorFinder';
import { useAQI } from '../hooks/useAQI';
import { useLocation } from '../hooks/useLocalStorage';
import { MAHARASHTRA_CITIES } from '../utils/constants';
import { downloadHealthReport } from '../utils/reportGenerator';

export default function CombinedResults() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { data, weather, loading } = useAQI(location.city, location.area);
  const [assessment, setAssessment] = useState(null);
  const [doctorOpen, setDoctorOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartaqi_assessment');
    if (saved) setAssessment(JSON.parse(saved));
    else navigate('/health/assessment');
  }, [navigate]);

  const cityLabel = MAHARASHTRA_CITIES[location.city]?.label ?? location.city;

  if (!assessment || loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const handleDownload = () => {
    downloadHealthReport({
      profile: assessment.profile,
      assessment,
      aqiData: data,
      weather,
      location,
      cityLabel,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FlowStepper current={5} />
      <DoctorFinder
        isOpen={doctorOpen}
        onClose={() => setDoctorOpen(false)}
        cityKey={location.city}
        profile={assessment.profile}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Final Report Dashboard</h1>
              <p className="mt-1 text-slate-500">
                {assessment.profile.name} · {cityLabel}, {location.area}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" icon={IoMedical} onClick={() => setDoctorOpen(true)}>
                Ask Doctor
              </Button>
              <Button icon={IoDownload} onClick={handleDownload}>
                Download Report
              </Button>
            </div>
          </div>

          {/* Horizontal split: Air | Health */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* LEFT — Air Quality */}
            <div className="space-y-6">
              <GlassCard className="border-l-4 border-l-blue-600">
                <div className="mb-4 flex items-center gap-2">
                  <IoCloud className="text-2xl text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-800">Air Quality Results</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">{cityLabel} — {location.area}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AQIGauge aqi={data.aqi} size="medium" />
                  <WeatherCard weather={weather} compact />
                </div>
              </GlassCard>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Pollutant Levels</h3>
                <PollutantCard data={data} />
              </div>
            </div>

            {/* RIGHT — Health */}
            <div className="space-y-6">
              <GlassCard className="border-l-4 border-l-red-500">
                <div className="mb-4 flex items-center gap-2">
                  <IoHeart className="text-2xl text-red-500" />
                  <h2 className="text-xl font-bold text-slate-800">Health Results</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  {assessment.profile.name}, {assessment.profile.age} yrs · {assessment.profile.gender}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <RiskGauge score={assessment.riskScore} size="medium" />
                  <div className="flex flex-col justify-center gap-3">
                    <div className="rounded-2xl bg-green-50 p-4 text-center">
                      <p className="text-xs text-slate-500">Health Score</p>
                      <p className="text-4xl font-extrabold text-green-600">{assessment.healthScore}</p>
                      <p className="text-xs text-slate-400">out of 100</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 text-center">
                      <p className="text-xs text-slate-500">Exposure Index</p>
                      <p className="text-4xl font-extrabold text-amber-600">{assessment.exposureIndex}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl px-4 py-3 text-center font-bold text-white"
                  style={{ backgroundColor: assessment.riskCategory.color }}>
                  Risk Category: {assessment.riskCategory.label} ({assessment.riskScore}%)
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="mb-3 text-sm font-semibold text-slate-800">Risk Factors</h3>
                <div className="flex flex-wrap gap-2">
                  {assessment.riskFactors.map((f) => (
                    <span key={f.label} className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      f.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {f.label}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Full width sections below */}
          <GlassCard className="mt-6">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Ideal Range vs Your Readings</h3>
            <HealthRangeComparison aqiData={data} assessment={assessment} />
          </GlassCard>

          <GlassCard className="mt-6">
            <h3 className="mb-3 text-lg font-bold text-slate-800">AI Analysis</h3>
            <p className="text-sm leading-relaxed text-slate-600">{assessment.aiExplanation}</p>
          </GlassCard>

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Recommendations &amp; Suggestions</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assessment.recommendations.map((rec) => (
                <GlassCard key={rec.title} className="p-5">
                  <span className="text-2xl">{rec.icon}</span>
                  <h4 className="mt-2 font-bold text-slate-800">{rec.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{rec.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button icon={IoMedical} onClick={() => setDoctorOpen(true)}>Ask Doctor — Find Nearby</Button>
            <Button icon={IoDownload} onClick={handleDownload}>Download PDF Report</Button>
            <Link to="/air/select">
              <Button variant="outline">Change City</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
