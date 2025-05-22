//constants
const path = require('path');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const DBFILE = path.join(__dirname, 'data', 'data.db')

//middleware
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//DB setup
const db = new sqlite3.Database(DBFILE, err => {
	if (err) {
		console.error('Failed to open database:', err);
		process.exit(1);
	}

	//create users table
	db.run(
		`CREATE TABLE IF NOT EXISTS users (
		id         INTEGER PRIMARY KEY,
		username   TEXT,
		role       TEXT,
		created_at TEXT
	 )`,
		err => { 
			if (err){
				console.error('users table error:', err);
			}else{
				console.log('users table functional');
			} 	
		}
	);

	//create events table
	db.run(
		`CREATE TABLE IF NOT EXISTS events (
		id         INTEGER PRIMARY KEY,
		title      TEXT,
		body       TEXT,
		image_url  TEXT,
		event_time TEXT,
		location   TEXT,
		user_id    INTEGER,
		created_at TEXT,
		FOREIGN KEY(user_id) REFERENCES users(id)
	 )`,
		err => { 
			if (err){
				console.error('events table error:', err);
			}else{
				console.log('events table functional')
			}
		}
	);
});

//ROUTES
//basic routes
app.get('/', (req, res) => {
	res.send(`
		<html>
			<head>
				<title>Server</title>
			</head>
			<body>
				<p>Server running at ${ new Date().toDateString() }.</p>
			</body>
		</html>
	`);
});

app.get('/api/test', (req, res) => {
	res.json(
		{
			message: 'successful test',
			time:    new Date().toDateString(),
		}
	)
});

app.get('/api-tests', (req, res) => {
	res.sendFile(__dirname + '/api-tests.html');
})

//user routes
app.get('/api/user/:id', (req, res) => {
	let id = req.params.id;
	db.get(`SELECT * FROM users WHERE id = ${ id }`,
		function (err, row) {
			res.json({user: row});
		});
});

app.get('/api/users/all', (req, res) => {
	db.all(`SELECT * FROM users`,
		function (err, rows) {
			res.json({users: rows});
		});
});

app.post('/api/users/register', (req, res) => {
	const { username, role } = req.body;
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO users (username, role, created_at)
	 	VALUES (?, ?, ?)`,
		[username, role, created_at],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
});

//event routes
app.get('/api/event/:id', (req, res) => {
	let id = req.params.id;
	db.get(`SELECT * FROM events WHERE id = ${ id }`,
		function (err, row) {
			res.json({event: row});
		});
});

app.get('/api/events/all', (req, res) => {
	db.all(`SELECT * FROM events`,
		function (err, rows) {
			res.json({events: rows});
		});
});

app.get('/api/events/search', (req, res) => {
	// Define valid searchable columns
	const validColumns = ['title', 'event_time', 'location'];
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
});

app.post('/api/events/create', (req, res) => {
	const { title, body, image_url, event_time, location, user_id } = req.body;
	const created_at = new Date().toISOString();
	db.run(`INSERT INTO events (title, body, image_url, event_time, location, user_id, created_at)
	 	VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[title, body, image_url, event_time, location, user_id, created_at],
		function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(this);
		}
	);
});

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}/`);
});