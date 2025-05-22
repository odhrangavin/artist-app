import axios from "axios";

const TICKETMASTER_API_KEY = "bOtQy0uSgOsaeJPANusiQDmGAYYDhLBu";
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

/**
 * Search Ticketmaster events with multiple filters.
 * @param {Object} params
 * @param {string} [params.keyword]
 * @param {string} [params.startDateTime] - ISO8601 date string (e.g. '2025-06-01T00:00:00Z')
 * @param {string} [params.endDateTime] - ISO8601 date string
 * @param {string} [params.city]
 * @param {string} [params.venueName]
 * @param {string} [params.classificationName] - Genre/category
 * @param {number} [params.size]
 * @param {number} [params.page]
 * @returns {Promise<Array>} events
 */
export const searchEvents = async ({
  keyword = "",
  startDateTime = "",
  endDateTime = "",
  city = "",
  venueName = "",
  classificationName = "",
  size = 30,
  page = 0,
} = {}) => {
  const params = {
    apikey: TICKETMASTER_API_KEY,
    countryCode: "IE",
    size,
    page,
  };

  if (keyword) params.keyword = keyword;
  if (startDateTime) params.startDateTime = startDateTime;
  if (endDateTime) params.endDateTime = endDateTime;
  if (city) params.city = city;
  if (venueName) params.venueName = venueName;
  if (classificationName) params.classificationName = classificationName;

  const response = await axios.get(BASE_URL, { params });
  const events = response.data._embedded?.events || [];
  return events.map((event) => ({
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate,
    time: event.dates?.start?.localTime,
    city: event._embedded?.venues?.[0]?.city?.name || "",
    venue: event._embedded?.venues?.[0]?.name || "",
    description: event.info || "No description available",
    image: event.images?.[0]?.url || "",
    url: event.url,
    genre:
      event.classifications?.[0]?.genre?.name ||
      event.classifications?.[0]?.segment?.name ||
      "",
  }));
};

/**
 * Get unique city/venue/genre suggestions from a list of events.
 * @param {Array} events
 * @returns {Object} { cities, venues, genres }
 */
export const getEventSuggestions = (events = []) => {
  const cities = Array.from(
    new Set(events.map((e) => e.city).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const venues = Array.from(
    new Set(events.map((e) => e.venue).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const genres = Array.from(
    new Set(events.map((e) => e.genre).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  return { cities, venues, genres };
};
