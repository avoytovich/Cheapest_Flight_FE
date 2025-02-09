'use client';

import { useEffect, useState } from 'react';

import AvailableCountries from '@/components/AvailableCountries';

interface Country {
  name: string;
  code: string;
  currency: string;
}

const ArrivalCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://www.ryanair.com/api/views/locate/3/countries/en'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <AvailableCountries
      direction="arrival"
      countries={countries}
      loading={loading}
      error={error}
    />
  );
};

export default ArrivalCountries;
