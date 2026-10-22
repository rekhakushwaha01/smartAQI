import { useEffect, useState } from 'react';
import { IoCall, IoLocation, IoStar, IoOpenOutline, IoMedkit } from 'react-icons/io5';
import { fetchNearbyDoctors } from '../../services/doctorService';

export default function NearbyCareList({ cityKey, profile }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const data = await fetchNearbyDoctors(cityKey, profile);
      if (!cancelled) {
        setResult(data);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [cityKey, profile]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div>
      <p className="mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Recommended specialty for you: <strong>{result.specialty}</strong>
        {result.source === 'mock' && (
          <span className="mt-1 block text-xs text-blue-600">
            Live Google Places list appears when VITE_GOOGLE_MAPS_API_KEY is set. Meanwhile showing nearby specialists for your city.
          </span>
        )}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {result.doctors.map((doc, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-slate-800">{doc.name}</p>
                <p className="text-sm text-blue-600">{doc.specialty || result.specialty}</p>
                {doc.type && <p className="text-xs text-slate-400">{doc.type}</p>}
              </div>
              {doc.rating != null && (
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                  <IoStar /> {doc.rating}
                </span>
              )}
            </div>
            {doc.address && (
              <p className="mt-2 flex items-start gap-1 text-xs text-slate-500">
                <IoLocation className="mt-0.5 shrink-0" /> {doc.address}
              </p>
            )}
            {doc.phone && (
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <IoCall /> {doc.phone}
              </p>
            )}
            <a
              href={doc.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((doc.name || result.specialty) + ' hospital ')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              <IoMedkit /> Open in Google Maps <IoOpenOutline />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
