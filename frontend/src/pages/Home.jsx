import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowForward, IoLeaf, IoCloud, IoHeart, IoAnalytics } from 'react-icons/io5';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import GlassCard from '../components/common/GlassCard';

const steps = [
  { icon: IoCloud, title: 'Select City & Area', desc: 'Choose a polluted Maharashtra city on map or dropdown' },
  { icon: IoAnalytics, title: 'Air Quality Dashboard', desc: 'View AQI, gases, temperature, humidity from live API' },
  { icon: IoHeart, title: 'Health Assessment', desc: 'Enter personal info, lifestyle & medical history' },
  { icon: IoLeaf, title: 'Combined Report', desc: 'Air + health results side-by-side with doctor recommendations' },
];

export default function Home() {
  return (
    <div className="gradient-hero relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <Navbar transparent />

      <section className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col items-center justify-center px-4 pt-28 pb-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-semibold text-blue-600 backdrop-blur-xl">
            Final Year Project · Maharashtra Focus
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
            Smart<span className="text-gradient">AQI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
            Urban Air Quality Based Respiratory Health Risk Prediction System
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Monitor air pollution in Maharashtra&apos;s most polluted cities, assess your health risk, and get personalized recommendations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Link to="/air/select">
            <Button size="lg" icon={IoArrowForward}>
              Get Started — Select Your City
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <GlassCard key={step.title} className="p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-bold">
                {i + 1}
              </div>
              <step.icon className="mx-auto mb-2 text-2xl text-blue-500" />
              <h3 className="font-bold text-slate-800">{step.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{step.desc}</p>
            </GlassCard>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
