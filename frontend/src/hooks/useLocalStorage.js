import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      /* ignore */
    }
  }, [key, stored]);

  return [stored, setStored];
}

export function useLocation() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('smartaqi_location');
      return saved ? JSON.parse(saved) : { city: 'mumbai', area: 'Andheri' };
    } catch {
      return { city: 'mumbai', area: 'Andheri' };
    }
  });

  const updateLocation = (city, area) => {
    const loc = { city, area };
    setLocation(loc);
    localStorage.setItem('smartaqi_location', JSON.stringify(loc));
  };

  return { location, updateLocation };
}
