/**
 * Created by HP on 03/05/2017.
 */
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var CampaignModel = require('../../../models/campaign.model');
var scraper = require('./websites.controller');
var async = require('async');


module.exports.websitesLauncher = function () {
  return new Promise(function (resolve, reject) {
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
                    console.log('Success websites article saved');
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
          resolve();
        });

      });
    });
  });
};
