/**
 * Created by Ibrahim on 22/04/2017.
 */

var request = require('request');
var config = require('../../../config/facebook.config');

var getData = module.exports.getData = function (url) {

  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      }
      else {
        reject(JSON.parse(error))
      }

    });

  })
};


//When User gives us something like that :
// https://www.facebook.com/5281959998_10151150035389999
// And we want somethink like that
// https://www.facebook.com/5281959998/posts/10151150035389999
module.exports.getFacebookUrl = function (url) {
  var tab = url.split("/");
  preTransformed = tab[3].split("_");
  var link = "https://www.facebook.com/" + preTransformed[0] + "/posts/" + preTransformed[1];
  return link;
};


// when we Want somethink like that : 5281959998_10151150035389999

module.exports.getFacebookPostId = function (url) {
  var tab = url.split("/");
  preTransformed = tab[3].split("_");
  var link = preTransformed[0] + "_" + preTransformed[1];
  return link;
};

//When User gives us something like that :
// https://www.facebook.com/nytimes/posts/10151150035389999
// And we want somethink like that
// https://www.facebook.com/5281959998_10151150035389999

module.exports.getFacebookLongUrl = function (url) {
  return new Promise(function (resolve, reject) {
    var tab = url.split("/");
    var pageId = tab[3];
    var postId = tab[5];
    var parameters = "?access_token=" + config.ACCESS_TOKEN;
    var _url = config.base + pageId + parameters;

    getData(_url)
      .then(function (data) {
        console.log("data", data);
        var link = data.id + "_" + postId;
        resolve(link);

      })
      .catch(function (err) {
        reject(err);
      })

  });
};
