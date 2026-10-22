const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API request failed: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export const getAQIData = async (
  city = 'mumbai',
  area = ''
) => {
  return fetchAPI(
    `/aqi/current?city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}`
  );
};

export const getWeatherData = async (
  city = 'mumbai'
) => {
  return fetchAPI(
    `/weather?city=${encodeURIComponent(city)}`
  );
};

export const getAQIHistory7Day = async (
  city = 'mumbai'
) => {
  return fetchAPI(
    `/aqi/history/7day?city=${encodeURIComponent(city)}`
  );
};

export const getAQIHistory24Hour = async (
  city = 'mumbai'
) => {
  return fetchAPI(
    `/aqi/history/24hour?city=${encodeURIComponent(city)}`
  );
};

export const getPollutantComparison = async (
  city = 'mumbai'
) => {
  return fetchAPI(
    `/aqi/pollutants?city=${encodeURIComponent(city)}`
  );
};

export const getMapMarkers = async () => {
  return fetchAPI('/aqi/map');
};

export const getHealthHistory = async () => {
  return fetchAPI('/health/history');
};

export const getReports = async () => {
  return fetchAPI('/health/reports');
};

export const getAQIVsRisk = async () => {
  return fetchAPI('/health/aqi-vs-risk');
};

export const submitHealthAssessment = async (payload) => {
  return fetchAPI('/health/assess', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const defaultAssessmentForm = {
  name: '',
  age: '',
  gender: '',
  height: '',
  weight: '',

  asthma: false,
  copd: false,
  lungDisease: false,
  heartDisease: false,
  allergies: false,
  noMedicalHistory: false,

  customMedical: [],

  smoking: 'never',
  occupation: '',
  occupationOther: '',
  outdoorHours: 3,
  exerciseFrequency: 'moderate',
  maskUsage: 'sometimes',

  cough: false,
  breathingDifficulty: false,
  chestTightness: false,
  eyeIrritation: false,
  noSymptoms: false,

  customSymptoms: [],
};

export const mockAQIData = {
  aqi: 156,
  category: 'Unhealthy',
  pm25: 92,
  pm10: 148,
  no2: 42,
  so2: 18,
  co: 0.8,
  o3: 31,
  location: 'Mumbai, Maharashtra',
  station: 'Mumbai Central',
  updatedAt: new Date().toISOString(),
};

export const mockWeather = {
  temp: 29,
  feelsLike: 32,
  humidity: 72,
  windSpeed: 14,
  windDirection: 'NW',
  pressure: 1008,
  visibility: 5,
  condition: 'Hazy',
  description: 'Hazy conditions with moderate air pollution',
  icon: 'haze',
  updatedAt: new Date().toISOString(),
};

export const mockAQIHistory7Day = [
  { date: '2026-09-27', day: 'Sun', aqi: 142, category: 'Unhealthy' },
  { date: '2026-09-28', day: 'Mon', aqi: 128, category: 'Unhealthy for Sensitive Groups' },
  { date: '2026-09-29', day: 'Tue', aqi: 151, category: 'Unhealthy' },
  { date: '2026-09-30', day: 'Wed', aqi: 164, category: 'Unhealthy' },
  { date: '2026-10-01', day: 'Thu', aqi: 148, category: 'Unhealthy' },
  { date: '2026-10-02', day: 'Fri', aqi: 159, category: 'Unhealthy' },
  { date: '2026-10-03', day: 'Sat', aqi: 156, category: 'Unhealthy' },
];

export const mockAQIHistory24Hour = [
  { time: '00:00', hour: '00:00', aqi: 118, pm25: 69 },
  { time: '02:00', hour: '02:00', aqi: 121, pm25: 71 },
  { time: '04:00', hour: '04:00', aqi: 127, pm25: 75 },
  { time: '06:00', hour: '06:00', aqi: 139, pm25: 82 },
  { time: '08:00', hour: '08:00', aqi: 153, pm25: 90 },
  { time: '10:00', hour: '10:00', aqi: 161, pm25: 95 },
  { time: '12:00', hour: '12:00', aqi: 168, pm25: 99 },
  { time: '14:00', hour: '14:00', aqi: 162, pm25: 96 },
  { time: '16:00', hour: '16:00', aqi: 158, pm25: 93 },
  { time: '18:00', hour: '18:00', aqi: 164, pm25: 97 },
  { time: '20:00', hour: '20:00', aqi: 159, pm25: 94 },
  { time: '22:00', hour: '22:00', aqi: 156, pm25: 92 },
];

export const mockPollutantComparison = [
  { name: 'PM2.5', pollutant: 'PM2.5', value: 92, safe: 35, limit: 60, unit: 'µg/m³', status: 'High' },
  { name: 'PM10', pollutant: 'PM10', value: 148, safe: 50, limit: 100, unit: 'µg/m³', status: 'High' },
  { name: 'NO₂', pollutant: 'NO₂', value: 42, safe: 80, limit: 80, unit: 'µg/m³', status: 'Moderate' },
  { name: 'SO₂', pollutant: 'SO₂', value: 18, safe: 80, limit: 80, unit: 'µg/m³', status: 'Good' },
  { name: 'CO', pollutant: 'CO', value: 0.8, safe: 4, limit: 4, unit: 'mg/m³', status: 'Good' },
  { name: 'O₃', pollutant: 'O₃', value: 31, safe: 100, limit: 100, unit: 'µg/m³', status: 'Good' },
];

export const mockMapMarkers = [
  { id: 'mumbai', city: 'Mumbai', area: 'Andheri', latitude: 19.1197, longitude: 72.8468, aqi: 162, category: 'Unhealthy' },
  { id: 'pune', city: 'Pune', area: 'Kothrud', latitude: 18.5074, longitude: 73.8077, aqi: 148, category: 'Unhealthy' },
  { id: 'nagpur', city: 'Nagpur', area: 'Sitabuldi', latitude: 21.1498, longitude: 79.082, aqi: 135, category: 'Unhealthy for Sensitive Groups' },
  { id: 'aurangabad', city: 'Aurangabad', area: 'Cidco', latitude: 19.872, longitude: 75.355, aqi: 156, category: 'Unhealthy' },
  { id: 'nashik', city: 'Nashik', area: 'College Road', latitude: 19.997, longitude: 73.78, aqi: 129, category: 'Unhealthy for Sensitive Groups' },
  { id: 'thane', city: 'Thane', area: 'Ghodbunder', latitude: 19.24, longitude: 72.97, aqi: 140, category: 'Unhealthy' },
];

export const mockHealthHistory = [
  { id: 1, date: '2026-09-28', riskLevel: 'Moderate', riskScore: 54, aqi: 142, symptoms: ['Cough', 'Eye irritation'] },
  { id: 2, date: '2026-09-30', riskLevel: 'High', riskScore: 68, aqi: 164, symptoms: ['Breathing difficulty', 'Cough'] },
  { id: 3, date: '2026-10-03', riskLevel: 'Moderate', riskScore: 61, aqi: 156, symptoms: ['Eye irritation'] },
];

export const mockReports = [
  {
    id: 1,
    title: 'Weekly Air Quality Health Report',
    date: '2026-09-28',
    type: 'weekly',
    riskLevel: 'Moderate',
    summary:
      'Air pollution exposure remained elevated during the week. Sensitive individuals should limit prolonged outdoor activity during high-AQI periods.',
  },
  {
    id: 2,
    title: 'Monthly Health Exposure Report',
    date: '2026-10-01',
    type: 'monthly',
    riskLevel: 'Moderate',
    summary: 'Average AQI remained above the recommended level during several days of the month.',
  },
];

export const mockAQIVsRisk = [
  { aqi: 50, riskScore: 12, riskLevel: 'Low' },
  { aqi: 75, riskScore: 21, riskLevel: 'Low' },
  { aqi: 100, riskScore: 31, riskLevel: 'Moderate' },
  { aqi: 125, riskScore: 43, riskLevel: 'Moderate' },
  { aqi: 150, riskScore: 55, riskLevel: 'Moderate' },
  { aqi: 175, riskScore: 67, riskLevel: 'High' },
  { aqi: 200, riskScore: 79, riskLevel: 'High' },
  { aqi: 250, riskScore: 91, riskLevel: 'Very High' },
];
