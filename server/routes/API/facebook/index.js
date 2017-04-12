var express = require('express');
var router = express.Router();
var extendToken = require('./handlers/extendLLT.middleware');
var facebookHandler = require('./handlers/facebookHandler.middleware');
var facebookDataProvider = require('./facebookDataProvider.controller');
var facebookApi = require('./facebook.api');

router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


//Directly From Facebook API
router.get('/token/:token', extendToken, facebookApi.getToken);
router.get('/posts/:id/comments', facebookApi.getCommentsByPost);
router.get('/posts/:id/reactions', facebookApi.getReactionsByPost);
router.get('/page/:id/insights/:metric/:token/:since/:until', facebookApi.pageInsights);

router.post('/facebookPosts', facebookHandler.transformPostsData, facebookApi.getPostsByPage);
router.post('/facebookComments', facebookHandler.transformCommentsData, facebookDataProvider.addFacebookComments);


//From Our DB After Transformation
router.post('/facebookDataProvider/get', facebookDataProvider.getFacebookDataProvider);

router.post('/reputationBySentimental', facebookDataProvider.getFacebookSentimental);
router.post('/reputationByReactions', facebookDataProvider.getReputationByReaction);
router.post('/reputationByShares', facebookDataProvider.getReputationByShares);
router.post('/reputationByTypes', facebookDataProvider.getReputationByTypes);


module.exports = router;
