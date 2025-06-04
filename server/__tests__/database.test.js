import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';
const jwt = require('jsonwebtoken');

// import { getTestDB } from './dbSetup.js';
// import { createApp } from '../createApp.js';
import app from './server.js'
import db from './db.js'

// Add secret key
process.env.JWT_SECRET = 'testSecretKey123'

const checkTableExists = (db, tableName) => {
	return new Promise((resolve, reject) => {
		db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(!!row); // Returns true if table exists, false otherwise
				}
			}
		);
	});
};

const token = jwt.sign({ id: 2 }, process.env.JWT_SECRET, { expiresIn: '1d' });;

describe('Table checks', () =>{
	it('should have a users table', async () => {
		const res = await checkTableExists(db, 'users');
		expect(res).toBe(true);
	});

	it('should have an events table', async () => {
		const res = await checkTableExists(db, 'events');
		expect(res).toBe(true);
	});

	it('should have a faves table', async () => {
		const res = await checkTableExists(db, 'faves');
		expect(res).toBe(true);
	});

	it('should not have a balderdash table', async () => {
		const res = await checkTableExists(db, 'balderdash');
		expect(res).toBe(false);
	});

	it('should have a system-user user', async () => {
		const res = await request(app).get('/api/users/1')
		expect(res.body.user.username).toBe('system-user');
	});
});


describe('User API', () => {
	it('should create a new user (POST))', async () => {
		const res = await request(app).post('/api/users')
			.send({ username: 'testuser', 
				email: 'test@example.com', 
				password: 'test1234' ,
				confirm: 'test1234',
				role: 'artist'
			});
		// Test response status and that username is correct
		expect(res.status).toBe(201);
		const res2 = await request(app).get('/api/users/2')
		expect(res2.body.user.username).toBe('testuser');
		expect(res2.body.user.email).toBe('test@example.com');
 
	});

	it('should get list of users (GET)', async () => {
		const res = await request(app).get('/api/users');
		// Test response status, number of users, and email
		expect(res.status).toBe(200);
		expect(res.body.users).toHaveLength(2);
		expect(res.body.users[1].email).toBe('test@example.com');
	});

	it('should get the "me" user (GET)', async () => {
		const res = await request(app).get('/api/users/me')
			.set('authorization', `Bearer: ${ token }`)
		// expect(res.status).toBe(201);
		console.log(res.body.user);
		expect(res.body.user.username).toBe('testuser');
	});

	it('should change username (PUT)', async () => {
		const res = await request(app).put('/api/users/me')
			.set('authorization', `Bearer: ${ token }`)
			.send({ username: 'testuser-modified', 
					email: 'test@example.com', 
				});
		// expect(res.status).toBe(201);
		const res2 = await request(app).get('/api/users/2');
		expect(res2.body.user.username).toBe('testuser-modified');
		expect(res2.body.user.email).toBe('test@example.com');
	});
});

