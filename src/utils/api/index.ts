export async function getCountriesWithAirports() {
  const res = await fetch(
    'https://www.ryanair.com/api/views/locate/3/countries/en',
    { cache: 'force-cache' }
  );
  return res.json();
}

export async function getDepartureAirports() {
  const res = await fetch(
    'https://www.ryanair.com/api/views/locate/5/airports/en/active',
    { cache: 'force-cache' }
  ); // Cached
  return res.json();
}

export async function getArrivalAirports(departure: string) {
  const res = await fetch(
    `https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/${departure}`,
    { cache: 'no-store' } // Disable caching
  );
  if (!res.ok) throw new Error('Failed to fetch arrival airports');
  return res.json();
}
