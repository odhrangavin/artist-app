const db = require('../db');

const getEvent = (req, res) => {
	let id = req.params.id;
	db.get(`SELECT * FROM events WHERE id = ?`,
		[id],
		function (err, row) {
			res.json({event: row});
		});
}

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
		? `SELECT * FROM events WHERE ${conditions.join(' AND ')}`
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
	const [ event_date, event_ntime ] = event_time.split("T");
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO events (title, description, image_url, event_date, event_time, location, venue, genre, user_id, created_at)
	 	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[title, description, image_url, event_date, event_ntime, location, venue, genre, user_id, created_at],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.status(201).json(this);
		}
	);
};


const editEvent = (req, res) => {
	const event_id = req.params.id;
	const user_id = req.user.id;
	const { title, description, image_url, event_time, location, venue, genre } = req.body;
	const [ event_date, event_ntime ] = event_time.split("T");
	const suspended = 0;
	db.run(`UPDATE events SET title = ?, description = ?, image_url = ?, event_date = ?, event_time = ?, location = ?, venue = ?, genre = ?, suspended = ?
	 	WHERE id = ? AND user_id = ?`,
		[title, description, image_url, event_date, event_ntime, location, venue, genre, suspended, event_id, user_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			if (this.changes === 0) {
            	return res.status(404).json({ error: 'Event not found or you are not the owner' });
        	}
			res.json({ success: true, message: "Event updated." });
		}
	);
}

const deleteEvent = (req, res) => {
	const event_id = req.params.id;
	const user_id = req.user.id;
	db.run(`DELETE FROM events WHERE id = ? AND user_id = ?`,
		[event_id, user_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
}

const toggleEvent = (req, res) => {
	const event_id = req.params.id;
	const user_id = req.user.id;
	const { suspended } = req.body;
	const isSuspended = suspended ? 1 : 0;
	db.run(`UPDATE events SET suspended = ?
	 	WHERE id = ? AND user_id = ?`,
		[isSuspended, event_id, user_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			if (this.changes === 0) {
            	return res.status(404).json({ error: 'Event not found or you are not the owner' });
        	}
			res.json({ success: true, message: "Event updated." });
		}
	);
}

module.exports = { getEvent, getEvents, createEvent, editEvent, deleteEvent, toggleEvent };