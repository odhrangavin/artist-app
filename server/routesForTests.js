const express = require('express');

// Take db as a parameter
module.exports = function createRouter(db) {
  const {
    register,
    login,
    requestReset,
    passwordReset,
    authenticateToken,
  } = require('./controllers/authControllerForTests')(db); // pass db to the controllers

  const {
    getEvents,
    createEvent,
  } = require('./controllers/eventControllerForTests')(db); 

  const router = express.Router();

  router.post('/login', login);
  router.post('/users/request-reset', requestReset);
  router.post('/users/password-reset', passwordReset);

  router.route('/events')
    .post(createEvent)
    .get(getEvents)
    .put((req, res, next) => next(new Error('NOT VALID')))
    .delete((req, res, next) => next(new Error('NOT VALID')));

  router.route('/events/:id')
    .post((req, res, next) => next(new Error('NOT VALID')))
    .get((req, res) => {
      const id = req.params.id;
      db.get(`SELECT * FROM events WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ event: row });
      });
    })
    .put((req, res, next) => next(new Error('/events/:id put not implemented')))
    .delete((req, res, next) => next(new Error('/events/:id delete not implemented')));

  router.route('/users')
    .post(register)
    .get((req, res) => {
      db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ users: rows });
      });
    })
    .put((req, res, next) => next(new Error('NOT VALID')))
    .delete((req, res, next) => next(new Error('NOT VALID')));

  router.route('/users/me')
    .post((req, res, next) => next(new Error('NOT VALID')))
    .get(authenticateToken, (req, res) => {
      const id = req.user.id;
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ user: row });
      });
    })
    .put((req, res, next) => next(new Error('/users/:id put not implemented')))
    .delete((req, res, next) => next(new Error('/users/:id delete not implemented')));

  router.route('/users/:id')
    .post((req, res, next) => next(new Error('NOT VALID')))
    .get((req, res) => {
      const id = req.params.id;
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ user: row });
      });
    })
    .put((req, res, next) => next(new Error('/users/:id put not implemented')))
    .delete((req, res, next) => next(new Error('/users/:id delete not implemented')));

  return router;
};
