//constants
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;
const DBFILE = path.join(__dirname, 'data', 'data.db')

//middleware
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//DB setup
const db = new sqlite3.Database(DBFILE, err => {
	if (err) {
		console.error("Failed to open database:", err);
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
				console.error("users table error:", err);
			}else{
				console.log("users table functional");
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
				console.error("events table error:", err);
			}else{
				console.log("events table functional")
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

//user routes
app.get('/api/user/:id', (req, res) => {
	let id = req.params.id;
	res.send(`user id: ${ id }`);
});

app.get('/api/users/all', (req, res) => {
	res.send(`all users`);
});

app.post('/api/users/register', (req, res) => {
	res.send(`user registration`);
});

//event routes
app.get('/api/event/:id', (req, res) => {
	let id = req.params.id;
	res.send(`event id: ${ id }`);
});

app.get('/api/events/all', (req, res) => {
	res.send(`all events`);
});

app.get('/api/events/search', (req, res) => {
	console.log(req.query);
	res.json(req.query);
});

app.post('/api/events/create', (req, res) => {
	res.send(`event creation`);
});

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}/`);
});