import GlassCard from '../common/GlassCard';
import { getAQICategory } from '../../utils/aqiHelpers';

export default function AQICard({ aqi, label = 'Current AQI', location, compact = false }) {
  const category = getAQICategory(aqi);

  return (
    <GlassCard className={compact ? 'p-5' : ''}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-5xl font-extrabold" style={{ color: category.color }}>
          {aqi}
        </span>
        <div className="mb-2">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.label}
          </span>
          {location && <p className="mt-1 text-xs text-slate-500">{location}</p>}
        </div>
      </div>
    </GlassCard>
  );
}
