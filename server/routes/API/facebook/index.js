var express = require('express');
var router = express.Router();
var request = require('request');
var extendToken = require('./extendLLT.middleware');
var config = require('../../../config/facebook.config');



router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


router.get('/token/:token', extendToken, function (req, res, next) {
  req.ExtendedToken.then(function (value) {
    console.log("toooken", value);
    res.json({longToken:value});
  })
});


router.get('/posts/:id', function (req, res, next) {

  // var page_id = "mosaiquefm";
  var page_id = req.params.id;
  var node = page_id + "/posts";
  var fields = "/?fields=message,link,created_time,type,name,id," +
    "comments,shares,reactions" +
    ".limit(0).summary(true)";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;
  var url = base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


router.get('/posts/:id/reactions', function (req, res, next) {

  var posts_id = req.params.id;
  var node = posts_id;
  var fields = "/?fields=reactions.type(LIKE).limit(0).summary(total_count).as(like)," +
    "reactions.type(LOVE).limit(0).summary(total_count).as(love)," +
    "reactions.type(WOW).limit(0).summary(total_count).as(wow)," +
    "reactions.type(HAHA).limit(0).summary(total_count).as(haha)," +
    "reactions.type(SAD).limit(0).summary(total_count).as(sad)," +
    "reactions.type(ANGRY).limit(0).summary(total_count).as(angry)";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;
  var url = base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


//used from second and Onwards to use direct the long lived token
router.get('/page/:id/insights/:token', function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id;
  var fields = "/insights?metric=['page_storytellers_by_age_gender']";

  var page_ACCESS_TOKEN = req.params.token;
  var parameters = "&access_token=" + page_ACCESS_TOKEN;
  var url = base + node + fields + parameters;
  console.log("url", url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


module.exports = router;