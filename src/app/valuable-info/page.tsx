'use client';

import { useState, useEffect } from 'react';
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

const TicketInfo = ({
  title,
  ticket,
  isRecommended = false,
  budgetDifference = null,
  tripDurationChangeNotice = '',
}: {
  title: string;
  ticket: Ticket | null | undefined;
  isRecommended?: boolean;
  budgetDifference?: number | null;
  tripDurationChangeNotice?: string;
}) => {
  if (!ticket) return null;

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
              ? `Save ${Math.abs(budgetDifference).toFixed(2)} ${ticket.price?.currencySymbol}`
              : `+${budgetDifference.toFixed(2)} ${ticket.price?.currencySymbol} extra`}
          </p>
        )}

        {tripDurationChangeNotice && (
          <p className="mt-2 text-sm font-semibold text-orange-600">
            {tripDurationChangeNotice}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ValuableInfo() {
  const [startPointTicket, setStartPointTicket] = useState<{
    outbound: { fares: [Ticket]; minFare: Ticket };
  } | null>(null);
  const [endPointTicket, setEndPointTicket] = useState<{
    outbound: { fares: [Ticket]; minFare: Ticket };
  } | null>(null);
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
    availableEndDates,
  } = useGeneral();

  const startTicket = startPointTicket?.outbound.fares.filter(
    (ticket) => ticket.day === startDate
  )[0];

  const endTicket = endPointTicket?.outbound.fares.filter(
    (ticket) => ticket.day === endDate
  )[0];

  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const response = await fetch(
          `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${departure}/${arrival}/cheapestPerDay?outboundMonthOfDate=${startDate}&currency=${currency}`
        );
        if (!response.ok) throw new Error('Failed to fetch ticket data');
        const data = await response.json();
        setStartPointTicket(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ticket data: ${err}`);
        setError((err as Error).message);
      }
    };
    fetchTicketInfo();
  }, [departure, arrival, startDate, currency]);

  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const response = await fetch(
          `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${arrival}/${departure}/cheapestPerDay?outboundMonthOfDate=${endDate}&currency=${currency}`
        );
        if (!response.ok) throw new Error('Failed to fetch ticket data');
        const data = await response.json();
        setEndPointTicket(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ticket data: ${err}`);
        setError((err as Error).message);
      }
    };
    fetchTicketInfo();
  }, [departure, arrival, endDate, currency]);

  useEffect(() => {
    const cheapestStartPointTicket = startPointTicket?.outbound?.minFare;
    const cheapestEndPointTicket = endPointTicket?.outbound?.minFare;

    const cheapestOption =
      cheapestStartPointTicket?.price && cheapestEndPointTicket?.price
        ? cheapestStartPointTicket.price.value <
          cheapestEndPointTicket.price.value
          ? cheapestStartPointTicket
          : cheapestEndPointTicket
        : cheapestStartPointTicket || cheapestEndPointTicket || null;

    if (!cheapestOption) return;

    setRecommendationStart(cheapestOption);

    const tripDuration = Math.round(
      new Date(endDate ?? '').getDate() - new Date(startDate ?? '').getDate() >
        0
        ? new Date(endDate ?? '').getDate() -
            new Date(startDate ?? '').getDate()
        : 30 -
            new Date(startDate ?? '').getDate() +
            new Date(endDate ?? '').getDate()
    );

    const recommendedStartDate = new Date(cheapestOption.day);
    const recommendedEndDate = new Date(recommendedStartDate);
    recommendedEndDate.setDate(recommendedStartDate.getDate() + tripDuration);
    const formattedRecommendedEndDate = new Date(recommendedEndDate)
      .toISOString()
      .split('T')[0];

    const targetDate = new Date(formattedRecommendedEndDate);

    // Convert the date strings in the array to Date objects
    const dateObjects = availableEndDates.map((date) => new Date(date));

    // Filter out past dates and find the nearest future date
    const futureDates = dateObjects.filter((date) => date >= targetDate);

    // Find the nearest future date
    const nearestDate = futureDates.reduce((nearest, currentDate) => {
      return currentDate < nearest ? currentDate : nearest;
    }, futureDates[0]);

    const requstedDay = nearestDate.toISOString().split('T')[0];

    const fetchTicketInfo = async () => {
      try {
        const response = await fetch(
          `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${arrival}/${departure}/cheapestPerDay?outboundMonthOfDate=${requstedDay}&currency=${currency}`
        );
        if (!response.ok) throw new Error('Failed to fetch ticket data');
        const data = await response.json();
        setRecommendationEnd(
          data?.outbound.fares.filter(
            (ticket: Ticket) => ticket.day === requstedDay
          )[0]
        );
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ticket data: ${err}`);
        setError((err as Error).message);
      }
    };
    fetchTicketInfo();
  }, [
    departure,
    arrival,
    startDate,
    endDate,
    currency,
    startPointTicket,
    endPointTicket,
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
      ? Math.abs(
          new Date(recommendationEnd.day).getDate() -
            new Date(recommendationStart.day).getDate()
        ) !==
        Math.abs(
          new Date(endTicket.day).getDate() -
            new Date(startTicket.day).getDate()
        )
        ? 'Trip duration has changed. Please verify.'
        : ''
      : '';

  const startPrice = startTicket?.price?.value ?? 0;
  const endPrice = endTicket?.price?.value ?? 0;
  const recommendedStartPrice = recommendationStart?.price?.value ?? 0;
  const recommendedEndPrice = recommendationEnd?.price?.value ?? 0;

  const budgetDifferenceStart = startPrice - recommendedStartPrice;
  const budgetDifferenceEnd = endPrice - recommendedEndPrice;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold text-center">Ticket Information</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TicketInfo title="Selected Departure" ticket={startTicket} />
        <TicketInfo title="Selected Return" ticket={endTicket} />
        <TicketInfo
          title="Recommended Departure"
          ticket={recommendationStart}
          isRecommended
          budgetDifference={budgetDifferenceStart}
          tripDurationChangeNotice={durationChangeNotice}
        />
        <TicketInfo
          title="Recommended Return"
          ticket={recommendationEnd}
          isRecommended
          budgetDifference={budgetDifferenceEnd}
          tripDurationChangeNotice={durationChangeNotice}
        />
      </div>
    </div>
  );
}
