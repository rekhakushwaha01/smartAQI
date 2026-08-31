import { buildHealthComparison } from '../../utils/reportGenerator';

const statusStyles = {
  good: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  poor: 'bg-red-100 text-red-700',
};

export default function HealthRangeComparison({ aqiData, assessment }) {
  const rows = buildHealthComparison(aqiData, assessment);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Metric</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Ideal Range</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Your Value</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.metric} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium">{row.metric}</td>
              <td className="px-4 py-3 text-slate-500">{row.ideal}</td>
              <td className="px-4 py-3 font-bold text-slate-800">{row.yours}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[row.status]}`}>
                  {row.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
