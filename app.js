const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const index = require('./routes/index');
const { NotFoundError } = require('./lib/error');

const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	debug: false,
}));

app.use('/', index);

app.use(express.static('public'));
app.use('/problems', express.static('public'));

app.use((req, res, next) => {
	next(new NotFoundError());
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error', { status: err.status, message: err.message });
});

module.exports = app;
