import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🌿</span>
        <Link to="/" className="navbar-title">Smart AQI Health</Link>
      </div>
      <nav className="navbar-actions">
        <Link to="/aqi-dashboard" className="navbar-link">Live AQI</Link>
        <Link to="/health-assessment" className="navbar-link">Assessment</Link>
        <Link to="/health-dashboard" className="navbar-link btn btn-primary navbar-cta">
          My Health
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
