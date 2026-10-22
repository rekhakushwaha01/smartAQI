export function getRiskLevel(score) {
  if (score <= 30) return { label: 'Low', color: '#22C55E', advice: 'Stay active outdoors with basic precautions.' };
  if (score <= 60) return { label: 'Moderate', color: '#F59E0B', advice: 'Limit long outdoor exposure; monitor symptoms.' };
  if (score <= 80) return { label: 'High', color: '#F97316', advice: 'Avoid outdoor exertion; use N95 and indoor air purifiers.' };
  return { label: 'Severe', color: '#EF4444', advice: 'Stay indoors if possible and consult a doctor promptly.' };
}

export function calculateRiskScore(aqi, profile) {
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
    recs.push({ icon: '✅', title: 'Safe to Exercise Outdoors', desc: 'Air quality is good — enjoy outdoor activities safely.' });
  }

  return recs;
}

export function getAIExplanation(score, aqi, profile) {
  const category = getRiskCategory(score);
  const conditions = [];
  if (!profile.noMedicalHistory) {
    if (profile.asthma) conditions.push('asthma');
    if (profile.copd) conditions.push('COPD');
    if (profile.lungDisease) conditions.push('lung disease');
    (profile.customMedical || []).forEach((c) => conditions.push(c.toLowerCase()));
  }
  if (profile.smoking !== 'never') conditions.push('smoking history');

  let text = `Based on the current AQI of ${aqi} and your health profile, your respiratory health risk is ${category.label.toLowerCase()} (${score}%). `;
  if (conditions.length) {
    text += `Key contributing factors include ${conditions.join(', ')} combined with local air pollution levels. `;
  }
  if (aqi > 150) {
    text += 'PM2.5 and PM10 levels are elevated, which can penetrate deep into the lungs and aggravate respiratory conditions.';
  } else if (aqi > 100) {
    text += 'Moderate pollution levels may cause discomfort for sensitive individuals during prolonged outdoor exposure.';
  } else {
    text += 'Current air conditions are relatively favorable for most outdoor activities.';
  }
  return text;
}

export function getHealthScore(riskScore) {
  return Math.max(0, 100 - riskScore);
}

export function getExposureIndex(outdoorHours, aqi, maskUsage) {
  let index = Math.round((outdoorHours / 8) * 40 + (aqi / 300) * 60);
  if (maskUsage === 'always') index = Math.round(index * 0.6);
  else if (maskUsage === 'sometimes') index = Math.round(index * 0.8);
  return Math.min(100, index);
}

export function getAirBodyImpact(aqi, pollutants = {}) {
  const items = [];
  if (aqi > 150) {
    items.push({ organ: 'Lungs', text: 'Fine particles can inflame airways, reduce lung function, and trigger wheezing or cough.' });
    items.push({ organ: 'Heart', text: 'Poor air quality raises strain on the heart and can worsen chest tightness in sensitive people.' });
  } else if (aqi > 100) {
    items.push({ organ: 'Lungs', text: 'Sensitive groups may feel shortness of breath or throat irritation during outdoor activity.' });
    items.push({ organ: 'Eyes & Nose', text: 'Irritation, watering eyes, and nasal congestion are common at this AQI.' });
  } else {
    items.push({ organ: 'Lungs', text: 'Air is generally safe. Outdoor breathing and exercise are low-risk for most people.' });
    items.push({ organ: 'Heart', text: 'Cardiovascular stress from pollution is expected to remain low.' });
  }

  if (pollutants.pm25 > 35) {
    items.push({ organ: 'PM2.5', text: 'PM2.5 is above the good range. These particles reach deep into the lungs and bloodstream.' });
  }
  if (pollutants.no2 > 53) {
    items.push({ organ: 'NO₂', text: 'Nitrogen dioxide can irritate airways and increase asthma attacks, especially in children.' });
  }
  if (pollutants.o3 > 70) {
    items.push({ organ: 'Ozone', text: 'High ozone can cause chest pain, coughing, and reduced lung capacity after outdoor exercise.' });
  }
  if (pollutants.so2 > 40) {
    items.push({ organ: 'SO₂', text: 'Sulphur dioxide may cause throat irritation and breathing difficulty in people with asthma.' });
  }
  if (pollutants.co > 4.4) {
    items.push({ organ: 'CO', text: 'Carbon monoxide reduces oxygen delivery in blood and can cause headache or fatigue.' });
  }

  return items;
}

export function getHealthBodyImpact(profile, aqi) {
  const items = [];

  if (profile.noMedicalHistory && profile.noSymptoms) {
    items.push({ organ: 'Overall', text: 'No reported medical history or symptoms. Risk is driven mainly by local air quality and lifestyle.' });
  }

  if (profile.asthma || profile.copd || profile.lungDisease) {
    items.push({ organ: 'Respiratory', text: 'Existing lung conditions make you more sensitive to PM2.5, ozone, and NO₂ in this area.' });
  }
  if (profile.heartDisease) {
    items.push({ organ: 'Cardiovascular', text: 'Heart disease plus polluted air can increase chest discomfort during outdoor work or exercise.' });
  }
  if (profile.allergies) {
    items.push({ organ: 'Allergies', text: 'Allergies can worsen with dust, pollen, and polluted air — eye and nose irritation is more likely.' });
  }
  if (profile.customMedical?.length) {
    items.push({ organ: 'Other conditions', text: `You reported: ${profile.customMedical.join(', ')}. These may increase pollution sensitivity.` });
  }
  if (profile.smoking !== 'never') {
    items.push({ organ: 'Lifestyle', text: 'Smoking plus polluted air multiplies lung damage. Reducing exposure is especially important.' });
  }
  if (profile.breathingDifficulty || profile.chestTightness) {
    items.push({ organ: 'Symptoms', text: 'Current breathing or chest symptoms with this AQI need extra caution and possible medical review.' });
  }
  if (profile.customSymptoms?.length) {
    items.push({ organ: 'Reported symptoms', text: `Additional symptoms: ${profile.customSymptoms.join(', ')}.` });
  }
  if (profile.age >= 65 || profile.age <= 12) {
    items.push({ organ: 'Age', text: 'Children and older adults absorb more pollution per body weight and should limit outdoor hours when AQI is high.' });
  }
  if (aqi > 100 && profile.outdoorHours >= 4) {
    items.push({ organ: 'Exposure', text: 'Long outdoor hours in this air quality raise daily inhaled pollutant load.' });
  }
  if (!items.length) {
    items.push({ organ: 'Overall', text: 'Your profile is relatively resilient. Keep monitoring AQI and symptoms.' });
  }
  return items;
}
