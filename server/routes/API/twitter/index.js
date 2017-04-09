/**
 * Created by MrFirases on 4/9/2017.
 */
var express = require('express');
var router = express.Router();
var config = require('../twitter/config');
var TwitterStream = require('twitter');
var client = new TwitterStream({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});
/* GET home page. */
router.get('/:screen_name', function (req, res, next) {

  client.get('statuses/user_timeline', {
    screen_name: req.params.screen_name,
    count: 1
  }, function (error, tweet, response) {

    if (error) {
      return res.json(error);
    }
    if (!tweet) {
      return res.status(404).send();
    }

    res.json(tweet[0].user)
  });
});


module.exports = router;
