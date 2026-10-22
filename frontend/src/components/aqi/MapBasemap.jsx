import { TileLayer } from 'react-leaflet';

/** OpenStreetMap raster tiles — no API key required (Carto now watermarks without a key). */
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function MapBasemap() {
  return (
    <TileLayer
      attribution={OSM_ATTRIBUTION}
      url={OSM_TILE_URL}
      maxZoom={19}
    />
  );
}
