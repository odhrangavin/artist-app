const db = require('../db');

const addFave = (req, res) => {
	const { event, user_id } = req.body;
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO events (event, user_id, created_at)
			VALUES (?, ?, ?)`);
		[event, user_id, created_at],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
}

const deleteFave = (req, res) => {
	const user_id = req.params.id;;
	db.run(`DELETE FROM events WHERE id = ?
			VALUES (?`);
		[user_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
}

module.exports = { addFave, deleteFave };