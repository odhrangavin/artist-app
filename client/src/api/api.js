import axios from "axios";

const TICKETMASTER_API_KEY = "bOtQy0uSgOsaeJPANusiQDmGAYYDhLBu";

export const searchEvents = async (keyword = "") => {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json`;
  const response = await axios.get(url, {
    params: {
      apikey: TICKETMASTER_API_KEY,
      keyword,
      size: 9,
      countryCode: "IE",
    },
  });

  const events = response.data._embedded?.events || [];
  return events.map((event) => ({
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate,
    venue: event._embedded?.venues?.[0]?.name,
    description: event.info || "No description available",
    image: event.images?.[0]?.url || "", // first image
    url: event.url,
  }));
};


// Personal APIs
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
}); // base url for API.get() and API.post() methods.

// Check if there is a token and include it in the headers before sending the HTTP request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  
  if(token) req.headers.Authorization = 'Bearer ${token}'; // Bearer is required by JWT

  return req;

})

export default API;