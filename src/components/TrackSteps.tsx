'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGeneral } from '@/context/GeneralContext';

export default function TrackSteps() {
  const { departure, arrival, startDate, endDate, currency } = useGeneral();
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
    <div className="flex flex-col md:flex-row">
      {!isFirstPage && (
        <div className="w-full bg-gray-800 text-white p-6 sticky top-0 flex flex-col md:flex-row justify-center md:space-x-6">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">Trip step</h2>

          {/* Steps with dynamic highlighting and conditional visibility */}
          <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-3 text-gray-400">
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
                        ...(currency && { currency }),
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
                Departure
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
                        ...(currency && { currency }),
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
                Arrival
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
                        ...(currency && { currency }),
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
                        ...(currency && { currency }),
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
                Recommendation
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
