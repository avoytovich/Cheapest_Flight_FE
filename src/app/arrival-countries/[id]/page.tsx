import RelatedAirports from '@/components/RelatedAirports';

async function getArrivalAirports(departure: string) {
  const res = await fetch(
    `https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/${departure}`,
    { cache: 'no-store' } // Disable caching
  );
  if (!res.ok) throw new Error('Failed to fetch arrival airports');
  return res.json();
}

const GetArrivalAirports = async ({
  searchParams,
}: {
  searchParams: { departure: string };
}) => {
  try {
    const { departure } = searchParams;
    const arrivalAirports = await getArrivalAirports(departure);
    return <RelatedAirports direction="arrival" airports={arrivalAirports} />;
  } catch (error) {
    console.error(error);
    return <div>Failed to fetch arrival airports </div>;
  }
};

export default GetArrivalAirports;
