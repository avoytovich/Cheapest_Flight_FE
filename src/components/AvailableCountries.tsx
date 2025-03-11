'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useGeneral } from '@/context/GeneralContext';

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
  const { setCurrency, departure, arrival, startDate, endDate, currency } =
    useGeneral();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const router = useRouter();

  if (!countries) {
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

  const handleCountryChange = (
    event: React.ChangeEvent<unknown>,
    newValue: Country | null
  ) => {
    setSelectedCountry(newValue);
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

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        {`${direction.charAt(0).toUpperCase() + direction.slice(1)} Countries`}
      </Typography>
      <Box margin="0 auto" maxWidth="75%">
        <Autocomplete
          options={countries.sort((a, b) => a.name.localeCompare(b.name))}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${direction.charAt(0).toUpperCase() + direction.slice(1)} Country`}
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
