import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FlowStepper from '../components/layout/FlowStepper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { fetchHealthHistory } from '../services/authService';
import { MAHARASHTRA_CITIES } from '../utils/constants';

export default function HealthHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchHealthHistory();
        if (!cancelled) setHistory(data.history || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const openAssessment = (item) => {
    localStorage.setItem(
      'smartaqi_assessment',
      JSON.stringify({
        profile: item.profile,
        riskScore: item.riskScore,
        riskCategory: item.riskCategory,
        riskFactors: item.riskFactors,
        recommendations: item.recommendations,
        aiExplanation: item.aiExplanation,
        healthScore: item.healthScore,
        exposureIndex: item.exposureIndex,
        aqi: item.aqi,
        timestamp: item.assessedAt || item.createdAt,
      })
    );
    if (item.location?.city) {
      localStorage.setItem(
        'smartaqi_location',
        JSON.stringify({ city: item.location.city, area: item.location.area || '' })
      );
    }
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FlowStepper current={5} />
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Health History</h1>
            <p className="mt-2 text-sm text-slate-500">
              Past assessments saved to your account — open any report again anytime.
            </p>
          </div>
          <Link to="/health/assessment">
            <Button size="sm">New assessment</Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <GlassCard className="p-6 text-sm text-red-600">{error}</GlassCard>
        )}

        {!loading && !error && history.length === 0 && (
          <GlassCard className="p-8 text-center">
            <p className="text-slate-600">No saved assessments yet.</p>
            <Link to="/health/assessment" className="mt-4 inline-block">
              <Button>Start your first assessment</Button>
            </Link>
          </GlassCard>
        )}

        <div className="space-y-4">
          {history.map((item, index) => {
            const cityKey = item.location?.city;
            const cityLabel = MAHARASHTRA_CITIES[cityKey]?.label || cityKey || '—';
            const date = new Date(item.assessedAt || item.createdAt).toLocaleString();
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <GlassCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{date}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {cityLabel}
                      {item.location?.area ? ` · ${item.location.area}` : ''} · AQI {item.aqi ?? '—'}
                    </p>
                    <p className="mt-2 text-sm">
                      Risk: <span className="font-semibold text-blue-600">{item.riskCategory?.label || item.riskCategory}</span>
                      {' · '}Score {item.riskScore}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => openAssessment(item)}>
                    View report
                  </Button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
