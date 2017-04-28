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
  var task = cron.schedule('* * * * *', function () {

    var websitesAndKeywords = [];


    CampaignModel.findAllNewCreatedCampaigns().then(function (campaigns) {
      var channelPromise;
      async.eachSeries(campaigns, function iteratee(campaign, callback) {
        campaign.channels.forEach(function (campaignChannel) {
          channelPromise = new Promise(function (resolve, reject) {
            Channel.getChannelByIdModel(campaignChannel.channelId, function (err, channelById) {
              if (!channelById) {
                console.log("Error");
                resolve(channelById);
              }
              else {
                console.log("Entring to else");
                if (channelById.type === "twitter") {
                  var kyTab = []


                  campaign.keywords.forEach(function (item) {
                    kyTab.push(item.content);
                  });

                  var pathArray = channelById.url.split('/');
                  var ScreenName = pathArray[3];

                  websitesAndKeywords.push({
                    "since": yesterday,
                    "until": today,
                    "campaignId": campaign._id,
                    "channelId": channelById._id,
                    "url": channelById.url,
                    "keywords": kyTab,
                    "screenName": ScreenName
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

        console.log("websitesAndKeywords: ", websitesAndKeywords);

// i will add if startdate < date of creation, then scrap all data from creation date to today, else scrap only for yesterday.
        websitesAndKeywords.forEach(function (item) {
          TwitterAPIFunctions.SaveDatToTwitterProviderForRepliesToUserForChannel(item.since, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
          TwitterAPIFunctions.SaveDatToTwitterProviderForMentionedUserForChannel(item.since, item.until, item.channelId, item.campaignId, item.keywords, item.screenName)
          TwitterAPIFunctions.TweetsScrapper(item.since, item.until, item.channelId, item.campaignId, item.keywords)

        })


      });
    }).catch(function (err) {
    });


  });
  task.start();


};
