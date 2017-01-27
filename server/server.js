// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/environment');
var errors = require('./components/errors');

// Get our API routes
//const api = require('./server/routes/api');






// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);








const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
exports = module.exports = app;