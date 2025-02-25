import AvailableCountries from '@/components/AvailableCountries';

async function getArrivalCounties() {
  const res = await fetch(
    'https://www.ryanair.com/api/views/locate/3/countries/en',
    { cache: 'force-cache' }
  ); // Cached
  return res.json();
}

const ArrivalCountries = async () => {
  const arrivalCounties = await getArrivalCounties();

  return <AvailableCountries direction="arrival" countries={arrivalCounties} />;
};

export default ArrivalCountries;
