import axios from 'axios';
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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

async function withFallback(request, fallback) {
  try {
    const { data } = await request();
    return data;
  } catch {
    return fallback;
  }
}

export const aqiService = {
  getCurrent: (city = 'mumbai', area = '') =>
    withFallback(
      () => api.get('/aqi/current', { params: { city, area } }),
      { ...mockAQIData, location: `${area || city}, Maharashtra` }
    ),

  getWeather: (city = 'mumbai') =>
    withFallback(() => api.get('/weather', { params: { city } }), mockWeather),

  getHistory7Day: (city = 'mumbai') =>
    withFallback(() => api.get('/aqi/history/7day', { params: { city } }), mockAQIHistory7Day),

  getHistory24Hour: (city = 'mumbai') =>
    withFallback(() => api.get('/aqi/history/24hour', { params: { city } }), mockAQIHistory24Hour),

  getPollutantComparison: (city = 'mumbai') =>
    withFallback(() => api.get('/aqi/pollutants', { params: { city } }), mockPollutantComparison),

  getMapMarkers: () =>
    withFallback(() => api.get('/aqi/map'), mockMapMarkers),
};

export const healthService = {
  submitAssessment: (payload) =>
    withFallback(() => api.post('/health/assess', payload), { success: true, data: payload }),

  getHistory: () =>
    withFallback(() => api.get('/health/history'), mockHealthHistory),

  getReports: () =>
    withFallback(() => api.get('/health/reports'), mockReports),

  getAQIVsRisk: () =>
    withFallback(() => api.get('/health/aqi-vs-risk'), mockAQIVsRisk),
};

export default api;
