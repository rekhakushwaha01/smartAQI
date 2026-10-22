import './RiskMeter.css';

function getRiskLevel(risk) {
  if (risk <= 25) return { label: 'Low', color: '#22c55e' };
  if (risk <= 50) return { label: 'Moderate', color: '#eab308' };
  if (risk <= 75) return { label: 'High', color: '#f97316' };
  return { label: 'Very High', color: '#ef4444' };
}

const RiskMeter = ({ risk = 0 }) => {
  const level = getRiskLevel(risk);

  return (
    <div className="risk-meter card">
      <p className="card-title">Health Risk Score</p>
      <div className="risk-meter-body">
        <div className="risk-circle" style={{ '--risk-color': level.color, '--risk-pct': `${risk}%` }}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={level.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(risk / 100) * 327} 327`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="risk-value">
            <span className="risk-number">{risk}</span>
            <span className="risk-unit">/ 100</span>
          </div>
        </div>
        <p className="risk-label" style={{ color: level.color }}>{level.label} Risk</p>
      </div>
    </div>
  );
};

export default RiskMeter;
