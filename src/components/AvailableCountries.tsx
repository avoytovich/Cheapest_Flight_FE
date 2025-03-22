'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useGeneral } from '@/context/GeneralContext';
import { capitalizeFirstLetter } from '@/utils/helpers';

type Direction = 'departure' | 'arrival';

interface Country {
  name: string;
  code?: string;
  currency: string;
}

interface AvailableCountriesProps {
  direction: Direction;
  countries: Country[];
}

const AvailableCountries: React.FC<AvailableCountriesProps> = ({
  direction,
  countries,
}) => {
  const {
    loading,
    setLoading,
    setCurrency,
    departure,
    arrival,
    startDate,
    endDate,
    currency,
  } = useGeneral();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const router = useRouter();

  const handleCountryChange = (
    event: React.ChangeEvent<unknown>,
    newValue: Country | null
  ) => {
    setSelectedCountry(newValue);
    setLoading(true);
    if (newValue) {
      if (direction === 'departure') {
        setCurrency(newValue.currency);
      }
      // Navigate to the selected country's page
      const queryParams = new URLSearchParams({
        ...(departure && { departure }),
        ...(arrival && { arrival }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(currency && { currency }),
      }).toString();

      router.push(`/${direction}-countries/${newValue.code}?${queryParams}`);
    }
  };

  useEffect(() => {
    if (countries) {
      setLoading(false);
    }
  }, [countries, setLoading]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!countries.length) {
    return (
      <Typography align="center" color="textSecondary">
        {`No ${direction} countries available.`}
      </Typography>
    );
  }

  return (
    <Box p={4} minWidth="75%">
      <Typography variant="h4" align="center" gutterBottom>
        {`${direction === 'departure' ? 'DEPARTURE' : 'ARRIVAL'}`}
      </Typography>
      <Box>
        <Autocomplete
          options={countries.sort((a, b) => a.name.localeCompare(b.name))}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${capitalizeFirstLetter(direction)} Country`}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#000009',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#000009',
                  },
                },
              }}
            />
          )}
          onChange={handleCountryChange}
          value={selectedCountry}
        />
      </Box>
    </Box>
  );
};

export default AvailableCountries;
