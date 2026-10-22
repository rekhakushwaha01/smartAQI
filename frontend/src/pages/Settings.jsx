import { motion } from 'framer-motion';
import { IoSettings, IoNotifications, IoLocation, IoServer } from 'react-icons/io5';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import { useLocation } from '../hooks/useLocalStorage';
import { MAHARASHTRA_CITIES } from '../utils/constants';

export default function Settings() {
  const { location, updateLocation } = useLocation();
  const { toasts, addToast, removeToast } = useToast();
  const cityData = MAHARASHTRA_CITIES[location.city];

  const handleSave = () => {
    addToast('Settings saved successfully', 'success');
  };

  return (
    <DashboardLayout>
      <Toast toasts={toasts} removeToast={removeToast} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
        <p className="mt-1 mb-8 text-slate-500">Configure your SmartAQI preferences</p>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <IoLocation className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Default Location</h3>
                <p className="text-xs text-slate-500">Your preferred city and area</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">City</label>
                <select
                  value={location.city}
                  onChange={(e) => updateLocation(e.target.value, cityData?.areas[0] || '')}
                  className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {Object.entries(MAHARASHTRA_CITIES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Area</label>
                <select
                  value={location.area}
                  onChange={(e) => updateLocation(location.city, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {cityData?.areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <IoNotifications className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <p className="text-xs text-slate-500">Air quality alerts & health reminders</p>
              </div>
            </div>
            {[
              { label: 'AQI threshold alerts', desc: 'Notify when AQI exceeds 150' },
              { label: 'Daily health tips', desc: 'Personalized respiratory advice' },
              { label: 'Weekly reports', desc: 'Summary of AQI & risk trends' },
            ].map(({ label, desc }) => (
              <label key={label} className="mb-4 flex cursor-pointer items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded accent-blue-600" />
              </label>
            ))}
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <IoServer className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">API Configuration</h3>
                <p className="text-xs text-slate-500">Flask backend integration (coming soon)</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">API Base URL</label>
                <input
                  readOnly
                  value={import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
                <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-700">Using mock data (offline mode)</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="mt-8 flex justify-end">
          <Button icon={IoSettings} onClick={handleSave}>Save Settings</Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
