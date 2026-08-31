import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoLeaf,
  IoGrid,
  IoCloud,
  IoHeart,
  IoDocumentText,
  IoSettings,
} from 'react-icons/io5';
import { NAV_LINKS } from '../../utils/constants';

const iconMap = {
  dashboard: IoGrid,
  air: IoCloud,
  health: IoHeart,
  reports: IoDocumentText,
  settings: IoSettings,
};

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/30 bg-white/50 pt-24 backdrop-blur-2xl lg:flex">
      <div className="px-6 pb-8">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
            <IoLeaf />
          </div>
          <span className="text-lg font-bold">
            Smart<span className="text-blue-600">AQI</span>
          </span>
        </NavLink>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_LINKS.map(({ to, label, icon }) => {
          const Icon = iconMap[icon];
          return (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-600 hover:bg-white/70'
                }`
              }
            >
              <Icon className="text-lg" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 p-4 text-white shadow-lg shadow-blue-600/20"
        >
          <p className="text-xs font-medium opacity-80">Final Year Project</p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            Urban Air Quality Based Respiratory Health Risk Prediction
          </p>
        </motion.div>
      </div>
    </aside>
  );
}
