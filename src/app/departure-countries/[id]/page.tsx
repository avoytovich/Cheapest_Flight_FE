'use client';

import { useEffect, useState } from 'react';

import RelatedAirports from '@/components/RelatedAirports';

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

const DepartureAirports = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(
          'https://www.ryanair.com/api/views/locate/5/airports/en/active'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch airports');
        }
        const data = await response.json();
        setAirports(data);
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
      direction="departure"
      airports={airports}
      loading={loading}
      error={error}
    />
  );
};

export default DepartureAirports;
