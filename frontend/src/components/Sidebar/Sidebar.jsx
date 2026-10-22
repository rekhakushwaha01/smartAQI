import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/aqi-dashboard', label: 'AQI Dashboard', icon: '📊' },
  { to: '/health-assessment', label: 'Health Assessment', icon: '📋' },
  { to: '/health-dashboard', label: 'Health Dashboard', icon: '❤️' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            <span className="sidebar-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">Monitor air quality &amp; protect your health</p>
      </div>
    </aside>
  );
};

export default Sidebar;
