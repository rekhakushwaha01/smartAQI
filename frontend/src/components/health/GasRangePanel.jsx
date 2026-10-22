import { buildGasRangeRows } from '../../utils/reportGenerator';

const statusStyles = {
  good: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  poor: 'bg-red-100 text-red-700',
};

const barColors = {
  good: '#22C55E',
  moderate: '#F59E0B',
  poor: '#EF4444',
};

export default function GasRangePanel({ aqiData }) {
  const rows = buildGasRangeRows(aqiData);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Compare the <strong>good / safe range</strong> with what is in your area <strong>right now</strong>.
      </p>
      {rows.map((row) => {
        const pct = row.value == null ? 0 : Math.min(100, (row.value / (row.goodMax * 2)) * 100);
        const goodPct = Math.min(100, (row.goodMax / (row.goodMax * 2)) * 100);
        return (
          <div key={row.key} className="rounded-2xl bg-slate-50/80 p-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-bold text-slate-800">{row.metric}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyles[row.status]}`}>
                {row.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Good range: {row.ideal}</span>
              <span>Now: <strong className="text-slate-800">{row.yours}</strong></span>
            </div>
            <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="absolute inset-y-0 left-0 bg-green-200" style={{ width: `${goodPct}%` }} />
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${pct}%`, backgroundColor: barColors[row.status] }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">{row.note}</p>
          </div>
        );
      })}
    </div>
  );
}
