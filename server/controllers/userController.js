const db = require('../db');

const getUser = (req, res) => {
	let id = req?.user?.id ?? req.params.id;
	db.get(`SELECT * FROM users WHERE id = ?`,
		[id],
		function (err, row) {
			res.json({user: row});
		});
}

const getUsers = (req, res) => {
	db.all(`SELECT * FROM users`,
		function (err, rows) {
			res.json({users: rows});
		});
}

const getUserEvents = (req, res) => {
	let id = req.user.id;
	db.all(`SELECT * FROM events WHERE user_id = ?`,
		[id],
		function (err, row) {
			res.json({events: row});
		});
}

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

module.exports = { getUser, getUsers, getUserEvents, editUser, deleteUser };