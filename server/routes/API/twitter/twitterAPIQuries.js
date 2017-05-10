/**
 * Created by MrFirases on 4/9/2017.
 */
var moment = require('moment');

var config = require('../../../config/twitter.config');
var TwitterStream = require('twitter');
var dataProvider = require('../../../models/dataProvider/dataProvider.model');
var async = require('async');
var translate = require('google-translate-api');
var utils = require('../helpers/utils.helper');

var client = new TwitterStream({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

//var max = [1];
var count = 0;

//START TEST*************************************************
module.exports.SaveDatToTwitterProviderForRepliesToUserForChannelTest = function (req, res, next) {

  client.get('statuses/retweets', {id: '855489561614536708'}, function (error, tweets, response) {
    console.log(tweets);
    res.json(tweets);
  });


  /*

   var since = req.query.since;
   var until = req.query.until;
   var mentionedUser = req.query.mentionedUser;
   var keywords = req.body.keywords;

   var keywordsArrayLength = keywords.length;
   var finalKeywords = null;

   var channelId = req.query.channelId;
   var campaignId = req.query.campaignId;

   for (var i = 0; i < keywordsArrayLength; i++) {
   if (finalKeywords == null) {
   finalKeywords = ""
   }
   if (keywords.indexOf(keywords[i]) != keywordsArrayLength - 1) {
   finalKeywords = finalKeywords + '"' + keywords[i] + '" OR ';
   }
   else {
   finalKeywords = finalKeywords + '"' + keywords[i] + '" ';
   }
   }


   console.log(finalKeywords);


   function scrap(max_id) {

   // return new Promise(function (resolve, reject) {


   client.get('search/tweets', {
   q: 'to:' + mentionedUser + ' ' + finalKeywords + ' since:' + since + ' until:' + until + 'result_type:popular',
   count: 100,
   max_id: max_id
   }, function (error, tweets, response) {

   for (var i = 0; i < tweets.statuses.length; i++) {
   var newTwitterData = new dataProvider.tweetsProvider();
   newTwitterData.id = tweets.statuses[i].id;
   newTwitterData.dateContent = tweets.statuses[i].created_at;
   newTwitterData.content = tweets.statuses[i].text;
   newTwitterData.contentLanguage = tweets.statuses[i].lang;
   newTwitterData.author = {
   screenName: tweets.statuses[i].user.screen_name,
   id: tweets.statuses[i].user.screen_name
   }; //
   newTwitterData.dateOfScraping = new Date();
   newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
   newTwitterData.tweetType = "Reply";
   newTwitterData.resultType = tweets.statuses[i].metadata.result_type;
   newTwitterData.counts = {
   retweets: tweets.statuses[i].retweet_count,
   favorites: tweets.statuses[i].favorite_count
   }
   newTwitterData.channelId = channelId;
   newTwitterData.campaignId = campaignId;

   dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
   if (err)
   console.log('Error', err);
   else {

   //console.log('Saved Successfully: ', data);

   }
   });
   }


   if (tweets.search_metadata.next_results == null) {
   //res.status(200).json({"End":tweets})
   console.log('wfé')
   res.status(200).json(count)
   }
   else {
   var max = tweets.search_metadata.next_results.slice(8, 26);
   console.log(max);
   if (max) {
   count++;
   console.log('count: ', count)
   res.status(200).json(tweets)
   scrap(max);
   }
   else {
   res.status(200).json(count)
   }

   //
   }

   });

   }

   scrap(null);
   */
};
//END TEST********************************************************


module.exports.SaveDatToTwitterProviderForRepliesToUserForChannel = function (req, res, next) {

  var since = req.query.since;
  var until = req.query.until;
  var mentionedUser = req.query.mentionedUser;
  var keywords = req.body.keywords;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;

  var channelId = req.query.channelId;
  var campaignId = req.query.campaignId;

  for (var i = 0; i < keywordsArrayLength; i++) {
    if (finalKeywords == null) {
      finalKeywords = ""
    }
    if (keywords.indexOf(keywords[i]) != keywordsArrayLength - 1) {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" OR ';
    }
    else {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" ';
    }
  }


  console.log(finalKeywords);


  function scrap(max_id) {

    // return new Promise(function (resolve, reject) {


    client.get('search/tweets', {
      q: 'to:' + mentionedUser + ' ' + finalKeywords + ' since:' + since + ' until:' + until + 'result_type:popular',
      count: 100,
      max_id: max_id
    }, function (error, tweets, response) {
      if (error) {
        return res.json(error);
      }
      for (var i = 0; i < tweets.statuses.length; i++) {
        var newTwitterData = new dataProvider.tweetsProvider();
        newTwitterData.id = tweets.statuses[i].id_str;
        newTwitterData.dateContent = tweets.statuses[i].created_at;
        var newContent = tweets.statuses[i].text.replace(/\r?\n|\r/g, " ");
        newTwitterData.content = newContent;
        newTwitterData.contentLanguage = tweets.statuses[i].lang;
        newTwitterData.author = {
          screenName: tweets.statuses[i].user.screen_name,
          id: tweets.statuses[i].user.screen_name
        }; //
        newTwitterData.dateOfScraping = new Date();
        newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
        newTwitterData.tweetType = "Reply";
        newTwitterData.resultType = tweets.statuses[i].metadata.result_type;
        newTwitterData.counts = {
          retweets: tweets.statuses[i].retweet_count,
          favorites: tweets.statuses[i].favorite_count
        }
        newTwitterData.channelId = channelId;
        newTwitterData.campaignId = campaignId;

        dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
          if (err)
            console.log('Error', err);
          else {

            //console.log('Saved Successfully: ', data);

          }
        });
      }


      if (tweets.search_metadata.next_results == null) {
        //res.status(200).json({"End":tweets})
        console.log('wfé')
        res.status(200).json(count)
      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count++;
          console.log('count: ', count)
          scrap(max);
        }
        else {
          res.status(200).json(count)
        }

        //
      }

    });

  }

  scrap(null);
};


module.exports.SaveDatToTwitterProviderForMentionedUserForChannel = function (req, res, next) {

  var since = req.query.since;
  var until = req.query.until;
  var mentionedUser = req.query.mentionedUser;
  var keywords = req.body.keywords;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;

  var channelId = req.query.channelId;
  var campaignId = req.query.campaignId;

  for (var i = 0; i < keywordsArrayLength; i++) {
    if (finalKeywords == null) {
      finalKeywords = ""
    }
    if (keywords.indexOf(keywords[i]) != keywordsArrayLength - 1) {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" OR ';
    }
    else {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" ';
    }
  }


  console.log(finalKeywords);


  function scrap(max_id) {

    // return new Promise(function (resolve, reject) {


    client.get('search/tweets', {
      q: '@' + mentionedUser + ' ' + finalKeywords + ' since:' + since + ' until:' + until + 'result_type:popular',
      count: 100,
      max_id: max_id
    }, function (error, tweets, response) {
      if (error) {
        return res.json(error);
      }
      for (var i = 0; i < tweets.statuses.length; i++) {
        var newTwitterData = new dataProvider.tweetsProvider();
        newTwitterData.id = tweets.statuses[i].id_str;
        newTwitterData.dateContent = tweets.statuses[i].created_at;
        var newContent = tweets.statuses[i].text.replace(/\r?\n|\r/g, " ");
        newTwitterData.content = newContent;
        newTwitterData.contentLanguage = tweets.statuses[i].lang;
        newTwitterData.author = {
          screenName: tweets.statuses[i].user.screen_name,
          id: tweets.statuses[i].user.screen_name
        }; //
        newTwitterData.dateOfScraping = new Date();
        newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
        newTwitterData.tweetType = "Mention";
        newTwitterData.resultType = tweets.statuses[i].metadata.result_type;
        newTwitterData.counts = {
          retweets: tweets.statuses[i].retweet_count,
          favorites: tweets.statuses[i].favorite_count
        }
        newTwitterData.channelId = channelId;
        newTwitterData.campaignId = campaignId;

        dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
          if (err)
            console.log('Error', err);
          else {

            //console.log('Saved Successfully: ', data);

          }
        });
      }


      if (tweets.search_metadata.next_results == null) {
        //res.status(200).json({"End":tweets})
        console.log('wfé')
        res.status(200).json(count)
      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count++;
          console.log('count: ', count)
          scrap(max);
        }
        else {
          res.status(200).json(count)
        }

        //
      }

    });

  }

  scrap(null);


};


module.exports.TweetsScrapper = function (req, res, next) {

  var since = req.query.since;
  var until = req.query.until;
  var keywords = req.body.keywords;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;

  var channelId = req.query.channelId;
  var campaignId = req.query.campaignId;

  for (var i = 0; i < keywordsArrayLength; i++) {
    if (finalKeywords == null) {
      finalKeywords = ""
    }
    if (keywords.indexOf(keywords[i]) != keywordsArrayLength - 1) {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" OR ';
    }
    else {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" ';
    }
  }


  console.log(finalKeywords);
  function scrap(max_id) {

    client.get('search/tweets', {
      q: '' + finalKeywords + ' since:' + since + ' until:' + until + '',
      count: 100, max_id: max_id
    }, function (error, tweets, response) {
      if (error) {
        return res.json(error);
      }
      for (var i = 0; i < tweets.statuses.length; i++) {
        var newTwitterData = new dataProvider.tweetsProvider();
        newTwitterData.id = tweets.statuses[i].id_str;
        newTwitterData.dateContent = tweets.statuses[i].created_at;
        var newContent = tweets.statuses[i].text.replace(/\r?\n|\r/g, " ");
        newTwitterData.content = newContent;
        newTwitterData.contentLanguage = tweets.statuses[i].lang;
        newTwitterData.author = {
          screenName: tweets.statuses[i].user.screen_name,
          id: tweets.statuses[i].user.screen_name
        }; //
        newTwitterData.dateOfScraping = new Date();
        newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
        newTwitterData.tweetType = "NormalScraper";
        newTwitterData.resultType = tweets.statuses[i].metadata.result_type;
        newTwitterData.counts = {
          retweets: tweets.statuses[i].retweet_count,
          favorites: tweets.statuses[i].favorite_count
        }
        newTwitterData.channelId = channelId;
        newTwitterData.campaignId = campaignId;

        dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
          if (err)
            console.log('Error', err);
          else {

            //console.log('Saved Successfully: ', data);
          }
        });
      }

      if (tweets.search_metadata.next_results == null) {
        //res.status(200).json({"End":tweets})
        console.log('wfé')
        res.status(200).json(count)
      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count++;
          console.log('count: ', count)
          scrap(max);
        }
        else {
          res.status(200).json(count)
        }

        //
      }


    });
  }

  scrap(null);

};


module.exports.TweetsScrapperWithGeo = function (req, res, next) {

  var since = req.query.since;
  var until = req.query.until;
  var keywords = req.body.keywords;
  var geo = req.body.geo;
  var finalGeo = geo[0] + ',' + geo[1] + ',' + '150mi';

  var channelId = req.query.channelId;
  var campaignId = req.query.campaignId;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;


  for (var i = 0; i < keywordsArrayLength; i++) {
    if (finalKeywords == null) {
      finalKeywords = ""
    }
    if (keywords.indexOf(keywords[i]) != keywordsArrayLength - 1) {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" OR ';
    }
    else {
      finalKeywords = finalKeywords + '"' + keywords[i] + '" ';
    }
  }


  console.log(finalKeywords);
  function scrap(max_id) {

    client.get('search/tweets', {
      q: '' + finalKeywords + ' since:' + since + ' until:' + until + '',
      count: 100,
      max_id: max_id,
      geocode: finalGeo
    }, function (error, tweets, response) {
      if (error) {
        return res.json(error);
      }
      for (var i = 0; i < tweets.statuses.length; i++) {
        var newTwitterData = new dataProvider.tweetsProvider();
        newTwitterData.id = tweets.statuses[i].id_str;
        newTwitterData.dateContent = tweets.statuses[i].created_at;
        var newContent = tweets.statuses[i].text.replace(/\r?\n|\r/g, " ");
        newTwitterData.content = newContent;
        newTwitterData.contentLanguage = tweets.statuses[i].lang;
        newTwitterData.author = {
          screenName: tweets.statuses[i].user.screen_name,
          id: tweets.statuses[i].user.screen_name
        }; //
        newTwitterData.dateOfScraping = new Date();
        newTwitterData.hashtags = tweets.statuses[i].entities.hashtags; //
        newTwitterData.tweetType = "NormalScraperWithGeo";
        newTwitterData.resultType = tweets.statuses[i].metadata.result_type;
        newTwitterData.counts = {
          retweets: tweets.statuses[i].retweet_count,
          favorites: tweets.statuses[i].favorite_count
        }
        newTwitterData.channelId = channelId;
        newTwitterData.campaignId = campaignId;

        dataProvider.createDataProviderModel(newTwitterData, function (err, data) {
          if (err)
            console.log('Error', err);
          else {

            //console.log('Saved Successfully: ', data);

          }
        });
      }
      if (tweets.search_metadata.next_results == null) {
        //res.status(200).json({"End":tweets})
        console.log('wfé')
        res.status(200).json(count)
      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count++;
          console.log('count: ', count)
          scrap(max);
        }
        else {
          res.status(200).json(count)
        }

        //
      }


    });
  }

  scrap(null);


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

var myRequest = require('request');
module.exports.analyseLiveTweet = function (req, res, next) {


  var _mostPositiveComment = {
    "score": {
      "positivity": 0
    }
  };
  var _mostNegativeComment = {
    "score": {
      "negativity": 0
    }
  };


  client.get('statuses/retweets', {id: req.body.id}, function (error, tweets, response) {

    res.json(tweets)
    console.log("length: ", tweets.length)
    //******************************************


    /*


     async.eachSeries(tweets, function iteratee(tweet, callback) {
     utils.getSentimentalAnalysis(tweet.text)
     .then(function (result) {

     console.log("result",result)
     comment.score = result;

     if(comment.score.positivity>_mostPositiveComment.score.positivity)
     _mostPositiveComment = comment;

     if(comment.score.negativity>_mostNegativeComment.score.negativity)
     _mostNegativeComment = comment;

     callback()
     })
     .catch(function (err) {
     callback()

     })

     },function done() {
     console.log("DONE")
     console.log("_mostPositiveComment",_mostPositiveComment)
     console.log("_mostNegativeComment",_mostNegativeComment)
     res.json({
     mostPositiveComment : _mostPositiveComment,
     mostNegativeComment : _mostNegativeComment,
     });
     res.json(tweets)
     })
     */
    //*******************************************
  });

};
