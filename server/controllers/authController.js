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
		res.status(201).json({ token: token });
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
		res.json({ token: token });
	});
};

const requestReset = (req, res) => {
	const { email } = req.body;
	const sql = 'SELECT * FROM users WHERE email =  ?';
	db.get(sql, [email], async (err, user) => {
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const resetToken = jwt.sign(
			{ userId: user.id },
			process.env.JWT_SECRET,
			{ expiresIn: '15m' }
		);
		console.log(`Password reset token for ${email}: ${resetToken}`);
		res.json( resetToken );
	});
};

const passwordReset = async (req, res) => {
	const { token, newPassword } = req.body;
	const sql = 'SELECT * FROM users WHERE id =  ?';
	const payload = jwt.verify(token, process.env.JWT_SECRET);
	const id = payload.userId;
	db.get(sql, [id], async (err, user) => {
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const sql = 'UPDATE users set password = ? WHERE id = ?'
		db.run(sql, [hashedPassword, id], function (err) {
			if (err){
				return res.status(500).json({ message: 'Invalid' });
			}
			res.json({ message: 'Password has been reset successfully' });
		});
	});
};

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token){
		return res.sendStatus(401);
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err){
			return res.sendStatus(403);
		}
		req.user = user;  // decoded token payload here
		next();
	});
}

module.exports = { register, login, requestReset, passwordReset, authenticateToken };
