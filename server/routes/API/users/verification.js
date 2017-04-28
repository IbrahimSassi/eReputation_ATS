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
      data = data + '' +
        '<a style="color:cadetblue;" href="' + config.host +
        '/#!/emailconfirmation/' + token +
        '">Verification Link ' +
        '</a>';
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

module.exports = router;
