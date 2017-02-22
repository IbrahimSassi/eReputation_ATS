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

});




router.get('/about',function (req,res) {

  client.get('search/tweets', {q: 'Mohamed Firas Ouertani'}, function(error, tweets, response) {

    //JSON
    res.json(tweets);
    //console.log("This is it: ",tweets);

  });


});





router.get('/user_timeline/:user', function(req, res) {
/*
  var oEmbedTweets = [], tweets = [],

    params = {
      screen_name: req.params.user, // the user id passed in as part of the route
      count: TWEET_COUNT // how many tweets to return
    };

  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }
*/

  // request data
  twitter.get(USER_TIMELINE_URL, function (err, data, resp) {

   // tweets = data;
    //JSON
    res.json(data);
    /*var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      getOEmbed(tweets[i]);
    }*/
  });

  /**
   * requests the oEmbed html
   */
/*
  function getOEmbed (tweet) {

    // oEmbed request params
    var params = {
      "id": tweet.id_str,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // request data
    twitter.get(OEMBED_URL, params, function (err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == tweets.length) {
        res.setHeader('Content-Type', 'application/json');
        res.send(oEmbedTweets);
      }
    });
  }
  */
});



module.exports = router;
