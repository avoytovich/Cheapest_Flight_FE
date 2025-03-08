import RelatedAirports from '@/components/RelatedAirports';
import { getCountriesWithAirports, getArrivalAirports } from '@/utils/api';

export async function generateStaticParams() {
  try {
    const countries = await getCountriesWithAirports();
    return countries.map((country: { code: string }) => ({
      id: country.code,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch arrival countries');
    }
  }
}

interface GetArrivalAirportsProps {
  params: { id: string };
  searchParams: { departure: string };
}

const GetArrivalAirports = async ({
  params,
  searchParams,
}: GetArrivalAirportsProps) => {
  try {
    const { departure } = searchParams;
    const arrivalAirports = await getArrivalAirports(departure);
    const filteredAirports = arrivalAirports.filter(
      (airport: { arrivalAirport: { country: { code: string } } }) =>
        airport.arrivalAirport.country.code === params.id
    );
    return <RelatedAirports direction="arrival" airports={filteredAirports} />;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch arrival airports');
    }
  }
};

export default GetArrivalAirports;
