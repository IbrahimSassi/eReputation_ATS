/**
 * Created by ninou on 3/29/2017.
 */


var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
 var async = require('async');



module.exports.getCampaignSentimental = function (req, res, next) {

  var since;
  var until;
  if (req.body.since && req.body.until) {
    since = moment(req.body.since).format();
    until = moment(req.body.until).format();
  }

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {campaignId: {'$eq': req.body.campaignId}}
    ]
  };


  var groupObject = {
    _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
    neutral_score: {$avg: "$contentScore.neutral"},
    positive_score: {$avg: "$contentScore.positivity"},
    negative_score: {$avg: "$contentScore.negativity"}
  };

  /*if (req.body.channelId == "all") {
   matchObject.$and.splice(1, 1);
   delete groupObject._id.channelId;
   }*/

  var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, undefined, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};



module.exports.getChannelSentimental = function (req, res, next) {

  var since;
  var until;
  if (req.body.since && req.body.until) {
    since = moment(req.body.since).format();
    until = moment(req.body.until).format();
  }

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': req.body.source}}
    ]
  };


  var groupObject = {
    _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
    neutral_score: {$avg: "$contentScore.neutral"},
    positive_score: {$avg: "$contentScore.positivity"},
    negative_score: {$avg: "$contentScore.negativity"},
    avg: { $avg: { $add: [ "$contentScore.neutral", "$contentScore.positivity","$contentScore.negativity" ]  } }
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
