var express = require('express');
var router = express.Router();
var request = require('request');
var extendToken = require('./extendLLT.middleware');


const APP_ID = "583444071825924"
const APP_SECRET = "3e89611dc939876324bd42ea67ec5eb2";
const ACCESS_TOKEN = APP_ID + "|" + APP_SECRET;

const base = "https://graph.facebook.com/v2.8/"


router.get('/', function (req, res, next) {
  res.render('TestFacebookScraping', {});
});


router.get('/posts/:id', function (req, res, next) {

  // var page_id = "mosaiquefm";
  var page_id = req.params.id;
  var node = page_id + "/posts";
  var fields = "/?fields=message,link,created_time,type,name,id," +
    "comments,shares,reactions" +
    ".limit(0).summary(true)";
  var parameters = "&access_token=" + ACCESS_TOKEN;
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
  var node = posts_id;
  var fields = "/?fields=reactions.type(LIKE).limit(0).summary(total_count).as(like)," +
    "reactions.type(LOVE).limit(0).summary(total_count).as(love)," +
    "reactions.type(WOW).limit(0).summary(total_count).as(wow)," +
    "reactions.type(HAHA).limit(0).summary(total_count).as(haha)," +
    "reactions.type(SAD).limit(0).summary(total_count).as(sad)," +
    "reactions.type(ANGRY).limit(0).summary(total_count).as(angry)";
  var parameters = "&access_token=" + ACCESS_TOKEN;
  var url = base + node + fields + parameters;
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


//Used for the First Time to get the long-lived token from the short one
router.get('/1page/:id/insights/:token', extendToken, function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id;
  var fields = "/insights?metric=['page_storytellers_by_age_gender']";
  //All Metrics :
  //https://developers.facebook.com/docs/graph-api/reference/v2.5/insights#metrics


  req.ExtendedToken.then(function (value) {
    console.log("toooken", value)

    //Dynamic TOKEN Sended in the request
    var page_ACCESS_TOKEN = value;
    var parameters = "&access_token=" + page_ACCESS_TOKEN;
    var url = base + node + fields + parameters;
    console.log("url", url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        JSON.parse(body).data.LongLivedToken=page_ACCESS_TOKEN;
        res.json(JSON.parse(body));
      }
    })
  })
});


//used from second and Onwards to use direct the long lived token
router.get('/2page/:id/insights/:token', function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id;
  var fields = "/insights?metric=['page_storytellers_by_age_gender']";


  var page_ACCESS_TOKEN = req.params.token;
  var parameters = "&access_token=" + page_ACCESS_TOKEN;
  var url = base + node + fields + parameters;
  console.log("url", url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
    }
  })


});


module.exports = router;
