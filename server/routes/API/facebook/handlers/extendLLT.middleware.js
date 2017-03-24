/**
 * Created by Ibrahim on 14/03/2017.
 */
var request = require('request');
var config = require('../../../../config/facebook.config.js');


module.exports = function (req, res, next) {

  var node = "oauth/access_token?" +
    "client_id=" + config.APP_ID + "&" +
    "client_secret=" + config.APP_SECRET + "&" +
    "grant_type=fb_exchange_token&" +
    "fb_exchange_token=" + req.params.token;

  var url = config.base + node;

  console.log("before **", req.params.token);

  var promise = new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var ExtendedToken = JSON.parse(body).access_token;
        resolve(ExtendedToken);
        console.log("after **", ExtendedToken);
        // req.ExtendedToken = ExtendedToken;
        // req.params.token = JSON.parse(body);
      }
    });
  });

  req.ExtendedToken = promise;
  next();


};
