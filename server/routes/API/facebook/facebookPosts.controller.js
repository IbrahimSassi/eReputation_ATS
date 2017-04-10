/**
 * Created by Ibrahim on 24/03/2017.
 */
//TODO - Organize the structure LATER

var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;

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
  if(req.body.since && req.body.until)
  {
    var since = moment(req.body.since).format();
    var until = moment(req.body.until).format();
  }

  // console.log("datejs formated to moment,", moment(datejs).format())
  var query;
  var sortedBy;
  var options;

  query = {
    dateContent: {$gte: since, $lte: until},
    channelId: req.body.channelId,
    campaignId: req.body.campaignId,
    source: req.body.source
  };

  if (!req.body.keywords) {
    sortedBy = {dateContent: 1}
  }

  if (!req.body.channelId) {
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

    query.$text.$search = keywords;
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


function handleError(res, err) {
  return res.status(500).send(err);
}
