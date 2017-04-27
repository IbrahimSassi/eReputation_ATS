var express = require('express');
var router = express.Router();
var facebookHandler = require('./handlers/facebookHandler.middleware');
var facebookDataProvider = require('./facebookDataProvider.controller');
var facebookApi = require('./facebook.api');


router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


//Directly From Facebook API
router.get('/token/:token', facebookHandler.extendToken, facebookApi.getToken);
router.get('/posts/:id/reactions', facebookApi.getReactionsByPost);
router.get('/page/:id/insights/:metric/:token/:since/:until', facebookApi.pageInsights);

router.post('/facebookPosts', facebookHandler.transformPostsData, facebookApi.getPostsByPage);
router.post('/facebookComments', facebookHandler.transformCommentsData, facebookDataProvider.addFacebookComments);


router.post('/posts/url', facebookApi.longUrl);

//Update Reactions
router.put('/facebookPosts', facebookDataProvider.updateFacebookPost);

//From Our DB After Transformation
router.post('/facebookDataProvider/get', facebookDataProvider.getFacebookDataProvider);
router.post('/reputationBySentimental', facebookDataProvider.getFacebookSentimental);
router.post('/posts/reputation',facebookHandler.getComments, facebookDataProvider.getSentimentalByPost);




module.exports = router;
