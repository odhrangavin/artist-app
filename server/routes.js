//routes are going here eventually
const express = require('express');
const db = require('./db');
const { register, login, requestReset, passwordReset, authenticateToken } = require('./controllers/authController')
const { getUser, getUsers, getUserEvents, editUser, deleteUser } = require('./controllers/userController')
const { getEvent, getEvents, createEvent, editEvent, deleteEvent, toggleEvent } = require('./controllers/eventController');
const { scrapeTicketmaster, scrapeFailte } = require('./controllers/scrapeController')
const { getFaves, getFavesEvents, getFaveCount, addFave, deleteFave } = require('./controllers/favesController')
const { getAttending, getAttendingEvents, getAttendanceCount, addAttending, deleteAttending } = require('./controllers/attendController')

const router = express.Router();

const invalidRoute = (req, res, next) =>{
		next(new Error('Not a valid route'))
	};

router.post('/login', login);
router.post('/users/request-reset', requestReset);
router.post('/users/password-reset', passwordReset);
router.get('/scraper/ticketmaster', scrapeTicketmaster);
router.get('/scraper/failte', scrapeFailte);

//authentication?
router.route('/events')
	.post(authenticateToken, createEvent)
	.get(getEvents)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/events/:id')
	.post(invalidRoute)
	.get(getEvent)
	.put(authenticateToken, editEvent)
	.delete(authenticateToken, deleteEvent)
	.patch(authenticateToken, toggleEvent);

router.route('/events/:id/attendance')
	.post(invalidRoute)
	.get(getAttendanceCount)
	.put(invalidRoute)
	.delete(invalidRoute)

router.route('/users')
	.post(register)
	.get(getUsers)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me')
	.post(invalidRoute)
	.get(authenticateToken, getUser)
	.put(authenticateToken, editUser)
	.delete(authenticateToken, deleteUser);

router.route('/users/me/events')
	.post(invalidRoute)
	.get(authenticateToken,getUserEvents)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/faves')
	.post(authenticateToken, addFave)
	.get(authenticateToken, getFaves)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/faves/full')
	.post(invalidRoute)
	.get(authenticateToken, getFavesEvents)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/faves/:id')
	.post(invalidRoute)
	.get(invalidRoute)
	.put(invalidRoute)
	.delete(authenticateToken, deleteFave);

router.route('/users/me/attending')
	.post(authenticateToken, addAttending)
	.get(authenticateToken, getAttending)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/attending/full')
	.post(invalidRoute)
	.get(authenticateToken, getAttendingEvents)
	.put(invalidRoute)
	.delete(invalidRoute);

router.route('/users/me/attending/:id')
	.post(invalidRoute)
	.get(invalidRoute)
	.put(invalidRoute)
	.delete(authenticateToken, deleteAttending);

router.route('/users/:id')
	.post(invalidRoute)
	.get(getUser)
	.put(invalidRoute)
	.delete(invalidRoute);

module.exports = router;