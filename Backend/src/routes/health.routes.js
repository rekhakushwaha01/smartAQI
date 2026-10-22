const express = require('express');
const HealthAssessment = require('../models/healthAssessment.model');
const authMiddleware = require('../middleware/auth.middleware');
const { generateHealthExplanation } = require('../services/healthAi.service');
const { buildPrediction } = require('../services/riskDemo.service');
const config = require('../config/env');

const router = express.Router();

router.post('/predict', async (req, res) => {
  const aqi = req.body?.aqi;
  const profile = req.body?.profile || {};
  const pollutants = req.body?.pollutants || {};

  if (aqi == null) {
    return res.status(400).json({ message: 'aqi is required' });
  }

  try {
    const response = await fetch(`${config.mlServiceUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aqi, profile, pollutants }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    console.warn('ML predict HTTP', response.status);
  } catch (error) {
    console.warn('ML predict fallback used:', error.message);
  }

  return res.json(buildPrediction(aqi, profile, pollutants));
});

function normalizeRiskCategory(value) {
  if (value && typeof value === 'object') {
    return value.label || 'Moderate';
  }
  return String(value || 'Moderate');
}

router.use(authMiddleware);

router.post('/assess', async (req, res) => {
  try {
    const {
      profile,
      riskScore,
      riskCategory,
      riskFactors,
      recommendations,
      aiExplanation,
      healthScore,
      exposureIndex,
      aqi,
      location,
      timestamp,
    } = req.body;

    if (!profile || riskScore == null || !riskCategory) {
      return res.status(400).json({ message: 'Invalid assessment payload' });
    }

    let explanation = aiExplanation || '';
    try {
      explanation = await generateHealthExplanation({
        riskScore,
        aqi,
        profile,
        pollutants: req.body.pollutants || {},
      });
    } catch (error) {
      console.warn('Health AI fallback used:', error.message);
    }

    const doc = await HealthAssessment.create({
      user: req.user._id,
      profile,
      riskScore,
      riskCategory: normalizeRiskCategory(riskCategory),
      riskFactors: riskFactors || [],
      recommendations: recommendations || [],
      aiExplanation: explanation,
      healthScore,
      exposureIndex,
      aqi,
      location: {
        city: location?.city || req.user.location?.city || '',
        area: location?.area || req.user.location?.area || '',
      },
      assessedAt: timestamp ? new Date(timestamp) : new Date(),
    });

    if (location?.city || location?.area) {
      req.user.location = {
        city: location.city || req.user.location?.city || '',
        area: location.area || req.user.location?.area || '',
      };
      await req.user.save();
    }

    return res.status(201).json({
      message: 'Assessment saved',
      assessment: doc,
    });
  } catch (error) {
    console.error('Save assessment error:', error);
    return res.status(500).json({ message: 'Failed to save assessment' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await HealthAssessment.find({ user: req.user._id })
      .sort({ assessedAt: -1 })
      .limit(50)
      .lean();

    return res.json({
      message: 'History fetched',
      history,
    });
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({ message: 'Failed to fetch history' });
  }
});

router.get('/history/:id', async (req, res) => {
  try {
    const assessment = await HealthAssessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean();

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    return res.json({ assessment });
  } catch (error) {
    console.error('History item error:', error);
    return res.status(500).json({ message: 'Failed to fetch assessment' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const history = await HealthAssessment.find({ user: req.user._id })
      .sort({ assessedAt: -1 })
      .limit(10)
      .lean();

    const reports = history.map((item, index) => ({
      id: item._id,
      title: index === 0 ? 'Latest Health Exposure Report' : 'Past Health Assessment Report',
      date: (item.assessedAt || item.createdAt)?.toISOString?.()?.slice(0, 10) || '',
      type: 'assessment',
      riskLevel: item.riskCategory,
      summary: item.aiExplanation || `Risk score ${item.riskScore} at AQI ${item.aqi}.`,
    }));

    return res.json(reports);
  } catch (error) {
    console.error('Reports error:', error);
    return res.status(500).json({ message: 'Failed to fetch reports' });
  }
});

router.get('/aqi-vs-risk', async (_req, res) => {
  return res.json([
    { aqi: 50, riskScore: 12, riskLevel: 'Low' },
    { aqi: 75, riskScore: 21, riskLevel: 'Low' },
    { aqi: 100, riskScore: 31, riskLevel: 'Moderate' },
    { aqi: 125, riskScore: 43, riskLevel: 'Moderate' },
    { aqi: 150, riskScore: 55, riskLevel: 'Moderate' },
    { aqi: 175, riskScore: 67, riskLevel: 'High' },
    { aqi: 200, riskScore: 79, riskLevel: 'High' },
    { aqi: 250, riskScore: 91, riskLevel: 'Very High' },
  ]);
});

module.exports = router;
