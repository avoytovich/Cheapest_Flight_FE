'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGeneral } from '@/context/GeneralContext';

const TripDetail = ({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) => {
  return (
    <div className="p-3 mb-4 rounded-lg bg-gray-700 text-gray-300">
      <span className="text-sm">{label}</span>
      <p className="text-lg font-medium">{value || 'Not selected'}</p>
    </div>
  );
};

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { departure, arrival, startDate, endDate } = useGeneral();
  const pathname = usePathname();
  const isFirstPage = pathname === '/'; // Hide for the first page

  // Determine which step is active based on the URL
  let activeStep = null;
  if (pathname.includes('departure')) activeStep = 1;
  else if (pathname.includes('arrival')) activeStep = 2;
  else if (pathname.includes('available')) activeStep = 3;
  else if (pathname.includes('valuable')) activeStep = 4;

  // Determine the completion status of each step
  const isDepartureCompleted = departure !== null && departure !== '';
  const isArrivalCompleted =
    isDepartureCompleted && arrival !== null && arrival !== '';
  const isDatesCompleted =
    isArrivalCompleted && startDate !== null && endDate !== null;

  return (
    <div className="flex">
      {!isFirstPage && (
        <aside className="w-64 bg-gray-800 text-white h-screen p-6 sticky top-0 hidden md:block">
          <h2 className="text-xl font-semibold mb-4">Your Trip</h2>

          {/* Steps with dynamic highlighting and conditional visibility */}
          <div className="space-y-3 space-x-1 text-gray-400">
            <Link
              href={
                isDepartureCompleted
                  ? {
                      pathname: '/departure-countries',
                      query: {
                        ...(departure && { departure }),
                        ...(arrival && { arrival }),
                        ...(startDate && { startDate }),
                        ...(endDate && { endDate }),
                      },
                    }
                  : '#'
              }
              className={
                !isDepartureCompleted ? 'cursor-not-allowed opacity-50' : ''
              }
            >
              <p>
                <span
                  className={`${
                    activeStep === 1
                      ? 'bg-blue-600 text-white px-2 py-1 rounded'
                      : 'px-2 py-1'
                  } `}
                >
                  1
                </span>{' '}
                Choose Departure
              </p>
            </Link>

            <Link
              href={
                isDepartureCompleted
                  ? {
                      pathname: '/arrival-countries',
                      query: {
                        ...(departure && { departure }),
                        ...(arrival && { arrival }),
                        ...(startDate && { startDate }),
                        ...(endDate && { endDate }),
                      },
                    }
                  : '#'
              }
              className={
                !isDepartureCompleted ? 'cursor-not-allowed opacity-50' : ''
              }
            >
              <p>
                <span
                  className={`${
                    activeStep === 2
                      ? 'bg-blue-600 text-white px-2 py-1 rounded'
                      : 'px-2 py-1'
                  } `}
                >
                  2
                </span>{' '}
                Select Arrival
              </p>
            </Link>

            <Link
              href={
                isArrivalCompleted
                  ? {
                      pathname: '/available-dates',
                      query: {
                        ...(departure && { departure }),
                        ...(arrival && { arrival }),
                        ...(startDate && { startDate }),
                        ...(endDate && { endDate }),
                      },
                    }
                  : '#'
              }
              className={
                !isArrivalCompleted ? 'cursor-not-allowed opacity-50' : ''
              }
            >
              <p>
                <span
                  className={`${
                    activeStep === 3
                      ? 'bg-blue-600 text-white px-2 py-1 rounded'
                      : 'px-2 py-1'
                  } `}
                >
                  3
                </span>{' '}
                Pick days
              </p>
            </Link>

            <Link
              href={
                isDatesCompleted
                  ? {
                      pathname: '/valuable-info',
                      query: {
                        ...(departure && { departure }),
                        ...(arrival && { arrival }),
                        ...(startDate && { startDate }),
                        ...(endDate && { endDate }),
                      },
                    }
                  : '#'
              }
              className={
                !isDatesCompleted ? 'cursor-not-allowed opacity-50' : ''
              }
            >
              <p>
                <span
                  className={`${
                    activeStep === 4
                      ? 'bg-blue-600 text-white px-2 py-1 rounded'
                      : 'px-2 py-1'
                  } `}
                >
                  4
                </span>{' '}
                Get valuable information
              </p>
            </Link>
          </div>

          {/* Trip Details with URL-based Highlighting */}
          <div className="mt-6 border-t border-gray-700 pt-4 space-y-3">
            <TripDetail label="Departure" value={departure} />
            <TripDetail label="Arrival" value={arrival} />
            <TripDetail label="Starting point" value={startDate} />
            <TripDetail label="End point" value={endDate} />
          </div>
        </aside>
      )}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
