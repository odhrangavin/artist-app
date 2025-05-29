const db = require('../db');

const addFave = (req, res) => {
	const { event, user_id } = req.body;
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO faves (event, user_id, created_at)
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
	const event_id = req.params.id;;
	db.run(`DELETE FROM faves WHERE id = ?
			VALUES (?`);
		[event_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
}

module.exports = { addFave, deleteFave };