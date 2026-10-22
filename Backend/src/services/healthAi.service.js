const { googleApiKey, healthApiKey, geminiApiKey } = require('../config/env');

function looksLikeGoogleAiKey(key) {
  return typeof key === 'string' && key.startsWith('AIza');
}

function localExplanation({ riskScore, aqi, profile }) {
  const conditions = [];
  if (!profile?.noMedicalHistory) {
    if (profile?.asthma) conditions.push('asthma');
    if (profile?.copd) conditions.push('COPD');
    if (profile?.lungDisease) conditions.push('lung disease');
    (profile?.customMedical || []).forEach((c) => conditions.push(String(c).toLowerCase()));
  }
  if (profile?.smoking && profile.smoking !== 'never') conditions.push('smoking history');

  let text = `Based on the current AQI of ${aqi} and your health profile, your respiratory health risk is ${riskScore}%. `;
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

function geminiKeys() {
  return [geminiApiKey, googleApiKey, healthApiKey].filter(looksLikeGoogleAiKey);
}

async function generateWithGemini(prompt, apiKey) {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
  let lastError;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 280 },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      lastError = data.error?.message || `Gemini ${res.status}`;
      continue;
    }

    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join(' ').trim();
    if (text) return text;
    lastError = 'Empty Gemini response';
  }

  throw new Error(lastError || 'Gemini request failed');
}

async function generateHealthExplanation({ riskScore, aqi, profile, pollutants = {} }) {
  const fallback = localExplanation({ riskScore, aqi, profile });
  const prompt = [
    'You are a public-health assistant for an India AQI app.',
    'Write 2-3 short sentences in plain English for a patient.',
    'Do not give a diagnosis or prescribe medicines.',
    `AQI: ${aqi}. Risk score: ${riskScore}%.`,
    `Age: ${profile?.age ?? 'unknown'}. Occupation: ${profile?.occupation || 'unknown'}.`,
    `Outdoor hours: ${profile?.outdoorHours ?? 'unknown'}. Mask: ${profile?.maskUsage || 'unknown'}.`,
    `Asthma: ${Boolean(profile?.asthma)}. COPD: ${Boolean(profile?.copd)}. Heart disease: ${Boolean(profile?.heartDisease)}.`,
    `Symptoms: cough=${Boolean(profile?.cough)}, breathing difficulty=${Boolean(profile?.breathingDifficulty)}.`,
    `Pollutants: PM2.5=${pollutants.pm25 ?? 'n/a'}, PM10=${pollutants.pm10 ?? 'n/a'}, NO2=${pollutants.no2 ?? 'n/a'}.`,
  ].join(' ');

  for (const key of geminiKeys()) {
    try {
      const text = await generateWithGemini(prompt, key);
      if (text) return text;
    } catch (error) {
      console.warn('Health AI key failed:', error.message);
    }
  }

  return fallback;
}

module.exports = {
  generateHealthExplanation,
  localExplanation,
};
