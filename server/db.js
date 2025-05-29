const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBFILE = path.join(__dirname, 'data', 'data.db')
let db;

if(process.env.NODE_ENV == 'test'){
	console.log("in test")
	db = new sqlite3.Database(':memory:', err => {
		if (err) {
			console.error('Failed to open database:', err);
			process.exit(1);
		}
	});
}else{
	db = new sqlite3.Database(DBFILE, err => {
		if (err) {
			console.error('Failed to open database:', err);
			process.exit(1);
		}
	});
}

//create users table
db.run(
	`CREATE TABLE IF NOT EXISTS users (
		id         INTEGER PRIMARY KEY,
		email      TEXT UNIQUE NOT NULL,
		username   TEXT UNIQUE NOT NULL,
		password   TEXT NOT NULL,
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
		title       TEXT NOT NULL,
		description TEXT,
		image_url   TEXT,
		event_date  TEXT,
		event_time  TEXT,
		location    TEXT,
		venue       TEXT,
		user_id     INTEGER NOT NULL,
		created_at  TEXT,	
		FOREIGN KEY(user_id) REFERENCES users(id)
	)`,
	err => { 
		if (err){
			console.error('events table error:', err);
		}else{
			console.log('events table functional')
			let created = new Date().toISOString();
			//create user #1 as system write user if not there
			//password hash is nonsense, this user cannot log in
			db.run(
				`INSERT OR IGNORE INTO users 
						(id, email, username, password, role, created_at)
						VALUES (1, 'system-user@system.system', 'system-user', 'F1uIWVbof/AwWFi3Y8EivDa31qxs2Pu.$2b$10$jI5yLWbWDre78stUQHxbC', 'system-user', '${ created }')`,
				function (err) { 
					if (err){
						console.error('user creation error', err);
					}else if(this.changes > 0){
						console.log('root user created');
					}else{
						console.log('root user exists');
					}
				}
			)
		}
	}
);

module.exports = db;