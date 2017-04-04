/**
 * Created by MrFirases on 4/4/2017.
 */

var express = require('express');
var router = express.Router();
var User = require('../../models/users');
router.get('/a', function(req, res, next) {
  res.json({"a":1})
});

router.post('/basicinformationIndiv', function(req, res, next) {

  if (!req.body.activeEmail && !req.body.email && !req.body.firstName && !req.body.lastName && !req.body.username && !req.body.phoneNumber)
  {
  var activeEmail = req.body.activeEmail;
  var email=req.body.email;
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;
  var username=req.body.username;
  var phoneNumber=req.body.phoneNumber;


  User.Individual.update({ email: activeEmail }, { $set: { firstName: firstName,lastName:lastName,username:username,email:email,phoneNumber:phoneNumber}}, function (err, user) {
    if (err) return res.status(401);

    res.status(200).json({ "email": "ok"});

  });

  }
  else
  {
    res.status(400).json({ "error": "All field are required!"})
  }

});

  router.post('/basicinformationBuss', function(req, res, next) {
    if (!req.body.activeEmail && !req.body.email && !req.body.businessName && !req.body.businessType && !req.body.employeesNumber && !req.body.phoneNumber)
    {
    var activeEmail = req.body.activeEmail;
    var email=req.body.email;
    var businessName=req.body.businessName;
    var businessType=req.body.businessType;
    var employeesNumber=req.body.employeesNumber;
    var phoneNumber=req.body.phoneNumber;

    User.Business.update({ email: activeEmail }, { $set: { businessName: businessName,businessType:businessType,employeesNumber:employeesNumber,email:email,phoneNumber:phoneNumber}}, function (err, user) {
      if (err) return res.json({"g":err});
      res.status(200).json(user);
    });
    }
    else
    {
      res.status(400).json({ "error": "All field are required!"})
    }
  });


    router.post('/additionalInformation', function(req, res, next) {
      if (!req.body.activeEmail && !req.body.profilePicture && !req.body.coverPicture && !req.body.about && !req.body.birthday && !req.body.country)
      {
      var activeEmail = req.body.activeEmail;
      var profilePicture = req.body.profilePicture;
      var coverPicture = req.body.coverPicture;
      var about = req.body.about;
      var birthday = req.body.birthday;
      var country = req.body.country;

      User.update({ email: activeEmail }, { $set: { profilePicture: profilePicture, coverPicture:coverPicture,about:about,birthday:birthday,country:country}}, function (err, user) {
        if (err) return res.status(401);
        res.status(200).json({ "email": "ok"});
      });
      res.status(200)
      }
      else
      {
        res.status(400).json({ "error": "All field are required!"})
      }
});

module.exports = router;
