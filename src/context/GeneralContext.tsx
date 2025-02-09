'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GeneralContextType {
  departure: string | null;
  setDeparture: (airport: string) => void;
  arrival: string | null;
  setArrival: (airport: string) => void;
  currency: string | null;
  setCurrency: (currency: string) => void;
  startDate: string | null;
  setStartDate: (date: string) => void;
  endDate: string | null;
  setEndDate: (date: string) => void;
  availableEndDates: [string] | [];
  setAvailableEndDates: (date: [string]) => void;
}

const GeneralContext = createContext<GeneralContextType>({
  departure: null,
  setDeparture: () => {},
  arrival: null,
  setArrival: () => {},
  currency: null,
  setCurrency: () => {},
  startDate: null,
  setStartDate: () => {},
  endDate: null,
  setEndDate: () => {},
  availableEndDates: [],
  setAvailableEndDates: () => {},
});

export const GeneralProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  let savedDeparture = null;
  let savedArrival = null;
  let savedCurrency = null;
  let savedStartDate = null;
  let savedEndDate = null;
  let savedAvailableEndDates = [];
  if (typeof window !== 'undefined') {
    savedDeparture = sessionStorage.getItem('departure');
    savedArrival = sessionStorage.getItem('arrival');
    savedCurrency = sessionStorage.getItem('currency');
    savedStartDate = sessionStorage.getItem('startDate');
    savedEndDate = sessionStorage.getItem('endDate');
    savedAvailableEndDates = JSON.parse(
      sessionStorage.getItem('availableEndDates') || '[]'
    );
  }

  const [departure, setDeparture] = useState<string | null>(
    savedDeparture || null
  );
  const [arrival, setArrival] = useState<string | null>(savedArrival || null);
  const [currency, setCurrency] = useState<string | null>(
    savedCurrency || null
  );
  const [startDate, setStartDate] = useState<string | null>(
    savedStartDate || null
  );
  const [endDate, setEndDate] = useState<string | null>(savedEndDate || null);
  const [availableEndDates, setAvailableEndDates] = useState<[string] | []>(
    savedAvailableEndDates || []
  );

  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (departure) sessionStorage.setItem('departure', departure);
      if (arrival) sessionStorage.setItem('arrival', arrival);
      if (currency) sessionStorage.setItem('currency', currency);
      if (startDate) sessionStorage.setItem('startDate', startDate);
      if (endDate) sessionStorage.setItem('endDate', endDate);
      if (availableEndDates)
        sessionStorage.setItem(
          'availableEndDates',
          JSON.stringify(availableEndDates)
        );
    }
  }, [departure, arrival, startDate, endDate, availableEndDates]);

  return (
    <GeneralContext.Provider
      value={{
        departure,
        setDeparture,
        arrival,
        setArrival,
        currency,
        setCurrency,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        availableEndDates,
        setAvailableEndDates,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
