import axios from "axios";

const TICKETMASTER_API_KEY = "bOtQy0uSgOsaeJPANusiQDmGAYYDhLBu";
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

/**
 * Fetch events from Ticketmaster with filters.
 */
export const searchEvents = async ({
  keyword = "",
  startDateTime = "",
  endDateTime = "",
  city = "",
  venue = "",
  genre = "",
} = {}) => {
  const params = {
    apikey: TICKETMASTER_API_KEY,
    countryCode: "IE",
    size: 100,
  };

  if (keyword) params.keyword = keyword;
  if (startDateTime) params.startDateTime = startDateTime;
  if (endDateTime) params.endDateTime = endDateTime;
  if (city) params.city = city;
  if (venue) params.venueId = venue;
  if (genre) params.classificationName = genre;

  const response = await axios.get(BASE_URL, { params });
  return response.data._embedded?.events || [];
};

/**
 * Extract unique cities, venues (by city), and genres (by city+venue) from a list of events.
 */
export function extractOptions(events) {
  // City set
  const citySet = new Set();
  // City -> Set of venues
  const cityVenueMap = {};
  // City+Venue -> Set of genres
  const cityVenueGenreMap = {};

  // events.forEach((e) => {
  //   const city = e._embedded?.venues?.[0]?.city?.name || "";
  //   const venue = e._embedded?.venues?.[0]?.name || "";
  //   const genres = [];
  //   if (e.classifications && e.classifications[0]) {
  //     if (e.classifications[0].genre?.name)
  //       genres.push(e.classifications[0].genre.name);
  //     if (e.classifications[0].segment?.name)
  //       genres.push(e.classifications[0].segment.name);
  //   }
  //   if (!city) return;

  //   citySet.add(city);

  //   if (venue) {
  //     cityVenueMap[city] = cityVenueMap[city] || new Set();
  //     cityVenueMap[city].add(venue);

  //     const key = `${city}|||${venue}`;
  //     cityVenueGenreMap[key] = cityVenueGenreMap[key] || new Set();
  //     genres.forEach((g) => cityVenueGenreMap[key].add(g));
  //   }
  // });

  // return {
  //   cities: Array.from(citySet).sort(),
  //   venuesByCity: Object.fromEntries(
  //     Object.entries(cityVenueMap).map(([c, venues]) => [
  //       c,
  //       Array.from(venues).sort(),
  //     ])
  //   ),
  //   genresByCityVenue: Object.fromEntries(
  //     Object.entries(cityVenueGenreMap).map(([k, genres]) => [
  //       k,
  //       Array.from(genres).sort(),
  //     ])
  //   ),
  // };
  events.forEach((e) => {
    const city = e._embedded?.venues?.[0]?.city?.name || "";
    const venueObj = e._embedded?.venues?.[0];
    const venueName = venueObj?.name || "";
    const venueId = venueObj?.id || "";
    const genres = [];
    if (e.classifications && e.classifications[0]) {
      if (e.classifications[0].genre?.name)
        genres.push(e.classifications[0].genre.name);
      if (e.classifications[0].segment?.name)
        genres.push(e.classifications[0].segment.name);
    }
    if (!city) return;

    citySet.add(city);

    if (venueName && venueId) {
      cityVenueMap[city] = cityVenueMap[city] || [];
      if (!cityVenueMap[city].some((v) => v.id === venueId))
        cityVenueMap[city].push({ name: venueName, id: venueId });

      const key = `${city}|||${venueId}`;
      cityVenueGenreMap[key] = cityVenueGenreMap[key] || new Set();
      genres.forEach((g) => cityVenueGenreMap[key].add(g));
    }
  });

  return {
    cities: Array.from(citySet).sort(),
    venuesByCity: Object.fromEntries(
      Object.entries(cityVenueMap).map(([c, venues]) => [
        c,
        venues.sort((a, b) => a.name.localeCompare(b.name)),
      ])
    ),
    genresByCityVenue: Object.fromEntries(
      Object.entries(cityVenueGenreMap).map(([k, genres]) => [
        k,
        Array.from(genres).sort(),
      ])
    ),
  };
}

// ==Personal APIs==
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
}); // base url for API.get() and API.post() methods.

// Check if there is a token and include it in the headers before sending the HTTP request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  
  if(token) req.headers.Authorization = `Bearer ${token}`; // Bearer is required by JWT

  return req;

})

export default API;
