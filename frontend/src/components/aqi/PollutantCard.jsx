import GlassCard from '../common/GlassCard';
import { formatPollutant, getPollutantUnit } from '../../utils/aqiHelpers';

const safeLimits = { pm25: 35, pm10: 50, no2: 53, so2: 40, co: 4.4, o3: 70 };

export default function PollutantCard({ data }) {
  if (!data) return null;

  const pollutants = Object.entries(data).filter(([key]) => safeLimits[key] !== undefined);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {pollutants.map(([key, value]) => {
        const safe = safeLimits[key];
        const pct = Math.min(100, (value / safe) * 100);
        const isHigh = value > safe;

        return (
          <GlassCard key={key} className="p-5">
            <p className="text-xs font-semibold text-slate-400">{formatPollutant(key)}</p>
            <p className={`mt-2 text-2xl font-bold ${isHigh ? 'text-red-500' : 'text-green-600'}`}>
              {value}
            </p>
            <p className="text-xs text-slate-400">{getPollutantUnit(key)}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isHigh ? '#EF4444' : '#22C55E',
                }}
              />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
