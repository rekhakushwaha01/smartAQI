import { NavLink } from 'react-router-dom';
import { IoGrid, IoHeart, IoDocumentText, IoHome } from 'react-icons/io5';

const links = [
  { to: '/', label: 'Home', icon: IoHome },
  { to: '/dashboard', label: 'AQI', icon: IoGrid },
  { to: '/health-assessment', label: 'Assess', icon: IoHeart },
  { to: '/health-dashboard', label: 'Health', icon: IoHeart },
  { to: '/reports', label: 'Reports', icon: IoDocumentText },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/30 bg-white/80 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`
            }
          >
            <Icon className="text-xl" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
