import AvailableCountries from '@/components/AvailableCountries';
import { getCountriesWithAirports } from '@/utils/api';

const DepartureCountries = async () => {
  try {
    const departureCountries = await getCountriesWithAirports();

    return (
      <AvailableCountries
        direction="departure"
        countries={departureCountries}
      />
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch departure countries');
    }
  }
};

export default DepartureCountries;
