import { getAQILevel } from '../../services/api';
import './Charts.css';

const AQIChart = ({ data = [] }) => {
  if (!data.length) return null;

  const maxAqi = Math.max(...data.map((d) => d.aqi), 150);

  return (
    <div className="aqi-chart card">
      <p className="card-title">AQI Trend (Today)</p>
      <div className="chart-bars">
        {data.map((point, i) => {
          const level = getAQILevel(point.aqi);
          const height = (point.aqi / maxAqi) * 100;

          return (
            <div key={i} className="chart-bar-group">
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{ height: `${height}%`, background: level.color }}
                  title={`AQI ${point.aqi}`}
                />
              </div>
              <span className="chart-bar-label">{point.time}</span>
              <span className="chart-bar-value">{point.aqi}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AQIChart;
