import axios from 'axios';
import { MAHARASHTRA_CITIES } from '../utils/constants';


const GOOGLE_API_KEY = 'AIzaSyAY2BA8_zkFzysRShBi_rTSVXD9Ghy5IPM';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const mockDoctors = {
  mumbai: [
    { name: 'Dr. Rajesh Mehta', specialty: 'Pulmonologist', rating: 4.7, address: 'Andheri West, Mumbai', phone: '+91 98765 43210', mapsUrl: 'https://maps.google.com/?q=pulmonologist+andheri+mumbai' },
    { name: 'Dr. Priya Sharma', specialty: 'Respiratory Specialist', rating: 4.5, address: 'Bandra, Mumbai', phone: '+91 98765 43211', mapsUrl: 'https://maps.google.com/?q=respiratory+doctor+bandra+mumbai' },
    { name: 'Dr. Amit Desai', specialty: 'Chest Physician', rating: 4.6, address: 'Dadar, Mumbai', phone: '+91 98765 43212', mapsUrl: 'https://maps.google.com/?q=chest+physician+dadar+mumbai' },
  ],
  pune: [
    { name: 'Dr. Sneha Kulkarni', specialty: 'Pulmonologist', rating: 4.8, address: 'Kothrud, Pune', phone: '+91 98765 43220', mapsUrl: 'https://maps.google.com/?q=pulmonologist+kothrud+pune' },
    { name: 'Dr. Vikram Patil', specialty: 'Asthma Specialist', rating: 4.4, address: 'Hinjewadi, Pune', phone: '+91 98765 43221', mapsUrl: 'https://maps.google.com/?q=asthma+specialist+pune' },
  ],
  nagpur: [
    { name: 'Dr. Anil Verma', specialty: 'Pulmonologist', rating: 4.5, address: 'Dharampeth, Nagpur', phone: '+91 98765 43230', mapsUrl: 'https://maps.google.com/?q=pulmonologist+nagpur' },
  ],
  aurangabad: [
    { name: 'Dr. Farhan Khan', specialty: 'Chest Specialist', rating: 4.3, address: 'Cidco, Aurangabad', phone: '+91 98765 43240', mapsUrl: 'https://maps.google.com/?q=chest+specialist+aurangabad' },
  ],
  nashik: [
    { name: 'Dr. Meera Joshi', specialty: 'Pulmonologist', rating: 4.6, address: 'College Road, Nashik', phone: '+91 98765 43250', mapsUrl: 'https://maps.google.com/?q=pulmonologist+nashik' },
  ],
  thane: [
    { name: 'Dr. Rohit Singh', specialty: 'Respiratory Physician', rating: 4.5, address: 'Ghodbunder, Thane', phone: '+91 98765 43260', mapsUrl: 'https://maps.google.com/?q=respiratory+doctor+thane' },
  ],
};

export function getSpecialtyFromProfile(profile) {
  if (profile.asthma || profile.copd || profile.lungDisease || profile.breathingDifficulty) {
    return 'Pulmonologist';
  }
  if (profile.heartDisease || profile.chestTightness) {
    return 'Cardiologist';
  }
  if (profile.allergies || profile.eyeIrritation) {
    return 'Allergist';
  }
  return 'General Physician';
}

export async function fetchNearbyDoctors(cityKey, profile) {
  const specialty = getSpecialtyFromProfile(profile);
  const city = MAHARASHTRA_CITIES[cityKey]?.label ?? cityKey;

  if (GOOGLE_API_KEY) {
    try {
      const query = `${specialty} near ${city} Maharashtra`;
      const { data } = await axios.get(`${API_BASE}/doctors/nearby`, {
        params: { query, city, specialty },
      });
      if (data?.doctors?.length) return { doctors: data.doctors, specialty, source: 'api' };
    } catch {
      /* fall through */
    }

    try {
      const { data } = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        {
          params: {
            query: `${specialty} in ${city} Maharashtra`,
            key: GOOGLE_API_KEY,
          },
        }
      );
      if (data.results?.length) {
        return {
          doctors: data.results.slice(0, 5).map((p) => ({
            name: p.name,
            specialty,
            rating: p.rating ?? '—',
            address: p.formatted_address,
            mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(p.name + ' ' + city)}`,
          })),
          specialty,
          source: 'google',
        };
      }
    } catch {
      /* fall through */
    }
  }

  const doctors = mockDoctors[cityKey] ?? mockDoctors.mumbai;
  return { doctors, specialty, source: 'mock' };
}
