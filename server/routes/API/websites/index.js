/**
 * Created by HP on 10/04/2017.
 */
/**
 * Imports
 */
var express = require('express');
var router = express.Router();
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var CampaignModel = require('../../../models/campaign.model');
var google = require('google');
var scraper = require('./websites.controller');
var async = require('async');
var alexaData = require('alexa-traffic-rank');

/**
 * end Imports
 */

/**
 * Search For WebsitesProvider with campaignId
 */
router.post('/', function (req, res, next) {

  var matchObject = {
    $and: [
      {
        campaignId: {
          '$eq': req.body.campaignId
        }
      },
      {
        source: {
          '$eq': "websitesProvider"
        }
      }
    ]
  };


  var groupObject = {
    _id: {
      dateContent: {
        $substr: ["$dateContent", 0, 10]
      }
    },
    neutral_score: {
      $avg: "$contentScore.neutral"
    },
    positive_score: {
      $avg: "$contentScore.positivity"
    },
    negative_score: {
      $avg: "$contentScore.negativity"
    }
  };

  if (req.body.channelId == "all") {
    matchObject.$and.splice(0, 1);
    // delete groupObject._id.channelId;
  }

  // var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, undefined, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

});

router.post('/keys', function (req, res, next) {

  var matchObject = {
    $and: [
      {
        campaignId: {
          '$eq': req.body.campaignId
        }
      },
      {
        source: {
          '$eq': "websitesProvider"
        }
      }
      ,{
        name:{
          '$regex' : ".*"+req.body.keyword+".*"
        }
      }
    ]
  };


  var groupObject = {
    _id: {
      dateContent: {
        $substr: ["$dateContent", 0, 10]
      }
    },
    neutral_score: {
      $avg: "$contentScore.neutral"
    },
    positive_score: {
      $avg: "$contentScore.positivity"
    },
    negative_score: {
      $avg: "$contentScore.negativity"
    }
  };

  if (req.body.channelId == "all") {
    matchObject.$and.splice(0, 1);
    // delete groupObject._id.channelId;
  }

  // var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, groupObject, undefined, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

});

router.post('/allkeys-neg', function (req, res, next) {

  var matchObject = {
    $and: [
      {
        campaignId: {
          '$eq': req.body.campaignId
        }
      },
      {
        source: {
          '$eq': "websitesProvider"
        }
      }
      ,{
        name:{
          '$regex' : ".*"+req.body.keyword+".*"
        }
      }
    ]
  };

  var sortObject=
  {
    "contentScore.negativity": -1 //Sort by Date Added DESC
  }



  // var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, undefined, sortObject, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

});

router.post('/allkeys-pos', function (req, res, next) {

  var matchObject = {
    $and: [
      {
        campaignId: {
          '$eq': req.body.campaignId
        }
      },
      {
        source: {
          '$eq': "websitesProvider"
        }
      }
      ,{
        name:{
          '$regex' : ".*"+req.body.keyword+".*"
        }
      }
    ]
  };

  var sortObject=
    {
      "contentScore.positivity": -1 //Sort by Date Added DESC
    }



  // var sortObject = {$sort: {dateContent: -1}};
  DataProvider.getDataProviderMatchedAndGrouped(matchObject, undefined, sortObject, undefined).then(function (data) {
    res.json(data);
  }).catch(function (err) {
    res.json(err);
  })

});

/**
 * END Search For WebsitesProvider with chanelId & campaignId
 */


/**
 * Get All WebsitesProvider
 */
router.get('/', function (req, res, next) {
  DataProvider.getDataProvidersByConditionModel({
    "source": "websitesProvider"
  }, function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.status(404).send();
    }
    res.status(200)
      .json(docs);

  });
});

/**
 * END Get All WebsitesProvider
 */

/**
 * Return ALEXA analysis
 */

router.get('/getAnalysis/:url', function (req, res, next) {
  alexaData.AlexaWebData(req.params.url, function (error, result) {
    result.websiteName = req.params.url;
    res.json(result);
  });
});

/**
 * END Return ALEXA analysis
 */
router.get('/getData', function (req, res, next) {
  var tableOfPromise = [];
  CampaignModel.findAllCampaigns().then(function (campaigns) {
    campaigns.forEach(function (campaign, index) {

      var singlePromise = new Promise(function (resolve) {
        scraper.getWebsitesArticles(campaign.keywords, campaign._id).then(function (data) {
          resolve(data);
        });
      });
      tableOfPromise.push(singlePromise);
    });
    Promise.all(tableOfPromise).then(function (data) {
      //res.json(data);
      async.eachSeries(data, function iteratee(keys, callbackData) {
        async.eachSeries(keys, function iteratee(news, callbackKeys) {
          async.eachSeries(news, function iteratee(item, callbackNews) {
            if (item !== null && item.description && item.description !== "") {

              var dataToSaveWebsites = {
                "name": item.title ? item.title : null,
                "sourceLink": item.url ? item.url : null,
                "content": item.description ? item.description : null,
                "dateContent": item.postDate ? item.postDate : new Date(),
                "contentScore": {},
                "contentTopics": [],
                "contentEmotions": [],
                "contentLanguage": item.lang ? item.lang : null,
                "author": item.author ? item.author : null,
                "dateOfScraping": new Date(),
                "campaignId": item.campaignId ? item.campaignId : null,
              };
              var newWebsitesArticle = new DataProvider.websitesProvider(dataToSaveWebsites);
              DataProvider.createDataProviderModel(newWebsitesArticle, function (err, item) {
                if (err) return handleError(res, err);
                else {
                  callbackNews();
                }
              });
            }
            else {
              callbackNews();
            }
          }, function done() {
            callbackKeys();
          });
        }, function done() {
          callbackData();
        });
      }, function done() {
        res.json({"End": "ok"});
      });

    });
  });

});


module.exports = router;
