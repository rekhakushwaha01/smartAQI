const express = require('express');
const aqiService = require('../services/aqi.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await aqiService.getWeather(req.query.city, req.query.area);
    res.json(data);
  } catch (error) {
    console.error('Weather error:', error.message);
    res.status(502).json({ message: error.message || 'Failed to fetch weather' });
  }
});

module.exports = router;
