/**
 * Created by MrFirases on 4/23/2017.
 */
var cron = require('node-cron');
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var CampaignModel = require('../../../models/campaign.model');
var Channel = require('../../../models/channel/channel.model');
var async = require('async');
var TwitterAPIFunctions = require('./twitterAPIFunctions');
var moment = require('moment');
var sentimentalFN = require('../sentimental/SentimentalFunctions');

var today = moment(new Date()).format('YYYY-MM-DD');
var yesterday = moment(new Date(new Date().setDate(new Date().getDate() - 1))).format('YYYY-MM-DD');

module.exports.run = function (req, res) {
  //var task = cron.schedule('2 0 0 * * *', function () { //right one
  var task = cron.schedule('0 45 22 * * *', function () {
    var campaignResultData = [];
    var campaignQuery = {
      state: "active",
      dateStart: {'$lte': new Date()},
      dateEnd: {'$gte': new Date()}
    }


    CampaignModel.getCampaignsByQuery(campaignQuery).then(function (campaigns) {
      var channelPromise;
      async.eachSeries(campaigns, function iteratee(campaign, callback) {
        campaign.channels.forEach(function (campaignChannel) {
          channelPromise = new Promise(function (resolve, reject) {
            Channel.getChannelByIdModel(campaignChannel.channelId, function (err, channelById) {
              if (!channelById) {

                resolve(channelById);
              }
              else {

                if (channelById.type === "twitter") {
                  var kyTab = []


                  campaign.keywords.forEach(function (item) {
                    kyTab.push(item.content);
                  });

                  var pathArray = channelById.url.split('/');
                  var ScreenName = pathArray[3];

                  campaignResultData.push({
                    "since": yesterday,
                    "until": today,
                    "campaignId": campaign._id,
                    "channelId": channelById._id,
                    "url": channelById.url,
                    "keywords": kyTab,
                    "screenName": ScreenName,
                    "scraping": campaign.twitterScrapingState,
                    "startDate": moment(campaign.dateStart).format('YYYY-MM-DD'),
                    "endDate": moment(campaign.dateEnd).format('YYYY-MM-DD')
                  });
                }
                resolve(channelById);
              }
            });
          })
        });
        channelPromise.then(function (data) {
          callback()
        })
      }, function done() {

        console.log("THE END OF ANALYSING");
        console.log("*****************Start*****************");
        console.log("campaignResultData: ", campaignResultData);
        console.log("*****************End*****************");


        campaignResultData.forEach(function (item) {
          if (item.scraping == undefined) {
            console.log("*****************ENTRING TO NULL*****************");
            TwitterAPIFunctions.SaveDatToTwitterProviderForRepliesToUserForChannel(item.startDate, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
            TwitterAPIFunctions.SaveDatToTwitterProviderForMentionedUserForChannel(item.startDate, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
            TwitterAPIFunctions.TweetsScrapper(item.startDate, item.until, item.channelId, item.campaignId, item.keywords)


            //Updating dataprovider scraping state
            CampaignModel.update({_id: item.campaignId}, {
              $set: {
                twitterScrapingState: {
                  firstScrap: true,
                  date: new Date()
                }
              }
            }, function (err, updatedData) {
              if (err) return -1;
              console.log("DataProvider updated for scraping state for twitter: ", updatedData)

            });
          }
          else {
            console.log("*****************ENTRING TO ELSE*****************");
            campaignResultData.forEach(function (item) {
              TwitterAPIFunctions.SaveDatToTwitterProviderForRepliesToUserForChannel(item.since, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
              TwitterAPIFunctions.SaveDatToTwitterProviderForMentionedUserForChannel(item.since, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
              TwitterAPIFunctions.TweetsScrapper(item.since, item.until, item.channelId, item.campaignId, item.keywords)


              //Updating dataprovider scraping state
              CampaignModel.update({_id: item.campaignId}, {
                $set: {
                  twitterScrapingState: {
                    firstScrap: true,
                    date: new Date()
                  }
                }
              }, function (err, updatedData) {
                if (err) return -1;
                console.log("DataProvider updated for scraping state for twitter: ", updatedData)

              });

            });


          }
        })

      });
    }).catch(function (err) {
    });


  });
  task.start();


};


module.exports.runSentimentalAnalysis = function (req, res) {
  // cron.schedule('2 3 0 * * *', function(){ right one
  cron.schedule('0 45 22 * * *', function () {


    sentimentalFN.SentimentalForSpecificProvider("tweetsProvide");


  });
};
