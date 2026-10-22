const express = require('express');
const { googleApiKey } = require('../config/env');
const { resolveCoords } = require('../utils/cities');

const router = express.Router();

function mapPlace(place, specialty, city) {
  return {
    name: place.name,
    specialty,
    type: /hospital|clinic|centre|center/i.test(place.name) ? 'Hospital' : 'Doctor',
    rating: place.rating ?? '—',
    address: place.formatted_address || place.vicinity || '',
    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${place.name} ${city}`)}`,
  };
}

async function searchTextLegacy(query, key) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', key);
  const response = await fetch(url);
  return response.json();
}

async function searchTextNew(query, key) {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating',
    },
    body: JSON.stringify({ textQuery: query, pageSize: 6 }),
  });
  return response.json();
}

const OSM_HEADERS = {
  'User-Agent': 'SmartAQI/1.0 (local air-quality app)',
  Accept: 'application/json',
};

async function searchOverpass(lat, lon, specialty, city) {
  const query = `[out:json][timeout:20];
(
  node["amenity"~"hospital|clinic|doctors"](around:12000,${lat},${lon});
  way["amenity"~"hospital|clinic"](around:12000,${lat},${lon});
);
out center 16;`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...OSM_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        lastError = new Error(`Overpass ${response.status}`);
        continue;
      }

      const data = await response.json();
      const seen = new Set();
      const doctors = [];

      for (const el of data.elements || []) {
        const name = el.tags?.name;
        if (!name || seen.has(name)) continue;
        seen.add(name);
        const amenity = el.tags.amenity || 'clinic';
        doctors.push({
          name,
          specialty,
          type: amenity === 'hospital' ? 'Hospital' : 'Clinic',
          rating: '—',
          address: [el.tags['addr:street'], el.tags['addr:city'] || city].filter(Boolean).join(', '),
          mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${name} ${city}`)}`,
        });
        if (doctors.length >= 6) break;
      }

      if (doctors.length) return doctors;
    } catch (error) {
      lastError = error;
    }
  }

  const nominatim = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(`hospital clinic ${city} Maharashtra`)}`,
    { headers: OSM_HEADERS }
  );
  if (nominatim.ok) {
    const places = await nominatim.json();
    return (places || []).map((p) => ({
      name: p.display_name?.split(',')[0] || 'Clinic',
      specialty,
      type: /hospital/i.test(p.display_name) ? 'Hospital' : 'Clinic',
      rating: '—',
      address: p.display_name || city,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(p.display_name || `${city} hospital`)}`,
    }));
  }

  throw lastError || new Error('No nearby clinics found');
}

router.get('/nearby', async (req, res) => {
  try {
    const specialty = req.query.specialty || 'Pulmonologist';
    const city = req.query.city || 'Mumbai';
    const query = req.query.query || `${specialty} near ${city} Maharashtra`;
    const { lat, lon } = resolveCoords(req.query.cityKey || city, req.query.area);

    if (googleApiKey) {
      const legacy = await searchTextLegacy(query, googleApiKey);
      if (legacy.status === 'OK' || legacy.status === 'ZERO_RESULTS') {
        const doctors = (legacy.results || []).slice(0, 6).map((p) => mapPlace(p, specialty, city));
        return res.json({ doctors, specialty, source: 'google-places' });
      }

      const modern = await searchTextNew(query, googleApiKey);
      if (Array.isArray(modern.places)) {
        const doctors = modern.places.slice(0, 6).map((p) =>
          mapPlace(
            {
              name: p.displayName?.text || 'Clinic',
              formatted_address: p.formattedAddress,
              rating: p.rating,
            },
            specialty,
            city
          )
        );
        return res.json({ doctors, specialty, source: 'google-places-new' });
      }

      console.warn(
        'Google Places unavailable:',
        legacy.error_message || modern.error?.message || legacy.status
      );
    }

    const doctors = await searchOverpass(lat, lon, specialty, city);
    return res.json({
      doctors,
      specialty,
      source: doctors.length ? 'openstreetmap' : 'empty',
    });
  } catch (error) {
    console.error('Doctors nearby error:', error.message);
    return res.status(502).json({ message: error.message || 'Failed to fetch doctors', doctors: [] });
  }
});

module.exports = router;
