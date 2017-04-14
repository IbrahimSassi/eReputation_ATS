/**
 * Created by MrFirases on 4/12/2017.
 */
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');


module.exports.getTwitterSentimentalForMention = function (req, res, next) {

  console.log("ahawa: ", req.body.since)

  var since;
  var until;
  if (req.body.since && req.body.until) {
    since = moment(req.body.since).format();
    until = moment(req.body.until).format();
  }

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {channelId: {'$eq': req.body.channelId}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': "tweetsProvider"}},
      {tweetType: {'$eq': "Mention"}}
    ]
  };


  var groupObject = {
    _id: {Insights: "My Insights"},
    neutral_score: {$avg: "$contentScore.neutral"},
    positive_score: {$avg: "$contentScore.positivity"},
    negative_score: {$avg: "$contentScore.negativity"}
  };

  if (req.body.channelId == "all") {
    matchObject.$and.splice(1, 1);
    delete groupObject._id.channelId;
  }

  var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, undefined, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};


module.exports.getTwitterSentimentalForReply = function (req, res, next) {

  console.log("ahawa: ", req.body.since)

  var since;
  var until;
  if (req.body.since && req.body.until) {
    since = moment(req.body.since).format();
    until = moment(req.body.until).format();
  }

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {channelId: {'$eq': req.body.channelId}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': "tweetsProvider"}},
      {tweetType: {'$eq': "Reply"}}
    ]
  };


  var groupObject = {
    _id: {Insights: "My Insights"},
    neutral_score: {$avg: "$contentScore.neutral"},
    positive_score: {$avg: "$contentScore.positivity"},
    negative_score: {$avg: "$contentScore.negativity"}
  };

  if (req.body.channelId == "all") {
    matchObject.$and.splice(1, 1);
    delete groupObject._id.channelId;
  }

  var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, undefined, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};


module.exports.getTopTweet = function (req, res, next) {

  var tweetType = req.body.tweetType;
  var score = req.body.score;
  var campaignId = req.body.campaignId;
  var channelId = req.body.channelId;
  var since = req.body.since;
  var until = req.body.until;


  if (score == "positive") {
    console.log("ahaha")
    DataProvider.findOne({
      tweetType: tweetType, channelId: channelId, campaignId: campaignId, dateContent: {
        $gte: new Date(since),
        $lt: new Date(until)
      }
    }).sort({'contentScore.positivity': -1}).then(function (doc, err) {
      if (err) res.send(err)
      res.json(doc)
    })

  }
  else {
    DataProvider.findOne({
      tweetType: tweetType,
      channelId: channelId,
      campaignId: campaignId,
      dateContent: {
        $gte: new Date(since),
        $lt: new Date(until)
      }
    }).sort({'contentScore.negativity': -1}).then(function (doc, err) {
      if (err) res.send(err)
      res.json(doc)
    })
  }
};


module.exports.getTopHashtags = function (req, res, next) {

  DataProvider.aggregate([{
    $match: {

      source: {'$eq': "tweetsProvider"},
      tweetType: {'$eq': req.body.tweetType},


      dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)},
      campaignId: {'$eq': req.body.campaignId},
      channelId: {'$eq': req.body.channelId},
    }
  }, {$unwind: "$hashtags"}, {$group: {_id: "$hashtags", assets: {$push: {assets_id: "$_id"}}, nb: {$sum: 1}}},

    {$sort: {score: {$meta: "textScore"}, nb: -1}}])

    .then(function (data) {
      res.json(data);
    }).catch(function (err) {
    res.json(err);
  })

};
