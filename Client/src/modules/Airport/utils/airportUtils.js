// Validate ICAO code format (4 letters)
export const validateICAO = (icao) => {
  return /^[A-Z]{4}$/.test(icao?.toUpperCase());
};

// Validate IATA code format (3 letters)
export const validateIATA = (iata) => {
  return /^[A-Z]{3}$/.test(iata?.toUpperCase());
};

// Format airport data for display
export const formatAirportData = (airport) => {
  return {
    _id: airport._id,
    icao: airport.icao?.toUpperCase(),
    iata: airport.iata?.toUpperCase(),
    name: airport.name,
    city: airport.city,
    country: airport.country,
    operator: airport.operator,
    tarmac: airport.tarmac,
    gmtOffset: airport.gmtOffset,
    timezone: airport.timezone,
    openingHours: airport.openingHours,
    open24: airport.open24,
    customs: airport.customs,
  };
};

// Filter airports based on search criteria
export const filterAirports = (airports, searchCriteria) => {
  const { searchQuery, icaoSearch, iataSearch, citySearch, countrySearch } =
    searchCriteria;

  let filtered = [...airports];

  // Apply specific field filters
  if (icaoSearch) {
    filtered = filtered.filter((airport) =>
      airport.icao.toLowerCase().includes(icaoSearch.toLowerCase())
    );
  }
  if (iataSearch) {
    filtered = filtered.filter((airport) =>
      airport.iata.toLowerCase().includes(iataSearch.toLowerCase())
    );
  }
  if (citySearch) {
    filtered = filtered.filter((airport) =>
      airport.city.toLowerCase().includes(citySearch.toLowerCase())
    );
  }
  if (countrySearch) {
    filtered = filtered.filter((airport) =>
      airport.country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }

  // Apply universal search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((airport) =>
      Object.values(airport).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(query)
      )
    );
  }

  return filtered;
};

// Get paginated data
export const getPaginatedData = (data, page, rowsPerPage) => {
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  return data.slice(start, end);
};
