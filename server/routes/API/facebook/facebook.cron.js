/**
 * Created by Ibrahim on 27/04/2017.
 */

var utils = require('../helpers/utils.helper');
var config = require('../../../config/facebook.config');
var moment = require('moment');
var Campaign = require('../../../models/campaign.model');
var Channel = require('../../../models/channel/channel.model');
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var async = require('async');
module.exports.facebookLauncher = function (req, res) {

  var _since = new Date(new Date().setDate(new Date().getDate() - 1));
  // var _since = new Date(moment.subtract(1, 'days'));
  var _until = new Date();
  var _targets = [];

  var _query = {
    state: "active",
    dateStart: {'$lte': new Date()},
    dateEnd: {'$gte': new Date()}
  };
  // return new Promise(function (resolve, reject) {
  Campaign.getCampaignsByQuery(_query)
    .then(function (campaigns) {
      var channelPromise;
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
              res.json(err);
            })


        }, function done() {
          callback()
        });


      }, function done() {


        console.log("Start Getting Posts .....")
        async.eachSeries(_targets, function iteratee(target, callback) {
          console.log("Target with Channel Id ..", target.name);
          console.log(_since);
          console.log(_until);

          var url = {
            url: config.host + "/api/facebook/facebookPosts",
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: '{"since": "' + _since.toISOString() +
            '", "until": " ' + _until.toISOString() +
            '", "channelId": "' + target.channelId.toString() +
            '", "campaignId": "' + target.campaignId.toString() + '"}'

          };
          utils.getData(url)
            .then(function () {
              callback();
            })
            .catch(function (err) {
              res.json(err);
            })

        }, function done() {
          res.json(_targets);
        })


      });


    })
    .catch(function (err) {
      res.json(err);
    });
  // })

};
