import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { getAQICategory, getAQILabel } from '../../utils/aqiHelpers';
import { AQI_CATEGORIES } from '../../utils/constants';

export default function AQIGauge({ aqi, size = 'large' }) {
  const category = getAQICategory(aqi);
  const circumference = 2 * Math.PI * 90;
  const progress = Math.min(aqi / 300, 1);
  const dashOffset = circumference * (1 - progress);
  const isLarge = size === 'large';
  const isMedium = size === 'medium';
  const dimClass = isLarge ? 'h-56 w-56' : isMedium ? 'h-44 w-44' : 'h-40 w-40';
  const textClass = isLarge ? 'text-5xl' : isMedium ? 'text-4xl' : 'text-3xl';

  return (
    <GlassCard className="flex flex-col items-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        AQI Gauge
      </p>

      <div className={`relative ${dimClass}`}>
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={category.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className={`font-extrabold ${textClass}`}
            style={{ color: category.color }}
          >
            {aqi}
          </motion.span>
          <span className="text-sm font-semibold text-slate-500">{getAQILabel(aqi)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {AQI_CATEGORIES.map((cat) => (
          <span
            key={cat.label}
            className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
            style={{ backgroundColor: cat.color, opacity: category.label === cat.label ? 1 : 0.4 }}
          >
            {cat.label}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
