/**
 * Created by MrFirases on 4/4/2017.
 */

var express = require('express');
var router = express.Router();
var User = require('../../models/users');
var crypto = require('crypto');
router.get('/a', function(req, res, next) {
  res.json({"a":1})
});

router.post('/basicinformationIndiv/:activeEmail/:email/:firstName/:lastName/:username/:phoneNumber', function(req, res, next) {

  if (req.body.activeEmail && req.params.email && req.params.firstName && req.params.lastName && req.params.username && req.params.phoneNumber)
  {
  var activeEmail = req.params.activeEmail;
  var email=req.params.email;
  var firstName=req.params.firstName;
  var lastName=req.params.lastName;
  var username=req.params.username;
  var phoneNumber=req.params.phoneNumber;


  User.Individual.update({ email: activeEmail }, { $set: { firstName: firstName,lastName:lastName,username:username,email:email,phoneNumber:phoneNumber}}, function (err, user) {
    if (err) return res.status(401);

    res.status(200).json({ "statut": "ok"});

  });

  }
  else
  {
    res.status(400).json({ "error": "All field are required!"})
  }

});

  router.post('/basicinformationBuss/:activeEmail/:email/:businessName/:businessType/:employeesNumber/:phoneNumber', function(req, res, next) {
    if (req.params.activeEmail && req.params.email && req.params.businessName && req.params.businessType && req.params.employeesNumber && req.params.phoneNumber)
    {
    var activeEmail = req.params.activeEmail;
    var email=req.params.email;
    var businessName=req.params.businessName;
    var businessType=req.params.businessType;
    var employeesNumber=req.params.employeesNumber;
    var phoneNumber=req.params.phoneNumber;

    User.Business.update({ email: activeEmail }, { $set: { businessName: businessName,businessType:businessType,employeesNumber:employeesNumber,email:email,phoneNumber:phoneNumber}}, function (err, user) {
      if (err) return res.status(401);
      res.status(200).json({"statut":"ok"});
    });
    }
    else
    {
      res.status(400).json({ "error": "All field are required!"})
    }
  });


    router.post('/additionalInformation/:activeEmail/:profilePicture/:coverPicture/:about/:birthday/:country', function(req, res, next) {
      if (req.params.activeEmail && req.params.profilePicture && req.params.coverPicture && req.params.about && req.params.birthday && req.params.country)
      {
      var activeEmail = req.params.activeEmail;
      var profilePicture = req.params.profilePicture;
      var coverPicture = req.params.coverPicture;
      var about = req.params.about;
      var birthday = req.params.birthday;
      var country = req.params.country;

      User.update({ email: activeEmail }, { $set: { profilePicture: profilePicture, coverPicture:coverPicture,about:about,birthday:birthday,country:country}}, function (err, user) {
        if (err) return res.status(401);
        res.status(200).json({ "statut": "ok"});
      });
      res.status(200)
      }
      else
      {
        res.status(400).json({ "error": "All field are required!"})
      }
});



router.post('/changepassword/:activeEmail/:oldpassword/:newpassword', function(req, res, next) {
  if (req.params.activeEmail && req.params.oldpassword && req.params.newpassword)
  {
    var activeEmail = req.params.activeEmail;
    var oldpassword = req.params.oldpassword;
    var newpassword = req.params.newpassword;
    console.log("Passed: ",activeEmail,oldpassword,newpassword)

    User.findOne({ email: activeEmail }, function (err, user) {

      if (err) {
        console.log('err ',err);
        return res.status(500).json(err);
      }

      // Return if password is wrong
      if (!user.validPassword(oldpassword)) {
        console.log('notvalid ');
        return res.status(401).json({"err":"Password is wrong"});
      }

      if (user.validPassword(oldpassword)) {
        user.setPassword(newpassword);
        var salt = crypto.randomBytes(16).toString('hex');
        var hashedPassword = crypto.pbkdf2Sync(newpassword, salt, 1000, 64).toString('hex');
        User.update({ email: activeEmail }, { $set: { salt: salt, hashedPassword:hashedPassword}}, function (err, user) {
          if (err) return res.status(401);
          console.log('password changed ');
          return res.status(200).json({ "statut": "ok"});

        });

      }


    });


  }
  else
  {
    res.status(400).json({ "error": "All field are required!"})
  }
});




module.exports = router;
