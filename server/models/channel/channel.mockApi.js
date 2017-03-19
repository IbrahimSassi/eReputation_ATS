/**
 * Created by Ibrahim on 19/03/2017.
 */
"use strict";

//This file is mocking a web API by hitting hard coded data.
var channels = require('./channel.data').channels;
var _ = require('lodash');

//This would be performed on the server in a real app. Just stubbing in.
var _generateId = function () {
  var maxId = _.max(_.map(ChannelApi.getAllChannels(),"_id"));
  return parseInt(maxId)+1;


};

var _clone = function (item) {
  return JSON.parse(JSON.stringify(item)); //return cloned copy so that the item is passed by value instead of by reference
};

var ChannelApi = {
  getAllChannels: function () {
    return _clone(channels);
  },

  getChannelById: function (id) {
    var channel = _.find(channels, {_id: id});
    return _clone(channel);
  },
  getChannelByOwner: function (id) {
    var channel = _.find(channels, {"created_by.id": id});
    return _clone(channel);
  },

  saveChannel: function (channel) {
    //pretend an ajax call to web api is made here
    console.log('Pretend this just saved the channel to the DB via AJAX call...');

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

    return _clone(channel);
  },

  deleteChannel: function (id) {
    console.log('Pretend this just deleted the channel from the DB via an AJAX call...');
    _.remove(channels, {_id: id});
  }
};

module.exports = ChannelApi;
