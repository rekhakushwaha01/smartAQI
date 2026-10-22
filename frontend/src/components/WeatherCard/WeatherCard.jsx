import './WeatherCard.css';

const WeatherCard = ({ temp, humidity, windSpeed, condition, uvIndex }) => {
  return (
    <div className="weather-card card">
      <p className="card-title">Weather</p>
      <div className="weather-main">
        <span className="weather-temp">{temp}°C</span>
        <span className="weather-condition">{condition}</span>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <span className="weather-detail-label">Humidity</span>
          <span className="weather-detail-value">{humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail-label">Wind</span>
          <span className="weather-detail-value">{windSpeed} km/h</span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail-label">UV Index</span>
          <span className="weather-detail-value">{uvIndex}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
