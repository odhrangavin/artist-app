const db = require('../db');
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

const scrapeTicketmaster = async (req, res) => {
	let fullData = [];
	//deal with pagination
	const params = new URLSearchParams({
		apikey: TICKETMASTER_API_KEY,
		countryCode: "IE",
		size: 200,
    });
	for(var i=0;i<=4;i++){
		params.set('page', i);
		const response = await fetch(`${ BASE_URL }?${ params }`);
		const data = await response.json();
		fullData = fullData.concat(data._embedded.events)
	}
	//res.json(fullData);
	const created_at = new Date().toISOString();
	let fullDataMap = fullData.map(eventItem => [
		eventItem.id,
		eventItem.name,
		eventItem.images[0].url || '',
		eventItem.dates.start.localDate,
		eventItem.dates.start.localTime,
		eventItem.classifications?.[0].genre.name ?? '',
		eventItem._embedded.venues[0]?.name || '',
		created_at
	])
	//need to do a bunch of munging here
	//name (title), id (external_id), images[0].url (image_url), dates.start.localDate (event_date), dates.start.localTime (event_time), 
	//classifications[0].genre.name (genre), _embedded.venus.[0].name (location)
	const stmt = db.prepare(`INSERT OR IGNORE INTO events
							 (external_id, title, image_url, event_date, event_time, genre, location, created_at) 
							 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
	db.serialize(() => {
		db.run('BEGIN TRANSACTION');
		let insertedRows = 0;
		for (const row of fullDataMap) {
			stmt.run(row, function (err) {
				if (err) {
					console.error('Insert error:', err.message);
				} else if (this.changes > 0) {
					insertedRows++; // Count rows actually inserted (not ignored)
				}
			});
		}
		stmt.finalize();
		db.run('COMMIT', (err) => {
			if (err) {
				console.error('Commit error:', err.message);
				return res.status(500).json({ error: 'Failed to commit transaction' });
			}
			res.json({ message: `Inserted ${insertedRows} rows successfully`, data: fullData });
		});
	});
}

module.exports = { scrapeTicketmaster };