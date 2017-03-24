var express = require('express');
var router = express.Router();
var request = require('request');
var extendToken = require('./handlers/extendLLT.middleware');
var facebookHandler = require('./handlers/facebookHandler.middleware');
var config = require('../../../config/facebook.config');
var facebookPosts = require('./facebookPosts.controller');

router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


router.get('/token/:token', extendToken, function (req, res, next) {
  req.ExtendedToken.then(function (value) {
    console.log("toooken", value);
    res.json({longToken: value});
  })
});


router.get('/page/posts/:id',facebookHandler.transformPostsData, function (req, res, next) {

  // var page_id = "mosaiquefm";
  console.log("there")

  req.postsTransformed.then(function (data) {
    console.log("data",data)
    res.json(data)
  });

});


router.get('/posts/:id/comments', function (req, res, next) {

  // var page_id = "mosaiquefm";
  var page_id = req.params.id;
  var node = page_id + "/posts";
  var fields = "/?fields=comments";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;
  var url = config.base + node + fields + parameters;
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
  var url = config.base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


router.get('/page/:id/insights/:token/byAgeGender', function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id;
  var fields = "/insights?metric=['page_storytellers_by_age_gender']";

  var page_ACCESS_TOKEN = req.params.token;
  var parameters = "&access_token=" + page_ACCESS_TOKEN;
  var url = config.base + node + fields + parameters;
  console.log("url", url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })

});


router.get('/page/:id/insights/:token/byStoryType', function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id;
  var fields = "/insights?metric=['page_storytellers_by_story_type']";

  var page_ACCESS_TOKEN = req.params.token;
  var parameters = "&access_token=" + page_ACCESS_TOKEN;
  var url = config.base + node + fields + parameters;
  console.log("url", url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })

});


router.post('/add/posts',facebookPosts.saveFacebookPosts);

module.exports = router;
