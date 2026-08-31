import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import GlassCard from '../common/GlassCard';

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  fontSize: '13px',
};

export function AQI7DayChart({ data }) {
  return (
    <GlassCard>
      <h3 className="mb-6 text-sm font-semibold text-slate-800">7-Day AQI Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="aqi" stroke="#2563EB" strokeWidth={3} fill="url(#aqiGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export function AQI24HourChart({ data }) {
  return (
    <GlassCard>
      <h3 className="mb-6 text-sm font-semibold text-slate-800">24-Hour AQI Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="aqi" stroke="#60A5FA" strokeWidth={3} dot={{ fill: '#2563EB', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export function PollutantBarChart({ data }) {
  return (
    <GlassCard>
      <h3 className="mb-6 text-sm font-semibold text-slate-800">Pollutant Comparison</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="value" name="Current" fill="#2563EB" radius={[8, 8, 0, 0]} />
          <Bar dataKey="safe" name="Safe Limit" fill="#22C55E" radius={[8, 8, 0, 0]} opacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export function AQIVsRiskChart({ data }) {
  return (
    <GlassCard>
      <h3 className="mb-6 text-sm font-semibold text-slate-800">AQI vs Health Risk</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="aqi" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}

export function MiniAQIChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data}>
        <Area type="monotone" dataKey="aqi" stroke="#2563EB" strokeWidth={2} fill="#2563EB" fillOpacity={0.1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
