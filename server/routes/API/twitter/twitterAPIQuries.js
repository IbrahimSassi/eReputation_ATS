/**
 * Created by MrFirases on 4/9/2017.
 */
var moment = require('moment');

var config = require('../twitter/config');
var TwitterStream = require('twitter');
var dataProvider = require('../../../models/dataProvider/dataProvider.model');

var client = new TwitterStream({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

module.exports.SaveDatToTwitterProviderForRepliesToUserForChannel = function (req, res, next) {

  var since = req.query.since;
  var until = req.query.until;
  var mentionedUser = req.query.mentionedUser;

  client.get('search/tweets', {q: 'to:'+mentionedUser+' since:'+since+' until:'+until+'', count: 2}, function(error, tweets, response) {

    for(var i =0;i<tweets.statuses.length;i++)
    {
      var newTwitterData = new dataProvider.tweetsProvider();
      newTwitterData.id = tweets.statuses[i].id;
      newTwitterData.dateContent = tweets.statuses[i].created_at;
      newTwitterData.content = tweets.statuses[i].text;
      newTwitterData.contentLanguage = tweets.statuses[i].lang;
      newTwitterData.author = {screenName:tweets.statuses[i].user.screen_name,id:tweets.statuses[i].user.screen_name}; //
      newTwitterData.dateOfScraping = new Date();
      newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
      newTwitterData.tweetType = "Reply" ;
      newTwitterData.resultType = tweets.statuses[i].metadata.result_type;

        dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
          if (err)
            console.log('Error', err);
          else {

            console.log('Success facebook posts saved saved', data);

          }
        });
    }
    res.status(200).send(tweets)
  });


};


module.exports.SaveDatToTwitterProviderForMentionedUserForChannel = function (req, res, next) {

  var since = req.query.since;
  var until = req.query.until;
  var mentionedUser = req.query.mentionedUser;

  client.get('search/tweets', {q: '@'+mentionedUser+' since:'+since+' until:'+until+'', count: 2}, function(error, tweets, response) {

    for(var i =0;i<tweets.statuses.length;i++)
    {
      var newTwitterData = new dataProvider.tweetsProvider();
      newTwitterData.id = tweets.statuses[i].id;
      newTwitterData.dateContent = tweets.statuses[i].created_at;
      newTwitterData.content = tweets.statuses[i].text;
      newTwitterData.contentLanguage = tweets.statuses[i].lang;
      newTwitterData.author = {screenName:tweets.statuses[i].user.screen_name,id:tweets.statuses[i].user.screen_name}; //
      newTwitterData.dateOfScraping = new Date();
      newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
      newTwitterData.tweetType = "Mention" ;
      newTwitterData.resultType = tweets.statuses[i].metadata.result_type;

      dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
        if (err)
          console.log('Error', err);
        else {

          console.log('Success facebook posts saved saved', data);

        }
      });
    }
    res.status(200).send(tweets)
  });


};


module.exports.GetUserInfo = function (req, res, next) {

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


};


//with save in the database
/*
 module.exports.SaveDatToTwitterProviderForRepliesChannel = function (req, res, next) {

 var since = req.query.since;
 var until = req.query.until;
 var mentionedUser = req.query.mentionedUser;

 console.log(keywords)
 client.get('search/tweets', {q: '@'+mentionedUser+' since:'+since+' until:'+until+'', count: 100}, function(error, tweets, response) {

 var newTwitterData = new DataProvider.tweetsProvider(req.body);

 dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
 if (err)
 return res.status(400).send(err);
 else {

 console.log('Success facebook posts saved saved', item);
 res.status(200).send(data)
 }
 });
 res.json(tweets)
 });


 };
 */
