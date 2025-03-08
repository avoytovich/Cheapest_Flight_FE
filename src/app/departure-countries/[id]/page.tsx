import RelatedAirports from '@/components/RelatedAirports';
import { getCountriesWithAirports, getDepartureAirports } from '@/utils/api';

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
      throw new Error('Failed to fetch departure countries');
    }
  }
}

const DepartureAirports = async ({ params }: { params: { id: string } }) => {
  try {
    const departureAirports = await getDepartureAirports();
    const filteredAirports = departureAirports.filter(
      (airport: { country: { code: string } }) =>
        airport.country.code === params.id
    );

    return (
      <RelatedAirports direction="departure" airports={filteredAirports} />
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch departure airports');
    }
  }
};

export default DepartureAirports;
