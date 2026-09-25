const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
