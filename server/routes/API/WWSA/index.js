var express = require('express');
var router = express.Router();
var myRequest = require('request');
var translate = require('google-translate-api');


/* POST TEXT SEARCH . */
//POST BODY EXEMPLE
// {
//   "text":"j'aime bien ce produit"
// }
router.post('/', function (req, result, next) {

  translate(req.body.text, {to: 'en'}).then(function (res) {
    // console.log(res.text);
    // console.log(res.from.language.iso);
    myRequest({
      url: 'http://apidemo.theysay.io/api/v1/sentiment',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"text": "' + res.text + '", "level": "sentence"}'
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);

        console.log( JSON.parse(body)[0].sentiment);
        //RESPONSE
      //  result.json(JSON.parse(body));

        /*******here*****/
        var cleanResult = JSON.parse(body)[0].sentiment;


         result.json({
           positivity:(cleanResult.positive)*100,
           negativity:(cleanResult.negative)*100,
           neutrality:(cleanResult.neutral)*100,
         });

      }
    });

  }).catch(function (err) {
    console.error(err);
  });


});



router.post('/topic', function (req, result, next) {
   var tab = [];
  translate(req.body.text, {to: 'en'}).then(function (res) {
    // console.log(res.text);
    // console.log(res.from.language.iso);
    myRequest({
      url: 'http://apidemo.theysay.io/api/v1/topic',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"text": "' + res.text + '", "level": "sentence"}'
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);

        console.log( JSON.parse(body));


        var x =JSON.parse(body)[0].scores.length ;
        //RESPONSE
       for (var i =0 ; i< x ; i++)
        {
          console.log(i)
         tab.push({
           topic : (JSON.parse(body)[0].scores[i].label),
           confidence : (JSON.parse(body)[0].scores[i].confidence)
         });
         console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh/n", JSON.parse(body)[0].scores[i].label);
        }
         result.json(tab);

      }
    });

  }).catch(function (err) {
    console.error(err);
  });


});







router.post('/emotions', function (req, result, next) {
  var tab = [];
  translate(req.body.text, {to: 'en'}).then(function (res) {
    // console.log(res.text);
    // console.log(res.from.language.iso);
    myRequest({
      url: 'http://apidemo.theysay.io/api/v1/emotion',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"text": "' + res.text + '", "level": "sentence"}'
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);

        console.log( JSON.parse(body));


        var x =JSON.parse(body)[0].emotions.length ;
        console.log(x)
        //RESPONSE
        for (var i =0 ; i< x ; i++)
        {
          console.log(i)
          tab.push({
            dimension : (JSON.parse(body)[0].emotions[i].dimension),
            score : (JSON.parse(body)[0].emotions[i].score)
          });
          console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh/n", JSON.parse(body)[0].emotions[i].dimension);
        }
        result.json(tab);

      }
    });

  }).catch(function (err) {
    console.error(err);
  });
});








module.exports = router;
