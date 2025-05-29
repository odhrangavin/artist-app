import sqlite3 from 'sqlite3';

// External DB in memory used for testing
export function getTestDB() {
  // Use DB in memory
  const db = new sqlite3.Database(':memory:'); 
  // Run db in sequence order
  db.serialize(() => {
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
        if (err) throw new Error('Users table creation error:', err.message);
      }
    );
  });
  
  return db;
}