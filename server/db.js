const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBFILE = path.join(__dirname, 'data', 'data.db')

const db = new sqlite3.Database(DBFILE, err => {
	if (err) {
		console.error('Failed to open database:', err);
		process.exit(1);
	}

	//create users table
	db.run(
		`CREATE TABLE IF NOT EXISTS users (
		id         INTEGER PRIMARY KEY,
		email      TEXT UNIQUE,
		username   TEXT,
		password   TEXT,
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
		id          INTEGER PRIMARY KEY,
		external_id TEXT UNIQUE,
		genre       TEXT,
		title       TEXT,
		body        TEXT,
		image_url   TEXT,
		event_date  TEXT,
		event_time  TEXT,
		location    TEXT,
		user_id     INTEGER,
		created_at  TEXT,
		
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

module.exports = db;