export function getRiskLevel(score) {
  if (score <= 30) return { label: 'Low', color: '#22C55E', advice: 'Stay active outdoors with basic precautions.' };
  if (score <= 60) return { label: 'Moderate', color: '#F59E0B', advice: 'Limit long outdoor exposure; monitor symptoms.' };
  if (score <= 80) return { label: 'High', color: '#F97316', advice: 'Avoid outdoor exertion; use N95 and indoor air purifiers.' };
  return { label: 'Severe', color: '#EF4444', advice: 'Stay indoors if possible and consult a doctor promptly.' };
}

export function calculateRiskScore(aqi, profile) {
  if (profile.noMedicalHistory && profile.noSymptoms && profile.smoking === 'never') {
    /* still apply air + lifestyle */
  }

  let score = Math.min(70, Math.round((aqi / 300) * 50));

  if (!profile.noMedicalHistory) {
    if (profile.asthma) score += 12;
    if (profile.copd) score += 14;
    if (profile.lungDisease) score += 12;
    if (profile.heartDisease) score += 10;
    if (profile.allergies) score += 5;
    if (profile.customMedical?.length) score += Math.min(12, profile.customMedical.length * 4);
  }

  if (profile.smoking === 'regular') score += 15;
  if (profile.smoking === 'occasional') score += 8;
  if (profile.outdoorHours >= 6) score += 10;
  else if (profile.outdoorHours >= 3) score += 5;
  if (profile.exerciseFrequency === 'daily') score += 4;
  if (profile.maskUsage === 'never') score += 8;
  if (profile.maskUsage === 'sometimes') score += 4;
  if (profile.age >= 65) score += 8;
  if (profile.age <= 12) score += 8;

  if (!profile.noSymptoms) {
    if (profile.cough) score += 5;
    if (profile.breathingDifficulty) score += 10;
    if (profile.chestTightness) score += 8;
    if (profile.eyeIrritation) score += 3;
    if (profile.customSymptoms?.length) score += Math.min(10, profile.customSymptoms.length * 3);
  }

  return Math.min(100, Math.max(0, score));
}

export function getRiskCategory(score) {
  return getRiskLevel(score);
}

export function getRiskFactors(aqi, profile, pollutants) {
  const factors = [];
  if (pollutants?.pm25 > 35) factors.push({ label: 'High PM2.5', severity: 'high' });
  if (pollutants?.pm10 > 50) factors.push({ label: 'Elevated PM10', severity: 'medium' });
  if (pollutants?.no2 > 53) factors.push({ label: 'High NO₂', severity: 'medium' });
  if (pollutants?.o3 > 70) factors.push({ label: 'High Ozone', severity: 'medium' });
  if (!profile.noMedicalHistory) {
    if (profile.asthma) factors.push({ label: 'Asthma', severity: 'high' });
    if (profile.copd) factors.push({ label: 'COPD', severity: 'high' });
    if (profile.heartDisease) factors.push({ label: 'Heart Disease', severity: 'medium' });
    (profile.customMedical || []).forEach((c) => factors.push({ label: c, severity: 'medium' }));
  }
  if (profile.smoking !== 'never') factors.push({ label: 'Smoking', severity: 'high' });
  if (profile.outdoorHours >= 4) factors.push({ label: 'Outdoor Exposure', severity: 'medium' });
  if (aqi > 150) factors.push({ label: 'Poor Air Quality', severity: 'high' });
  if (!profile.noSymptoms) {
    if (profile.breathingDifficulty) factors.push({ label: 'Breathing Difficulty', severity: 'high' });
    (profile.customSymptoms || []).forEach((s) => factors.push({ label: s, severity: 'medium' }));
  }
  if (!factors.length) factors.push({ label: 'No major personal risk factors', severity: 'low' });
  return factors;
}

export function getRecommendations(score, aqi, profile) {
  const recs = [];

  if (aqi > 100 || score > 40) {
    recs.push({ icon: '😷', title: 'Wear N95 Mask', desc: 'Use N95/KN95 masks when stepping outdoors.' });
  }
  if (aqi > 150 || profile.outdoorHours >= 4) {
    recs.push({ icon: '🏠', title: 'Reduce Outdoor Activities', desc: 'Limit strenuous outdoor exercise during peak pollution hours.' });
  }
  recs.push({ icon: '💧', title: 'Stay Hydrated', desc: 'Drink plenty of water to help your respiratory system.' });
  if (aqi > 100) {
    recs.push({ icon: '🌬️', title: 'Air Purifier Recommended', desc: 'Use HEPA air purifiers indoors, especially in bedrooms.' });
  }
  if (profile.breathingDifficulty || profile.chestTightness || score > 70 || profile.customSymptoms?.length) {
    recs.push({ icon: '🏥', title: 'Consult Doctor', desc: 'Seek medical advice if symptoms increase or persist.' });
  }
  if (aqi <= 50 && score <= 30) {
    recs.push({ icon: '✅', title: 'Safe to Exercise Outdoors', desc: 'Air 