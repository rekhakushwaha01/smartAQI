import './RecommendationCard.css';

const typeIcons = {
  warning: '⚠️',
  danger: '🚨',
  health: '🏥',
  success: '✅',
  info: 'ℹ️',
};

const RecommendationCard = ({ recommendations = [] }) => {
  if (!recommendations.length) {
    return (
      <div className="recommendation-card card">
        <p className="card-title">Recommendations</p>
        <p className="recommendation-empty">Complete a health assessment to get personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="recommendation-card card">
      <p className="card-title">Recommendations</p>
      <ul className="recommendation-list">
        {recommendations.map((rec, i) => (
          <li key={i} className={`recommendation-item recommendation-item--${rec.type}`}>
            <span className="recommendation-icon">{typeIcons[rec.type] || 'ℹ️'}</span>
            <span>{rec.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationCard;
