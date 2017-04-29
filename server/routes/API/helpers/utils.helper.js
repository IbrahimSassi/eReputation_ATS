/**
 * Created by Ibrahim on 22/04/2017.
 */

var request = require('request');
var config = require('../../../config/facebook.config');
var translate = require('google-translate-api');

module.exports = {
  getData: getData,
  cleanText: cleanText,
  getFacebookUrl: getFacebookUrl,
  getFacebookPostId: getFacebookPostId,
  getFacebookLongUrl: getFacebookLongUrl,
  getSentimentalAnalysis: getSentimentalAnalysis
};


function getData(url) {

  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      }
      else {
        reject(error)
      }

    });

  })
}

function cleanText(text) {

  text = text.replaceAll("\"", " ");
  text = text.replace(/(\r\n|\n|\r)/gm, " ")
  text = text.replaceAll("'", " ");
  text = text.replaceAll(",", " ");
  text = text.replaceAll("@", " ");
  text = text.replaceAll(".", " ");
  text = text.replaceAll("  ", " ");
  text = text.replaceAll("   ", " ");
  return text;
}

//When User gives us something like that :
// https://www.facebook.com/5281959998_10151150035389999
// And we want somethink like that
// https://www.facebook.com/5281959998/posts/10151150035389999
function getFacebookUrl(url) {
  var tab = url.split("/");
  preTransformed = tab[3].split("_");
  var link = "https://www.facebook.com/" + preTransformed[0] + "/posts/" + preTransformed[1];
  return link;
}


// when we Want somethink like that : 5281959998_10151150035389999

function getFacebookPostId(url) {
  var tab = url.split("/");
  preTransformed = tab[3].split("_");
  var link = preTransformed[0] + "_" + preTransformed[1];
  return link;
}

//When User gives us something like that :
// https://www.facebook.com/nytimes/posts/10151150035389999
// And we want somethink like that
// https://www.facebook.com/5281959998_10151150035389999

function getFacebookLongUrl(url) {
  return new Promise(function (resolve, reject) {
    var tab = url.split("/");
    var postId;
    var pageId = tab[3];
    if (url.indexOf('photos') !== -1)
      postId = tab[6];
    else
      postId = tab[5];
    var parameters = "?access_token=" + config.ACCESS_TOKEN;
    var _url = config.base + pageId + parameters;

    getData(_url)
      .then(function (data) {
        var link = data.id + "_" + postId;
        resolve(link);

      })
      .catch(function (err) {
        reject(err);
      })

  });
}


function getSentimentalAnalysis(text) {

  return new Promise(function (resolve, reject) {

    var positive = null;
    var negative = null;
    var neutral = null;


    translate(cleanText(text), {to: 'en'}).then(function (res) {
      request({
        url: 'http://apidemo.theysay.io/api/v1/sentiment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"text": "' + res.text + '", "level": "sentence"}'
      }, function (error, response, body) {
        if (error) {
          // console.log(error);
          reject(error)
        } else {

          var resultsLenght = JSON.parse(body).length;
          for (var i = 0; i < resultsLenght; i++) {
            positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
            negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
            neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
          }

          var scoreResults;
          if (positive !== null || negative !== null) {
            scoreResults = {
              positivity: positive.toFixed(3),
              negativity: negative.toFixed(3),
              neutral: neutral.toFixed(3)
            }
          }
          else {
            scoreResults = {
              positivity: positive,
              negativity: negative,
              neutral: neutral
            }
          }
          resolve(scoreResults);


        }
      });
    }).catch(function (err) {


      request({
        url: 'http://apidemo.theysay.io/api/v1/sentiment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"text": "' + cleanText(text) + '", "level": "sentence"}'
      }, function (error, response, body) {
        if (error || response.statusCode == 400) {
          reject(error)

        } else {
          var resultsLenght = JSON.parse(body).length;
          for (var i = 0; i < resultsLenght; i++) {
            positive = positive + ((JSON.parse(body)[i].sentiment.positive) / resultsLenght) * 100;
            negative = negative + ((JSON.parse(body)[i].sentiment.negative) / resultsLenght) * 100;
            neutral = neutral + ((JSON.parse(body)[i].sentiment.neutral) / resultsLenght) * 100;
          }


          var scoreResults = {
            positivity: positive.toFixed(3),
            negativity: negative.toFixed(3),
            neutral: neutral.toFixed(3)
          };
          resolve(scoreResults)

        }
      });


      // console.log("herre i am",err)


    });

  })

}


String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};
