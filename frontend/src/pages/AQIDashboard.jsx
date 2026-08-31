import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import { IoCloud, IoHeart, IoArrowForward } from 'react-icons/io5';
import FlowStepper from '../components/layout/FlowStepper';
import AQIGauge from '../components/aqi/AQIGauge';
import PollutantCard from '../components/aqi/PollutantCard';
import WeatherCard, { StatCard } from '../components/weather/WeatherCard';
import MaharashtraMap from '../components/aqi/MaharashtraMap';
import { AQI7DayChart, AQI24HourChart, PollutantBarChart } from '../components/charts/ChartComponents';
import Button from '../components/common/Button';
import { useAQI } from '../hooks/useAQI';
import { useLocation } from '../hooks/useLocalStorage';
import { MAHARASHTRA_CITIES } from '../utils/constants';

export default function AQIDashboard() {
  const { location } = useLocation();
  const { data, weather, history7Day, history24Hour, pollutants, mapMarkers, loading } = useAQI(
    location.city,
    location.area
  );

  const cityLabel = MAHARASHTRA_CITIES[location.city]?.label ?? location.city;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FlowStepper current={3} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Air Quality Dashboard</h1>
              <p className="mt-1 text-slate-500">
                {cityLabel} — {location.area} · Live API data
              </p>
            </div>
            <Link to="/health/assessment">
              <Button icon={IoHeart}>Check Your Health</Button>
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard icon={IoCloud} label="Current AQI" value={data.aqi} color="text-blue-600" />
            <StatCard icon={WiThermometer} label="Temperature" value={`${weather.temp}°C`} color="text-orange-500" />
            <StatCard icon={WiHumidity} label="Humidity" value={`${weather.humidity}%`} color="text-blue-400" />
            <StatCard icon={WiStrongWind} label="Wind Speed" value={weather.windSpeed} unit="km/h" color="text-sky-500" />
            <StatCard icon={IoCloud} label="Weather" value={weather.condition} color="text-amber-500" />
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <AQIGauge aqi={data.aqi} />
            <WeatherCard weather={weather} />
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Pollutant Levels (Gases)</h2>
            <PollutantCard data={data} />
          </div>

          <div className="mb-6">
            <MaharashtraMap markers={mapMarkers} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <AQI7DayChart data={history7Day} />
            <AQI24HourChart data={history24Hour} />
          </div>

          <div className="mt-6">
            <PollutantBarChart data={pollutants} />
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/health/assessment">
              <Button size="lg" icon={IoArrowForward}>Continue to Health Assessment</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
