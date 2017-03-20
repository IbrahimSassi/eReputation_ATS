/**
 * Created by Ibrahim on 19/03/2017.
 */
var express = require('express');
var router = express.Router();
var channels = require('../../../models/channel/channel.mockApi');

/* GET users listing. */
router.get('/', function (req, res, next) {
  channels.getAllChannels().then(function (data) {
    res.json(data);
  })
});


router.get('/:id', function (req, res, next) {

  channels.getChannelById(req.params.id).then(function (data) {
    res.json(data);
  })
});

router.get('/user/:id', function (req, res, next) {
  channels.getChannelByOwner(req.params.id).then(function (data) {
    res.json(data);

  })
});

router.post('/', function (req, res, next) {
  channels.saveChannel(req.body).then(function (data) {
    res.sendStatus(201);
  });
});

router.delete('/:id', function (req, res, next) {
  channels.deleteChannel(req.params.id).then(function () {
    res.status(200).end();
  });
});

router.put('/:id', function (req, res, next) {
  channels.saveChannel(req.body).then(function () {
    res.status(200).end();
  });
});

module.exports = router;
