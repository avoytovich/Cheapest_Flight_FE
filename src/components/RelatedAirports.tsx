'use client';

import { Box, Card, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useGeneral } from '@/context/GeneralContext';
import { capitalizeFirstLetter } from '@/utils';

type Direction = 'departure' | 'arrival';

type DepartureAirport = {
  name: string;
  code: string;
  city: {
    name: string;
  };
  country: {
    name: string;
    code: string;
  };
};

type ArrivalAirport = { arrivalAirport: DepartureAirport };

interface RelatedAirportsProps {
  direction: Direction;
  airports: DepartureAirport[] | ArrivalAirport[];
}

const RelatedAirports: React.FC<RelatedAirportsProps> = ({
  direction,
  airports,
}) => {
  const { departure, setDeparture, setArrival, setStartDate, setEndDate } =
    useGeneral();
  const params = useParams();
  const id = params?.id as string;

  const handleDeparture = (airport: string) => {
    setDeparture(airport);
    setArrival(null);
    setStartDate(null);
    setEndDate(null);
  };

  const handleArrival = (airport: string) => {
    setArrival(airport);
    setStartDate(null);
    setEndDate(null);
  };

  if (!airports) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const filteredAirports = airports.filter((airport) => {
    if (direction === 'departure')
      return (airport as DepartureAirport).country.code === id;
    return (airport as ArrivalAirport).arrivalAirport.country.code === id;
  });

  if (filteredAirports.length === 0)
    return (
      <Typography variant="h6" textAlign="center">
        {`${direction === 'departure' ? 'No airports available for this country' : `No airports available in this country from ${departure}`}`}
      </Typography>
    );

  return (
    <Box p={4} className="h-screen">
      <Typography variant="h4" textAlign="center" gutterBottom>
        {`${capitalizeFirstLetter(direction)} airports in ${direction === 'departure' ? (filteredAirports[0] as DepartureAirport).country.name : (filteredAirports[0] as ArrivalAirport).arrivalAirport.country.name}`}
      </Typography>
      <Box margin="0 auto" maxWidth="75%">
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={3}
        >
          {filteredAirports.map((airport) => (
            <Link
              key={
                direction === 'departure'
                  ? (airport as DepartureAirport).code
                  : (airport as ArrivalAirport).arrivalAirport.code
              }
              href={
                direction === 'departure'
                  ? `/arrival-countries?departure=${(airport as DepartureAirport).code}`
                  : `/available-dates?departure=${departure}&arrival=${(airport as ArrivalAirport).arrivalAirport.code}`
              }
              passHref
            >
              <Card
                sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
                onClick={() =>
                  direction === 'departure'
                    ? handleDeparture((airport as DepartureAirport).code)
                    : handleArrival(
                        (airport as ArrivalAirport).arrivalAirport.code
                      )
                }
              >
                <Typography variant="subtitle1">
                  {direction === 'departure'
                    ? (airport as DepartureAirport).city.name
                    : (airport as ArrivalAirport).arrivalAirport.city.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {direction === 'departure'
                    ? (airport as DepartureAirport).code
                    : (airport as ArrivalAirport).arrivalAirport.code}
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
