/**
 * Created by MrFirases on 3/20/2017.
 */
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../../models/users');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();
console.log('He we save'+req.body.email);
  user.username = req.body.username;
  user.email = req.body.email;
  user.firstName= req.body.firstName;
  user.lastName= req.body.lastName;
  user.businessName= req.body.businessName;
  user.employeesNumber= req.body.employeesNumber;
  user.businessType= req.body.businessType;
  user.accountType= req.body.accountType;
  user.creationDate= new Date();
  user.state = "NOTVALID";






  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    console.log('token: '+token);

    res.json({
      "token" : token
    });
  });

};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      console.log("Password: ",user.validPassword("000000"));
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });

    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
