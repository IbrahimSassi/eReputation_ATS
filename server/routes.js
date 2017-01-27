/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function (app) {

  // Insert routes below


  app.get('/api', (req, res) => {
    res.send('api works');
  });

  app.use('/api/users', require('./api/user'));


  // Catch all other routes and return the index file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });


  // All undefined asset or api routes should return a 404
  app.route('/:url(auth|components|app|bower_components|assets)/*')
    .get(errors[404]);





};
