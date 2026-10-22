const express = require('express');
const { MAHARASHTRA_CITIES } = require('../utils/cities');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const cities = Object.entries(MAHARASHTRA_CITIES).map(([key, city]) => ({
      key,
      label: city.label,
      coords: city.coords,
      areas: Object.keys(city.areas),
    }));
    res.json({ cities });
  } catch (error) {
    console.error('Cities error:', error.message);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
});

router.get('/:cityKey/areas', (req, res) => {
  try {
    const city = MAHARASHTRA_CITIES[req.params.cityKey];
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ areas: Object.keys(city.areas) });
  } catch (error) {
    console.error('Areas error:', error.message);
    res.status(500).json({ message: 'Failed to fetch areas' });
  }
});

module.exports = router;
