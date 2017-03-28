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

router.get('/page/:id/insights/:metric/:token/:since/:until', facebookApi.pageInsights);


router.post('/add/posts', facebookPosts.saveFacebookPosts);

module.exports = router;
