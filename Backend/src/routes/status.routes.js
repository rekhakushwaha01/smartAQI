const express = require('express');
const { openWeatherKey, googleApiKey, geminiApiKey, healthApiKey, mongoUrl, jwtSecret } = require('../config/env');

const router = express.Router();

function looksLikeGoogleAiKey(key) {
  return typeof key === 'string' && key.startsWith('AIza');
}

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'smart-aqi-backend',
    integrations: {
      openWeather: Boolean(openWeatherKey),
      googleApiKeyConfigured: Boolean(googleApiKey),
      geminiHealthAi: looksLikeGoogleAiKey(geminiApiKey),
      healthApiKeyConfigured: Boolean(healthApiKey),
      healthApiKeyLooksValidForGemini: looksLikeGoogleAiKey(healthApiKey),
      mongo: Boolean(mongoUrl),
      jwt: Boolean(jwtSecret),
    },
  });
});

module.exports = router;
