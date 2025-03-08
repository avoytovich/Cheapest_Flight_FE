import RelatedAirports from '@/components/RelatedAirports';
import { getArrivalAirports } from '@/utils/api';

const GetArrivalAirports = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { departure: string };
}) => {
  const { id } = params;
  const { departure } = searchParams;

  try {
    const arrivalAirports = await getArrivalAirports(departure);
    const filteredAirports = arrivalAirports.filter(
      (airport: { arrivalAirport: { country: { code: string } } }) =>
        airport.arrivalAirport.country.code.toLowerCase() === id.toLowerCase()
    );

    return <RelatedAirports direction="arrival" airports={filteredAirports} />;
  } catch (error) {
    console.error('Error fetching arrival airports:', error);
    return <div>Failed to load arrival airports.</div>;
  }
};

export default GetArrivalAirports;
