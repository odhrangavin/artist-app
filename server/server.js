//constants
const env = require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3000;

//project includes
const router = require('./routes');
const { login } = require('./controllers/authController')

//middleware
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', router);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images/');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage });

//basic routes
app.get('/', (req, res) => {
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

app.get('/test', (req, res) => {
	res.json(
		{
			message: 'successful test',
			time:    new Date().toDateString(),
		}
	)
});

app.get('/api-tests', (req, res) => {
	res.sendFile(__dirname + '/api-tests.html');
});

app.get('/login-tests', (req, res) => {
	res.sendFile(__dirname + '/login-tests.html');
});

app.post('/api/upload', upload.single('file'), (req, res) => {
	res.json({ url: 'http://localhost:3000/images/' + req.file.filename });
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(PORT, () => {
	// console.log(`Server running: http://localhost:${PORT}/`);
});

module.exports = app