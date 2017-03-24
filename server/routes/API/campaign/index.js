/**
 * Created by HP on 24/03/2017.
 */
var express = require('express');
var router = express.Router();
var CampaignModel = require('../../../models/campaign.model');

/* GET home page. */
router.get('/', function (req, res, next) {

  CampaignModel.findAllCampaigns().then(function (data) {
    res.status(200).json(data);
  }).catch(function (err) {
    res.status(204).json(err);
  });

});

router.get('/:id', function (req, res, next) {

  CampaignModel.findCampaignById(req.params.id).then(function (data) {
    res.status(200).json(data);
  }).catch(function (err) {
    res.status(204).json(err);
  });

});


router.post('/', function (req, res, next) {

  var campaignPosted = req.body;
  var myCampaign = new CampaignModel(campaignPosted);

  CampaignModel.saveCampaign(myCampaign).then(function (data) {
    res.status(201).json(data);
  }).catch(function (err) {
    res.status(500).send(err);
  });


});

router.put('/:id', function (req, res, next) {

  CampaignModel.updateCampaign(req.params.id,req.body).then(function (data) {
    res.status(200).json(data);
  }).catch(function (err) {
    res.status(500).json(err);
  });

});

router.delete('/:id', function (req, res, next) {

  CampaignModel.removeCampaign(req.params.id).then(function (data) {
    res.status(200).json(data);
  }).catch(function (err) {
    res.status(500).json(err);
  });

});

module.exports = router;
