import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoDownload, IoShield, IoFlame } from 'react-icons/io5';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import RiskGauge from '../components/health/RiskGauge';
import { AQIVsRiskChart } from '../components/charts/ChartComponents';
import { useHealthAssessment } from '../hooks/useHealthAssessment';
import { mockAQIVsRisk, mockHealthHistory } from '../services/mockData';
import Toast from '../components/common/Toast';
import { useToast } from '../hooks/useToast';

export default function HealthDashboard() {
  const { result, loadSaved } = useHealthAssessment();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const assessment = result || JSON.parse(localStorage.getItem('smartaqi_assessment') || 'null');

  if (!assessment) {
    return (
      <DashboardLayout>
        <GlassCard className="mx-auto max-w-lg text-center py-16">
          <IoShield className="mx-auto text-5xl text-blue-400" />
          <h2 className="mt-4 text-2xl font-bold">No Assessment Yet</h2>
          <p className="mt-2 text-slate-500">Complete the health assessment to view your personalized risk dashboard.</p>
          <Link to="/health-assessment" className="mt-6 inline-block">
            <Button>Start Assessment</Button>
          </Link>
        </GlassCard>
      </DashboardLayout>
    );
  }

  const handleDownload = () => {
    addToast('PDF report generation coming soon with Flask API integration', 'info');
  };

  return (
    <DashboardLayout>
      <Toast toasts={toasts} removeToast={removeToast} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Health Dashboard</h1>
            <p className="mt-1 text-slate-500">Personalized respiratory health risk analysis</p>
          </div>
          <Button variant="secondary" icon={IoDownload} onClick={handleDownload}>
            Download PDF Report
          </Button>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <RiskGauge score={assessment.riskScore} />
          <GlassCard>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Health Score</p>
            <p className="mt-3 text-5xl font-extrabold text-green-500">{assessment.healthScore}</p>
            <p className="text-sm text-slate-500">out of 100</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Exposure Index</p>
            <p className="mt-3 text-5xl font-extrabold text-amber-500">{assessment.exposureIndex}</p>
            <p className="text-sm text-slate-500">pollution exposure level</p>
          </GlassCard>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <IoFlame className="text-red-500" /> Risk Factors
            </h3>
            <div className="flex flex-wrap gap-2">
              {assessment.riskFactors.map((f) => (
                <span
                  key={f.label}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    f.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {f.label}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-4 text-sm font-semibold text-slate-800">AI Explanation</h3>
            <p className="text-sm leading-relaxed text-slate-600">{assessment.aiExplanation}</p>
          </GlassCard>
        </div>

        <div className="mb-6">
          <h3 className="mb-4 text-lg font-bold text-slate-800">Personalized Recommendations</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assessment.recommendations.map((rec) => (
              <GlassCard key={rec.title} className="p-5">
                <span className="text-2xl">{rec.icon}</span>
                <h4 className="mt-3 font-bold text-slate-800">{rec.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{rec.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <AQIVsRiskChart data={mockAQIVsRisk} />
        </div>

        <GlassCard>
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Health History Timeline</h3>
          <div className="space-y-4">
            {mockHealthHistory.map((entry, i) => (
              <div key={entry.date} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />
                  {i < mockHealthHistory.length - 1 && <div className="w-0.5 flex-1 bg-slate-200" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-bold text-slate-800">{entry.date}</p>
                  <p className="text-xs text-slate-500">
                    AQI {entry.aqi} · Risk {entry.risk}% — {entry.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  );
}
