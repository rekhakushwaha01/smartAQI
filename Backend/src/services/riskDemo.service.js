function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function getRiskLevel(score) {
  if (score <= 30) return { label: 'Low', color: '#22C55E', advice: 'Stay active outdoors with basic precautions.' };
  if (score <= 60) return { label: 'Moderate', color: '#F59E0B', advice: 'Limit long outdoor exposure; monitor symptoms.' };
  if (score <= 80) return { label: 'High', color: '#F97316', advice: 'Avoid outdoor exertion; use N95 and indoor air purifiers.' };
  return { label: 'Severe', color: '#EF4444', advice: 'Stay indoors if possible and consult a doctor promptly.' };
}

function calculateRiskScore(aqi, profile = {}) {
  let score = Math.min(70, Math.round((num(aqi) / 300) * 50));

  if (!profile.noMedicalHistory) {
    if (profile.asthma) score += 12;
    if (profile.copd) score += 14;
    if (profile.lungDisease) score += 12;
    if (profile.heartDisease) score += 10;
    if (profile.allergies) score += 5;
    if (asList(profile.customMedical).length) score += Math.min(12, asList(profile.customMedical).length * 4);
  }

  if (profile.smoking === 'regular') score += 15;
  if (profile.smoking === 'occasional') score += 8;
  if (num(profile.outdoorHours) >= 6) score += 10;
  else if (num(profile.outdoorHours) >= 3) score += 5;
  if (profile.exerciseFrequency === 'daily') score += 4;
  if (profile.maskUsage === 'never') score += 8;
  if (profile.maskUsage === 'sometimes') score += 4;
  if (num(profile.age, 30) >= 65) score += 8;
  if (num(profile.age, 30) <= 12) score += 8;

  if (!profile.noSymptoms) {
    if (profile.cough) score += 5;
    if (profile.breathingDifficulty) score += 10;
    if (profile.chestTightness) score += 8;
    if (profile.eyeIrritation) score += 3;
    if (asList(profile.customSymptoms).length) score += Math.min(10, asList(profile.customSymptoms).length * 3);
  }

  return Math.min(100, Math.max(0, score));
}

function getRiskFactors(aqi, profile = {}, pollutants = {}) {
  const factors = [];
  if (num(pollutants.pm25) > 35) factors.push({ label: 'High PM2.5', severity: 'high', modifiable: false });
  if (num(pollutants.pm10) > 50) factors.push({ label: 'Elevated PM10', severity: 'medium', modifiable: false });
  if (num(pollutants.no2) > 53) factors.push({ label: 'High NO₂', severity: 'medium', modifiable: false });
  if (num(pollutants.o3) > 70) factors.push({ label: 'High Ozone', severity: 'medium', modifiable: false });
  if (!profile.noMedicalHistory) {
    if (profile.asthma) factors.push({ label: 'Asthma', severity: 'high', modifiable: false });
    if (profile.copd) factors.push({ label: 'COPD', severity: 'high', modifiable: false });
    if (profile.heartDisease) factors.push({ label: 'Heart Disease', severity: 'medium', modifiable: false });
    asList(profile.customMedical).forEach((c) => factors.push({ label: String(c), severity: 'medium', modifiable: false }));
  }
  if (profile.smoking && profile.smoking !== 'never') factors.push({ label: 'Smoking', severity: 'high', modifiable: true });
  if (num(profile.outdoorHours) >= 4) factors.push({ label: 'Outdoor Exposure', severity: 'medium', modifiable: true });
  if (num(aqi) > 150) factors.push({ label: 'Poor Air Quality', severity: 'high', modifiable: false });
  if (!profile.noSymptoms) {
    if (profile.breathingDifficulty) factors.push({ label: 'Breathing Difficulty', severity: 'high', modifiable: false });
    asList(profile.customSymptoms).forEach((s) => factors.push({ label: String(s), severity: 'medium', modifiable: false }));
  }
  if (!factors.length) {
    factors.push({ label: 'No major personal risk factors', severity: 'low', impactPct: 0, modifiable: false });
  }
  return factors;
}

function getRecommendations(score, aqi, profile = {}) {
  const recs = [];
  const aqiN = num(aqi);
  if (aqiN > 100 || score > 40) {
    recs.push({ icon: '😷', title: 'Wear N95 Mask', desc: 'Use N95/KN95 masks when stepping outdoors.' });
  }
  if (aqiN > 150 || num(profile.outdoorHours) >= 4) {
    recs.push({ icon: '🏠', title: 'Reduce Outdoor Activities', desc: 'Limit strenuous outdoor exercise during peak pollution hours.' });
  }
  recs.push({ icon: '💧', title: 'Stay Hydrated', desc: 'Drink plenty of water to help your respiratory system.' });
  if (aqiN > 100) {
    recs.push({ icon: '🌬️', title: 'Air Purifier Recommended', desc: 'Use HEPA air purifiers indoors, especially in bedrooms.' });
  }
  if (profile.breathingDifficulty || profile.chestTightness || score > 70 || asList(profile.customSymptoms).length) {
    recs.push({ icon: '🏥', title: 'Consult Doctor', desc: 'Seek medical advice if symptoms increase or persist.' });
  }
  if (aqiN <= 50 && score <= 30) {
    recs.push({ icon: '✅', title: 'Safe to Exercise Outdoors', desc: 'Air quality is good — enjoy outdoor activities safely.' });
  }
  return recs;
}

function getAIExplanation(score, aqi, profile = {}) {
  const category = getRiskLevel(score);
  const conditions = [];
  if (!profile.noMedicalHistory) {
    if (profile.asthma) conditions.push('asthma');
    if (profile.copd) conditions.push('COPD');
    if (profile.lungDisease) conditions.push('lung disease');
    asList(profile.customMedical).forEach((c) => conditions.push(String(c).toLowerCase()));
  }
  if (profile.smoking && profile.smoking !== 'never') conditions.push('smoking history');

  let text = `Based on the current AQI of ${Math.round(num(aqi))} and your health profile, your respiratory health risk is ${category.label.toLowerCase()} (${score}%). `;
  if (conditions.length) {
    text += `Key contributing factors include ${conditions.join(', ')} combined with local air pollution levels. `;
  }
  if (num(aqi) > 150) {
    text += 'PM2.5 and PM10 levels are elevated, which can penetrate deep into the lungs and aggravate respiratory conditions.';
  } else if (num(aqi) > 100) {
    text += 'Moderate pollution levels may cause discomfort for sensitive individuals during prolonged outdoor exposure.';
  } else {
    text += 'Current air conditions are relatively favorable for most outdoor activities.';
  }
  return text;
}

function getHealthScore(riskScore) {
  return Math.max(0, 100 - riskScore);
}

function getExposureIndex(outdoorHours, aqi, maskUsage) {
  let index = Math.round((num(outdoorHours) / 8) * 40 + (num(aqi) / 300) * 60);
  if (maskUsage === 'always') index = Math.round(index * 0.6);
  else if (maskUsage === 'sometimes') index = Math.round(index * 0.8);
  return Math.min(100, index);
}

function buildPrediction(aqi, profile = {}, pollutants = {}) {
  const riskScore = calculateRiskScore(aqi, profile);
  return {
    modelSource: 'demo',
    riskProbability: Number((riskScore / 100).toFixed(4)),
    riskScore,
    riskCategory: getRiskLevel(riskScore),
    healthScore: getHealthScore(riskScore),
    exposureIndex: getExposureIndex(profile.outdoorHours, aqi, profile.maskUsage),
    riskFactors: getRiskFactors(aqi, profile, pollutants),
    recommendations: getRecommendations(riskScore, aqi, profile),
    aiExplanation: getAIExplanation(riskScore, aqi, profile),
    overrides: [],
    modelInfo: { source: 'demo', logic: 'frontend/src/utils/riskCalculator.js' },
  };
}

module.exports = { buildPrediction, getRiskLevel };
