const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');

const register = async (req, res) => {
	const { email, username, password, confirm, role } = req.body;
	if (password !== confirm) {
		return res.status(400).json({ message: 'Passwords do not match' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const sql = 'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)';

	db.run(sql, [email, username, hashedPassword, role], function (err) {
		if (err){
			return res.status(500).json({ message: 'User already exists' });
		}

		const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1d' });
		res.status(201).json({ token });
	});
};

const login = (req, res) => {
	const { username, password } = req.body;

	const sql = 'SELECT * FROM users WHERE username = ?';
	db.get(sql, [username], async (err, user) => {
		if (err || !user){
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match){
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
		res.json({ token });
	});
};

module.exports = { register, login };
