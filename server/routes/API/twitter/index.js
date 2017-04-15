/**
 * Created by MrFirases on 4/9/2017.
 */
var express = require('express');
var router = express.Router();
var config = require('../twitter/config');
var TwitterStream = require('twitter');
var dataProvider = require('../../../models/dataProvider/dataProvider.model');
var TwitterAPIQueries = require('./twitterAPIQuries');
var TwitterStatsGenerator = require('./twitterStatsGenerator');


var client = new TwitterStream({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});



router.post('/test',function (req,res) {

  var since = req.query.since;
  var until = req.query.until;
  var keywords = req.body.keywords;
  console.log(keywords)
    client.get('search/tweets', {q: ''+keywords+' since:'+since+' until:'+until+'', count: 11,geocode:'40.712639,-74.006299,150km' }, function(error, tweets, response) {
      res.json(tweets)
    });

});


router.post('/UserRepForChannel',TwitterAPIQueries.SaveDatToTwitterProviderForRepliesToUserForChannel);
router.post('/UserMentionedForChannel',TwitterAPIQueries.SaveDatToTwitterProviderForMentionedUserForChannel);
router.post('/GetUserInfo/:screen_name',TwitterAPIQueries.GetUserInfo);
router.post('/TweetsScrapper',TwitterAPIQueries.TweetsScrapper);
router.post('/TweetsScrapperWithGeo',TwitterAPIQueries.TweetsScrapperWithGeo);

router.post('/getTwitterSentimentalForMention',TwitterStatsGenerator.getTwitterSentimentalForMention);
router.post('/getTwitterSentimentalForReply',TwitterStatsGenerator.getTwitterSentimentalForReply);
router.post('/getTopTweet',TwitterStatsGenerator.getTopTweet);
router.post('/getTopHashtags',TwitterStatsGenerator.getTopHashtags);


router.post('/getTwitterSentimentalForAll',TwitterStatsGenerator.getTwitterSentimentalForAll);

//Test
router.post('/UserRepForChannelTest',TwitterAPIQueries.SaveDatToTwitterProviderForRepliesToUserForChannelTest);

module.exports = router;
