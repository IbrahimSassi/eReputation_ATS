/**
 * Created by Ibrahim on 19/03/2017.
 */
var express = require('express');
var router = express.Router();
var controller = require('./channel.controller');
var channelHelper = require('../helpers/channel.helper');


// CRUD
router.get('/', controller.getAllChannels);

router.get('/:id', controller.getChannelById);

router.get('/user/:id', controller.allChannelsByOwner);

router.post('/', controller.createChannel);

router.delete('/:id', controller.deleteChannel);

router.put('/:id', controller.updateChannel);

//Others
router.get('/similar/:url', channelHelper.getSimilarWebsite);



module.exports = router;
