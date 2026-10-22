import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLeaf } from 'react-icons/io5';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { MAHARASHTRA_CITIES } from '../utils/constants';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/air/select';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: 'mumbai',
    area: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        location: { city: form.city, area: form.area },
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gradient-hero min-h-screen">
      <Navbar transparent />
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <GlassCard className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <IoLeaf className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
              <p className="mt-2 text-sm text-slate-500">
                Save your profile and health history in one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className={inputClass}
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">City</label>
                <select
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(MAHARASHTRA_CITIES).map(([key, city]) => (
                    <option key={key} value={key}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Area (optional)</label>
                <input
                  value={form.area}
                  onChange={(e) => update('area', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Andheri"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Register'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already registered?{' '}
              <Link to="/login" state={{ from }} className="font-semibold text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
