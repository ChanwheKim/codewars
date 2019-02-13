var express = require('express');

var index = require('./routes/index');

var app = express();

var sassMiddleware = require('node-sass-middleware');

const path = require('path');

const bodyParser = require('body-parser');

app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	debug: false,
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', index);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const server = app.listen(4000, function() {
  console.log('Express server has started on port 4000.');
});

app.use(express.static('public'));
app.use('/problems', express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
