/**
 * Created by Ibrahim on 24/03/2017.
 */
//TODO - Organize the structure LATER

var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

exports.getAllFacebookPosts = function (req, res, next) {

  DataProvider.getAllDataProvidersModel(function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.status(404).send();
    }
    console.log(docs);
    res.status(200)
      .json(docs);

  });
};

module.exports.saveFacebookPosts = function (req, res, next) {

  // console.log(req.body);
  var newFacebookPost = new DataProvider.FacebookPostsProvider(req.body);

  DataProvider.createDataProviderModel(newFacebookPost, function (err, item) {
    if (err) return handleError(res, err);
    else {
      console.log('Success facebook posts saved saved');
      console.log(item);
      res.status(201)
        .json(item);
    }

  })
};


module.exports.getFacebookDataProvider = function (req, res, next) {

  // var since = new Date(req.params.since);
  // var until = new Date(req.params.until);
  var since;
  var until;
  if (req.body.since && req.body.until) {
    since = moment(req.body.since).format();
    until = moment(req.body.until).format();
  }

  // console.log("datejs formated to moment,", moment(datejs).format())
  var query;
  var sortedBy;
  var options;

  query = {
    dateContent: {$gte: new Date(since), $lte: new Date(until)},
    channelId: req.body.channelId,
    campaignId: req.body.campaignId,
    source: req.body.source,
    $text: {$search: ""}
  };

  if (!req.body.keywords.length) {
    sortedBy = {dateContent: 1};
    delete query.$text;
  }

  if (!req.body.channelId || req.body.channelId == "all") {
    delete query.channelId;
  }

  if (!req.body.campaignId) {
    delete query.campaignId;
  }
  if (!req.body.source) {
    delete query.source;
  }
  if (!req.body.until) {
    delete query.dateContent;
  }
  if (!req.body.since) {
    delete query.dateContent;
  }


  if (req.body.keywords && req.body.keywords.length) {
    var keywords = req.body.keywords.join(" ");
    console.log(query);
    query.$text.$search = keywords.toString();
    options = {"score": {$meta: "textScore"}};
    sortedBy = {"score": {$meta: "textScore"}};
  }


  // Create DB Index !!!!!!!
  // db.dataproviders.createIndex( { content: "text",name:"text" } )

  console.log("query", query);
  DataProvider.getDataProvidersByConditionSortedModel(query, options, sortedBy, function (err, docs) {
    if (err) return handleError(res, err);
    else {
      console.log('Success ', docs.length);
      res.status(201)
        .json(docs);
    }
  })
};


module.exports.addFacebookComments = function (req, res, next) {


  async.eachSeries(req.comments, function iteratee(comment, callback) {

    var storingPromise = new Promise(function (resolve, reject) {
      var newFacebookComment = new DataProvider.FacebookCommentsProvider(comment);
      DataProvider.createDataProviderModel(newFacebookComment, function (err, item) {
        if (err)
        {
          handleError(res, err);
          reject(err)
        }
        else {
          resolve(item);
          console.log('Success facebook comments saved saved', item._id);
        }

      });
    });

    storingPromise.then(function (item) {
      callback();
    });

  }, function done() {
    res.json(req.comments)
  });

};


module.exports.getFacebookSentimental = function (req, res, next) {


  var matchObject = {
      $and: [
        {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
        {channelId: {'$eq': req.body.channelId}},
        {campaignId: {'$eq': req.body.campaignId}},
        {$text: {$search: ""}}


      ],
      $or: [{source: 'FacebookCommentsProvider'}, {source: 'FacebookPostsProvider'}]
    }
    ;


  var groupObject = {
    _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
    neutral_score: {$avg: "$contentScore.neutral"},
    positive_score: {$avg: "$contentScore.positivity"},
    negative_score: {$avg: "$contentScore.negativity"}
  };

  if (req.body.channelId == "all" || !req.body.channelId) {
    // matchObject.$and.splice(1, 1);
    matchObject.$and[1]=undefined;
  }

  console.log("before")


  if (!req.body.keywords || !req.body.keywords.length ) {
    matchObject.$and[3]=undefined;
  }


  if (req.body.keywords && req.body.keywords.length) {
    var keywords = req.body.keywords.join(" ");
    console.log(keywords)
    matchObject.$and[3].$text.$search = keywords.toString();
  }


  for (var i = 0; i < matchObject.$and.length; i++) {
    if (matchObject.$and[i] == undefined) {
      matchObject.$and.splice(i, 1);
      i = 0;
    }
  }



  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, {dateContent: -1}, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

}
;

module.exports.getReputationByReaction = function (req, res, next) {

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {channelId: {'$eq': req.body.channelId}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': "FacebookPostsProvider"}}
    ]
  };


  var groupObject = {
    _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
    like: {$sum: "$reactions.like.summary.total_count"},
    love: {$sum: "$reactions.love.summary.total_count"},
    sad: {$sum: "$reactions.sad.summary.total_count"},
    angry: {$sum: "$reactions.angry.summary.total_count"}
  };

  if (req.body.channelId == "all" || !req.body.channelId) {
    matchObject.$and.splice(1, 1);
  }

  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, {dateContent: -1}, "$reactions").then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};
module.exports.getReputationByShares = function (req, res, next) {

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {channelId: {'$eq': req.body.channelId}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': "FacebookPostsProvider"}}
    ]
  };

  var groupObject = {
    _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
    shares: {$sum: "$shares"}
  };

  if (req.body.channelId == "all" || !req.body.channelId) {
    matchObject.$and.splice(1, 1);
  }

  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, {dateContent: -1}, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};

module.exports.getReputationByTypes = function (req, res, next) {

  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {channelId: {'$eq': req.body.channelId}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': "FacebookPostsProvider"}}
    ]
  };

  var groupObject = {
    _id: {type: "$type"}, nb: {$sum: 1},
    neutral_score: {$avg: "$contentScore.neutral"},
    positive_score: {$avg: "$contentScore.positivity"},
    negative_score: {$avg: "$contentScore.negativity"}

  };

  if (req.body.channelId == "all" || !req.body.channelId) {
    matchObject.$and.splice(1, 1);
  }

  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, {dateContent: -1}, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};


module.exports.getTopPosts = function (req, res, next) {


  var matchObject = {
    $and: [
      {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
      {channelId: {'$eq': req.body.channelId}},
      {campaignId: {'$eq': req.body.campaignId}},
      {source: {'$eq': "FacebookPostsProvider"}}
    ]
  };


  if (req.body.channelId == "all" || !req.body.channelId) {
    matchObject.$and.splice(1, 1);
  }

  var sortProperty = req.body.sort;
  var sortObject;
  if (sortProperty.toString() == "shares") {
    sortObject = {shares: -1};
  }
  else if (sortProperty.toString() == "likes") {
    sortObject = {'reactions.0.like.summary.total_count': -1};
  }
  else if (sortProperty.toString() == "loves") {
    sortObject = {'reactions.0.love.summary.total_count': -1};
  }
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, undefined, sortObject, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

};


function handleError(res, err) {
  return res.status(500).send(err);
}
