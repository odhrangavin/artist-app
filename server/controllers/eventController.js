const db = require('../db');

const getEvents = (req, res) => {
	// Define valid searchable columns
	const validColumns = ['title', 'event_date', 'event_time', 'location', 'venue', 'genre'];
	const conditions = [];
	const params = [];

	// Build SQL conditions dynamically based on provided query parameters
	for (const column of validColumns) {
		if (req.query[column]) {
			conditions.push(`${column} LIKE ?`);
			params.push(`%${req.query[column].toLowerCase()}%`);
		}
	}

	// If no valid query parameters, return all rows
	const sql = conditions.length > 0 
		? `SELECT * FROM events WHERE ${conditions.join(' OR ')}`
		: `SELECT * FROM events`;

	db.all(sql, params, (err, rows) => {
		if (err) {
			console.error(err.message);
			return res.status(500).json({ error: 'Database error' });
		}
		res.json({ query: req.query, results: rows });
	});
};

const createEvent = (req, res) => {
	const { title, description, image_url, event_time, location, venue, genre, user_id } = req.body;
	console.log(event_time)
	const [ event_date, event_ntime ] = event_time.split("T");
	console.log(event_date, event_ntime)
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO events (title, description, image_url, event_date, event_time, location, venue, genre, user_id, created_at)
	 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[title, description, image_url, event_date, event_ntime, location, venue, genre, user_id, created_at],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
};

module.exports = { getEvents, createEvent };