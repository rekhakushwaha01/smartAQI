import { Link } from 'react-router-dom';
import { IoHome, IoCloud, IoHeart, IoAnalytics } from 'react-icons/io5';

const STEPS = [
  { id: 1, label: 'Intro', to: '/', icon: IoHome },
  { id: 2, label: 'Select City', to: '/air/select', icon: IoCloud },
  { id: 3, label: 'Air Dashboard', to: '/air/dashboard', icon: IoAnalytics },
  { id: 4, label: 'Health Form', to: '/health/assessment', icon: IoHeart },
  { id: 5, label: 'Final Report', to: '/results', icon: IoAnalytics },
];

export default function FlowStepper({ current = 1 }) {
  return (
    <div className="sticky top-0 z-50 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 overflow-x-auto px-4 py-4 md:px-8">
        <Link to="/" className="shrink-0 text-lg font-bold text-slate-800">
          Smart<span className="text-blue-600">AQI</span>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === current;
            const isDone = step.id < current;
            return (
              <Link
                key={step.id}
                to={step.to}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold md:px-3 md:text-xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : isDone
                      ? 'bg-green-100 text-green-700'
                      : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Icon className="hidden text-sm md:block" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.id}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
