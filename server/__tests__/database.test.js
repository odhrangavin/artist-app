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

describe('Table checks', () => {
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

describe('Invalid route checks', () => {
	it('should not access PUT /events', async () => {
		const res = await request(app).put('/api/events')
		expect(res.status).toBe(500);
	})

	it('should not access DELETE /events', async () => {
		const res = await request(app).delete('/api/events')
		expect(res.status).toBe(500);
	})

	it('should not access POST /events/:id', async () => {
		const res = await request(app).post('/api/events/1')
		expect(res.status).toBe(500);
	})

	it('should not access PUT /users', async () => {
		const res = await request(app).put('/api/users')
		expect(res.status).toBe(500);
	})

	it('should not access DELETE /users', async () => {
		const res = await request(app).delete('/api/users')
		expect(res.status).toBe(500);
	})

	it('should not access POST /users/me', async () => {
		const res = await request(app).post('/api/users/me')
		expect(res.status).toBe(500);
	})

	it('should not access POST /users/me/events', async () => {
		const res = await request(app).post('/api/users/me/events')
		expect(res.status).toBe(500);
	})

	it('should not access PUT /users/me/events', async () => {
		const res = await request(app).put('/api/users/me/events')
		expect(res.status).toBe(500);
	})

	it('should not access DELETE /users/me/events', async () => {
		const res = await request(app).delete('/api/users/me/events')
		expect(res.status).toBe(500);
	})

	it('should not access PUT /users/me/faves', async () => {
		const res = await request(app).put('/api/users/me/faves')
		expect(res.status).toBe(500);
	})

	it('should not access DELETE /users/me/faves', async () => {
		const res = await request(app).delete('/api/users/me/faves')
		expect(res.status).toBe(500);
	})

	it('should not access POST /users/me/faves/full', async () => {
		const res = await request(app).post('/api/users/me/faves/full')
		expect(res.status).toBe(500);
	})

	it('should not access PUT /users/me/faves/full', async () => {
		const res = await request(app).put('/api/users/me/faves/full')
		expect(res.status).toBe(500);
	})

	it('should not access DELETE /users/me/faves/full', async () => {
		const res = await request(app).delete('/api/users/me/faves/full')
		expect(res.status).toBe(500);
	})

	it('should not access POST /users/me/faves/:id', async () => {
		const res = await request(app).post('/api/users/me/faves/1')
		expect(res.status).toBe(500);
	})

	it('should not access GET /users/me/faves/:id', async () => {
		const res = await request(app).get('/api/users/me/faves/1')
		expect(res.status).toBe(500);
	})

	it('should not access PUT /users/me/faves/:id', async () => {
		const res = await request(app).put('/api/users/me/faves/1')
		expect(res.status).toBe(500);
	})

	it('should not access POST /users/:id', async () => {
		const res = await request(app).post('/api/users/2')
		expect(res.status).toBe(500);
	})

	it('should not access PUT /users/:id', async () => {
		const res = await request(app).put('/api/users/2')
		expect(res.status).toBe(500);
	})

	it('should not access DELETE /users/:id', async () => {
		const res = await request(app).delete('/api/users/2')
		expect(res.status).toBe(500);
	})
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
		expect(res.status).toBe(201);
		const res2 = await request(app).get('/api/users/2')
		expect(res2.body.user.username).toBe('testuser');
		expect(res2.body.user.email).toBe('test@example.com');
 
	});

	it('should get list of users (GET)', async () => {
		const res = await request(app).get('/api/users');
		expect(res.status).toBe(200);
		expect(res.body.users).toHaveLength(2);
		expect(res.body.users[1].email).toBe('test@example.com');
	});

	it('should get the "me" user (GET)', async () => {
		const res = await request(app).get('/api/users/me')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user.username).toBe('testuser');
	});

	it('should change username (PUT)', async () => {
		const res = await request(app).put('/api/users/me')
			.set('authorization', `Bearer: ${ token }`)
			.send({ username: 'testuser-modified', 
					email: 'test@example.com', 
				});
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/users/2');
		expect(res2.body.user.username).toBe('testuser-modified');
		expect(res2.body.user.email).toBe('test@example.com');
	});
});

describe('Events API', () => {
	it('should have no events', async () => {
		const res = await request(app).get('/api/events')
		expect(res.body.results).toHaveLength(0);
	});

	it('should create an event', async () => {
		const res = await request(app).post('/api/events')
			.set('authorization', `Bearer: ${ token }`)
			.send({ title: "Testing Event",
				description: "An event for testing",
				image_url: "",
				event_time: "",
				location: "Test Location",
				venue: "Test Venue",
				genre: "Other",
				user_id: 2
			});
		expect(res.status).toBe(201);
		const res2 = await request(app).get('/api/events/1')
		expect(res2.body.event.id).toBe(1);
		expect(res2.body.event.user_id).toBe(2);
		expect(res2.body.event.genre).toBe("Other")
	})

	it('should now have one event', async () => {
		const res = await request(app).get('/api/events')
		expect(res.body.results).toHaveLength(1);
	});

	it('should now have one event with Genre = "Other', async () => {
		const res = await request(app).get('/api/events?genre=other')
		expect(res.body.results).toHaveLength(1);
	});

	it('should now have no events with Genre = "Alternative', async () => {
		const res = await request(app).get('/api/events?genre=alternative')
		expect(res.body.results).toHaveLength(0);
	});

	it('should edit the test event', async () => {
		const res = await request(app).put('/api/events/1')
			.set('authorization', `Bearer: ${ token }`)
			.send({ title: "Testing Event",
				description: "An event for testing",
				image_url: "",
				event_time: "",
				location: "Test Location",
				venue: "Test Venue",
				genre: "Alternative",
			});
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/events/1')
		expect(res2.body.event.id).toBe(1);
		expect(res2.body.event.user_id).toBe(2);
		expect(res2.body.event.genre).toBe("Alternative")
	})

	it('should suspend the test event', async () => {
		const res = await request(app).patch('/api/events/1')
			.set('authorization', `Bearer: ${ token }`)
			.send({ suspended: true });
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/events/1')
		expect(res2.body.event.id).toBe(1);
		expect(res2.body.event.user_id).toBe(2);
		expect(res2.body.event.suspended).toBe(1)
	})

	it('should un-suspend the test event', async () => {
		const res = await request(app).patch('/api/events/1')
			.set('authorization', `Bearer: ${ token }`)
			.send({ suspended: false });
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/events/1')
		expect(res2.body.event.id).toBe(1);
		expect(res2.body.event.user_id).toBe(2);
		expect(res2.body.event.suspended).toBe(0)
	})

	it('should return a list of a user\'s events', async () => {
		const res = await request(app).get('/api/users/me/events')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.events[0].id).toBe(1);
		expect(res.body.events[0].user_id).toBe(2);
		expect(res.body.events[0].genre).toBe('Alternative');
	})
})

describe('Faves API', () => {
	it('should have no faves', async () => {
		const res = await request(app).get('/api/users/me/faves')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user).toHaveLength(0);
	})

	it('should create a fave ', async () => {
		const res = await request(app).post('/api/users/me/faves')
			.set('authorization', `Bearer: ${ token }`)
			.send({
				event: 1,
				user_id: 2
			});
		expect(res.status).toBe(201);
		expect(res.body.lastID).toBe(1);
	})

	it('should now have one fave', async () => {
		const res = await request(app).get('/api/users/me/faves')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user).toHaveLength(1);
	})

	it('should get the full faves details', async () => {
		const res = await request(app).get('/api/users/me/faves/full')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user).toHaveLength(1);
		expect(res.body.user[0].genre).toBe("Alternative");
	})

	it('should error on attempting to create a duplicate fave', async () => {
		const res = await request(app).post('/api/users/me/faves')
			.set('authorization', `Bearer: ${ token }`)
			.send({
				event: 1,
				user_id: 2
			});
		expect(res.status).toBe(500);
	})
})

describe('Attending API', () => {
	it('should have no faves', async () => {
		const res = await request(app).get('/api/users/me/attending')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user).toHaveLength(0);
	})

	it('should create a attendance', async () => {
		const res = await request(app).post('/api/users/me/attending')
			.set('authorization', `Bearer: ${ token }`)
			.send({
				event: 1,
				user_id: 2
			});
		expect(res.status).toBe(201);
		expect(res.body.lastID).toBe(1);
	})

	it('should now have one fave', async () => {
		const res = await request(app).get('/api/users/me/attending')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user).toHaveLength(1);
	})

	it('should get the full attendance details', async () => {
		const res = await request(app).get('/api/users/me/attending/full')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		expect(res.body.user).toHaveLength(1);
		expect(res.body.user[0].genre).toBe("Alternative");
	})

	it('should error on attempting to create a duplicate attendance', async () => {
		const res = await request(app).post('/api/users/me/attending')
			.set('authorization', `Bearer: ${ token }`)
			.send({
				event: 1,
				user_id: 2
			});
		expect(res.status).toBe(500);
	})

	it('should give an attendance count', async () => {
		const res = await request(app).get('/api/events/1/attendance')
		expect(res.status).toBe(200);
		expect(res.body.attendance).toBe(1);
	})
})

describe('Deletions', () => {
	it('should delete user (DELETE)', async () => {
		const res = await request(app).delete('/api/users/me')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/users');
		expect(res2.status).toBe(200);
		expect(res2.body.users).toHaveLength(1);
	})

	it('should delete event (DELETE)', async () => {
		const res = await request(app).delete('/api/events/1')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/events');
		expect(res2.status).toBe(200);
		expect(res2.body.results).toHaveLength(0);
	})

	it('should delete fave (DELETE)', async () => {
		const res = await request(app).delete('/api/users/me/faves/1')
			.set('authorization', `Bearer: ${ token }`)
		expect(res.status).toBe(200);
		const res2 = await request(app).get('/api/users/me/faves')
			.set('authorization', `Bearer: ${ token }`)
		expect(res2.status).toBe(200);
		expect(res2.body.user).toHaveLength(0);
	})
})