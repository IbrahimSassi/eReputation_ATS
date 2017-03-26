var express = require('express');
var router = express.Router();
var request = require('request');
var extendToken = require('./handlers/extendLLT.middleware');
var facebookHandler = require('./handlers/facebookHandler.middleware');
var config = require('../../../config/facebook.config');
var facebookPosts = require('./facebookPosts.controller');
var facebookApi = require('./facebook.api');

router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


router.get('/token/:token', extendToken, facebookApi.getToken);

router.get('/page/posts/:id', facebookHandler.transformPostsData, facebookApi.getPostsByPage);

router.get('/posts/:id/comments', facebookApi.getCommentsByPost);

router.get('/posts/:id/reactions', facebookApi.getReactionsByPost);

router.get('/page/:id/fans/:token/:since/:until', facebookApi.getFansPage);


//TODO ToCHANGE
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


router.post('/add/posts', facebookPosts.saveFacebookPosts);

module.exports = router;
