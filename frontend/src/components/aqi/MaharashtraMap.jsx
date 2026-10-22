import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import MapBasemap from './MapBasemap';
import GlassCard from '../common/GlassCard';
import { getAQIColor } from '../../utils/aqiHelpers';

export default function MaharashtraMap({ markers = [] }) {
  const center = [19.7515, 75.7139];

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="p-6 pb-4">
        <h3 className="text-sm font-semibold text-slate-800">Maharashtra AQI Map</h3>
        <p className="text-xs text-slate-400">Interactive air quality markers across cities</p>
      </div>
      <div className="h-[360px] w-full">
        <MapContainer center={center} zoom={7} className="h-full w-full" scrollWheelZoom={false}>
          <MapBasemap />
          {markers
            .filter((m) => m && (m.coords || (m.latitude != null && m.longitude != null)))
            .map((marker) => {
              const city = marker.city || marker.id;
              const aqi = marker.aqi ?? 0;
              const coords = marker.coords || [marker.latitude, marker.longitude];
              return (
                <CircleMarker
                  key={marker.id || city}
                  center={coords}
                  radius={14}
                  pathOptions={{
                    color: getAQIColor(aqi),
                    fillColor: getAQIColor(aqi),
                    fillOpacity: 0.7,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>{city}</strong>
                      <br />
                      AQI: <span style={{ color: getAQIColor(aqi), fontWeight: 700 }}>{aqi}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
        </MapContainer>
      </div>
    </GlassCard>
  );
}
