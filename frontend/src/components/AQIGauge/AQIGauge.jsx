import { getAQILevel } from '../../services/api';
import './AQIGauge.css';

const AQIGauge = ({ aqi = 0 }) => {
  const level = getAQILevel(aqi);
  const rotation = Math.min(180, (aqi / 300) * 180);

  return (
    <div className="aqi-gauge card">
      <p className="card-title">AQI Gauge</p>
      <div className="gauge-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="20%" stopColor="#eab308" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="80%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--border)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.3"
          />
          <line
            x1="100"
            y1="100"
            x2={100 + 60 * Math.cos((Math.PI * (180 - rotation)) / 180)}
            y2={100 - 60 * Math.sin((Math.PI * (180 - rotation)) / 180)}
            stroke={level.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="6" fill={level.color} />
        </svg>
        <div className="gauge-value" style={{ color: level.color }}>{aqi}</div>
        <p className="gauge-label">{level.label}</p>
      </div>
    </div>
  );
};

export default AQIGauge;
