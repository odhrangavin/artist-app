//routes are going here eventually
const express = require('express');

const router = express.Router();

router.route('/events')
	.post((req, res, next) =>{
		next(new Error('/events post not implemented'))
	})
	.get((req, res, next) =>{
		next(new Error('/events get not implemented'))
	})
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
		next(new Error('/events/:id get not implemented'))
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
	.post((req, res, next) =>{
		next(new Error('/users post not implemented'))
	})
	.get((req, res, next) =>{
		next(new Error('/users get not implemented'))
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
		next(new Error('/users/:id get not implemented'))
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