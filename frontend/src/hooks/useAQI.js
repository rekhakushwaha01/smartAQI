import { useState, useEffect, useCallback } from 'react';
import { aqiService } from '../services/api';

export function useAQI(city = 'mumbai', area = '') {
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [history7Day, setHistory7Day] = useState([]);
  const [history24Hour, setHistory24Hour] = useState([]);
  const [pollutants, setPollutants] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAQIData() {
      setLoading(true);
      try {
        const [aqi, wx, h7, h24, pol, markers] = await Promise.all([
          aqiService.getCurrent(city, area),
          aqiService.getWeather(city),
          aqiService.getHistory7Day(city),
          aqiService.getHistory24Hour(city),
          aqiService.getPollutantComparison(city),
          aqiService.getMapMarkers(),
        ]);

        if (cancelled) return;

        setData(aqi);
        setWeather(wx);
        setHistory7Day(h7);
        setHistory24Hour(h24);
        setPollutants(pol);
        setMapMarkers(markers);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAQIData();

    return () => {
      cancelled = true;
    };
  }, [city, area, refreshKey]);

  return { data, weather, history7Day, history24Hour, pollutants, mapMarkers, loading, refetch };
}
