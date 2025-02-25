import AvailableCountries from '@/components/AvailableCountries';

async function getDepartureCounties() {
  const res = await fetch(
    'https://www.ryanair.com/api/views/locate/3/countries/en',
    { cache: 'force-cache' }
  ); // Cached
  return res.json();
}

const DepartureCountries = async () => {
  const departureCounties = await getDepartureCounties();

  return (
    <AvailableCountries direction="departure" countries={departureCounties} />
  );
};

export default DepartureCountries;
