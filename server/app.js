var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var admin = require('./routes/admin');
var index = require('./routes/index');
var users = require('./routes/users');
var TestFacebookScraping = require('./routes/TestFacebookScraping');

/** APIS*/
var webScraping = require('./routes/API/webScraping/index');
var twitterScraping = require('./routes/API/twitterScraping/twitterScraping');
var facebookScraping = require('./routes/API/facebookScraping');
var twitter = require('./routes/API/twitterScraping/twitter');
var wwsa = require('./routes/API/wwsa/index');
/**End APIS*/

var ejs = require('ejs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//MongoDB Connection
var mongoose   = require('mongoose');
// mongoose.connect('mongodb://:@localhost:27017/ats');
mongoose.connect('mongodb://bro:brobro0055@ds157469.mlab.com:57469/ats-digital');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin);
app.use('/', index);
app.use('/users', users);
app.use('/TestFacebookScraping', TestFacebookScraping);
app.use('/API/webScraping', webScraping);
app.use('/API/twitterScraping', twitterScraping);
app.use('/API/wwsa', wwsa);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
