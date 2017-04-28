/**
 * Created by Ibrahim on 24/03/2017.
 */
//TODO - Organize the structure LATER

var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var Campaign = require('../../../models/campaign.model');
var moment = require('moment');
var async = require('async');
var utils = require('../helpers/utils.helper');
var config = require('../../../config/facebook.config');



module.exports = {
  saveFacebookPosts : saveFacebookPosts,
  getFacebookDataProvider : getFacebookDataProvider,
  addFacebookComments : addFacebookComments,
  getFacebookSentimental : getFacebookSentimental,
  getSentimentalByPost : getSentimentalByPost,
  updateFacebookPost : updateFacebookPost
};


function saveFacebookPosts(req, res, next) {

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


function getFacebookDataProvider(req, res, next) {

  // var since = new Date(req.params.since);
  // var until = new Date(req.params.until);
  var since;
  var until;
  if (req.body.since && req.body.until) {
    since = moment(req.body.since).format();
    until = moment(req.body.until).format();
  }
  console.log("hello")
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

  if (!req.body.keywords || !req.body.keywords.length) {
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


function addFacebookComments(req, res, next) {


  async.eachSeries(req.comments, function iteratee(comment, callback) {

    var storingPromise = new Promise(function (resolve, reject) {
      var newFacebookComment = new DataProvider.FacebookCommentsProvider(comment);
      DataProvider.createDataProviderModel(newFacebookComment, function (err, item) {
        if (err) {
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


function getFacebookSentimental(req, res, next) {

  var matchObject;
  var groupObject;
  var sortObject;
  var unwindObject;
  var type = req.body.type;

  if (type == "sentimental") {
    matchObject = {
      $and: [
        {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
        {channelId: {'$eq': req.body.channelId}},
        {campaignId: {'$eq': req.body.campaignId}},
        {$text: {$search: ""}}
      ],
      $or: [{source: 'FacebookCommentsProvider'}, {source: 'FacebookPostsProvider'}]
    };


    groupObject = {
      _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
      neutral_score: {$avg: "$contentScore.neutral"},
      positive_score: {$avg: "$contentScore.positivity"},
      negative_score: {$avg: "$contentScore.negativity"}
    };

    sortObject = {dateContent: -1}

  }
  else if (type == "reactions") {
    matchObject = {
      $and: [
        {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
        {channelId: {'$eq': req.body.channelId}},
        {campaignId: {'$eq': req.body.campaignId}},
        {source: {'$eq': "FacebookPostsProvider"}}
      ]
    };


    groupObject = {
      _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
      like: {$sum: "$reactions.like.summary.total_count"},
      love: {$sum: "$reactions.love.summary.total_count"},
      sad: {$sum: "$reactions.sad.summary.total_count"},
      angry: {$sum: "$reactions.angry.summary.total_count"}
    };

    unwindObject = "$reactions";
    // sortObject = {dateContent: -1}

  }
  else if (type == "shares") {
    matchObject = {
      $and: [
        {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
        {channelId: {'$eq': req.body.channelId}},
        {campaignId: {'$eq': req.body.campaignId}},
        {source: {'$eq': "FacebookPostsProvider"}}
      ]
    };

    groupObject = {
      _id: {dateContent: {$substr: ["$dateContent", 0, 10]}},
      shares: {$sum: "$shares"}
    };

    sortObject = {dateContent: -1}


  }

  else if (type == "postsType") {

    matchObject = {
      $and: [
        {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
        {channelId: {'$eq': req.body.channelId}},
        {campaignId: {'$eq': req.body.campaignId}},
        {source: {'$eq': "FacebookPostsProvider"}}
      ]
    };

    groupObject = {
      _id: {type: "$type"}, nb: {$sum: 1},
      neutral_score: {$avg: "$contentScore.neutral"},
      positive_score: {$avg: "$contentScore.positivity"},
      negative_score: {$avg: "$contentScore.negativity"}

    };

    sortObject = {dateContent: -1}

  }
  else if (type == "topPosts") {
    matchObject = {
      $and: [
        {dateContent: {'$gte': new Date(req.body.since), '$lte': new Date(req.body.until)}},
        {channelId: {'$eq': req.body.channelId}},
        {campaignId: {'$eq': req.body.campaignId}},
        {source: {'$eq': "FacebookPostsProvider"}}
      ]
    };


    var sortProperty = req.body.sort;
    if (sortProperty.toString() == "shares") {
      sortObject = {shares: -1};
    }
    else if (sortProperty.toString() == "likes") {
      sortObject = {"reactions.0.like.summary.total_count": -1};

    }
    else if (sortProperty.toString() == "loves") {
      sortObject = {'reactions.0.love.summary.total_count': -1};
    }
    else if (sortProperty.toString() == "positive") {
      sortObject = {"contentScore.positivity": -1};
    } else if (sortProperty.toString() == "negative") {
      sortObject = {"contentScore.negativity": -1};
    }

  }


  if (req.body.channelId == "all" || !req.body.channelId) {
    matchObject.$and[1] = undefined;
  }

  if (type == "sentimental") {
    if (!req.body.keywords || !req.body.keywords.length) {
      matchObject.$and[3] = undefined;
    }
    else {
      var keywords = req.body.keywords.join(" ");
      console.log(keywords)
      matchObject.$and[3].$text.$search = keywords.toString();
    }
  }


  for (var i = 0; i < matchObject.$and.length; i++) {
    if (matchObject.$and[i] == undefined) {
      matchObject.$and.splice(i, 1);
      i = 0;
    }
  }


  console.log("typee :", type)

  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, sortObject, unwindObject).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    console.log("Error")
    console.log(err)
    res.json(err);
  })

};


function getSentimentalByPost (req, res, next) {

  var _mostPositiveComment ={
    "score": {
      "positivity": 0
    }
  };
  var _mostNegativeComment ={
    "score": {
      "negativity": 0
    }
  };


  async.eachSeries(req.comments, function iteratee(comment, callback) {
    utils.getSentimentalAnalysis(comment.message)
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
  })



};


function updateFacebookPost (req, res, next) {

  var _queryCampaign = {
    state: "active",
    dateStart: {'$lte': new Date()},
    dateEnd: {'$gte': new Date()}
  };


  Campaign.getCampaignsByQuery(_queryCampaign).then(function (campaigns) {

    var _posts = [];
    async.eachSeries(campaigns, function iteratee(campaign, callback) {

      var _until = new Date();
      var _since = new Date(new Date().setDate(_until.getDate() - 1));


      var _queryDP = {
        $and: [
          // {dateContent: {'$gte': _since, '$lte': _until}},
          {source: "FacebookPostsProvider"},
          {campaignId: campaign._id}
        ]
      };

      DataProvider.getDataProvidersByConditionModel(_queryDP, function (err, posts) {

        if (err)
          return;

        async.eachSeries(posts, function iteratee(post, cb) {

          var reactionsUrl = config.host + '/api/facebook/posts/' + post.id + '/reactions';
          utils.getData(reactionsUrl)
            .then(function (reaction) {
              reaction.date = new Date();
              post.reactions[0] = reaction;
              return post;

            })
            .then(function (postUpdated) {

              DataProvider.updateDataProviderModel(postUpdated._id, postUpdated, function (err, item) {

                if (err)
                  return;
                console.log("Post update successfully with id ", item.id);
                _posts.push(post.id);
                cb();

              })
            })
            .catch(function (err) {
              console.log(err);
              res.json(err);
            })

        }, function done() {
          callback();
        })

      });

    }, function done() {
      res.json({message: 'Done', ModifiedPosts: _posts});

    });


  });


};


function handleError(res, err) {
  return res.status(500).send(err);
}
