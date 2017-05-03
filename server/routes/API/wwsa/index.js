var express = require('express');
var router = express.Router();
var myRequest = require('request');
var translate = require('google-translate-api');
var dataProviderModel = require('../../../models/dataProvider/dataProvider.model');
var sentimentalController = require('../sentimental/sentimentAnalysis.controller.js');
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
    myRequest({
      url: 'http://apidemo.theysay.io/api/v1/topic',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{"text": "' + req.body.text + '", "level": "sentence"}'
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

router.get('/PositivitybyCompaign/:id', function (req, res, next) {

  dataProviderModel.avgPositivitybyCompaign(req.params.id).then(function (data) {
      console.log('the id: ',data)
    res.status(200).json({data:data});
  }).catch(function (err) {
    res.status(400).json(err);
  });

});

router.get('/NegativityByCompaign/:id', function (req, res, next) {
  dataProviderModel.avgNegativitybyCompaign(req.params.id).then(function (data) {
    res.status(200).json({data:data});
  }).catch(function (err) {
    res.status(204).json(err);
  });

});

router.get('/NeutralByCompaign/:id', function (req, res, next) {

  console.log("3 last days",new Date(new Date().setDate(new Date().getDate()-3)))

  dataProviderModel.avgNeutralitybyCompaign(req.params.id).then(function (data) {
    res.status(200).json({data:data});
  }).catch(function (err) {
    res.status(204).json(err);
  });

});


router.post('/CompaignSentimental', sentimentalController.getCampaignSentimental);
router.post('/ChannelSentimental', sentimentalController.getChannelSentimental);











module.exports = router;
