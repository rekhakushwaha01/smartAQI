import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoDownload, IoCloud, IoHeart, IoWarning } from 'react-icons/io5';
import FlowStepper from '../components/layout/FlowStepper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import AQIGauge from '../components/aqi/AQIGauge';
import WeatherCard from '../components/weather/WeatherCard';
import RiskGauge from '../components/health/RiskGauge';
import GasRangePanel from '../components/health/GasRangePanel';
import NearbyCareList from '../components/health/NearbyCareList';
import { useAQI } from '../hooks/useAQI';
import { useLocation } from '../hooks/useLocalStorage';
import { MAHARASHTRA_CITIES } from '../utils/constants';
import { downloadHealthReport } from '../utils/reportGenerator';
import { getAirBodyImpact, getHealthBodyImpact, getRiskLevel } from '../utils/riskCalculator';

export default function CombinedResults() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { data, weather, loading } = useAQI(location.city, location.area);
  const [assessment, setAssessment] = useState(null);
  const [impactTab, setImpactTab] = useState('air');

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

  const riskLevel = getRiskLevel(assessment.riskScore);
  const airImpact = getAirBodyImpact(data.aqi, data);
  const healthImpact = getHealthBodyImpact(assessment.profile, data.aqi);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FlowStepper current={5} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Personalized Respiratory Health Risk Dashboard</h1>
              <p className="mt-1 text-slate-500">
                {assessment.profile.name || 'User'} · {cityLabel}, {location.area}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/health/history">
                <Button variant="secondary">History</Button>
              </Link>
              <Button icon={IoDownload} onClick={handleDownload}>Download Report</Button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <GlassCard className="border-l-4 border-l-blue-600">
                <div className="mb-4 flex items-center gap-2">
                  <IoCloud className="text-2xl text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-800">Air Quality</h2>
                </div>
                <p className="mb-4 text-sm text-slate-500">{cityLabel} — {location.area}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AQIGauge aqi={data.aqi} size="medium" />
                  <WeatherCard weather={weather} compact />
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="mb-4 text-lg font-bold text-slate-800">Gas ranges — good vs now</h3>
                <GasRangePanel aqiData={data} />
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard className="border-l-4 border-l-red-500">
                <div className="mb-4 flex items-center gap-2">
                  <IoHeart className="text-2xl text-red-500" />
                  <h2 className="text-xl font-bold text-slate-800">Health Snapshot</h2>
                </div>
                <p className="mb-4 text-sm text-slate-500">
                  {assessment.profile.name}, {assessment.profile.age} yrs · {assessment.profile.gender}
                </p>
                <RiskGauge score={assessment.riskScore} size="medium" />
              </GlassCard>

              <GlassCard className="flex h-full min-h-[420px] flex-col p-0">
                <div className="flex border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setImpactTab('air')}
                    className={`flex-1 rounded-tl-3xl px-4 py-4 text-sm font-bold transition-colors ${
                      impactTab === 'air' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Air impact on body
                  </button>
                  <button
                    type="button"
                    onClick={() => setImpactTab('health')}
                    className={`flex-1 rounded-tr-3xl px-4 py-4 text-sm font-bold transition-colors ${
                      impactTab === 'health' ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Health impact on body
                  </button>
                </div>
                <div className="flex-1 space-y-3 p-6">
                  {(impactTab === 'air' ? airImpact : healthImpact).map((item, i) => (
                    <div key={`${item.organ}-${i}`} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{item.organ}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="mt-8">
            <div className="mb-5 flex items-center gap-2">
              <IoWarning className="text-xl text-amber-500" />
              <h2 className="text-xl font-bold text-slate-800">Your personal risk</h2>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl p-5 text-center text-white" style={{ backgroundColor: riskLevel.color }}>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Risk category</p>
                <p className="mt-1 text-2xl font-extrabold">{assessment.riskCategory?.label || assessment.riskCategory}</p>
              </div>
              <div className="rounded-2xl bg-slate-900 p-5 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Risk score</p>
                <p className="mt-1 text-2xl font-extrabold">{assessment.riskScore}%</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Risk level</p>
                <p className="mt-1 text-2xl font-extrabold" style={{ color: riskLevel.color }}>{riskLevel.label}</p>
              </div>
            </div>

            <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{riskLevel.advice}</p>
            <p className="mb-5 text-sm leading-relaxed text-slate-600">{assessment.aiExplanation}</p>

            <h3 className="mb-3 text-sm font-semibold text-slate-800">Recommendations</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assessment.recommendations.map((rec) => (
                <div key={rec.title} className="rounded-2xl bg-slate-50 p-4">
                  <span className="text-xl">{rec.icon}</span>
                  <h4 className="mt-1 font-bold text-slate-800">{rec.title}</h4>
                  <p className="text-sm text-slate-500">{rec.desc}</p>
                </div>
              ))}
            </div>

            {assessment.riskFactors?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {assessment.riskFactors.map((f) => (
                  <span key={f.label} className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    f.severity === 'high' ? 'bg-red-100 text-red-700' : f.severity === 'low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {f.label}
                  </span>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="mt-6">
            <h2 className="mb-2 text-xl font-bold text-slate-800">Nearby hospitals &amp; doctors</h2>
            <p className="mb-5 text-sm text-slate-500">
              Specialists and hospitals near {cityLabel} based on your reported condition. Open a listing in Google Maps to get directions.
            </p>
            <NearbyCareList cityKey={location.city} profile={assessment.profile} />
          </GlassCard>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button icon={IoDownload} onClick={handleDownload}>Download PDF Report</Button>
            <Link to="/air/select"><Button variant="outline">Change City</Button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
