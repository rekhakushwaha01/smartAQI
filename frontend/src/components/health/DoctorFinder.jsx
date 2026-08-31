import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCall, IoLocation, IoStar, IoOpenOutline } from 'react-icons/io5';
import Button from '../common/Button';
import { fetchNearbyDoctors } from '../../services/doctorService';

export default function DoctorFinder({ isOpen, onClose, cityKey, profile }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      return;
    }
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
  }, [isOpen, cityKey, profile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Ask a Doctor</h3>
                <p className="text-sm text-slate-500">Nearby specialists for your condition</p>
              </div>
              <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
                <IoClose className="text-xl" />
              </button>
            </div>

            {loading && (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            )}

            {result && !loading && (
              <>
                <p className="mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  Recommended: <strong>{result.specialty}</strong>
                  {result.source === 'mock' && (
                    <span className="block mt-1 text-xs text-blue-600">
                      Set VITE_GOOGLE_MAPS_API_KEY for live Google Places results
                    </span>
                  )}
                </p>
                <div className="space-y-3">
                  {result.doctors.map((doc, i) => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-800">{doc.name}</p>
                          <p className="text-sm text-blue-600">{doc.specialty}</p>
                        </div>
                        {doc.rating && (
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
                      {doc.mapsUrl && (
                        <a href={doc.mapsUrl} target="_blank" rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                          Open in Google Maps <IoOpenOutline />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <Button variant="ghost" className="mt-6 w-full" onClick={onClose}>Close</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
