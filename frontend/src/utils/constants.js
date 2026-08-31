export const MAHARASHTRA_CITIES = {
  mumbai: {
    label: 'Mumbai',
    areas: ['Andheri', 'Bandra', 'Colaba', 'Dadar', 'Powai', 'Thane'],
    coords: [19.076, 72.8777],
    pollutionRank: 1,
  },
  pune: {
    label: 'Pune',
    areas: ['Kothrud', 'Hinjewadi', 'Koregaon Park', 'Hadapsar', 'Baner'],
    coords: [18.5204, 73.8567],
    pollutionRank: 2,
  },
  nagpur: {
    label: 'Nagpur',
    areas: ['Sitabuldi', 'Dharampeth', 'Civil Lines', 'Sadar'],
    coords: [21.1458, 79.0882],
    pollutionRank: 3,
  },
  aurangabad: {
    label: 'Aurangabad',
    areas: ['Cidco', 'Jalna Road', 'Beed Bypass', 'Garkheda'],
    coords: [19.8762, 75.3433],
    pollutionRank: 4,
  },
  nashik: {
    label: 'Nashik',
    areas: ['Panchavati', 'College Road', 'Satpur', 'Nashik Road'],
    coords: [19.9975, 73.7898],
    pollutionRank: 5,
  },
  thane: {
    label: 'Thane',
    areas: ['Ghodbunder', 'Majiwada', 'Kolshet', 'Hiranandani'],
    coords: [19.2183, 72.9781],
    pollutionRank: 6,
  },
};

/** Most polluted Maharashtra cities for this project */
export const POLLUTED_CITY_KEYS = ['mumbai', 'pune', 'nagpur', 'aurangabad', 'nashik', 'thane'];

export const AQI_CATEGORIES = [
  { min: 0, max: 50, label: 'Good', color: '#22C55E', bg: 'bg-green-500' },
  { min: 51, max: 100, label: 'Moderate', color: '#F59E0B', bg: 'bg-amber-500' },
  { min: 101, max: 200, label: 'Poor', color: '#F97316', bg: 'bg-orange-500' },
  { min: 201, max: 300, label: 'Very Poor', color: '#EF4444', bg: 'bg-red-500' },
  { min: 301, max: 500, label: 'Severe', color: '#7C3AED', bg: 'bg-purple-700' },
];

export const POLLUTANTS = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];

export const NAV_LINKS = [
  { to: '/air/select', label: 'Select City', icon: 'air' },
  { to: '/air/dashboard', label: 'Air Dashboard', icon: 'dashboard' },
  { to: '/health/assessment', label: 'Health Form', icon: 'health' },
  { to: '/results', label: 'Final Report', icon: 'reports' },
];

export const ASSESSMENT_STEPS = [
  { id: 1, title: 'Personal Info', subtitle: 'Name, age, gender & BMI' },
  { id: 2, title: 'Medical History', subtitle: 'Existing conditions' },
  { id: 3, title: 'Lifestyle', subtitle: 'Daily habits & exposure' },
  { id: 4, title: 'Symptoms', subtitle: 'Current health signs' },
];

export const OCCUPATION_OPTIONS = [
  'Office Worker', 'Construction Worker', 'Factory Worker', 'Traffic Police',
  'Delivery Person', 'Student', 'Healthcare Worker', 'Homemaker', 'Other',
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const SMOKING_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'occasional', label: 'Occasional' },
  { value: 'regular', label: 'Regular' },
];

export const EXERCISE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'moderate', label: 'Moderate (2-3x/week)' },
  { value: 'daily', label: 'Daily' },
];

export const MASK_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'always', label: 'Always' },
];

export const MEDICAL_CONDITIONS = [
  { name: 'asthma', label: 'Asthma' },
  { name: 'copd', label: 'COPD' },
  { name: 'lungDisease', label: 'Lung Disease' },
  { name: 'heartDisease', label: 'Heart Disease' },
  { name: 'allergies', label: 'Allergies' },
];

export const SYMPTOM_OPTIONS = [
  { name: 'cough', label: 'Cough' },
  { name: 'breathingDifficulty', label: 'Breathing Difficulty' },
  { name: 'chestTightness', label: 'Chest Tightness' },
  { name: 'eyeIrritation', label: 'Eye Irritation' },
];

export const HEALTH_IDEAL_RANGES = {
  aqi: { ideal: '0–50', goodMax: 50, unit: '', label: 'Good air quality' },
  pm25: { ideal: '0–35 µg/m³', goodMax: 35, unit: 'µg/m³', label: 'WHO 24h guideline' },
  pm10: { ideal: '0–50 µg/m³', goodMax: 50, unit: 'µg/m³', label: 'WHO 24h guideline' },
  no2: { ideal: '0–53 ppb', goodMax: 53, unit: 'ppb', label: 'Safe 1-hour limit' },
  so2: { ideal: '0–40 ppb', goodMax: 40, unit: 'ppb', label: 'Safe 24h limit' },
  co: { ideal: '0–4.4 ppm', goodMax: 4.4, unit: 'ppm', label: 'Safe 8-hour limit' },
  o3: { ideal: '0–70 ppb', goodMax: 70, unit: 'ppb', label: 'Safe 8-hour limit' },
  healthScore: { ideal: '80–100', goodMax: 100, unit: '', label: 'Optimal respiratory health' },
  riskScore: { ideal: '0–30%', goodMax: 30, unit: '%', label: 'Low risk zone' },
};

export const GAS_RANGE_KEYS = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3'];
