'use client';

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

export default function TrackChoise() {
  const { departure, arrival, startDate, endDate, currency } = useGeneral();
  const pathname = usePathname();
  const isFirstPage = pathname === '/'; // Hide for the first page

  return (
    !isFirstPage && (
      <div className="bg-gray-800 text-white">
        {/* Trip Details with URL-based Highlighting */}
        <div className="flex flex-wrap justify-center border-t border-gray-700 p-4 gap-4">
          <div className="w-full sm:w-auto">
            <TripDetail label="Departure Airport" value={departure} />
          </div>
          <div className="w-full sm:w-auto">
            <TripDetail label="Arrival Airport" value={arrival} />
          </div>
          <div className="w-full sm:w-auto">
            <TripDetail label="Starting point" value={startDate} />
          </div>
          <div className="w-full sm:w-auto">
            <TripDetail label="End point" value={endDate} />
          </div>
          <div className="w-full sm:w-auto">
            <TripDetail label="Currency" value={currency} />
          </div>
        </div>
      </div>
    )
  );
}
