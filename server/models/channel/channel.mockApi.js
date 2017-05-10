/**
 * Created by Ibrahim on 19/03/2017.
 */
"use strict";

//This file is mocking a web API by hitting hard coded data.
var channels = require('./channel.data').channels;
var _ = require('lodash');

//This would be performed on the server in a real app. Just stubbing in.
var _generateId = function () {
  var maxId = _.max(_.map(channels, "_id"));
  return parseInt(maxId) + 1;


};

var _clone = function (item) {
  return JSON.parse(JSON.stringify(item)); //return cloned copy so that the item is passed by value instead of by reference
};

var ChannelApi = {
  getAllChannels: function () {
    return new Promise(function (resolve,reject) {
      setTimeout(function () {
        resolve(_clone(channels));
      },1000)
    })
  },

  getChannelById: function (id) {
    return new Promise(function (resolve,reject) {
      setTimeout(function () {
        var channel = _.find(channels, {_id: id});
        resolve(channel);

      },1000);
    })
  },
  getChannelByOwner: function (id) {

    return new Promise(function (resolve,reject) {
      setTimeout(function () {
        var myChannels = [];
        _.map(channels, function (channel) {
          if (channel.userId == id)
            myChannels.push(channel);
        });
        resolve(_clone(myChannels));

      },1000)
    })
  },

  saveChannel: function (channel) {

    return new Promise(function (resolve,reject) {
      setTimeout(function () {

        //pretend an ajax call to web api is made here
        // console.log('Pretend this just saved the channel to the DB via AJAX call...');

        if (channel._id) {
          var existingChannelIndex = _.indexOf(channels, _.find(channels, {_id: channel._id}));
          channels.splice(existingChannelIndex, 1, channel);
        } else {
          //Just simulating creation here.
          //The server would generate ids for new channels in a real app.
          //Cloning so copy returned is passed by value rather than by reference.
          channel._id = _generateId();
          channels.push(channel);
        }

        resolve(channel);


      },1000)
    })

  },

  deleteChannel: function (id) {
    return new Promise(function (resolve,reject) {
      setTimeout(function () {
        // console.log('Pretend this just deleted the channel from the DB via an AJAX call...');
        _.remove(channels, {_id: id});
        resolve();
      },1000)
    })
  }
};

module.exports = ChannelApi;
