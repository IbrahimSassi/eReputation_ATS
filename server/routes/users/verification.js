/**
 * Created by MrFirases on 3/29/2017.
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../../models/users');
var mailsender = require('mailsender');
var fs = require('fs')
var Styliner = require('styliner');

router.post('/generate/:email', function(req, res, next) {

  var token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    email: req.params.email
  }, 'emailverification');


  fs.readFile('server/views/email.html',function (err,data) {
    if(err)
    {
      console.log(err);
    }
    else {
      data = data  + '<a style="color:cadetblue;" href="http://localhost:3000/users/verification/validate/'+token+'">Verification Link</a>';
      sendmail(data)


    }

  });


  function sendmail (body) {
    mailsender
      .from('mohamedfiras.ouertani@esprit.tn', 'MFO11889162')
      .to('profirases@gmail.com')
      .body('subject',body,true)
  .send();
  }


  res.status(200).json({ "token": token});
});


router.get('/validate/:token', function(req, res, next) {

  jwt.verify(req.params.token, 'emailverification', function(err, decoded) {

    User.update({ email: decoded.email }, { $set: { state: 'Activated' }}, function (err, user) {
      if (err) return res.status(401);


    });

    res.json({ "email": decoded.email});
  });




});

module.exports = router;
