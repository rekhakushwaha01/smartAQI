import { motion } from 'framer-motion';
import { IoDownload, IoDocumentText } from 'react-icons/io5';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { AQI7DayChart, AQIVsRiskChart } from '../components/charts/ChartComponents';
import { mockReports, mockAQIHistory7Day, mockHealthHistory } from '../services/mockData';
import Toast from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import { getAQIColor } from '../utils/aqiHelpers';

export default function Reports() {
  const { toasts, addToast, removeToast } = useToast();

  const handleExport = () => {
    addToast('PDF export will connect to Flask API', 'info');
  };

  return (
    <DashboardLayout>
      <Toast toasts={toasts} removeToast={removeToast} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Reports</h1>
            <p className="mt-1 text-slate-500">Previous predictions, AQI &amp; health history</p>
          </div>
          <Button icon={IoDownload} onClick={handleExport}>Export PDF</Button>
        </div>

        <GlassCard className="mb-6 overflow-hidden p-0">
          <div className="p-6 pb-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <IoDocumentText className="text-blue-500" /> Previous Predictions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">City</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">AQI</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">Risk</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">Category</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{r.date}</td>
                    <td className="px-6 py-4">{r.city}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold" style={{ color: getAQIColor(r.aqi) }}>{r.aqi}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{r.risk}%</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        r.category === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <AQI7DayChart data={mockAQIHistory7Day} />
          <AQIVsRiskChart data={mockHealthHistory.map((h) => ({
            date: h.date.slice(5),
            aqi: h.aqi,
            risk: h.risk,
          }))} />
        </div>

        <GlassCard className="mt-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Health History Log</h3>
          <div className="space-y-3">
            {mockHealthHistory.map((h) => (
              <div key={h.date} className="flex items-center justify-between rounded-2xl bg-slate-50/80 px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-800">{h.date}</p>
                  <p className="text-xs text-slate-500">{h.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: getAQIColor(h.aqi) }}>AQI {h.aqi}</p>
                  <p className="text-xs text-red-500 font-semibold">Risk {h.risk}%</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  );
}
