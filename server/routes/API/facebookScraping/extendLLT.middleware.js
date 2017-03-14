/**
 * Created by Ibrahim on 14/03/2017.
 */

var request = require('request');
const APP_ID = "583444071825924"
const APP_SECRET = "3e89611dc939876324bd42ea67ec5eb2";

const base = "https://graph.facebook.com/v2.8/"


module.exports = function (req,res,next) {

  console.log("middle")
  var node = "oauth/access_token?" +
    "client_id="+APP_ID+"&" +
    "client_secret="+APP_SECRET+"&" +
    "grant_type=fb_exchange_token&"+
    "fb_exchange_token="+req.params.token;

  var url = base + node;

  console.log("before **",req.params.token)

var promise = new Promise(function (resolve,reject) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      var ExtendedToken = JSON.parse(body).access_token;
      resolve(ExtendedToken);
      console.log("after **",ExtendedToken);
      // req.ExtendedToken = ExtendedToken;
      // req.params.token = JSON.parse(body);
    }
  });
});

  req.ExtendedToken = promise;
  next();




}
