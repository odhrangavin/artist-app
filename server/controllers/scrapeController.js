const db = require('../db');
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

const scrapeTicketmaster = async (req, res) => {
	//deal with pagination
	const params = new URLSearchParams({
		apikey: TICKETMASTER_API_KEY,
		countryCode: "IE",
		size: 100,
		//page: 13
    });
	const response = await fetch(`${ BASE_URL }?${ params }`);
	const data = await response.json();
	res.json(data);
}

module.exports = { scrapeTicketmaster };