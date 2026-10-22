const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

function env(name, fallback = '') {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  return String(value).trim();
}

const config = {
  port: Number(env('PORT', '3000')),
  mongoUrl: env('MONGO_URL'),
  jwtSecret: env('JWT_SECRET'),
  openWeatherKey: env('OPENWEATHER_API_KEY'),
  googleApiKey: env('GOOGLE_API_KEY'),
  geminiApiKey: env('GEMINI_API_KEY'),
  healthApiKey: env('HEALTH_API_KEY'),
  imagekitPrivateKey: env('IMAGEKIT_PRIVATE_KEY'),
  frontendOrigin: env('FRONTEND_ORIGIN', 'http://localhost:5173'),
};

module.exports = config;
