export const mockAQIData = {
  aqi: 156,
  category: 'Poor',
  pm25: 68,
  pm10: 112,
  no2: 42,
  so2: 18,
  co: 1.2,
  o3: 55,
  location: 'Mumbai, Maharashtra',
  area: 'Andheri',
  updatedAt: new Date().toISOString(),
};

export const mockWeather = {
  temp: 31,
  feelsLike: 34,
  humidity: 72,
  windSpeed: 14,
  condition: 'Partly Cloudy',
  uvIndex: 6,
  pressure: 1012,
  visibility: 8,
};

export const mockAQIHistory7Day = [
  { day: 'Mon', aqi: 98, pm25: 38 },
  { day: 'Tue', aqi: 112, pm25: 45 },
  { day: 'Wed', aqi: 134, pm25: 52 },
  { day: 'Thu', aqi: 148, pm25: 61 },
  { day: 'Fri', aqi: 162, pm25: 68 },
  { day: 'Sat', aqi: 145, pm25: 58 },
  { day: 'Sun', aqi: 156, pm25: 68 },
];

export const mockAQIHistory24Hour = [
  { hour: '12 AM', aqi: 88 },
  { hour: '3 AM', aqi: 82 },
  { hour: '6 AM', aqi: 95 },
  { hour: '9 AM', aqi: 128 },
  { hour: '12 PM', aqi: 162 },
  { hour: '3 PM', aqi: 178 },
  { hour: '6 PM', aqi: 156 },
  { hour: '9 PM', aqi: 132 },
];

export const mockPollutantComparison = [
  { name: 'PM2.5', value: 68, safe: 35 },
  { name: 'PM10', value: 112, safe: 50 },
  { name: 'NO₂', value: 42, safe: 53 },
  { name: 'SO₂', value: 18, safe: 40 },
  { name: 'CO', value: 1.2, safe: 4.4 },
  { name: 'O₃', value: 55, safe: 70 },
];

export const mockMapMarkers = [
  { city: 'Mumbai', coords: [19.076, 72.8777], aqi: 156 },
  { city: 'Pune', coords: [18.5204, 73.8567], aqi: 98 },
  { city: 'Nagpur', coords: [21.1458, 79.0882], aqi: 142 },
  { city: 'Nashik', coords: [19.9975, 73.7898], aqi: 118 },
  { city: 'Aurangabad', coords: [19.8762, 75.3433], aqi: 165 },
  { city: 'Thane', coords: [19.2183, 72.9781], aqi: 148 },
];

export const mockHealthHistory = [
  { date: '2026-07-20', risk: 72, aqi: 148, note: 'High outdoor exposure' },
  { date: '2026-07-22', risk: 68, aqi: 132, note: 'Used mask outdoors' },
  { date: '2026-07-24', risk: 75, aqi: 162, note: 'Breathing difficulty reported' },
  { date: '2026-07-26', risk: 82, aqi: 156, note: 'Current assessment' },
];

export const mockReports = [
  { id: 1, date: '2026-07-26', city: 'Mumbai', aqi: 156, risk: 82, category: 'High' },
  { id: 2, date: '2026-07-24', city: 'Mumbai', aqi: 162, risk: 75, category: 'High' },
  { id: 3, date: '2026-07-22', city: 'Pune', aqi: 132, risk: 68, category: 'Moderate' },
  { id: 4, date: '2026-07-20', city: 'Mumbai', aqi: 148, risk: 72, category: 'High' },
  { id: 5, date: '2026-07-18', city: 'Nagpur', aqi: 118, risk: 55, category: 'Moderate' },
];

export const mockAQIVsRisk = [
  { date: 'Jul 20', aqi: 148, risk: 72 },
  { date: 'Jul 22', aqi: 132, risk: 68 },
  { date: 'Jul 24', aqi: 162, risk: 75 },
  { date: 'Jul 26', aqi: 156, risk: 82 },
];

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
