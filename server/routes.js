//routes are going here eventually
const express = require('express');
const db = require('./db');
const { register, login, requestReset, passwordReset, authenticateToken } = require('./controllers/authController')
const { getEvents, createEvent } = require('./controllers/eventController');
const { scrapeTicketmaster, scrapeFailte } = require('./controllers/scrapeController')
const { addFave, deleteFave } = require('./controllers/faveController')

const router = express.Router();

router.post('/login', login);
router.post('/users/request-reset', requestReset);
router.post('/users/password-reset', passwordReset);
router.get('/test/ticketmaster', scrapeTicketmaster);
router.get('/test/failte', scrapeFailte);

router.route('/events')
	.post(createEvent)
	.get(getEvents)
	.put((req, res, next) =>{
		next(new Error('NOT VALID'))
	})
	.delete((req, res, next) =>{
		next(new Error('NOT VALID'))
	});

router.route('/events/:id')
	.post((req, res, next) =>{
		next(new Error('NOT VALID'))
	})
	.get((req, res, next) =>{
		let id = req.params.id;
		db.get(`SELECT * FROM events WHERE id = ${ id }`,
		function (err, row) {
			res.json({event: row});
		});
	})
	.put((req, res, next) =>{
		let id = req.params.id;
		next(new Error('/events/:id put not implemented'))
	})
	.delete((req, res, next) =>{
		let id = req.params.id;
		next(new Error('/events/:id delete not implemented'))
	});

router.route('/users')
	.post(register)
	.get((req, res, next) =>{
		db.all(`SELECT * FROM users`,
		function (err, rows) {
			res.json({users: rows});
		});
	})
	.put((req, res, next) =>{
		next(new Error('NOT VALID'))
	})
	.delete((req, res, next) =>{
		next(new Error('NOT VALID'))
	});

router.route('/users/me')
	.post((req, res, next) =>{
		next(new Error('NOT VALID'))
	})
	.get(authenticateToken, (req, res, next) =>{
		let id = req.user.id;
		db.get(`SELECT * FROM users WHERE id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put((req, res, next) =>{
		let id = req.params.id;
		next(new Error('/users/:id put not implemented'))
	})
	.delete((req, res, next) =>{
		let id = req.params.id;
		next(new Error('/users/:id delete not implemented'))
	});

router.route('/users/me/faves')
	.post(addFave)
	.get(authenticateToken, (req, res, next) =>{
		let id = req.user.id;
		db.get(`SELECT * FROM faves WHERE user_id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put((req, res, next) =>{
		let id = req.params.id;
		next(new Error('NOT VALID'))
	})
	.delete((req, res, next) =>{
		let id = req.params.id;
		next(new Error('NOT VALID'))
	});

router.route('/users/me/faves/:id')
	.post((req, res, next) =>{
		next(new Error('NOT VALID'))
	})
	.get(authenticateToken, (req, res, next) =>{
		let id = req.params.id;
		db.get(`SELECT * FROM faves WHERE id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put((req, res, next) =>{
		let id = req.params.id;
		next(new Error('NOT VALID'))
	})
	.delete(deleteFave);

router.route('/users/:id')
	.post((req, res, next) =>{
		next(new Error('NOT VALID'))
	})
	.get((req, res, next) =>{
		let id = req.params.id;
		db.get(`SELECT * FROM users WHERE id = ${ id }`,
			function (err, row) {
				res.json({user: row});
			});
	})
	.put((req, res, next) =>{
		let id = req.params.id;
		next(new Error('/users/:id put not implemented'))
	})
	.delete((req, res, next) =>{
		let id = req.params.id;
		next(new Error('/users/:id delete not implemented'))
	});

module.exports = router;