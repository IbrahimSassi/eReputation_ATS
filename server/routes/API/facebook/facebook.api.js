/**
 * Created by Ibrahim on 24/03/2017.
 */
var config = require('../../../config/facebook.config');
var controller = require('../facebook/facebookPosts.controller');
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var async = require('async');

var request = require('request');

module.exports.getToken = function (req, res, next) {
  req.ExtendedToken.then(function (value) {
    console.log("toooken", value);
    res.json({longToken: value});
  })

};


module.exports.getPostsByPage = function (req, res, next) {

  // var page_id = "mosaiquefm";
  console.log("req.posts.length", req.posts.length)


  async.eachSeries(req.posts, function iteratee(post, callback) {
    var newFacebookPost = new DataProvider.FacebookPostsProvider(post);

    DataProvider.createDataProviderModel(newFacebookPost, function (err, item) {
      if (err)
        return res.status(500).send(err);
      else {
        console.log('Success facebook posts saved saved', item.id);
      }

    });
    callback();
  }, function done() {
    res.json(req.posts)
  });


};


module.exports.getCommentsByPost = function (req, res, next) {

  // var page_id = "mosaiquefm";
  var page_id = req.params.id;
  // var node =  "posts/";
  var fields = "/comments";
  var parameters = "?access_token=" + config.ACCESS_TOKEN;
  var url = config.base + page_id + fields + parameters;
  // console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })

};

module.exports.getReactionsByPost = function (req, res, next) {

  var posts_id = req.params.id;
  var node = posts_id;
  var fields = "/?fields=reactions.type(LIKE).limit(0).summary(total_count).as(like)," +
    "reactions.type(LOVE).limit(0).summary(total_count).as(love)," +
    "reactions.type(WOW).limit(0).summary(total_count).as(wow)," +
    "reactions.type(HAHA).limit(0).summary(total_count).as(haha)," +
    "reactions.type(SAD).limit(0).summary(total_count).as(sad)," +
    "reactions.type(ANGRY).limit(0).summary(total_count).as(angry)";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;
  var url = config.base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


};


module.exports.pageInsights = function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id;
  var fields = "/insights?metric=['" + req.params.metric + "']" +
    "&limit=100&since=" + req.params.since + "&until=" + req.params.until;
  var parameters = "&access_token=" + req.params.token;
  var url = config.base + node + fields + parameters;

  request(url, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body))
      res.json(JSON.parse(body));
    }
  });

  // return req.pipe(request(url)).pipe(res);

};


