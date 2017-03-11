/**
 * Created by HP on 11/03/2017.
 *********************** Word World Sentiment Analysis*******************
 */

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
        //RESPONSE
        result.json(JSON.parse(body));

      }
    });

  }).catch(function (err) {
    console.error(err);
  });


});

module.exports = router;
