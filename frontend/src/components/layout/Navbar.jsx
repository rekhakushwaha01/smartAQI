import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLeaf, IoHome, IoGrid, IoHeart, IoDocumentText } from 'react-icons/io5';
import Button from '../common/Button';

const navItems = [
  { to: '/', label: 'Home', icon: IoHome },
  { to: '/dashboard', label: 'Dashboard', icon: IoGrid },
  { to: '/health-assessment', label: 'Assessment', icon: IoHeart },
  { to: '/health-dashboard', label: 'Health', icon: IoHeart },
  { to: '/reports', label: 'Reports', icon: IoDocumentText },
];

export default function Navbar({ transparent = false }) {
  const { pathname } = useLocation();

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
          {navItems.slice(1, 4).map(({ to, label }) => (
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

        <Link to="/dashboard">
          <Button size="sm">Explore Dashboard</Button>
        </Link>
      </div>
    </motion.nav>
  );
}
