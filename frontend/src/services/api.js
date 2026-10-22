import axios from 'axios';
import { AQI_CATEGORIES } from '../utils/constants';
import { getToken } from './authService';
import {
  mockAQIData,
  mockWeather,
  mockAQIHistory7Day,
  mockAQIHistory24Hour,
  mockPollutantComparison,
  mockMapMarkers,
  mockHealthHistory,
  mockReports,
  mockAQIVsRisk,
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getAQILevel(aqi) {
  const category = AQI_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max) ?? AQI_CATEGORIES[4];
  return { label: category.label, color: category.color, bg: category.bg };
}

async function withFallback(request, fallback) {
  try {
    const { data } = await request();
    return data;
  } catch (error) {
    console.warn('API fallback used:', error?.message || error);
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

export const citiesService = {
  getCities: () =>
    withFallback(
      () => api.get('/cities'),
      () => ({
        cities: Object.entries({
          mumbai: { label: 'Mumbai', coords: [19.076, 72.8777], areas: ['Andheri', 'Bandra', 'Colaba', 'Dadar', 'Powai', 'Thane'] },
          pune: { label: 'Pune', coords: [18.5204, 73.8567], areas: ['Kothrud', 'Hinjewadi', 'Koregaon Park', 'Hadapsar', 'Baner'] },
          nagpur: { label: 'Nagpur', coords: [21.1458, 79.0882], areas: ['Sitabuldi', 'Dharampeth', 'Civil Lines', 'Sadar'] },
          aurangabad: { label: 'Aurangabad', coords: [19.8762, 75.3433], areas: ['Cidco', 'Jalna Road', 'Beed Bypass', 'Garkheda'] },
          nashik: { label: 'Nashik', coords: [19.9975, 73.7898], areas: ['Panchavati', 'College Road', 'Satpur', 'Nashik Road'] },
          thane: { label: 'Thane', coords: [19.2183, 72.9781], areas: ['Ghodbunder', 'Majiwada', 'Kolshet', 'Hiranandani'] },
        }).map(([key, city]) => ({ key, ...city })),
      })
    ),

  getAreas: (cityKey) =>
    withFallback(
      () => api.get(`/cities/${cityKey}/areas`),
      () => {
        const fallbackAreas = {
          mumbai: ['Andheri', 'Bandra', 'Colaba', 'Dadar', 'Powai', 'Thane'],
          pune: ['Kothrud', 'Hinjewadi', 'Koregaon Park', 'Hadapsar', 'Baner'],
          nagpur: ['Sitabuldi', 'Dharampeth', 'Civil Lines', 'Sadar'],
          aurangabad: ['Cidco', 'Jalna Road', 'Beed Bypass', 'Garkheda'],
          nashik: ['Panchavati', 'College Road', 'Satpur', 'Nashik Road'],
          thane: ['Ghodbunder', 'Majiwada', 'Kolshet', 'Hiranandani'],
        };
        return { areas: fallbackAreas[cityKey] || [] };
      }
    ),
};

export const aqiService = {
  getCurrent: (city = 'mumbai', area = '') =>
    withFallback(
      () => api.get('/aqi/current', { params: { city, area } }),
      () => ({ ...mockAQIData, location: `${area || city}, Maharashtra`, city, area })
    ),

  getWeather: (city = 'mumbai', area = '') =>
    withFallback(() => api.get('/weather', { params: { city, area } }), mockWeather),

  getHistory7Day: (city = 'mumbai', area = '') =>
    withFallback(() => api.get('/aqi/history/7day', { params: { city, area } }), mockAQIHistory7Day),

  getHistory24Hour: (city = 'mumbai', area = '') =>
    withFallback(() => api.get('/aqi/history/24hour', { params: { city, area } }), mockAQIHistory24Hour),

  getPollutantComparison: (city = 'mumbai', area = '') =>
    withFallback(() => api.get('/aqi/pollutants', { params: { city, area } }), mockPollutantComparison),

  getMapMarkers: () => withFallback(() => api.get('/aqi/map'), mockMapMarkers),
};

export const healthService = {
  submitAssessment: (payload) => api.post('/health/assess', payload).then((r) => r.data),

  getHistory: () =>
    withFallback(() => api.get('/health/history'), () => ({ history: mockHealthHistory })),

  getReports: () => withFallback(() => api.get('/health/reports'), mockReports),

  getAQIVsRisk: () => withFallback(() => api.get('/health/aqi-vs-risk'), mockAQIVsRisk),
};

export default api;
