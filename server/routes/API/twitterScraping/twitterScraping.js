/**
 * Created by MrFirases on 2/22/2017.
 */
var express = require('express');
var router = express.Router();
var Twit = require('twit');
var config = require('../twitterScraping/config');

// instantiate Twitter module
var twitter = new Twit(config.twitter);

var TWEET_COUNT = 15;
var MAX_WIDTH = 305;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'statuses/user_timeline';

/**
 * GET tweets json.
 */




var TwitterStream = require('twitter');
var client = new TwitterStream({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

router.get('/streaming', function(req, res) {


  client.stream('statuses/filter', {track: 'Michael Jackson'},  function(stream) {

    stream.on('data', function(tweet) {
      //console.log(tweet);
      //JSON Streaming
      res.json(tweet);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });



  router.get('/about',function (req,res) {

    client.get('search/tweets', {q: 'Mohamed Firas Ouertani'}, function(error, tweets, response) {

      //JSON
      res.json(tweets);
      //console.log("This is it: ",tweets);

    });


  });




});




module.exports = router;
