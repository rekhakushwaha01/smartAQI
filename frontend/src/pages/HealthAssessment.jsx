import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FlowStepper from '../components/layout/FlowStepper';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { useHealthAssessment } from '../hooks/useHealthAssessment';
import { useAQI } from '../hooks/useAQI';
import { useLocation } from '../hooks/useLocalStorage';
import {
  ASSESSMENT_STEPS,
  MEDICAL_CONDITIONS,
  SYMPTOM_OPTIONS,
  OCCUPATION_OPTIONS,
  GENDER_OPTIONS,
} from '../utils/constants';
import { getBMICategory } from '../utils/aqiHelpers';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

function ProgressBar({ step }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {ASSESSMENT_STEPS.map((s) => (
          <div key={s.id} className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {s.id}
            </div>
            <p className={`mt-2 hidden text-xs font-medium md:block ${step >= s.id ? 'text-blue-600' : 'text-slate-400'}`}>
              {s.title}
            </p>
          </div>
        ))}
      </div>
      <div className="relative mt-4 h-1.5 rounded-full bg-slate-100">
        <motion.div
          className="absolute h-full rounded-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((step - 1) / 3) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

function ChipInput({ items, onAdd, onRemove, placeholder }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    if (!items.some((i) => i.toLowerCase() === value.toLowerCase())) onAdd(value);
    setDraft('');
  };

  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-slate-600">Not in the list? Type it here</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className={inputClass}
        />
        <Button type="button" onClick={add}>Add</Button>
      </div>
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {item}
              <button type="button" onClick={() => onRemove(item)} className="text-blue-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StepPersonal({ form, updateField, bmi }) {
  const bmiCat = getBMICategory(bmi);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-600">Full Name</label>
        <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your name" className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Age</label>
        <input type="number" min="1" max="120" value={form.age} onChange={(e) => updateField('age', e.target.value)} placeholder="25" className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Gender</label>
        <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)} className={inputClass}>
          <option value="">Select</option>
          {GENDER_OPTIONS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Height (cm)</label>
        <input type="number" value={form.height} onChange={(e) => updateField('height', e.target.value)} placeholder="170" className={inputClass} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Weight (kg)</label>
        <input type="number" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} placeholder="65" className={inputClass} />
      </div>
      {bmi > 0 && (
        <div className="md:col-span-2 rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-slate-600">
            BMI: <strong style={{ color: bmiCat.color }}>{bmi}</strong> — {bmiCat.label}
          </p>
        </div>
      )}
    </div>
  );
}

function StepMedical({ form, updateField }) {
  const setNone = (checked) => {
    const cleared = {};
    MEDICAL_CONDITIONS.forEach(({ name }) => { cleared[name] = false; });
    updateField('noMedicalHistory', checked);
    if (checked) {
      Object.entries(cleared).forEach(([k, v]) => updateField(k, v));
      updateField('customMedical', []);
    }
  };

  const toggleCondition = (name, checked) => {
    if (checked) updateField('noMedicalHistory', false);
    updateField(name, checked);
  };

  return (
    <div>
      <label className={`mb-3 flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 ${
        form.noMedicalHistory ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-200'
      }`}>
        <input type="checkbox" checked={form.noMedicalHistory} onChange={(e) => setNone(e.target.checked)} className="h-5 w-5 rounded accent-green-600" />
        <span className="font-medium text-slate-700">None — no medical history</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {MEDICAL_CONDITIONS.map(({ name, label }) => (
          <label key={name} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
            form[name] ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-200'
          }`}>
            <input type="checkbox" checked={form[name]} onChange={(e) => toggleCondition(name, e.target.checked)} className="h-5 w-5 rounded accent-blue-600" />
            <span className="font-medium text-slate-700">{label}</span>
          </label>
        ))}
      </div>

      <ChipInput
        items={form.customMedical || []}
        placeholder="e.g. Tuberculosis, Sinusitis"
        onAdd={(item) => {
          updateField('noMedicalHistory', false);
          updateField('customMedical', [...(form.customMedical || []), item]);
        }}
        onRemove={(item) => updateField('customMedical', (form.customMedical || []).filter((i) => i !== item))}
      />
    </div>
  );
}

function StepLifestyle({ form, updateField }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Smoking</label>
        <select value={form.smoking} onChange={(e) => updateField('smoking', e.target.value)} className={inputClass}>
          <option value="never">Never</option>
          <option value="occasional">Occasional</option>
          <option value="regular">Regular</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Occupation</label>
        <select value={form.occupation} onChange={(e) => updateField('occupation', e.target.value)} className={inputClass}>
          <option value="">Select</option>
          {OCCUPATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {form.occupation === 'Other' && (
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">Type your occupation</label>
          <input value={form.occupationOther || ''} onChange={(e) => updateField('occupationOther', e.target.value)} placeholder="Your occupation" className={inputClass} />
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Outdoor Hours / Day: {form.outdoorHours}h</label>
        <input type="range" min="0" max="12" value={form.outdoorHours} onChange={(e) => updateField('outdoorHours', Number(e.target.value))} className="w-full accent-blue-600" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Exercise Frequency</label>
        <select value={form.exerciseFrequency} onChange={(e) => updateField('exerciseFrequency', e.target.value)} className={inputClass}>
          <option value="none">None</option>
          <option value="moderate">Moderate (2-3x/week)</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-600">Mask Usage</label>
        <div className="flex gap-3">
          {['never', 'sometimes', 'always'].map((v) => (
            <button key={v} type="button" onClick={() => updateField('maskUsage', v)}
              className={`flex-1 rounded-2xl py-3 text-sm font-medium capitalize transition-all ${
                form.maskUsage === v ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepSymptoms({ form, updateField }) {
  const setNone = (checked) => {
    SYMPTOM_OPTIONS.forEach(({ name }) => updateField(name, false));
    updateField('noSymptoms', checked);
    if (checked) updateField('customSymptoms', []);
  };

  const toggleSymptom = (name, checked) => {
    if (checked) updateField('noSymptoms', false);
    updateField(name, checked);
  };

  return (
    <div>
      <label className={`mb-3 flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 ${
        form.noSymptoms ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-200'
      }`}>
        <input type="checkbox" checked={form.noSymptoms} onChange={(e) => setNone(e.target.checked)} className="h-5 w-5 rounded accent-green-600" />
        <span className="font-medium text-slate-700">None — no current symptoms</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {SYMPTOM_OPTIONS.map(({ name, label }) => (
          <label key={name} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
            form[name] ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-red-200'
          }`}>
            <input type="checkbox" checked={form[name]} onChange={(e) => toggleSymptom(name, e.target.checked)} className="h-5 w-5 rounded accent-red-500" />
            <span className="font-medium text-slate-700">{label}</span>
          </label>
        ))}
      </div>

      <ChipInput
        items={form.customSymptoms || []}
        placeholder="e.g. Headache, Sore throat"
        onAdd={(item) => {
          updateField('noSymptoms', false);
          updateField('customSymptoms', [...(form.customSymptoms || []), item]);
        }}
        onRemove={(item) => updateField('customSymptoms', (form.customSymptoms || []).filter((i) => i !== item))}
      />
    </div>
  );
}

export default function HealthAssessment() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { data } = useAQI(location.city, location.area);
  const { step, form, updateField, bmi, nextStep, prevStep, submit, saving } = useHealthAssessment(
    data?.aqi ?? 156,
    data ?? {}
  );

  const handleSubmit = async () => {
    await submit();
    navigate('/results');
  };

  const stepComponents = {
    1: <StepPersonal form={form} updateField={updateField} bmi={bmi} />,
    2: <StepMedical form={form} updateField={updateField} />,
    3: <StepLifestyle form={form} updateField={updateField} />,
    4: <StepSymptoms form={form} updateField={updateField} />,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <FlowStepper current={4} />
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-slate-900">Health Assessment</h1>
          <p className="mt-1 mb-8 text-slate-500">Tell us about yourself so we can match risk to your area&apos;s air quality.</p>

          <GlassCard className="mx-auto max-w-3xl">
            <ProgressBar step={step} />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-6 text-xl font-bold text-slate-800">{ASSESSMENT_STEPS[step - 1].title}</h2>
                {stepComponents[step]}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={prevStep} disabled={step === 1}>Back</Button>
              {step < 4 ? (
                <Button onClick={nextStep}>Continue</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Saving…' : 'See Combined Report'}
                </Button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
