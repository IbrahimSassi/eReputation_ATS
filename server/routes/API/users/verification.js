/**
 * Created by MrFirases on 3/29/2017.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../../../models/users.model');
var mailsender = require('mailsender');
var fs = require('fs')
var Styliner = require('styliner');
var configEmail = require('../../../config/email.config');
var config = require('../../../config/config');
var crypto = require('crypto');


router.post('/generate/:email', function (req, res, next) {

  var token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    email: req.params.email
  }, 'emailverification');


  fs.readFile('server/public/resources/email.html', function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      data = data+ '<a style="color:cadetblue;" href="' + config.host + '/#!/emailconfirmation/' + token + '">Verification Link ' + '</a>';
      sendmail(data, req.params.email)

    }

  });

  function sendmail(body, to) {
    mailsender
      .from(configEmail.from, configEmail.pwd)
      .to(to)
      .body(configEmail.subject, body, true)
      .send();
  }

  res.status(200).json({"token": token});
});


router.get('/validate/:token', function (req, res, next) {

  console.log('token:', req.params.token)
  jwt.verify(req.params.token, 'emailverification', function (err, decoded) {

    if (err) {
      res.status(401).json({"Error": 'Token Expired or incorrect'});
    }
    else {
      console.log("email: ", decoded.email)
      User.findOneAndUpdate({email: decoded.email}, {$set: {state: 'Activated'}}, function (err, user) {
        if (err) return res.status(401);

        User.findOne({email: user.email}, function (err, userFound) {
          if (err) return res.status(401);

          var token;
          token = userFound.generateJwt();
          console.log('token: ' + userFound);
          res.status(200).json({"token": token});
        });


      });
    }

  });


});


router.post('/requestNewPassword/:email', function (req, res, next) {

  var token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    email: req.params.email
  }, 'changePassword');

  sendmail("Please click this <a href='" +config.host+'/#!/changePassword/'+token+
    "'>link</a> to change your password!", req.params.email)
  function sendmail(body, to) {
    mailsender
      .from(configEmail.from, configEmail.pwd)
      .to(to)
      .body(configEmail.subject, body, true)
      .send();
  }
});


router.post('/changePassword', function (req, res, next) {

var token = req.body.token;
var newPassword = req.body.password;
  jwt.verify(token, 'changePassword', function (err, decoded) {
  User.findOne({email: decoded.email}, function (err, user) {

    if (err) {
      // console.log('err ', err);
      return res.status(500).json(err);
    }



      user.setPassword(newPassword);
      var salt = crypto.randomBytes(16).toString('hex');
      var hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64).toString('hex');
      User.update({email: decoded.email}, {$set: {salt: salt, hashedPassword: hashedPassword}}, function (err, user) {
        if (err) return res.status(401);
        console.log('password changed ');
        return res.status(200).json({"statut": "ok"});

      });

  });

  });

});

module.exports = router;
