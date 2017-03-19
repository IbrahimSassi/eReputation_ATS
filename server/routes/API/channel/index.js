/**
 * Created by Ibrahim on 19/03/2017.
 */
var express = require('express');
var router = express.Router();
var channels = require('../../../models/channel/channel.mockApi');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json(channels.getAllChannels());
});


router.get('/:id', function (req, res, next) {
  res.json(channels.getChannelById(req.params.id));
});

router.post('/', function (req, res, next) {
  channels.saveChannel(req.body);
  res.sendStatus(201);
});

router.delete('/:id', function (req, res, next) {
  channels.deleteChannel(req.params.id);
  res.status(200).end();
});

router.put('/:id', function (req, res, next) {
  channels.saveChannel(req.body);
  res.status(200).end();
});

module.exports = router;
