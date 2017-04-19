var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var admin = require('./routes/admin');
var index = require('./routes/index');
var users = require('./routes/users/index');
var usersVerification = require('./routes/users/verification');
var settings = require('./routes/users/settings');


/** APIS*/
var webScraping = require('./routes/API/webScraping/index');
var twitterScraping = require('./routes/API/twitterScraping/twitterScraping');
var facebook = require('./routes/API/facebook');
var twitter = require('./routes/API/twitter/index');
var websites = require('./routes/API/websites/index');
var wwsa = require('./routes/API/wwsa/index');

var dataProviderScore = require('./routes/sentimental/insights');
//Real Work Starts
var channel = require('./routes/API/channel');
var campaign = require('./routes/API/campaign')

/**End APIS*/

var ejs = require('ejs');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//MongoDB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://bro:brobro0055@ds157469.mlab.com:57469/ats-digital',{
 server: { socketOptions: { connectTimeoutMS: 9879978979 }}
});
 //mongoose.connect('mongodb://localhost:27017/ats-digital-local');

//Adding passport require
require('./config/passport');
app.use(passport.initialize());
app.use(bodyParser.json({limit: '5mb'}));

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
app.use('/api/facebook', facebook);
app.use('/api/webScraping', webScraping);
app.use('/api/twitterScraping', twitterScraping);
app.use('/api/wwsa', wwsa);
app.use('/api/channels', channel);
app.use('/api/campaigns', campaign);
app.use('/users/verification', usersVerification);
app.use('/users/settings', settings);
app.use('/attributeScore', dataProviderScore);
app.use('/api/twitter', twitter);
app.use('/api/websites', websites);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
