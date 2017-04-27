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

var today = moment(new Date()).format('YYYY-MM-DD')

var yesterday = moment(new Date(new Date().setDate(new Date().getDate() - 1))).format('YYYY-MM-DD');


module.exports.run = function (req, res) {
  //var task = cron.schedule('0 0 0 * * *', function () { //true one
  var task = cron.schedule('55 12 * * * *', function () {
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
              //  console.log("Error");
                resolve(channelById);
              }
              else {
               // console.log("Entring to else");
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
        //console.log("THE END OF ANALYSING");
        console.log("*****************Start*****************");
        console.log("campaignResultData: ", campaignResultData);
        console.log("*****************End*****************");



        if (campaignResultData.scraping.firstScrap != true) {
          console.log("*****************ENTRING TO NULL*****************");
          campaignResultData.forEach(function (item) {
            TwitterAPIFunctions.SaveDatToTwitterProviderForRepliesToUserForChannel(item.startDate, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
            TwitterAPIFunctions.SaveDatToTwitterProviderForMentionedUserForChannel(item.startDate, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
            TwitterAPIFunctions.TweetsScrapper(item.startDate, item.until, item.channelId, item.campaignId, item.keywords)


            //Updating dataprovider scraping state
            CampaignModel.update({_id: "590123555896af1124f4d002"}, {
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

          })

        }
        else {
          console.log("*****************ENTRING TO ELSE*****************");
          // i will add if startdate < date of creation, then scrap all data from creation date to today, else scrap only for yesterday.
          campaignResultData.forEach(function (item) {
            TwitterAPIFunctions.SaveDatToTwitterProviderForRepliesToUserForChannel(item.since, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
            TwitterAPIFunctions.SaveDatToTwitterProviderForMentionedUserForChannel(item.since, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
            TwitterAPIFunctions.TweetsScrapper(item.since, item.until, item.channelId, item.campaignId, item.keywords)


            //Updating dataprovider scraping state
            CampaignModel.update({_id: "590123555896af1124f4d002"}, {
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


      });
    }).catch(function (err) {
    });


  });
  task.start();


};
