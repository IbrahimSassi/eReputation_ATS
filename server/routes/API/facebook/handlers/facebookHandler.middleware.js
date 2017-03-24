/**
 * Created by Ibrahim on 24/03/2017.
 */

var config = require('../../../../config/facebook.config.js');
var request = require('request');

module.exports.transformPostsData = function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id + "/posts";
  var fields = "?fields=message,link,created_time,type,name,id," +
    "comments,shares,reactions" +
    ".limit(0).summary(true)" +
    //TODO Change This Dynamic
    "&since=" + "24-03-2017";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;

  var url = config.base + node + fields + parameters;
  console.log(url);

  var promise = new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var posts = JSON.parse(body);
        resolve(posts);
      }
    });
  });

  req.postsTransformed = promise;
  next();


};
