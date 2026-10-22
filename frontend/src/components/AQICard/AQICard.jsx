import { getAQILevel } from '../../services/api';
import './AQICard.css';

const AQICard = ({ aqi = 0, location = 'Unknown', updatedAt }) => {
  const level = getAQILevel(aqi);
  const time = updatedAt
    ? new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div className="aqi-card card" style={{ '--aqi-color': level.color }}>
      <p className="card-title">Air Quality Index</p>
      <div className="aqi-card-body">
        <div className="aqi-value">{aqi}</div>
        <div className="aqi-meta">
          <span className="aqi-level" style={{ color: level.color }}>{level.label}</span>
          <span className="aqi-location">{location}</span>
          <span className="aqi-time">Updated {time}</span>
        </div>
      </div>
    </div>
  );
};

export default AQICard;
