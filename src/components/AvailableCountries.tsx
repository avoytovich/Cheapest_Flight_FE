'use client';

import Link from 'next/link';
import { CircularProgress, Box, Card, Typography } from '@mui/material';

import { capitalizeFirstLetter } from '@/utils';

type Direction = 'departure' | 'arrival';

interface Country {
  name: string;
  code?: string;
  currency: string;
}

interface AvailableCountriesProps {
  direction: Direction;
  countries: Country[];
  setCurrency?: (currency: string) => void;
  loading: boolean;
  error: string | null;
}

const AvailableCountries: React.FC<AvailableCountriesProps> = ({
  direction,
  countries,
  setCurrency,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" textAlign="center">
        Error: {error}
      </Typography>
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
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        {`${capitalizeFirstLetter(direction)} Countries`}
      </Typography>
      <Box margin="0 auto" maxWidth="75%">
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
          gap={3}
        >
          {countries
            .sort((a: Country, b: Country) => a.name.localeCompare(b.name))
            .map((country) => {
              const flagUrl = country.code
                ? `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`
                : null;

              return (
                <Link
                  key={country.name}
                  href={`/${direction}-countries/${country.code}`}
                  onClick={() => setCurrency && setCurrency(country.currency)}
                  passHref
                  prefetch
                >
                  <Card
                    role="button"
                    tabIndex={0}
                    sx={{
                      cursor: 'pointer',
                      p: 2,
                      textAlign: 'center',
                      backgroundColor: 'lightgray',
                    }}
                  >
                    {flagUrl && (
                      <Box
                        component="img"
                        src={flagUrl}
                        alt={`${country.name} flag`}
                        sx={{
                          objectFit: 'cover',
                          mb: 2,
                          width: '100%',
                          height: '80px',
                        }}
                      />
                    )}
                    <Typography>{country.name}</Typography>
                  </Card>
                </Link>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default AvailableCountries;
