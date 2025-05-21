import axios from "axios";

const TICKETMASTER_API_KEY = "bOtQy0uSgOsaeJPANusiQDmGAYYDhLBu";

export const searchEvents = async (keyword = "") => {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json`;
  const response = await axios.get(url, {
    params: {
      apikey: TICKETMASTER_API_KEY,
      keyword,
      size: 10,
      countryCode: "IE",
    },
  });

  const events = response.data._embedded?.events || [];
  return events.map((event) => ({
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate,
    venue: event._embedded?.venues?.[0]?.name,
    url: event.url,
  }));
};
