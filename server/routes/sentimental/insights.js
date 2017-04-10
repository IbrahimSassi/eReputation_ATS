/**
 * Created by ninou on 4/6/2017.
 */
var express = require('express');
var router = express.Router();
var dataProvider = require('../../models/dataProvider/dataProvider.model');
var translate = require('google-translate-api');
var myRequest = require('request');

router.get('/setScore', function (req, res, next) {


  dataProvider.findNulledScore().then(function (data) {
    console.log('this is: ', data.name)
    if (data.name)
    {
      translate(data.name, {to: 'en'}).then(function (result) {
        // console.log(res.text);
        // console.log(res.from.language.iso);
        myRequest({
          url: 'http://apidemo.theysay.io/api/v1/sentiment',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: '{"text": "' + result.text + '", "level": "sentence"}'
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            res.status(400).json({"Error":"Error in The sentiment API"})
          } else {
            console.log(response.statusCode, body);
            console.log(JSON.parse(body)[0].sentiment);
            //RESPONSE
            //  result.json(JSON.parse(body));

            /*******here*****/
            var cleanResult = JSON.parse(body)[0].sentiment;

            var scoreResults = {positivity:cleanResult.positive * 100,negativity: cleanResult.negative * 100,neutral: cleanResult.neutral * 100}


            dataProvider.updateScore(data,scoreResults).then(function (result) {
              res.status(200).json({"updatedData": result});
            }).catch(function (err) {
              res.status(400).json({"Error":"Error in update"})
            });

          }
        });

      }).catch(function (err) {
        res.status(400).json({"Error":"Error in translator"})
      });
  }

  }).catch(function (err) {
    res.status(400).json({"Error":"Error in Find Nulled Score"})
  });


});





router.get('/setScoretest', function (req, res, next) {


  dataProvider.findNulledScore().then(function (data) {
    console.log('this is: ', data.content)
    if (data.content)
    {

        // console.log(res.text);
        // console.log(res.from.language.iso);
        myRequest({
          url: 'http://apidemo.theysay.io/api/v1/sentiment',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: '{"text": "' + data.content + '", "level": "sentence"}'
        }, function (error, response, body) {
          if (error) {
            console.log(error);
            res.status(400).json({"Error":"Error in The sentiment API"})
          } else {
            console.log(response.statusCode, body);
            console.log(JSON.parse(body)[0].sentiment);
            //RESPONSE
            //  result.json(JSON.parse(body));

            /*******here*****/
            var cleanResult = JSON.parse(body)[0].sentiment;

            var scoreResults = {positivity:cleanResult.positive * 100,negativity: cleanResult.negative * 100,neutral: cleanResult.neutral * 100}


            dataProvider.updateScore(data,scoreResults).then(function (result) {
              res.status(200).json({"updatedData": result});
            }).catch(function (err) {
              res.status(400).json({"Error":"Error in update"})
            });

          }
        });


    }

  }).catch(function (err) {
    res.status(400).json({"Error":"Error in Find Nulled Score"})
  });


});


module.exports = router;
