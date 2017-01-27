'use strict';

var User = require('./user.model');
var config = require('../../config/environment');
//var jwt = require('jsonwebtoken');
var gravatar = require('gravatar');

var validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {

  //create Gravatar
  var getGravatar = gravatar.url(req.body.email, {
    s: 40,
    d: 'retro'
  })

  var newUser = new User(req.body);

  newUser.gravatar = getGravatar;
  newUser.provider = 'local';
  newUser.role = 'user';


  newUser.save(function (err, user) {
    if (err) return console.error(err);
    res.status(201).json(user);

  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  console.log(userId)
  User.find(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  res.redirect('/');
};
