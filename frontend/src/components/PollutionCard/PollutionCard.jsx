import './PollutionCard.css';

const pollutants = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', safe: 35 },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³', safe: 50 },
  { key: 'no2', label: 'NO₂', unit: 'ppb', safe: 53 },
  { key: 'o3', label: 'O₃', unit: 'ppb', safe: 70 },
  { key: 'co', label: 'CO', unit: 'ppm', safe: 4.4 },
];

const PollutionCard = ({ data = {} }) => {
  return (
    <div className="pollution-card card">
      <p className="card-title">Pollutants</p>
      <div className="pollution-list">
        {pollutants.map(({ key, label, unit, safe }) => {
          const value = data[key] ?? 0;
          const pct = Math.min(100, (value / safe) * 100);
          const isHigh = value > safe;

          return (
            <div key={key} className="pollution-item">
              <div className="pollution-header">
                <span className="pollution-label">{label}</span>
                <span className={`pollution-value${isHigh ? ' pollution-value--high' : ''}`}>
                  {value} {unit}
                </span>
              </div>
              <div className="pollution-bar">
                <div
                  className="pollution-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: isHigh ? 'var(--unhealthy)' : 'var(--good)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollutionCard;
