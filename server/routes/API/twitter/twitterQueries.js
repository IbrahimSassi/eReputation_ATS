/**
 * Created by MrFirases on 4/9/2017.
 */

var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var moment = require('moment');


module.exports.saveToTwitterProvider = function (req, res, next) {


  var newTwitterData = new DataProvider.tweetsProvider(req.body);

  DataProvider.createDataProviderModel(newTwitterData, function (err, data) {
    if (err) return handleError(res, err);
    else {
      console.log('Success! Twitter posts was saved');
      console.log(data);
      res.status(201)
        .json(data);
    }

  })
};
