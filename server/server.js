//constants
const env = require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

//project includes
const router = require('./routes');

//middleware
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/testing', router);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//ROUTES

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}/`);
});