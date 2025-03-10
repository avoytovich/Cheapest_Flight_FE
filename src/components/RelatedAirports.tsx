'use client';

import { Box, Card, Typography } from '@mui/material';
import Link from 'next/link';

import { useGeneral } from '@/context/GeneralContext';
import { capitalizeFirstLetter } from '@/utils/helpers';

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
  const {
    departure,
    setDeparture,
    setArrival,
    setStartDate,
    setEndDate,
    currency,
  } = useGeneral();

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

  if (airports.length === 0)
    return direction === 'departure' ? (
      <div className="error col-span-2 flex flex-col items-center justify-center p-6 border-4 border-orange-400 bg-red-50 rounded-2xl shadow-lg">
        <h1>No, way! 😢</h1>
        <p className="text-center font-medium">
          No airports available for this country
        </p>
      </div>
    ) : (
      <div className="error col-span-2 flex flex-col items-center justify-center p-6 border-4 border-orange-400 bg-red-50 rounded-2xl shadow-lg">
        <h1>No, way! 😢</h1>
        <p className="text-center font-medium">{`No arrival airports available in this country from ${departure}`}</p>
      </div>
    );

  return (
    <Box p={4}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {`${capitalizeFirstLetter(direction)} airports in ${direction === 'departure' ? (airports[0] as DepartureAirport).country.name : (airports[0] as ArrivalAirport).arrivalAirport.country.name}`}
      </Typography>
      <Box margin="0 auto" maxWidth="75%">
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={3}
        >
          {airports.map((airport) => (
            <Link
              key={
                direction === 'departure'
                  ? (airport as DepartureAirport).code
                  : (airport as ArrivalAirport).arrivalAirport.code
              }
              href={
                direction === 'departure'
                  ? `/arrival-countries?departure=${(airport as DepartureAirport).code}&currency=${currency}`
                  : `/available-dates?departure=${departure}&arrival=${(airport as ArrivalAirport).arrivalAirport.code}&currency=${currency}`
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
