/**
 * Created by MrFirases on 4/23/2017.
 */
var cron = require('node-cron');
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var CampaignModel = require('../../../models/campaign.model');
var Channel = require('../../../models/channel/channel.model');
var async = require('async');

module.exports.run = function (req, res) {
var task = cron.schedule('* * * * * *', function(){

  var websitesAndKeywords = [];



  CampaignModel.findAllCampaigns().then(function (campaigns) {
    var channelPromise;
    async.eachSeries(campaigns, function iteratee(campaign, callback) {
      campaign.channels.forEach(function (campaignChannel) {
        channelPromise = new Promise(function (resolve, reject) {
          Channel.getChannelByIdModel(campaignChannel.channelId, function (err, channelById) {
            if (!channelById) {
              console.log("nooo");
              resolve(channelById);
            }
            else {
              console.log("heyy");
              if (channelById.type === "twitter") {
                websitesAndKeywords.push({
                  "campaignId": campaign._id,
                  "channelId": channelById._id,
                  "url": channelById.url,
                  "keywords": campaign.keywords
                });
                console.log(websitesAndKeywords);
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
      console.log("end");


    });
  }).catch(function (err) {
  });











});
task.start();




};
