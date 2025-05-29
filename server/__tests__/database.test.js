import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';

import { getTestDB } from './dbSetup.js';
import { createApp } from '../createApp.js';

// Add secret key
process.env.JWT_SECRET = 'testSecretKey123'

// Initialize variables
let testDB;
let app;

// Execute before each test
beforeEach(async () => {
  // Start a clean DB
  testDB = getTestDB(); 
  app = createApp(testDB);
});

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
    testDB.get('SELECT * FROM users WHERE username = ?', ['testuser'], (err, user) => {
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
    })
 
  });

  it('should get list of users (get method)', async () => {
    // Insert user for testing
    testDB.run(`
      INSERT INTO users (username, email, password, role) 
      VALUES (?, ?, ?, ?)`, 
      ['user1', 'user1@example.com', 'user1234', 'artist']
    );
    
    const res = await request(app).get('/api/users');
    
    // Test response status, number of users, and email
    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].email).toBe('user1@example.com');
  });
});

