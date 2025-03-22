'use client';

import React, { createContext, useContext, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface GeneralContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  departure: string | null;
  setDeparture: (airport: string | null) => void;
  arrival: string | null;
  setArrival: (airport: string | null) => void;
  currency: string | null;
  setCurrency: (currency: string) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  availableStartDates: string[] | [];
  setAvailableStartDates: (date: string[]) => void;
  availableEndDates: string[] | [];
  setAvailableEndDates: (date: string[]) => void;
}

const GeneralContext = createContext<GeneralContextType>({
  loading: true,
  setLoading: () => {},
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
  availableStartDates: [],
  setAvailableStartDates: () => {},
  availableEndDates: [],
  setAvailableEndDates: () => {},
});

const GeneralProviderContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const params = React.useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const savedDeparture = params.get('departure') || null;
  const savedArrival = params.get('arrival') || null;
  const savedCurrency = params.get('currency') || null;
  const savedStartDate = params.get('startDate') || null;
  const savedEndDate = params.get('endDate') || null;
  const savedAvailableStartDates = JSON.parse(
    params.get('availableStartDates') || '[]'
  );
  const savedAvailableEndDates = JSON.parse(
    params.get('availableEndDates') || '[]'
  );

  const [departure, setDeparture] = useState<string | null>(savedDeparture);
  const [arrival, setArrival] = useState<string | null>(savedArrival);
  const [currency, setCurrency] = useState<string | null>(savedCurrency);
  const [startDate, setStartDate] = useState<string | null>(savedStartDate);
  const [endDate, setEndDate] = useState<string | null>(savedEndDate);
  const [availableStartDates, setAvailableStartDates] = useState<string[] | []>(
    savedAvailableStartDates || []
  );
  const [availableEndDates, setAvailableEndDates] = useState<string[] | []>(
    savedAvailableEndDates || []
  );
  const [loading, setLoading] = useState(true);

  return (
    <GeneralContext.Provider
      value={{
        loading,
        setLoading,
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
        availableStartDates,
        setAvailableStartDates,
        availableEndDates,
        setAvailableEndDates,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const GeneralProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneralProviderContent>{children}</GeneralProviderContent>
    </Suspense>
  );
};

export const useGeneral = () => useContext(GeneralContext);
