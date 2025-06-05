const db = require('../db');
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

const scrapeTicketmaster = async (req, res) => {
	let fullData = [];
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
	const created_at = new Date().toISOString();
	let fullDataMap = fullData.map(eventItem => [
		eventItem.id,
		eventItem.name,
		eventItem.images[0].url || '',
		eventItem.dates.start.localDate,
		eventItem.dates.start.localTime,
		eventItem.classifications?.[0].genre.name ?? '',
		eventItem._embedded.venues[0]?.city.name || '',
		eventItem._embedded.venues[0]?.name || '',
		eventItem?.info || eventItem?.description || '',
		created_at,
		1
	])

	const stmt = db.prepare(`INSERT OR IGNORE INTO events
							 (external_id, title, image_url, event_date, event_time, genre, location, venue, description, created_at, user_id) 
							 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
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
			res.json({ message: `Inserted ${insertedRows} rows successfully`, data: fullData, map: fullDataMap });
		});
	});
}

const scrapeFailte = async(req, res) => {
	let fullData = [];
	let response = await fetch('https://failteireland.azure-api.net/opendata-api/v2/events');
	let data = await response.json();
	fullData = fullData.concat(data.value);
	while(data['@odata.nextLink']){
		response = await fetch(data['@odata.nextLink']);
		data = await response.json();
		fullData = fullData.concat(data.value);
	}
	const created_at = new Date().toISOString();
	let fullDataMap = fullData.map(eventItem => [
		eventItem.id,
		eventItem.name,
		'', //failte doesn't seem to have images
		eventItem.eventSchedule[0]?.startDate.split("T")[0] ?? '',
		eventItem.eventSchedule[0]?.startTime ?? '00:00:00',
		eventItem.additionalType[0],
		eventItem.location.address.addressRegion,
		eventItem.location.name,
		eventItem.description,
		created_at,
		1
	])

	const stmt = db.prepare(`INSERT OR IGNORE INTO events
							 (external_id, title, image_url, event_date, event_time, genre, location, venue, description, created_at, user_id) 
							 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
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

module.exports = { scrapeTicketmaster, scrapeFailte };