'use client';

import Link from 'next/link';
import { Box, Card, Typography } from '@mui/material';
import { useParams } from 'next/navigation';

import { useGeneral } from '@/context/GeneralContext';
import { capitalizeFirstLetter } from '@/utils';

type Direction = 'departure' | 'arrival';

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

interface RelatedAirportsProps {
  direction: Direction;
  airports: Airport[];
  loading: boolean;
  error: string | null;
}

const RelatedAirports: React.FC<RelatedAirportsProps> = ({
  direction,
  airports,
  loading,
  error,
}) => {
  const { departure, setDeparture, arrival, setArrival } = useGeneral();
  const params = useParams();
  const id = params?.id as string;

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" textAlign="center">
        Error: {error}
      </Typography>
    );

  const filteredAirports = airports.filter(
    (airport) => id && airport.country.code === id
  );

  if (filteredAirports.length === 0)
    return (
      <Typography variant="h6" textAlign="center">
        {`${direction === 'departure' ? 'No airports available for this country' : `No airports available in this country from ${departure}`}`}
      </Typography>
    );

  console.log('departure', departure);
  console.log('arrival', arrival);

  return (
    <Box p={4} className="h-screen">
      <Typography variant="h4" textAlign="center" gutterBottom>
        {`${capitalizeFirstLetter(direction)} airports in ${filteredAirports[0].country.name}`}
      </Typography>
      <Box margin="0 auto" maxWidth="75%">
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={3}
        >
          {filteredAirports.map((airport) => (
            <Link
              key={airport.code}
              href={
                direction === 'departure' && !arrival
                  ? '/arrival-countries'
                  : (!!departure && direction === 'arrival') ||
                      (direction === 'departure' && !!arrival)
                    ? '/available-dates'
                    : '/departure-countries'
              }
              passHref
              onClick={() =>
                direction === 'departure'
                  ? setDeparture(airport.code)
                  : setArrival(airport.code)
              }
            >
              <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}>
                <Typography variant="subtitle1">{airport.city.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {airport.code}
                </Typography>
              </Card>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RelatedAirports;
