/**
 * Created by Ibrahim on 24/03/2017.
 */
//TODO - Organize the structure LATER

var DataProvider = require('../../../models/dataProvider/dataProvider.model');


exports.getAllFacebookPosts = function (req, res, next) {

  DataProvider.getAllDataProvidersModel(function (err, docs) {
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

module.exports.saveFacebookPosts = function (req, res, next) {

  console.log(req.body)
  var newFacebookPost = new DataProvider.FacebookPostsProvider(req.body);

  DataProvider.createDataProviderModel(newFacebookPost, function (err, item) {
    if (err) return handleError(res, err);
    else {
      console.log('Success facebook posts saved saved');
      console.log(item);
      res.status(201)
        .json(item);
    }

  })


};


function handleError(res, err) {
  return res.status(500).send(err);
}
