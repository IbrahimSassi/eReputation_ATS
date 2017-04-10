/**
 * Created by HP on 10/04/2017.
 */
var express = require('express');
var router = express.Router();
var DataProvider = require('../../../models/dataProvider/dataProvider.model');


router.post('/', function (req, res, next) {

  var newWebsitesArticle = new DataProvider.websitesProvider(req.body);

  DataProvider.createDataProviderModel(newWebsitesArticle, function (err, item) {
    if (err) return handleError(res, err);
    else {
      console.log('Success websites article saved');
      console.log(item);
      res.status(201)
        .json(item);
    }
  });

});

router.get('/', function (req, res, next) {

  res.json({ok:"ok"});

});


module.exports = router;
