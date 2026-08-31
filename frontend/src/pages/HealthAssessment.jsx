import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import { useHealthAssessment } from '../hooks/useHealthAssessment';
import { useAQI } from '../hooks/useAQI';
import { useLocation } from '../hooks/useLocalStorage';
import { ASSESSMENT_STEPS } from '../utils/constants';
import { getBMICategory } from '../utils/aqiHelpers';

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

function StepPersonal({ form, updateField, bmi }) {
  const bmiCat = getBMICategory(bmi);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[
        { name: 'age', label: 'Age', type: 'number', placeholder: '25' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'height', label: 'Height (cm)', type: 'number', placeholder: '170' },
        { name: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '65' },
      ].map((field) => (
        <div key={field.name}>
          <label className="mb-2 block text-sm font-medium text-slate-600">{field.label}</label>
          {field.type === 'select' ? (
            <select
              value={form[field.name]}
              onChange={(e) => updateField(field.name, e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select</option>
              {field.options.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
            </select>
          ) : (
            <input
              type={field.type}
              value={form[field.name]}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          )}
        </div>
      ))}
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
  const conditions = [
    { name: 'asthma', label: 'Asthma' },
    { name: 'copd', label: 'COPD' },
    { name: 'lungDisease', label: 'Lung Disease' },
    { name: 'heartDisease', label: 'Heart Disease' },
    { name: 'allergies', label: 'Allergies' },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {conditions.map(({ name, label }) => (
        <label
          key={name}
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
            form[name] ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-200'
          }`}
        >
          <input
            type="checkbox"
            checked={form[name]}
            onChange={(e) => updateField(name, e.target.checked)}
            className="h-5 w-5 rounded accent-blue-600"
          />
          <span className="font-medium text-slate-700">{label}</span>
        </label>
      ))}
    </div>
  );
}

function StepLifestyle({ form, updateField }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Smoking</label>
        <select value={form.smoking} onChange={(e) => updateField('smoking', e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none">
          <option value="never">Never</option>
          <option value="occasional">Occasional</option>
          <option value="regular">Regular</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Occupation</label>
        <input value={form.occupation} onChange={(e) => updateField('occupation', e.target.value)}
          placeholder="e.g. Office Worker, Construction"
          className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Outdoor Hours / Day: {form.outdoorHours}h
        </label>
        <input type="range" min="0" max="12" value={form.outdoorHours}
          onChange={(e) => updateField('outdoorHours', Number(e.target.value))}
          className="w-full accent-blue-600" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Exercise Frequency</label>
        <select value={form.exerciseFrequency} onChange={(e) => updateField('exerciseFrequency', e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none">
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
  const symptoms = [
    { name: 'cough', label: 'Cough' },
    { name: 'breathingDifficulty', label: 'Breathing Difficulty' },
    { name: 'chestTightness', label: 'Chest Tightness' },
    { name: 'eyeIrritation', label: 'Eye Irritation' },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {symptoms.map(({ name, label }) => (
        <label key={name}
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
            form[name] ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-red-200'
          }`}>
          <input type="checkbox" checked={form[name]} onChange={(e) => updateField(name, e.target.checked)}
            className="h-5 w-5 rounded accent-red-500" />
          <span className="font-medium text-slate-700">{label}</span>
        </label>
      ))}
    </div>
  );
}

export default function HealthAssessment() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { data } = useAQI(location.city, location.area);
  const { step, form, updateField, bmi, nextStep, prevStep, submit } = useHealthAssessment(
    data?.aqi ?? 156,
    data ?? {}
  );

  const handleSubmit = () => {
    submit();
    navigate('/health-dashboard');
  };

  const stepComponents = {
    1: <StepPersonal form={form} updateField={updateField} bmi={bmi} />,
    2: <StepMedical form={form} updateField={updateField} />,
    3: <StepLifestyle form={form} updateField={updateField} />,
    4: <StepSymptoms form={form} updateField={updateField} />,
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900">Health Assessment</h1>
        <p className="mt-1 mb-8 text-slate-500">Multi-step respiratory health risk evaluation</p>

        <GlassCard className="max-w-3xl mx-auto">
          <ProgressBar step={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="mb-6 text-xl font-bold text-slate-800">
                {ASSESSMENT_STEPS[step - 1].title}
              </h2>
              {stepComponents[step]}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={step === 1}>Back</Button>
            {step < 4 ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit Assessment</Button>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  );
}
