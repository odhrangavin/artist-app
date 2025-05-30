const db = require('../db');

const editUser = (req, res) => {
	const { email, username, user_id } = req.body;
	db.run(`UPDATE users SET email = ?, username = ?
	 	WHERE id = ?`,
		[email, username, user_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
}

const deleteUser = (req, res) => {
	const { user_id } = req.body;
	db.run(`DELETE FROM users WHERE id = ?`,
		[user_id],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
}

module.exports = { editUser, deleteUser };