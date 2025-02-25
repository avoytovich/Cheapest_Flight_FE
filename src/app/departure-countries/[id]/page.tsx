import RelatedAirports from '@/components/RelatedAirports';

async function getDepartureAirports() {
  const res = await fetch(
    'https://www.ryanair.com/api/views/locate/5/airports/en/active',
    { cache: 'force-cache' }
  ); // Cached
  return res.json();
}

const DepartureAirports = async () => {
  const departureAiroports = await getDepartureAirports();

  return (
    <RelatedAirports direction="departure" airports={departureAiroports} />
  );
};

export default DepartureAirports;
