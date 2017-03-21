/**
 * Created by Ibrahim on 19/03/2017.
 */

'use strict';

// var _ = require('lodash');
var Channel = require('../../../models/channel/channel.model');


exports.allChannels = function (req, res, next) {

  Channel.getChannels(function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.send(404);
    }
    console.log(docs);
    res.status(200)
      .json(docs);

  });
};


exports.channelById = function (req, res, next) {

  Channel.getChannelById(req.params.id, function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.send(404);
    }
    console.log(docs);
    res.status(200)
      .json(docs);
  });

};


exports.allChannelsByOwner = function (req, res, next) {

  Channel.getChannelByOwner(req.params.id, function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.send(404);
    }
    console.log(docs);
    res.status(200)
      .json(docs);
  });

};


exports.createChannel = function (req, res, next) {

  Channel.createChannel(req.body, function (err, item) {
    if (err) {
      console.log('error occured in saving channel');
    } else {
      console.log('Success channel saved');
      console.log(item);
      res.status(201)
        .json(item);
    }

  })
};


exports.updateChannel = function (req, res, next) {

  Channel.updateChannel(res.params.id, req.body, function (err, item) {
    if (err) {
      console.log('error occured in updating channel');
    } else {
      console.log('Success channel updated');
      console.log(item);
      res.status(201)
        .json(item);
    }
  })
};


exports.deleteChannel = function (req, res, next) {
  Channel.removeChannel(req.params.id, function (err, channel) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}
