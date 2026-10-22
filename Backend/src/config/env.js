const path = require('path');
const dotenv = require('dotenv');

// Load Backend/.env first, then the repo-root .env as a fallback.
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

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
  mlServiceUrl: env('ML_SERVICE_URL', 'http://127.0.0.1:8000'),
};

module.exports = config;
