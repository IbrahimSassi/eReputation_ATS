/**
 * Created by MrFirases on 3/20/2017.
 */
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../../models/users');
var addingUser = false;
//*************************************************************

//*************************************************************
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};


/**
 * Passport Register
 * @param req
 * @param res
 */

module.exports.register = function (req, res) {

  /**
   * All Field Verification
   */
  if (req.body.accountType == 'individual' && (!req.body.email || !req.body.password || !req.body.username || !req.body.firstName || !req.body.lastName)) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  if (req.body.accountType == 'business' && (!req.body.email || !req.body.password || !req.body.businessName || !req.body.employeesNumber || !req.body.businessType)) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  User.findOne({email: req.body.email}, function (err, findUser) {
    if (!findUser) {
      console.log('Adding User...');
      if (req.body.accountType == 'individual') {
        var user = new User.Individual();
        user.username = req.body.username;
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.creationDate = new Date();
        user.state = "INACTIVE";
      }
      else if (req.body.accountType == 'business') {
        var user = new User.Business();
        user.email = req.body.email;
        user.businessName = req.body.businessName;
        user.employeesNumber = req.body.employeesNumber;
        user.businessType = req.body.businessType;
        user.creationDate = new Date();
        user.state = "INACTIVE";
      }

      user.setPassword(req.body.password);

      user.save(function (err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        console.log('token: ' + token);

        res.json({
          "token": token
        });
      });

    }

    else {
      res.status(401).json();
    }

  });


};

/**
 * Passport Login
 * @param req
 * @param res
 */

module.exports.login = function (req, res) {

  passport.authenticate('local', function (err, user, info) {
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user && user.state != 'INACTIVE') {
      console.log("Password: ", user.validPassword("000000"));
      console.log("My User: ", user);
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
    }
    else if (user.state == 'INACTIVE') {
      res.status(400).json({warning: 'Please confirm your email address'});
    }
    else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
