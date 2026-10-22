const express = require('express');
const aqiService = require('../services/aqi.service');

const router = express.Router();

router.get('/current', async (req, res) => {
  try {
    const data = await aqiService.getCurrentAQI(req.query.city, req.query.area);
    res.json(data);
  } catch (error) {
    console.error('AQI current error:', error.message);
    res.status(502).json({ message: error.message || 'Failed to fetch AQI' });
  }
});

router.get('/history/7day', async (req, res) => {
  try {
    const data = await aqiService.getHistory7Day(req.query.city, req.query.area);
    res.json(data);
  } catch (error) {
    console.error('AQI 7day error:', error.message);
    res.status(502).json({ message: error.message || 'Failed to fetch 7-day history' });
  }
});

router.get('/history/24hour', async (req, res) => {
  try {
    const data = await aqiService.getHistory24Hour(req.query.city, req.query.area);
    res.json(data);
  } catch (error) {
    console.error('AQI 24h error:', error.message);
    res.status(502).json({ message: error.message || 'Failed to fetch 24-hour history' });
  }
});

router.get('/pollutants', async (req, res) => {
  try {
    const data = await aqiService.getPollutantComparison(req.query.city, req.query.area);
    res.json(data);
  } catch (error) {
    console.error('Pollutants error:', error.message);
    res.status(502).json({ message: error.message || 'Failed to fetch pollutants' });
  }
});

router.get('/map', async (req, res) => {
  try {
    const data = await aqiService.getMapMarkers();
    res.json(data);
  } catch (error) {
    console.error('Map markers error:', error.message);
    res.status(502).json({ message: error.message || 'Failed to fetch map markers' });
  }
});

module.exports = router;
