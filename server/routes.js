//routes are going here eventually
const express = require('express');
const { register, login } = require('./controllers/authController')
const { getEvents, createEvent } = require('./controllers/eventController')

const router = express.Router();

//basic routes
router.get('/', (req, res) => {
	res.send(`
		<html>
			<head>
				<title>Server</title>
			</head>
			<body>
				<p>Server running at ${ new Date().toDateString() }.</p>
			</body>
		</html>
	`);
});

router.get('/api/test', (req, res) => {
	res.json(
		{
			message: 'successful test',
			time:    new Date().toDateString(),
		}
	)
});

router.get('/api-tests', (req, res) => {
	res.sendFile(__dirname + '/api-tests.html');
})

router.get('/login-tests', (req, res) => {
	res.sendFile(__dirname + '/login-tests.html');
})

//login & registration
router.post('/login', login);

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