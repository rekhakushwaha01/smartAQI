import { useState, useCallback } from 'react';
import { defaultAssessmentForm } from '../services/mockData';
import { saveHealthAssessment } from '../services/authService';
import { healthService } from '../services/api';
import { calculateBMI } from '../utils/aqiHelpers';
import {
  calculateRiskScore,
  getRiskCategory,
  getRiskFactors,
  getRecommendations,
  getAIExplanation,
  getHealthScore,
  getExposureIndex,
} from '../utils/riskCalculator';

function localPrediction(aqi, profile, pollutants) {
  const riskScore = calculateRiskScore(aqi, profile);
  return {
    modelSource: 'demo-local',
    riskScore,
    riskCategory: getRiskCategory(riskScore),
    riskFactors: getRiskFactors(aqi, profile, pollutants),
    recommendations: getRecommendations(riskScore, aqi, profile),
    aiExplanation: getAIExplanation(riskScore, aqi, profile),
    healthScore: getHealthScore(riskScore),
    exposureIndex: getExposureIndex(profile.outdoorHours, aqi, profile.maskUsage),
  };
}

export function useHealthAssessment(aqi = 156, pollutants = {}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultAssessmentForm);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const bmi = calculateBMI(Number(form.height), Number(form.weight));

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submit = useCallback(async () => {
    const occupation = form.occupation === 'Other' ? (form.occupationOther || 'Other') : form.occupation;
    const profile = { ...form, age: Number(form.age), bmi, occupation };
    let location = { city: '', area: '' };
    try {
      const savedLoc = localStorage.getItem('smartaqi_location');
      if (savedLoc) location = JSON.parse(savedLoc);
    } catch {
      /* ignore */
    }

    let prediction = null;
    try {
      prediction = await healthService.predictRisk({ aqi, profile, pollutants });
    } catch {
      prediction = null;
    }
    if (!prediction?.riskScore && prediction?.riskScore !== 0) {
      prediction = localPrediction(aqi, profile, pollutants);
    }

    const riskCategory =
      prediction.riskCategory && typeof prediction.riskCategory === 'object'
        ? prediction.riskCategory
        : getRiskCategory(prediction.riskScore);

    const assessment = {
      profile,
      riskScore: prediction.riskScore,
      riskCategory,
      riskFactors: prediction.riskFactors || getRiskFactors(aqi, profile, pollutants),
      recommendations: prediction.recommendations || getRecommendations(prediction.riskScore, aqi, profile),
      aiExplanation: prediction.aiExplanation || getAIExplanation(prediction.riskScore, aqi, profile),
      healthScore: prediction.healthScore ?? getHealthScore(prediction.riskScore),
      exposureIndex:
        prediction.exposureIndex ?? getExposureIndex(profile.outdoorHours, aqi, profile.maskUsage),
      aqi,
      location,
      timestamp: new Date().toISOString(),
    };
    setResult(assessment);
    localStorage.setItem('smartaqi_assessment', JSON.stringify(assessment));

    setSaving(true);
    try {
      const saved = await saveHealthAssessment(assessment);
      if (saved?.assessment?.aiExplanation) {
        assessment.aiExplanation = saved.assessment.aiExplanation;
        setResult({ ...assessment });
        localStorage.setItem('smartaqi_assessment', JSON.stringify(assessment));
      }
    } catch (err) {
      console.error('Failed to save assessment to MongoDB:', err);
    } finally {
      setSaving(false);
    }

    return assessment;
  }, [form, aqi, pollutants, bmi]);

  const loadSaved = useCallback(() => {
    const saved = localStorage.getItem('smartaqi_assessment');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResult(parsed);
      return parsed;
    }
    return null;
  }, []);

  return {
    step,
    setStep,
    form,
    updateField,
    bmi,
    nextStep,
    prevStep,
    submit,
    saving,
    result,
    loadSaved,
  };
}
