/**
 * Created by Ibrahim on 27/04/2017.
 */

var utils = require('../helpers/utils.helper');
var config = require('../../../config/config');
var Campaign = require('../../../models/campaign.model');
var Channel = require('../../../models/channel/channel.model');
var async = require('async');
var cron = require('node-cron');


module.exports = {
  facebookLauncher: facebookCronLauncher
};


function facebookCronLauncher() {
  return new Promise(function (resolve, reject) {

    // console.log("get called");

    var _since = new Date(new Date().setDate(new Date().getDate() - 1));
    var _until = new Date();
    var _targets = [];
    var channelPromise;

    var _query = {
      state: "active",
      dateStart: {'$lte': new Date()},
      dateEnd: {'$gte': new Date()}
    };
    Campaign.getCampaignsByQuery(_query)
      .then(function (campaigns) {
        // console.log("campaigns")
        // console.log(campaigns)
        async.eachSeries(campaigns, function iteratee(campaign, callback) {
          async.eachSeries(campaign.channels, function iteratee(selectedChannel, callback) {
            channelPromise = new Promise(function (resolve, reject) {
              Channel.getChannelByIdModel(selectedChannel.channelId, function (err, channel) {
                if (!channel) {
                  reject(err);
                }
                else {
                  if (channel.type === "facebook") {
                    _targets.push(
                      {
                        channelId: channel._id,
                        campaignId: campaign._id,
                        name: channel.name
                      });
                  }
                  resolve(channel);
                }
              });
            });
            channelPromise
              .then(function () {
                callback()
              })
              .catch(function (err) {
                // console.log("err 1");
                // console.log(err);
                callback()
                // reject(err);
              })

          }, function done() {
            callback()
          });


        }, function done() {

          async.eachSeries(_targets, function iteratee(target, callback) {
            // console.log("Target with Channel ..", target.name);

            var _url = getRequestBody(
              "/api/facebook/facebookPosts",
              _since.toISOString(),
              _until.toISOString(),
              target.channelId.toString(),
              target.campaignId.toString());

            // console.log("Start Getting Posts .....");
            utils.getData(_url)
              .then(function () {
                var _url = getRequestBody(
                  "/api/facebook/facebookComments",
                  _since.toISOString(),
                  _until.toISOString(),
                  target.channelId.toString(),
                  target.campaignId.toString());

                // console.log("Start Getting Comments .....");
                utils.getData(_url)
                  .then(function () {
                    //Calling next target

                    Campaign.update({_id: target.campaignId}, {
                      $set: {
                        facebookScrapingState: {
                          firstScrap: true,
                          date: new Date()
                        }
                      }
                    }, function (err, updatedData) {
                      if (err) {
                        // console.log("Error on updating campaign facebook scraping date", err);
                      }
                      // console.log("DataProvider updated for scraping state for facebook: ", updatedData);

                      callback()

                    });

                  })
                  .catch(function (err) {
                    // console.log("err 2");
                    // console.log(err);
                    callback();

                  });

              })
              .catch(function (err) {
                // console.log("err 3");
                // console.log(err);
                reject(err);
              })

          }, function done() {

            // console.log("DONE GETTING Data");
            resolve(_targets);
          })

        });


      })
      .catch(function (err) {
        // console.log("err 5");
        // console.log(err);
        reject(err);
      });
  })

}


function getRequestBody(host, since, until, channelId, campaignId) {
  return {
    url: config.host + host,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"since": "' + since +
    '", "until": " ' + until +
    '", "channelId": "' + channelId +
    '", "campaignId": "' + campaignId + '"}'

  };

}
