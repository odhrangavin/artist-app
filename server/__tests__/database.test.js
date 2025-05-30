import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';

// import { getTestDB } from './dbSetup.js';
// import { createApp } from '../createApp.js';
import app from './server.js'
// import db from './db.js'

// Add secret key
process.env.JWT_SECRET = 'testSecretKey123'

// // Initialize variables
// let testDB;
// let app;

// Execute before each test
// beforeEach(async () => {
//   // Start a clean DB
//   db = db; 
//   // app = createApp(testDB);
// });

describe('User API', () => {
  it('should create a new user (post method)', async () => {
    const res = await request(app)
      .post('/api/users')
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

  it('should get list of users (get method)', async () => {
    const res = await request(app).get('/api/users');
    
    // Test response status, number of users, and email
    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(2);
    expect(res.body.users[1].email).toBe('test@example.com');
  });
});

