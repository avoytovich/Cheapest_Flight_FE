import AvailableCountries from '@/components/AvailableCountries';
import { getCountriesWithAirports } from '@/utils/api';

const ArrivalCountries = async () => {
  try {
    const arrivalCountries = await getCountriesWithAirports();
    return (
      <AvailableCountries direction="arrival" countries={arrivalCountries} />
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch arrival countries');
    }
  }
};

export default ArrivalCountries;
