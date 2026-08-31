import GlassCard from '../common/GlassCard';
import { WiDayCloudy, WiHumidity, WiStrongWind, WiThermometer } from 'react-icons/wi';
import { IoSunny } from 'react-icons/io5';

const iconMap = {
  'Partly Cloudy': WiDayCloudy,
  Sunny: IoSunny,
  Cloudy: WiDayCloudy,
  Hazy: WiDayCloudy,
};

export default function WeatherCard({ weather, compact = false }) {
  if (!weather) return null;
  const Icon = iconMap[weather.condition] || WiDayCloudy;

  if (compact) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center gap-3">
          <Icon className="text-4xl text-amber-400" />
          <div>
            <p className="text-2xl font-bold">{weather.temp}°C</p>
            <p className="text-xs text-slate-500">{weather.condition}</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weather</p>
      <div className="mt-4 flex items-center gap-4">
        <Icon className="text-6xl text-amber-400" />
        <div>
          <p className="text-4xl font-extrabold text-slate-800">{weather.temp}°C</p>
          <p className="text-sm text-slate-500">{weather.condition}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <WiHumidity className="text-2xl text-blue-400" />
          <div>
            <p className="text-xs text-slate-400">Humidity</p>
            <p className="font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WiStrongWind className="text-2xl text-sky-400" />
          <div>
            <p className="text-xs text-slate-400">Wind</p>
            <p className="font-semibold">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WiThermometer className="text-2xl text-orange-400" />
          <div>
            <p className="text-xs text-slate-400">Feels Like</p>
            <p className="font-semibold">{weather.feelsLike}°C</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function StatCard({ icon: Icon, label, value, unit, color = 'text-blue-600' }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 ${color}`}>
          <Icon className="text-2xl" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="text-xl font-bold text-slate-800">
            {value}
            {unit && <span className="text-sm font-normal text-slate-500"> {unit}</span>}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
