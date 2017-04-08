var express = require('express');
var router = express.Router();
var extendToken = require('./handlers/extendLLT.middleware');
var facebookHandler = require('./handlers/facebookHandler.middleware');
var facebookPosts = require('./facebookPosts.controller');
var facebookApi = require('./facebook.api');

router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


//Directly From Facebook API
router.get('/token/:token', extendToken, facebookApi.getToken);

router.get('/page/posts/:id/:since/:until', facebookHandler.transformPostsData, facebookApi.getPostsByPage);

router.get('/posts/:id/comments', facebookApi.getCommentsByPost);

router.get('/posts/:id/reactions', facebookApi.getReactionsByPost);

router.get('/page/:id/insights/:metric/:token/:since/:until', facebookApi.pageInsights);


//From Our DB After Transformation
router.post('/facebookPosts', facebookPosts.saveFacebookPosts);

router.post('/facebookPosts/get', facebookPosts.getFacebookPosts);


module.exports = router;
