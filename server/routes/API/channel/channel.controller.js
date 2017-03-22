/**
 * Created by Ibrahim on 19/03/2017.
 */
'use strict';

// var _ = require('lodash');
var Channel = require('../../../models/channel/channel.model');


exports.getAllChannels = function (req, res, next) {

  Channel.getChannelsModel(function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.status(404).send();
    }
    console.log(docs);
    res.status(200)
      .json(docs);

  });
};


exports.getChannelById = function (req, res, next) {

  Channel.getChannelByIdModel(req.params.id, function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    if (!docs) {
      return res.status(404).send();
    }
    console.log(docs);
    res.status(200)
      .json(docs);
  });

};


exports.allChannelsByOwner = function (req, res, next) {

  Channel.getChannelByOwnerModel(req.params.id, function (err, docs) {
    if (err) return handleError(res, err);

    if (!docs) {
      return res.status(404).send();
    }
    console.log(docs);
    res.status(200)
      .json(docs);
  });

};


exports.createChannel = function (req, res, next) {

  Channel.createChannelModel(req.body, function (err, item) {
    if (err) return handleError(res, err);
    else {
      console.log('Success channel saved');
      console.log(item);
      res.status(201)
        .json(item);
    }

  })
};


exports.updateChannel = function (req, res, next) {

  Channel.updateChannelModel(req.params.id, req.body, function (err, item) {
    if (err) return handleError(res, err);
    else {
      console.log('Success channel updated');
      console.log(item);
      res.status(201)
        .json(item);
    }
  })
};


exports.deleteChannel = function (req, res, next) {
  Channel.removeChannelModel(req.params.id, function (err, channel) {
    if (err) return handleError(res, err);
    return res.status(204).send();
  });
};


function handleError(res, err) {
  return res.status(500).send(err);
}
