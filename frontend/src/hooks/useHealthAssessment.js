import { useState, useCallback } from 'react';
import { defaultAssessmentForm } from '../services/mockData';
import { saveHealthAssessment } from '../services/authService';
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
    const riskScore = calculateRiskScore(aqi, profile);
    let location = { city: '', area: '' };
    try {
      const savedLoc = localStorage.getItem('smartaqi_location');
      if (savedLoc) location = JSON.parse(savedLoc);
    } catch {
      /* ignore */
    }

    const assessment = {
      profile,
      riskScore,
      riskCategory: getRiskCategory(riskScore).label,
      riskFactors: getRiskFactors(aqi, profile, pollutants),
      recommendations: getRecommendations(riskScore, aqi, profile),
      aiExplanation: getAIExplanation(riskScore, aqi, profile),
      healthScore: getHealthScore(riskScore),
      exposureIndex: getExposureIndex(profile.outdoorHours, aqi, profile.maskUsage),
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
