'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useGeneral } from '@/context/GeneralContext';

interface Price {
  value: number;
  currencySymbol: string;
}

interface Ticket {
  day: string;
  arrivalDate: string | null;
  departureDate: string | null;
  price: Price | null;
}

interface ApiPointTicket {
  outbound: {
    fares: Ticket[];
    minFare: Ticket;
  };
}

interface TicketInfoProps {
  title: string;
  ticket: Ticket | null;
  isRecommended?: boolean;
  budgetDifference?: number | null;
  tripDurationChangeNotice?: string;
}

const TicketInfo: React.FC<TicketInfoProps> = ({
  title,
  ticket,
  isRecommended = false,
  budgetDifference = null,
  tripDurationChangeNotice = '',
}) => {
  const { departure, arrival } = useGeneral();

  const isSelectedDeparture = title === 'Selected Departure';
  const isSelectedReturn = title === 'Selected Return';
  const isRecommendedDeparture = title === 'Recommended Departure';
  const isRecommendedReturn = title === 'Recommended Return';

  if (!ticket) return null;

  const externalLinkSelected = `https://www.ryanair.com/gb/en/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut=${ticket.day}&dateIn=&isConnectedFlight=false&discount=0&promoCode=&isReturn=false&originIata=${isSelectedDeparture ? departure : isSelectedReturn ? arrival : ''}&destinationIata=${isSelectedDeparture ? arrival : isSelectedReturn ? departure : ''}&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=${ticket.day}&tpEndDate=&tpDiscount=0&tpPromoCode=&tpOriginIata=${isSelectedDeparture ? departure : isSelectedReturn ? arrival : ''}&tpDestinationIata=${isSelectedDeparture ? arrival : isSelectedReturn ? departure : ''}`;
  const externalLinkRecommended = `https://www.ryanair.com/gb/en/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut=${ticket.day}&dateIn=&isConnectedFlight=false&discount=0&promoCode=&isReturn=false&originIata=${isRecommendedDeparture ? departure : isRecommendedReturn ? arrival : ''}&destinationIata=${isRecommendedDeparture ? arrival : isRecommendedReturn ? departure : ''}&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=${ticket.day}&tpEndDate=&tpDiscount=0&tpPromoCode=&tpOriginIata=${isRecommendedDeparture ? departure : isRecommendedReturn ? arrival : ''}&tpDestinationIata=${isRecommendedDeparture ? arrival : isRecommendedReturn ? departure : ''}`;

  return (
    <div
      className={`relative shadow-lg rounded-2xl p-6 text-center w-full max-w-md
        ${isRecommended ? 'border-4 border-yellow-400 bg-yellow-50' : 'bg-white'}`}
    >
      {isRecommended && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Recommended
        </div>
      )}

      <h2 className="text-lg font-semibold mt-3 mb-3 whitespace-pre-line">
        {title}
      </h2>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <p className="text-blue-600">Date: {ticket.day}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} />
          <p className="text-gray-600">
            Departure:{' '}
            {ticket.departureDate
              ? new Date(ticket.departureDate).toLocaleTimeString()
              : 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} />
          <p className="text-gray-600">
            Arrival:{' '}
            {ticket.arrivalDate
              ? new Date(ticket.arrivalDate).toLocaleTimeString()
              : 'N/A'}
          </p>
        </div>

        <p className="text-lg font-semibold mt-3">
          Price:{' '}
          {ticket.price
            ? `${ticket.price.value.toFixed(2)} ${ticket.price.currencySymbol}`
            : 'N/A'}
        </p>

        {budgetDifference !== null && budgetDifference !== 0 && (
          <p
            className={`mt-2 text-sm font-semibold ${budgetDifference < 0 ? 'text-red-500' : 'text-green-600'}`}
          >
            {budgetDifference > 0
              ? `Save on your budget: +${Math.abs(budgetDifference).toFixed(2)} ${ticket.price?.currencySymbol}`
              : `Extra expenses: ${budgetDifference.toFixed(2)} ${ticket.price?.currencySymbol}`}
          </p>
        )}

        {tripDurationChangeNotice && (
          <p className="mt-2 text-sm font-semibold text-orange-600">
            {tripDurationChangeNotice}
          </p>
        )}
        <a
          href={isRecommended ? externalLinkRecommended : externalLinkSelected}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-500 underline"
        >
          ✈️ Book ✈️
        </a>
      </div>
    </div>
  );
};

export default function ValuableInfo() {
  const [startPointTicket, setStartPointTicket] =
    useState<ApiPointTicket | null>(null);
  const [endPointTicket, setEndPointTicket] = useState<ApiPointTicket | null>(
    null
  );
  const [recommendationStart, setRecommendationStart] = useState<Ticket | null>(
    null
  );
  const [recommendationEnd, setRecommendationEnd] = useState<Ticket | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    departure,
    arrival,
    startDate,
    endDate,
    currency,
    availableStartDates,
    availableEndDates,
  } = useGeneral();

  const startTicket =
    startPointTicket?.outbound.fares.find(
      (ticket) => ticket.day === startDate
    ) || null;
  const endTicket =
    endPointTicket?.outbound.fares.find((ticket) => ticket.day === endDate) ||
    null;

  const calculateTripDuration = useCallback(
    (startDate: string | null, endDate: string | null): number => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate).getDate();
      const end = new Date(endDate).getDate();
      return end >= start ? end - start : 30 - start + end;
    },
    []
  );

  const tripDuration = calculateTripDuration(startDate, endDate);

  const findNearestDate = useCallback(
    (availableDates: string[], targetDate: string): string | null => {
      return (
        availableDates
          .map((date) => new Date(date))
          .filter((date) => date >= new Date(targetDate))
          .sort((a, b) => a.getTime() - b.getTime())[0]
          ?.toISOString()
          .split('T')[0] || null
      );
    },
    []
  );

  const fetchTicketInfo = useCallback(
    async (
      departure: string | null,
      arrival: string | null,
      requestedDay: string | null,
      currency: string | null,
      setRecommendation: (ticket: Ticket | null) => void
    ) => {
      if (!requestedDay) return;
      try {
        const url = `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${departure}/${arrival}/cheapestPerDay?outboundMonthOfDate=${requestedDay}&currency=${currency}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch ticket data');
        const data = await response.json();
        const ticket =
          data?.outbound?.fares.find((t: Ticket) => t.day === requestedDay) ||
          null;
        localStorage.setItem('recommendation', JSON.stringify(ticket));
        setRecommendation(ticket);
      } catch (err) {
        console.error(`Error fetching ticket data: ${err}`);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchTicketData = useCallback(
    async (
      from: string | null,
      to: string | null,
      date: string | null,
      currency: string | null,
      setState: React.Dispatch<React.SetStateAction<ApiPointTicket | null>>
    ) => {
      try {
        const response = await fetch(
          `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${from}/${to}/cheapestPerDay?outboundMonthOfDate=${date}&currency=${currency}`
        );
        if (!response.ok) throw new Error('Failed to fetch ticket data');
        const data = await response.json();
        setState(data);
      } catch (err) {
        console.error(`Error fetching ticket data: ${err}`);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleRecommendedStartDate = useCallback(
    (cheapestStart: Ticket | null) => {
      if (cheapestStart) {
        const recommendedStartDate = new Date(cheapestStart.day);
        const recommendedEndDate = new Date(recommendedStartDate);
        recommendedEndDate.setDate(
          recommendedStartDate.getDate() + tripDuration
        );
        const requestedDay = findNearestDate(
          availableEndDates,
          recommendedEndDate.toISOString().split('T')[0]
        );
        fetchTicketInfo(
          arrival,
          departure,
          requestedDay,
          currency,
          setRecommendationEnd
        );
      }
    },
    [
      arrival,
      departure,
      currency,
      tripDuration,
      findNearestDate,
      fetchTicketInfo,
      availableEndDates,
    ]
  );

  const handleRecommendedEndDate = useCallback(
    (cheapestEnd: Ticket | null) => {
      if (cheapestEnd) {
        const recommendedEnd = new Date(cheapestEnd.day);
        const recommendedStart = new Date(recommendedEnd);
        recommendedStart.setDate(recommendedEnd.getDate() - tripDuration);
        const requestedDay = findNearestDate(
          availableStartDates,
          recommendedStart.toISOString().split('T')[0]
        );
        fetchTicketInfo(
          departure,
          arrival,
          requestedDay,
          currency,
          setRecommendationStart
        );
      }
    },
    [
      departure,
      arrival,
      currency,
      tripDuration,
      findNearestDate,
      fetchTicketInfo,
      availableStartDates,
    ]
  );

  useEffect(() => {
    setRecommendationStart(
      JSON.parse(localStorage.getItem('recommendation') || 'null')
    );
    setRecommendationEnd(
      JSON.parse(localStorage.getItem('recommendation') || 'null')
    );
  }, []);

  useEffect(() => {
    fetchTicketData(
      departure,
      arrival,
      startDate,
      currency,
      setStartPointTicket
    );
    if (endDate) {
      fetchTicketData(arrival, departure, endDate, currency, setEndPointTicket);
    }
  }, [departure, arrival, startDate, endDate, currency, fetchTicketData]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const cheapestStart = startPointTicket?.outbound.minFare || null;
      const cheapestEnd = endPointTicket?.outbound.minFare || null;

      if (cheapestStart && cheapestEnd) {
        if (
          (cheapestStart.price?.value || 0) < (cheapestEnd.price?.value || 0)
        ) {
          setRecommendationStart(cheapestStart);
          handleRecommendedStartDate(cheapestStart);
        } else {
          setRecommendationEnd(cheapestEnd);
          handleRecommendedEndDate(cheapestEnd);
        }
      }
      if (cheapestStart && !cheapestEnd) {
        setRecommendationEnd(cheapestStart);
        handleRecommendedEndDate(cheapestStart);
      }
    };
    fetchRecommendations();
  }, [
    startPointTicket,
    endPointTicket,
    handleRecommendedStartDate,
    handleRecommendedEndDate,
  ]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen animate-pulse text-blue-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <p className="text-center text-red-500 font-medium">Error: {error}</p>
    );

  const durationChangeNotice =
    startTicket && endTicket && recommendationStart && recommendationEnd
      ? 'Trip dates, departure and arrival times as well as duration may change'
      : '';

  const startPrice = startTicket?.price?.value ?? 0;
  const endPrice = endTicket?.price?.value ?? 0;
  const recommendedStartPrice = recommendationStart?.price?.value ?? 0;
  const recommendedEndPrice = recommendationEnd?.price?.value ?? 0;

  const budgetDifferenceStart = startPrice - recommendedStartPrice;
  const budgetDifferenceEnd = endPrice - recommendedEndPrice;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold text-center">Tickets Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TicketInfo title="Selected Departure" ticket={startTicket} />
        <TicketInfo title="Selected Return" ticket={endTicket} />
        {(budgetDifferenceStart + budgetDifferenceEnd > 0 &&
          recommendationStart?.day !== recommendationEnd?.day) ||
        (!endTicket && budgetDifferenceStart > 0) ? (
          <>
            <TicketInfo
              title="Recommended Departure"
              ticket={recommendationStart}
              isRecommended
              budgetDifference={budgetDifferenceStart}
              tripDurationChangeNotice={durationChangeNotice}
            />
            <TicketInfo
              title="Recommended Return"
              ticket={endTicket && recommendationEnd}
              isRecommended
              budgetDifference={budgetDifferenceEnd}
              tripDurationChangeNotice={durationChangeNotice}
            />
          </>
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center p-6 border-4 border-orange-400 bg-red-50 rounded-2xl shadow-lg">
            <p className="text-center font-medium">
              No recommendations available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
