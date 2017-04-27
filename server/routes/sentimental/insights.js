/**
 * Created by ninou on 4/6/2017.
 */
var express = require('express');
var router = express.Router();
var dataProvider = require('../../models/dataProvider/dataProvider.model');
var translate = require('google-translate-api');
var myRequest = require('request');


router.get('/setScore', function (req, res, next) {



  function translateFN() {
    var positive = null;
    var negative = null;
    var neutral = null;
    dataProvider.findNulledScore().then(function (data) {

      console.log('this is: ', data.content)

      if (data.content) {
        translate(data.content.replace('@', ''), {to: 'en'}).then(function (result) {
          console.log(result.text);
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
              console.log("fama erreurrrrrrr");
              console.log(error);
              res.status(400).json({"Error": "Error in The sentiment API"})
            } else {


              //If a character make an error
              if (response.statusCode == 400) {
                console.log("fama erreurrrrrrr");
                var scoreResults = {
                  positivity: null,
                  negativity: null,
                  neutral: null
                }
                console.log("errrr", scoreResults)

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  translateFN()
                  //  res.status(200).json({"updatedData": result});
                }).catch(function (err) {
                  //    res.status(400).json({"Error": "Error in update"})
                });
              }

              else {

                console.log(response.statusCode, body);
                console.log(JSON.parse(body)[0].sentiment);

                //Clean code

                var resultsLenght = JSON.parse(body).length;
                console.log('len:', resultsLenght)
                for (var i = 0; i < resultsLenght; i++) {
                  positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
                  negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
                  neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
                }


                //End clean code


                //RESPONSE
                //  result.json(JSON.parse(body));

                /*******here*****/

                var scoreResults = {positivity: positive, negativity: negative, neutral: neutral}
                console.log('scoreResults: ', scoreResults);

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  translateFN()
                  // res.status(200).json({"updatedData": result});
                }).catch(function (err) {
                  //   res.status(400).json({"Error": "Error in update"})
                });
              }
            }
          });

        }).catch(function (err) {
          //res.status(400).json({"Error": "Error in translator"})

          //If error in translator
          myRequest({
            url: 'http://apidemo.theysay.io/api/v1/sentiment',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"text": "' + data.content.replace('@', '') + '", "level": "sentence"}'
          }, function (error, response, body) {
            if (error) {
              console.log(error);

              res.status(400).json({"Error": "Error in The sentiment API"})
            } else {

              //If a character make an error
              if (response.statusCode == 400) {
                console.log("fama erreurrrrrrr");
                var scoreResults = {
                  positivity: null,
                  negativity: null,
                  neutral: null
                }
                console.log("errrr", scoreResults)

                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  translateFN()
                  //  res.status(200).json({"updatedData": result});
                }).catch(function (err) {
                  //    res.status(400).json({"Error": "Error in update"})
                });
              }
              else {

                console.log(response.statusCode, body);
                console.log(JSON.parse(body)[0].sentiment);

                //Clean code

                var resultsLenght = JSON.parse(body).length;
                console.log('len:', resultsLenght)
                for (var i = 0; i < resultsLenght; i++) {
                  positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
                  negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
                  neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
                }


                //End clean code


                //RESPONSE
                //  result.json(JSON.parse(body));

                /*******here*****/

                var scoreResults = {positivity: positive, negativity: negative, neutral: neutral}
                console.log('scoreResults: ', scoreResults);


                dataProvider.updateScore(data, scoreResults).then(function (result) {
                  translateFN()
                  // res.status(200).json({"updatedData": result});
                }).catch(function (err) {
                  //   res.status(400).json({"Error": "Error in update"})
                });
              }
            }
          });

          //End if error in translator


        });
      }

      else {

        var scoreResults = {
          positivity: null,
          negativity: null,
          neutral: null
        }
        console.log("errrr", scoreResults)

        dataProvider.updateScore(data, scoreResults).then(function (result) {
          translateFN()
          //  res.status(200).json({"updatedData": result});
        }).catch(function (err) {
          //    res.status(400).json({"Error": "Error in update"})
        });

      }


    }).catch(function (err) {
      res.status(400).json({"Error": "Error in Find Nulled Score"})
    });
  }

  translateFN();

});




//********************************************************************************************************







router.get('/setScoretest', function (req, res, next) {

  var positive = null;
  var negative = null;
  var neutral = null;

  dataProvider.findNulledScore().then(function (data) {

    if (data.content) {

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
          res.status(400).json({"Error": "Error in The sentiment API"})
        } else {
          console.log(response.statusCode, body);
          console.log(JSON.parse(body)[0].sentiment);

          //Clean code

          var resultsLenght = JSON.parse(body).length;
          console.log('len:', resultsLenght)
          for (var i = 0; i < resultsLenght; i++) {
            positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
            negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
            neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
          }


          //End clean code


          //RESPONSE
          //  result.json(JSON.parse(body));

          /*******here*****/

          var scoreResults = {positivity: positive, negativity: negative, neutral: neutral}
          console.log('scoreResults: ', scoreResults);

          dataProvider.updateScore(data, scoreResults).then(function (result) {
            res.status(200).json({"updatedData": result});
          }).catch(function (err) {
            res.status(400).json({"Error": body})
          });

        }
      });


    }

  }).catch(function (err) {
    res.status(400).json({"Error": "Error in Find Nulled Score"})


  });
});


module.exports = router;
