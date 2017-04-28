/**
 * Created by MrFirases on 4/4/2017.
 */

var express = require('express');
var router = express.Router();
var User = require('../../../models/users.model');
var crypto = require('crypto');
var randomstring = require("randomstring");
var fs = require('fs');

var authenticate = require('./middleware/authenticate').authenticate

router.get('/a', function (req, res, next) {
  res.json({"a": 1})
});

router.put('/basicinformationIndiv',authenticate, function (req, res, next) {

  if (req.query.activeEmail && req.query.email && req.query.firstName && req.query.lastName && req.query.username && req.query.phoneNumber) {
    var activeEmail = req.query.activeEmail;
    var email = req.query.email;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var username = req.query.username;
    var phoneNumber = req.query.phoneNumber;


    User.Individual.findOneAndUpdate({email: activeEmail}, {
      $set: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        phoneNumber: phoneNumber
      }
    }, function (err, user) {
      if (err) return res.status(401);



      User.findOne({ email: user.email }, function (err, userFound) {
        if (err) return res.status(401);;

        var token;
        token = userFound.generateJwt();
        console.log('token: ' + userFound);
        res.status(200).json({"token": token});
      });


    });

  }
  else {
    res.status(400).json({"error": "All field are required!"})
  }

});

router.put('/basicinformationBuss/:activeEmail/:email/:businessName/:businessType/:employeesNumber/:phoneNumber', function (req, res, next) {
  if (req.params.activeEmail && req.params.email && req.params.businessName && req.params.businessType && req.params.employeesNumber && req.params.phoneNumber) {
    var activeEmail = req.params.activeEmail;
    var email = req.params.email;
    var businessName = req.params.businessName;
    var businessType = req.params.businessType;
    var employeesNumber = req.params.employeesNumber;
    var phoneNumber = req.params.phoneNumber;

    User.Business.findOneAndUpdate({email: activeEmail}, {
      $set: {
        businessName: businessName,
        businessType: businessType,
        employeesNumber: employeesNumber,
        email: email,
        phoneNumber: phoneNumber
      }
    }, function (err, user) {
      if (err) return res.status(401);

      User.findOne({ email: user.email, username:user.username }, function (err, userFound) {
        if (err) return res.status(401);;

        var token;
        token = userFound.generateJwt();
        console.log('token: ' + userFound);
        res.status(200).json({"token": token});
      });
    });
  }
  else {
    res.status(400).json({"error": "All field are required!"})
  }
});

router.put('/additionalInformation', function (req, res, next) {
  //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

 // console.log("Profile: ",req.params.profilePicture);




  if (req.body.activeEmail && req.body.about && req.body.birthday && req.body.country) {

    var activeEmail = req.body.activeEmail;
    var profilePicture = req.body.profilePicture;
    var coverPicture = req.body.coverPicture;
    var about = req.body.about;
    var birthday = req.body.birthday;
    var country = req.body.country;
    var profilePictureName = randomstring.generate(12);
    var coverPictureName = randomstring.generate(12);
    //*
    var profilePictureBase64 = profilePicture;
    var coverPictureBase64 = coverPicture;
    if (req.body.profilePicture !="" && req.body.coverPicture !="")
    {
    fs.writeFile(__dirname + "/../../public/uploads/images/"+profilePictureName+".png", profilePictureBase64, 'base64', function(err) {
      if (err) console.log(err);
    });

    fs.writeFile(__dirname + "/../../public/uploads/images/"+coverPictureName+".jpg", coverPictureBase64, 'base64', function(err) {
      if (err) console.log(err);
    });
    //*

    User.findOneAndUpdate({email: activeEmail}, {
      $set: {
        profilePicture: profilePictureName,
        coverPicture: coverPictureName,
        about: about,
        birthday: birthday,
        country: country
      }
    }, function (err, user) {
      if (err) return res.status(401);

      User.findOne({ email: user.email, username:user.username }, function (err, userFound) {
        if (err) return res.status(401);

        var token;
        token = userFound.generateJwt();
        //console.log('token: ' + userFound);
        res.status(200).json({"token": token});
      });
    });
    res.status(200)
    }
else
    {

      User.findOneAndUpdate({email: activeEmail}, {
        $set: {
          about: about,
          birthday: birthday,
          country: country
        }
      }, function (err, user) {
        if (err) return res.status(401);

        User.findOne({ email: user.email, username:user.username }, function (err, userFound) {
          if (err) return res.status(401);

          var token;
          token = userFound.generateJwt();
          //console.log('token: ' + userFound);
          res.status(200).json({"token": token});
        });
      });
      res.status(200)


    }
  }
  else {
    res.status(400).json({"error": "All field are required!"})
  }
});


router.put('/changepassword/:activeEmail/:oldpassword/:newpassword', function (req, res, next) {
  if (req.params.activeEmail && req.params.oldpassword && req.params.newpassword) {
    var activeEmail = req.params.activeEmail;
    var oldpassword = req.params.oldpassword;
    var newpassword = req.params.newpassword;
    //console.log("Passed: ", activeEmail, oldpassword, newpassword)

    User.findOne({email: activeEmail}, function (err, user) {

      if (err) {
       // console.log('err ', err);
        return res.status(500).json(err);
      }

      // Return if password is wrong
      if (!user.validPassword(oldpassword)) {
        //console.log('notvalid ');
        return res.status(401).json({"err": "Password is wrong"});
      }

      if (user.validPassword(oldpassword)) {
        user.setPassword(newpassword);
        var salt = crypto.randomBytes(16).toString('hex');
        var hashedPassword = crypto.pbkdf2Sync(newpassword, salt, 1000, 64).toString('hex');
        User.update({email: activeEmail}, {$set: {salt: salt, hashedPassword: hashedPassword}}, function (err, user) {
          if (err) return res.status(401);
          console.log('password changed ');
          return res.status(200).json({"statut": "ok"});

        });

      }

    });


  }
  else {
    res.status(400).json({"error": "All field are required!"})
  }
});











module.exports = router;
