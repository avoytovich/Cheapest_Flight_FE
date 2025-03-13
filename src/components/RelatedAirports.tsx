'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Autocomplete } from '@mui/material';
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
  const [selectedAirport, setSelectedAirport] = useState<
    DepartureAirport | ArrivalAirport | null
  >(null);

  const router = useRouter();

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
      <div className="error col-span-2 flex flex-col items-center justify-center p-6 border-4 border-orange-400 bg-red-50 rounded-2xl shadow-lg m-6">
        <h1>No, way! 😢</h1>
        <p className="text-center font-medium">
          No airports available for this country
        </p>
      </div>
    ) : (
      <div className="error col-span-2 flex flex-col items-center justify-center p-6 border-4 border-orange-400 bg-red-50 rounded-2xl shadow-lg m-6">
        <h1>No, way! 😢</h1>
        <p className="text-center font-medium">{`No arrival airports available in this country from ${departure}`}</p>
      </div>
    );

  const handleAirportChange = (
    event: React.ChangeEvent<unknown>,
    newValue: DepartureAirport | ArrivalAirport | null
  ) => {
    setSelectedAirport(newValue);
    if (newValue) {
      if (direction === 'departure') {
        handleDeparture((newValue as DepartureAirport).code);
        router.push(
          `/arrival-countries?departure=${(newValue as DepartureAirport).code}&currency=${currency}`
        );
      } else {
        handleArrival((newValue as ArrivalAirport).arrivalAirport.code);
        router.push(
          `/available-dates?departure=${departure}&arrival=${(newValue as ArrivalAirport).arrivalAirport.code}&currency=${currency}`
        );
      }
    }
  };

  return (
    <Box p={4} minWidth="75%">
      <Typography variant="h4" textAlign="center" gutterBottom>
        {direction === 'departure'
          ? `Departure airports in ${(airports[0] as DepartureAirport).country.name}`
          : `Arrival airports in ${(airports[0] as ArrivalAirport).arrivalAirport.country.name}`}
      </Typography>
      <Box>
        <Autocomplete
          options={(airports as (DepartureAirport | ArrivalAirport)[]).sort(
            (a, b) => {
              const nameA =
                direction === 'departure'
                  ? (a as DepartureAirport).city.name
                  : (a as ArrivalAirport).arrivalAirport.city.name;
              const nameB =
                direction === 'departure'
                  ? (b as DepartureAirport).city.name
                  : (b as ArrivalAirport).arrivalAirport.city.name;
              return nameA.localeCompare(nameB);
            }
          )}
          isOptionEqualToValue={(option, value) =>
            (direction === 'departure'
              ? (option as DepartureAirport).code
              : (option as ArrivalAirport).arrivalAirport.code) ===
            (direction === 'departure'
              ? (value as DepartureAirport).code
              : (value as ArrivalAirport).arrivalAirport.code)
          }
          getOptionLabel={(option) =>
            direction === 'departure'
              ? (option as DepartureAirport).city.name
              : (option as ArrivalAirport).arrivalAirport.city.name
          }
          renderOption={(props, option) => (
            <li
              {...props}
              key={
                direction === 'departure'
                  ? (option as DepartureAirport).code
                  : (option as ArrivalAirport).arrivalAirport.code
              }
            >
              {direction === 'departure'
                ? (option as DepartureAirport).city.name
                : (option as ArrivalAirport).arrivalAirport.city.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${capitalizeFirstLetter(direction)} Airport`}
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
          onChange={handleAirportChange}
          value={selectedAirport}
        />
      </Box>
    </Box>
  );
};

export default RelatedAirports;
