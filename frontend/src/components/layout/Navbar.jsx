import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLeaf } from 'react-icons/io5';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const publicItems = [{ to: '/', label: 'Home' }];

const authItems = [
  { to: '/air/select', label: 'Select City' },
  { to: '/air/dashboard', label: 'Air' },
  { to: '/health/assessment', label: 'Health' },
  { to: '/results', label: 'Report' },
  { to: '/health/history', label: 'History' },
];

export default function Navbar({ transparent = false }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = isAuthenticated ? [...publicItems, ...authItems] : publicItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 ${
        transparent ? 'bg-transparent' : 'glass border-b border-white/30'
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
            <IoLeaf className="text-xl" />
          </div>
          <span className="text-xl font-bold text-slate-800">
            Smart<span className="text-blue-600">AQI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.slice(1).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                pathname === to ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">
                Hi, {user?.name?.split(' ')[0] || 'User'}
              </span>
              <Button size="sm" variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="secondary">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
