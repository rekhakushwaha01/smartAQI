import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLeaf } from 'react-icons/io5';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/air/select';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
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
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-500">
                Login to check air quality and run health assessments.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Logging in…' : 'Login'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New here?{' '}
              <Link to="/register" state={{ from }} className="font-semibold text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
