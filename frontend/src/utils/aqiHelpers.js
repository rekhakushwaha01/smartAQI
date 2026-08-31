import { AQI_CATEGORIES } from './constants';

export function getAQICategory(aqi) {
  return AQI_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max) ?? AQI_CATEGORIES[4];
}

export function getAQIColor(aqi) {
  return getAQICategory(aqi).color;
}

export function getAQILabel(aqi) {
  return getAQICategory(aqi).label;
}

export function formatPollutant(key) {
  const map = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    so2: 'SO₂',
    co: 'CO',
    o3: 'O₃',
  };
  return map[key] ?? key.toUpperCase();
}

export function getPollutantUnit(key) {
  const map = {
    pm25: 'µg/m³',
    pm10: 'µg/m³',
    no2: 'ppb',
    so2: 'ppb',
    co: 'ppm',
    o3: 'ppb',
  };
  return map[key] ?? '';
}

export function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg) return 0;
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60A5FA' };
  if (bmi < 25) return { label: 'Normal', color: '#22C55E' };
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
  return { label: 'Obese', color: '#EF4444' };
}
