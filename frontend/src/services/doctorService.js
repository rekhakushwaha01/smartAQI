import axios from 'axios';
import { MAHARASHTRA_CITIES } from '../utils/constants';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const mockDoctors = {
  mumbai: [
    { name: 'Dr. Rajesh Mehta', specialty: 'Pulmonologist', type: 'Doctor', rating: 4.7, address: 'Andheri West, Mumbai', phone: '+91 98765 43210', mapsUrl: 'https://maps.google.com/?q=pulmonologist+andheri+mumbai' },
    { name: 'Dr. Priya Sharma', specialty: 'Respiratory Specialist', type: 'Doctor', rating: 4.5, address: 'Bandra, Mumbai', phone: '+91 98765 43211', mapsUrl: 'https://maps.google.com/?q=respiratory+doctor+bandra+mumbai' },
    { name: 'Kokilaben Dhirubhai Ambani Hospital', specialty: 'Pulmonology & Chest', type: 'Hospital', rating: 4.6, address: 'Andheri West, Mumbai', mapsUrl: 'https://maps.google.com/?q=Kokilaben+Hospital+Mumbai' },
    { name: 'Hinduja Hospital', specialty: 'Respiratory Medicine', type: 'Hospital', rating: 4.5, address: 'Mahim, Mumbai', mapsUrl: 'https://maps.google.com/?q=Hinduja+Hospital+Mumbai' },
  ],
  pune: [
    { name: 'Dr. Sneha Kulkarni', specialty: 'Pulmonologist', type: 'Doctor', rating: 4.8, address: 'Kothrud, Pune', phone: '+91 98765 43220', mapsUrl: 'https://maps.google.com/?q=pulmonologist+kothrud+pune' },
    { name: 'Ruby Hall Clinic', specialty: 'Chest Medicine', type: 'Hospital', rating: 4.5, address: 'Sassoon Road, Pune', mapsUrl: 'https://maps.google.com/?q=Ruby+Hall+Clinic+Pune' },
    { name: 'Dr. Vikram Patil', specialty: 'Asthma Specialist', type: 'Doctor', rating: 4.4, address: 'Hinjewadi, Pune', mapsUrl: 'https://maps.google.com/?q=asthma+specialist+pune' },
  ],
  nagpur: [
    { name: 'Dr. Anil Verma', specialty: 'Pulmonologist', type: 'Doctor', rating: 4.5, address: 'Dharampeth, Nagpur', mapsUrl: 'https://maps.google.com/?q=pulmonologist+nagpur' },
    { name: 'Wockhardt Super Speciality Hospital', specialty: 'Respiratory Care', type: 'Hospital', rating: 4.4, address: 'Nagpur', mapsUrl: 'https://maps.google.com/?q=Wockhardt+Hospital+Nagpur' },
  ],
  aurangabad: [
    { name: 'Dr. Farhan Khan', specialty: 'Chest Specialist', type: 'Doctor', rating: 4.3, address: 'Cidco, Aurangabad', mapsUrl: 'https://maps.google.com/?q=chest+specialist+aurangabad' },
    { name: 'MGM Medical College Hospital', specialty: 'Pulmonology', type: 'Hospital', rating: 4.2, address: 'Aurangabad', mapsUrl: 'https://maps.google.com/?q=MGM+Hospital+Aurangabad' },
  ],
  nashik: [
    { name: 'Dr. Meera Joshi', specialty: 'Pulmonologist', type: 'Doctor', rating: 4.6, address: 'College Road, Nashik', mapsUrl: 'https://maps.google.com/?q=pulmonologist+nashik' },
    { name: 'Wockhardt Hospital Nashik', specialty: 'Chest Care', type: 'Hospital', rating: 4.3, address: 'Nashik', mapsUrl: 'https://maps.google.com/?q=Wockhardt+Hospital+Nashik' },
  ],
  thane: [
    { name: 'Dr. Rohit Singh', specialty: 'Respiratory Physician', type: 'Doctor', rating: 4.5, address: 'Ghodbunder, Thane', mapsUrl: 'https://maps.google.com/?q=respiratory+doctor+thane' },
    { name: 'Jupiter Hospital', specialty: 'Pulmonology', type: 'Hospital', rating: 4.6, address: 'Thane', mapsUrl: 'https://maps.google.com/?q=Jupiter+Hospital+Thane' },
  ],
};

export function getSpecialtyFromProfile(profile) {
  const custom = `${(profile.customMedical || []).join(' ')} ${(profile.customSymptoms || []).join(' ')}`.toLowerCase();
  if (profile.asthma || profile.copd || profile.lungDisease || profile.breathingDifficulty || /asthma|copd|lung|tb|tuberculosis/.test(custom)) {
    return 'Pulmonologist';
  }
  if (profile.heartDisease || profile.chestTightness || /heart|cardio/.test(custom)) {
    return 'Cardiologist';
  }
  if (profile.allergies || profile.eyeIrritation || /allerg/.test(custom)) {
    return 'Allergist';
  }
  return 'General Physician';
}

export async function fetchNearbyDoctors(cityKey, profile) {
  const specialty = getSpecialtyFromProfile(profile);
  const city = MAHARASHTRA_CITIES[cityKey]?.label ?? cityKey;

  try {
    const { data } = await axios.get(`${API_BASE}/doctors/nearby`, {
      params: {
        query: `${specialty} near ${city} Maharashtra`,
        city,
        cityKey,
        specialty,
      },
      timeout: 18000,
    });
    if (data?.doctors?.length) {
      return { doctors: data.doctors, specialty, source: data.source || 'api' };
    }
  } catch (error) {
    console.warn('Doctors API unavailable:', error.message);
  }

  const doctors = mockDoctors[cityKey] ?? mockDoctors.mumbai;
  return { doctors, specialty, source: 'mock' };
}
