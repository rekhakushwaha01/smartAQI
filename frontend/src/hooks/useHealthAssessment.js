import { useState, useCallback } from 'react';
import { defaultAssessmentForm } from '../services/mockData';
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

  const updateField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const bmi = calculateBMI(Number(form.height), Number(form.weight));

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submit = useCallback(() => {
    const profile = { ...form, age: Number(form.age), bmi };
    const riskScore = calculateRiskScore(aqi, profile);
    const assessment = {
      profile,
      riskScore,
      riskCategory: getRiskCategory(riskScore),
      riskFactors: getRiskFactors(aqi, profile, pollutants),
      recommendations: getRecommendations(riskScore, aqi, profile),
      aiExplanation: getAIExplanation(riskScore, aqi, profile),
      healthScore: getHealthScore(riskScore),
      exposureIndex: getExposureIndex(profile.outdoorHours, aqi, profile.maskUsage),
      aqi,
      timestamp: new Date().toISOString(),
    };
    setResult(assessment);
    localStorage.setItem('smartaqi_assessment', JSON.stringify(assessment));
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
    result,
    loadSaved,
  };
}
