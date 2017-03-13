var express = require('express');
var router = express.Router();
var request = require('request');


const app_id = "583444071825924"
const app_secret = "3e89611dc939876324bd42ea67ec5eb2";
const access_token = app_id + "|" + app_secret;

var base = "https://graph.facebook.com/v2.8/"


router.get('/posts', function (req, res, next) {

  var page_id = "mosaiquefm";
  var node = page_id + "/posts";
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


router.get('/posts/:id/reactions', function (req, res, next) {

  var posts_id = req.params.id;
  var node = posts_id ;
  var fields = "/?fields=reactions.type(LIKE).limit(0).summary(total_count).as(like)," +
    "reactions.type(LOVE).limit(0).summary(total_count).as(love)," +
    "reactions.type(WOW).limit(0).summary(total_count).as(wow)," +
    "reactions.type(HAHA).limit(0).summary(total_count).as(haha)," +
    "reactions.type(SAD).limit(0).summary(total_count).as(sad)," +
    "reactions.type(ANGRY).limit(0).summary(total_count).as(angry)";
  var parameters = "&access_token=" + access_token;
  var url = base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


router.get('/page/:id/insights/:token', function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id ;
  var fields = "/insights?metric=['page_storytellers_by_age_gender']";


  // var page_access_token = "EAACEdEose0cBANSadQiZC3xcXAizcdMdm3Ibx6TwbafBLttSQ3BNRpMCoJ8HWRyqt8ZAflCbC8nvxNkVpOv0vGQH7Xqz5O5YQr33lo2ogNpPkPupZCWNhX69SLsykvUMLmmMyBY4HxprVGg0cbEJZBtOBCR5FyvxeetO22qk6JujnNcGg9zYkqthMLNn2LcZD";
  var page_access_token = req.params.token;
  var parameters = "&access_token=" + page_access_token;
  var url = base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});



module.exports = router;
