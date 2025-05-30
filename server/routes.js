//routes are going here eventually
const express = require('express');
const db = require('./db');
const { register, login, requestReset, passwordReset, authenticateToken } = require('./controllers/authController')
const { editUser, deleteUser } = require('./controllers/userController')
const { getEvents, createEvent, editEvent, deleteEvent } = require('./controllers/eventController');
const { scrapeTicketmaster, scrapeFailte } = require('./controllers/scrapeController')
const { addFave, deleteFave } = require('./controllers/faveController')

const router = express.Router();

const invalidRoute = (req, res, next) =>{
		next(new Error('Not a valid route'))
	};

router.post('/login', login);
router.post('/users/request-reset', requestReset);
router.post('/users/password-reset', passwordReset);
router.get('/test/ticketmaster', scrapeTicketmaster);
router.get('/test/failte', scrapeFailte);

//authentication?
router.route('/events')
	.post(authenticateToken, createEvent)
	.get(getEvents)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/events/:id')
	.post(invalidRoute)
	.get((req, res, next) =>{
		let id = req.params.id;
		db.get(`SELECT * FROM events WHERE id = ${ id }`,
		function (err, row) {
			res.json({event: row});
		});
	})
	.put(authenticateToken, editEvent)
	.delete(authenticateToken, deleteEvent);

router.route('/users')
	.post(register)
	.get((req, res, next) =>{
		db.all(`SELECT * FROM users`,
		function (err, rows) {
			res.json({users: rows});
		});
	})
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me')
	.post(invalidRoute)
	.get(authenticateToken, (req, res, next) =>{
		let id = req.user.id;
		db.get(`SELECT * FROM users WHERE id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put(authenticateToken, editUser)
	.delete(authenticateToken, deleteUser);

router.route('/users/me/events')
	.post(invalidRoute)
	.get(authenticateToken, (req, res, next) =>{
		let id = req.user.id;
		db.all(`SELECT * FROM events WHERE user_id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/faves')
	.post(addFave)
	.get(authenticateToken, (req, res, next) =>{
		let id = req.user.id;
		db.get(`SELECT * FROM faves WHERE user_id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/faves/:id')
	.post(invalidRoute)
	.get(authenticateToken, (req, res, next) =>{
		let id = req.params.id;
		db.get(`SELECT * FROM faves WHERE id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put(invalidRoute)
	.delete(authenticateToken, deleteFave);

router.route('/users/:id')
	.post(invalidRoute)
	.get((req, res, next) =>{
		let id = req.params.id;
		db.get(`SELECT * FROM users WHERE id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put(invalidRoute)
	.delete(invalidRoute);

module.exports = router;