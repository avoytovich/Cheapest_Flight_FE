'use client';

import Link from 'next/link';
import { CircularProgress, Box, Card, Typography } from '@mui/material';

import { capitalizeFirstLetter } from '@/utils';
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
                  href={{
                    pathname: `/${direction}-countries/${country.code}`,
                    query: {
                      ...(departure && { departure }),
                      ...(arrival && { arrival }),
                      ...(startDate && { startDate }),
                      ...(endDate && { endDate }),
                      ...(currency && { currency }),
                    },
                  }}
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
                    onClick={() =>
                      direction === 'departure'
                        ? setCurrency(country.currency)
                        : () => {}
                    }
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
