'use client';

import { useEffect, useState } from 'react';

import RelatedAirports from '@/components/RelatedAirports';
import { useGeneral } from '@/context/GeneralContext';

interface Airport {
  name: string;
  code: string;
  city: {
    name: string;
  };
  country: {
    name: string;
    code: string;
  };
}

const ArrivalAirports = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { departure } = useGeneral();

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(
          `https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/${departure}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch airports');
        }
        const data = await response.json();
        setAirports(
          data.map((each: { arrivalAirport: Airport }) => each.arrivalAirport)
        );
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  return (
    <RelatedAirports
      direction="arrival"
      airports={airports}
      loading={loading}
      error={error}
    />
  );
};

export default ArrivalAirports;
