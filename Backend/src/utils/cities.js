const MAHARASHTRA_CITIES = {
  mumbai: {
    label: 'Mumbai',
    coords: [19.076, 72.8777],
    areas: {
      Andheri: [19.1197, 72.8468],
      Bandra: [19.0596, 72.8295],
      Colaba: [18.9067, 72.8147],
      Dadar: [19.0178, 72.8478],
      Powai: [19.1176, 72.906],
      Thane: [19.2183, 72.9781],
    },
  },
  pune: {
    label: 'Pune',
    coords: [18.5204, 73.8567],
    areas: {
      Kothrud: [18.5074, 73.8077],
      Hinjewadi: [18.5912, 73.7389],
      'Koregaon Park': [18.5362, 73.8938],
      Hadapsar: [18.5089, 73.926],
      Baner: [18.559, 73.7868],
    },
  },
  nagpur: {
    label: 'Nagpur',
    coords: [21.1458, 79.0882],
    areas: {
      Sitabuldi: [21.1498, 79.082],
      Dharampeth: [21.141, 79.063],
      'Civil Lines': [21.155, 79.078],
      Sadar: [21.16, 79.09],
    },
  },
  aurangabad: {
    label: 'Aurangabad',
    coords: [19.8762, 75.3433],
    areas: {
      Cidco: [19.872, 75.355],
      'Jalna Road': [19.88, 75.36],
      'Beed Bypass': [19.85, 75.32],
      Garkheda: [19.86, 75.34],
    },
  },
  nashik: {
    label: 'Nashik',
    coords: [19.9975, 73.7898],
    areas: {
      Panchavati: [20.007, 73.795],
      'College Road': [19.997, 73.78],
      Satpur: [19.98, 73.75],
      'Nashik Road': [19.97, 73.83],
    },
  },
  thane: {
    label: 'Thane',
    coords: [19.2183, 72.9781],
    areas: {
      Ghodbunder: [19.24, 72.97],
      Majiwada: [19.21, 72.98],
      Kolshet: [19.23, 72.96],
      Hiranandani: [19.2, 72.97],
    },
  },
};

function resolveCoords(cityKey = 'mumbai', area = '') {
  const city = MAHARASHTRA_CITIES[String(cityKey).toLowerCase()] || MAHARASHTRA_CITIES.mumbai;
  if (area && city.areas[area]) {
    const [lat, lon] = city.areas[area];
    return { lat, lon, cityLabel: city.label, area };
  }
  const [lat, lon] = city.coords;
  return { lat, lon, cityLabel: city.label, area: area || '' };
}

module.exports = { MAHARASHTRA_CITIES, resolveCoords };
