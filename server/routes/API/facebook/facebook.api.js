/**
 * Created by Ibrahim on 24/03/2017.
 */
var config = require('../../../config/facebook.config');
var controller = require('./facebookDataProvider.controller');
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var async = require('async');
var request = require('request');
var utils = require('../helpers/utils.helper');


module.exports = {
  getToken: getToken,
  getPostsByPage: getPostsByPage,
  getReactionsByPost: getReactionsByPost,
  pageInsights: pageInsights,
  longUrl: longUrl
};


function getToken(req, res) {
  req.ExtendedToken.then(function (value) {
    console.log("token", value);
    res.json({longToken: value});
  })

}

function getPostsByPage(req, res) {


  async.eachSeries(req.posts, function iteratee(post, callback) {
    var newFacebookPost = new DataProvider.FacebookPostsProvider(post);

    DataProvider.createDataProviderModel(newFacebookPost, function (err, item) {
      if (err)
        return res.status(500).send(err);
      else {
        console.log('Success facebook post saved', item.id);
      }

    });
    callback();
  }, function done() {
    res.json(req.posts)
  });


}

function getReactionsByPost(req, res) {

  var posts_id = req.params.id;
  var fields = "/?fields=reactions.type(LIKE).limit(0).summary(total_count).as(like)," +
    "reactions.type(LOVE).limit(0).summary(total_count).as(love)," +
    "reactions.type(WOW).limit(0).summary(total_count).as(wow)," +
    "reactions.type(HAHA).limit(0).summary(total_count).as(haha)," +
    "reactions.type(SAD).limit(0).summary(total_count).as(sad)," +
    "reactions.type(ANGRY).limit(0).summary(total_count).as(angry)";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;
  var url = config.base + posts_id + fields + parameters;
  // console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
    else {
      res.json(JSON.parse(error));
    }

  })

}

function pageInsights(req, res) {

  var page_id = req.params.id;
  var fields = "/insights?metric=['" + req.params.metric + "']" +
    "&limit=100&since=" + req.params.since + "&until=" + req.params.until;

  var parameters;
  if (req.params.metric !== "page_storytellers_by_country")
    parameters = "&access_token=" + req.params.token;
  else
    parameters = "&access_token=" + config.ACCESS_TOKEN;

  var url = config.base + page_id + fields + parameters;
  request(url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body))
      res.json(JSON.parse(body));
    }
    else {
      res.json(error);
    }

  });


}

function longUrl(req, res) {

  utils.getFacebookLongUrl(req.body.url)
    .then(function (newUrl) {
      var url = "https://www.facebook.com/" + newUrl;
      res.json({longUrl: url});
    })
    .catch(function (err) {
      res.json(err);
    });
}
