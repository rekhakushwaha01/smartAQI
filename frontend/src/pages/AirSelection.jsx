import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { IoLocation, IoArrowForward } from 'react-icons/io5';
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';
import FlowStepper from '../components/layout/FlowStepper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { MAHARASHTRA_CITIES, POLLUTED_CITY_KEYS } from '../utils/constants';
import { useLocation } from '../hooks/useLocalStorage';
import { useAQI } from '../hooks/useAQI';
import { getAQICategory, formatPollutant } from '../utils/aqiHelpers';
import { getAQIColor } from '../utils/aqiHelpers';

function MapFocus({ coords }) {
  const map = useMap();
  if (coords) map.setView(coords, 10);
  return null;
}

export default function AirSelection() {
  const navigate = useNavigate();
  const { location, updateLocation } = useLocation();
  const cityData = MAHARASHTRA_CITIES[location.city];
  const { data, weather, loading } = useAQI(location.city, location.area);
  const category = data ? getAQICategory(data.aqi) : null;

  const handleCityFromMap = (cityKey) => {
    const city = MAHARASHTRA_CITIES[cityKey];
    if (city) updateLocation(cityKey, city.areas[0]);
  };

  const handleContinue = () => {
    if (location.city && location.area) navigate('/air/dashboard');
  };

  const markers = POLLUTED_CITY_KEYS.map((key) => ({
    key,
    ...MAHARASHTRA_CITIES[key],
    aqi: key === location.city ? data?.aqi : undefined,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FlowStepper current={1} />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-slate-900">Select Location</h1>
          <p className="mt-1 text-slate-500">
            Choose a polluted city in Maharashtra — manually or by clicking the map
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <GlassCard className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <IoLocation className="text-blue-600" /> City &amp; Area
              </h2>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Maharashtra City
                  </label>
                  <select
                    value={location.city}
                    onChange={(e) => updateLocation(e.target.value, MAHARASHTRA_CITIES[e.target.value]?.areas[0] || '')}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {POLLUTED_CITY_KEYS.map((key) => (
                      <option key={key} value={key}>{MAHARASHTRA_CITIES[key].label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Area
                  </label>
                  <select
                    value={location.area}
                    onChange={(e) => updateLocation(location.city, e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
                  >
                    {cityData?.areas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="mt-6 flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              ) : data && weather && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Live Preview — {cityData?.label}, {location.area}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-blue-50 p-4 text-center">
                      <p className="text-xs text-slate-500">AQI</p>
                      <p className="text-2xl font-extrabold" style={{ color: category.color }}>{data.aqi}</p>
                      <p className="text-xs" style={{ color: category.color }}>{category.label}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <WiThermometer className="mx-auto text-2xl text-orange-500" />
                      <p className="text-2xl font-bold">{weather.temp}°C</p>
                      <p className="text-xs text-slate-500">{weather.condition}</p>
                    </div>
                    <div className="rounded-2xl bg-sky-50 p-4 text-center">
                      <WiHumidity className="mx-auto text-2xl text-blue-400" />
                      <p className="text-2xl font-bold">{weather.humidity}%</p>
                      <p className="text-xs text-slate-500">Humidity</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 p-4 text-center">
                      <WiStrongWind className="mx-auto text-2xl text-sky-500" />
                      <p className="text-2xl font-bold">{weather.windSpeed}</p>
                      <p className="text-xs text-slate-500">km/h wind</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'].map((key) => (
                      <div key={key} className="rounded-xl bg-slate-50 px-3 py-2 text-center">
                        <p className="text-[10px] text-slate-400">{formatPollutant(key)}</p>
                        <p className="text-sm font-bold text-slate-700">{data[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="mt-6 w-full" icon={IoArrowForward} onClick={handleContinue} disabled={!location.area}>
                Open Air Dashboard
              </Button>
            </GlassCard>

            <GlassCard className="overflow-hidden p-0">
              <div className="p-6 pb-3">
                <h2 className="font-bold text-slate-800">Maharashtra Polluted Cities Map</h2>
                <p className="text-xs text-slate-400">Click a marker to select city</p>
              </div>
              <div className="h-[480px] w-full">
                <MapContainer center={[19.7515, 75.7139]} zoom={7} className="h-full w-full" scrollWheelZoom>
                  <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  {cityData?.coords && <MapFocus coords={cityData.coords} />}
                  {markers.map(({ key, label, coords }) => (
                    <CircleMarker
                      key={key}
                      center={coords}
                      radius={location.city === key ? 18 : 14}
                      pathOptions={{
                        color: location.city === key ? '#2563EB' : getAQIColor(data?.aqi ?? 150),
                        fillColor: location.city === key ? '#2563EB' : getAQIColor(data?.aqi ?? 150),
                        fillOpacity: location.city === key ? 0.9 : 0.6,
                        weight: location.city === key ? 3 : 2,
                      }}
                      eventHandlers={{ click: () => handleCityFromMap(key) }}
                    >
                      <Popup>
                        <strong>{label}</strong>
                        <br />
                        Click to select
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
