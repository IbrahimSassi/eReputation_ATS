/**
 * Created by Ibrahim on 08/04/2017.
 */

var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var async = require('async');

module.exports.addFacebookComments = function (req, res, next) {


  async.eachSeries(req.comments, function iteratee(comment, callback) {
    var newFacebookComment = new DataProvider.FacebookCommentsProvider(comment);

    DataProvider.createDataProviderModel(newFacebookComment, function (err, item) {
      if (err)
        return res.status(500).send(err);
      else {
        console.log('Success facebook comments saved saved', item._id);
      }

    });
    callback();
  }, function done() {
    res.json(req.comments)
  });

};


