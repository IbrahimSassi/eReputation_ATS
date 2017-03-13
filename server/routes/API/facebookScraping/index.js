var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/', function (req, res, next) {


  var app_id = "583444071825924"
  var app_secret = "3e89611dc939876324bd42ea67ec5eb2";
  var page_id = "mosaiquefm"
  var access_token = app_id + "|" + app_secret;

  var base = "https://graph.facebook.com/v2.8/"
  var node = page_id + "/posts" ;
  var fields = "/?fields=message,link,created_time,type,name,id," +
            "comments,shares,reactions" +
            ".limit(0).summary(true)"
  var parameters = "&access_token=" + access_token;
  var url = base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })



});


module.exports = router;
