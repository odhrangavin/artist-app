const db = require('../db');

// const getFave = (req, res) => {
// 	let event_id = req.params.id;
// 	let user_id = req.user.id
// 	db.get(`SELECT * FROM faves WHERE event_id = ? AND user_id = ?`,
// 		[event_id, user_id],
// 		function (err, row) {
// 			res.json({user: row});
// 		});
// }

const getFaves = (req, res) => {
	let id = req.user.id;
	db.all(`SELECT * FROM faves WHERE user_id = ?`,
		[id],
		function (err, row) {
			res.json({user: row});
		}
	);
}

const getFavesEvents = (req, res) => {
	let user_id = req.user.id;
	db.all(`SELECT
				events.id,
				events.external_id,
				events.genre,
				events.title,
				events.description,
				events.image_url,
				events.event_date,
				events.event_time,
				events.location,
				events.venue,
				events.user_id AS event_user_id,
				events.created_at,
				events.suspended,
				faves.id,
				faves.event,
				faves.user_id AS faves_user_id,
				faves.created_at
			FROM events JOIN faves ON events.id = faves.event WHERE faves.user_id = ?;`,
		[user_id],
		function (err, row) {
			res.json({user: row});
		}
	);
}

const getFaveCount = (req, res) => {
	let event_id = req.params.id;
	db.get(`SELECT count(id) AS attendance FROM faves WHERE event = ?`,
		[event_id],
		function (err, row) {
			res.json(row)
		}
	)
}

const addFave = (req, res) => {
	const { event, user_id } = req.body;
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO faves (event, user_id, created_at)
			VALUES (?, ?, ?)`,
		[event, user_id, created_at],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.status(201).json(this);
		}
	);
}

const deleteFave = (req, res) => {
	const id = req.params.id;
	db.run(`DELETE FROM faves WHERE id = ?`,
		[id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
}

module.exports = { getFaves, getFavesEvents, getFaveCount, addFave, deleteFave };