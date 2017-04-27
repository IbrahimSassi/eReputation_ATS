/**
 * Created by MrFirases on 4/26/2017.
 */

var moment = require('moment');

var config = require('../twitter/config');
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

var clientForReplies = new TwitterStream({
  consumer_key: config.twitterReplies.consumer_key,
  consumer_secret: config.twitterReplies.consumer_secret,
  access_token_key: config.twitterReplies.access_token,
  access_token_secret: config.twitterReplies.access_token_secret
});

var clientForMentions = new TwitterStream({
  consumer_key: config.twitterMentions.consumer_key,
  consumer_secret: config.twitterMentions.consumer_secret,
  access_token_key: config.twitterMentions.access_token,
  access_token_secret: config.twitterMentions.access_token_secret
});

var count1 = 0;
var count2 = 0;
var count3 = 0;


module.exports = {
  SaveDatToTwitterProviderForRepliesToUserForChannel: SaveDatToTwitterProviderForRepliesToUserForChannel,
  SaveDatToTwitterProviderForMentionedUserForChannel: SaveDatToTwitterProviderForMentionedUserForChannel,
  TweetsScrapper: TweetsScrapper
};


function SaveDatToTwitterProviderForRepliesToUserForChannel(since, until, channelId, campaignId, keywords, mentionedUser) {

  var since = since;
  var until = until;
  var mentionedUser = mentionedUser;
  var keywords = keywords;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;

  var channelId = channelId;
  var campaignId = campaignId;

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


    clientForReplies.get('search/tweets', {
      q: 'to:' + mentionedUser + ' ' + finalKeywords + ' since:' + since + ' until:' + until + 'result_type:popular',
      count: 100,
      max_id: max_id
    }, function (error, tweets, response) {
      if (error) {
        return -1;
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
        console.log('End Of Scrapping For Replies')

      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count1++;
          console.log('countRep: ', count1);


          if(count1==440)
          {
            setTimeout(function(){ scrap(max); }, 900000);
          }
          else
          {
          scrap(max);
          }
        }
        else {
          console.log('ElsecountRep: ', count1)
        }

        //
      }

    });

  }

  scrap(null);
};


function SaveDatToTwitterProviderForMentionedUserForChannel(since, until, channelId, campaignId, keywords, mentionedUser) {

  var since = since;
  var until = until;
  var mentionedUser = mentionedUser;
  var keywords = keywords;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;

  var channelId = channelId;
  var campaignId = campaignId;

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


    clientForMentions.get('search/tweets', {
      q: '@' + mentionedUser + ' ' + finalKeywords + ' since:' + since + ' until:' + until + 'result_type:popular',
      count: 100,
      max_id: max_id
    }, function (error, tweets, response) {
      if (error) {
        return -1;
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
        console.log('End Of Scrapping For Mentions')
      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count2++;
          console.log('countMent: ', count2)
          if(count2==440)
          {
            setTimeout(function(){ scrap(max); }, 900000);
          }
          else
          {
            scrap(max);
          }
        }
        else {
          console.log('ElsecountMent: ', count2)
        }

        //
      }

    });

  }

  scrap(null);


};


function TweetsScrapper(since, until, channelId, campaignId, keywords) {

  var since = since;
  var until = until;
  var keywords = keywords;

  var keywordsArrayLength = keywords.length;
  var finalKeywords = null;

  var channelId = channelId;
  var campaignId = campaignId;

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
        return -1;
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
        console.log('End Of Scrapping')
      }
      else {
        var max = tweets.search_metadata.next_results.slice(8, 26);
        console.log(max);
        if (max) {
          count3++;
          console.log('countAll: ', count3)
          if(count3==440)
          {
            setTimeout(function(){ scrap(max); }, 900000);
          }
          else
          {
            scrap(max);
          }
        }
        else {
          console.log('ElsecountAll: ', count3)
        }

        //
      }


    });
  }

  scrap(null);

};
