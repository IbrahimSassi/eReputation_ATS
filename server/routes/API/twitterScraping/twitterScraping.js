/**
 * Created by MrFirases on 2/22/2017.
 */
var express = require('express');
var router = express.Router();
var config = require('../twitterScraping/config');
var Tweet     = require('../../../models/tweet');

// instantiate Twit module
var Twit = require('twit');
var twitter = new Twit(config.twitter);

// instantiate Twitter module
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

  //client.get('search/tweets', {q: '"happy hour" until:2017-03-02', count:100}, function(error, tweets, response) {
    //client.get('search/tweets', {q: 'from:CoryBooker max_id:836661171746930700 until:2017-03-01', count:100}, function(error, tweets, response) {
  client.get('search/tweets', {q: 'from:CoryBooker max_id:836661171746930700 until:2017-03-01', count:100}, function(error, tweets, response) {
    //JSON
    res.json(tweets);
    //console.log("This is it: ",tweets);

  });


});




router.get('/timeline/:user',function (req,res) {

  client.get('statuses/user_timeline', {screen_name:req.params.user, count:100}, function(error, tweets, response) {

    res.json(tweets);

  });




});




router.get('/stream',function (req,res) {

  //get tweet by place bounded box

  var Tunisia = [ '7.52448164229', '30.3075560572', '11.4887874691', '37.3499944118' ]
  var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]


  var stream = twitter.stream('statuses/filter', { locations: sanFrancisco})

  stream.on('tweet', function (data) {
    console.log(data)
    var tweet = new Tweet();
    tweet.text = data.text;
    tweet.save(function(err) {
      if (err)
        res.send(err);

      //res.json({ message: 'User created!' });
    });

  })


// Streamin about a specific twwet
/*
  var stream = twitter.stream('statuses/filter', {  track: ['fcb', 'psg', 'Barcelona', 'Paris Saint-Germain'] })

  stream.on('tweet', function (tweet) {
    console.log(tweet)

  })
*/




});




module.exports = router;
