/**
 * Created by HP on 30/04/2017.
 */
var Xray = require('x-ray');
var x = Xray();
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();
var myGoogleNews = require('my-google-news');
var moment = require('moment');
var async = require('async');


module.exports.getWebsitesArticles = function (tableOfKeywords, campaignId) {
  return new Promise(function (resolve, reject) {
    decomposeRequests(tableOfKeywords, campaignId).then(function (data) {
      resolve(data);
    }).catch(function (err) {
      console.log(err);
      reject(err);
    });
  });
};

function decomposeRequests(tableOfFourKeywords, campaignId) {
  return new Promise(function (resolve, reject) {
    var tableAllData = [];
    var count = 0;
    async.eachSeries(tableOfFourKeywords, function iteratee(item, callback) {
      var resultPerPage = 0;
      if (item.importance === 'low') {
        resultPerPage = 10;
      }
      if (item.importance === 'medium') {
        resultPerPage = 50;
      }
      if (item.importance === 'high') {
        resultPerPage = 100;
      }
      console.log(count);
      searchAndScrapeGoogleNewsByKeywords(item.content, resultPerPage, campaignId).then(function (data) {
        tableAllData.push(data);
        count++;
        callback();
      }).catch(function (err) {
        reject(err);
        callback();
      });
    }, function done() {
      resolve(tableAllData);
    });

  });
};


function searchAndScrapeGoogleNewsByKeywords(keyword, resultByPage, campaignId) {
  return new Promise(function (resolve, reject) {
    //init vars
    var tableOfPromise = [];
    var queryToSearch = keyword;
    myGoogleNews.resultsPerPage = resultByPage;
    //end init vars
    myGoogleNews(queryToSearch, function (err, result) {
      if (err) {
        console.error(err);
        reject(err);
      }

      result.links.forEach(function (item) {
        var singlePromise = new Promise(function (resolve) {
          getUrlDetails(item.href, campaignId).then(function (detail) {
            //allUrlDetails.push(detail);
            resolve(detail);
          }).catch(function (err) {
            resolve();
          });
        });
        tableOfPromise.push(singlePromise);
      });
      Promise.all(tableOfPromise).then(function (data) {
        resolve(data);
      });

    });
  });
};


/**
 *
 * @param passedUrl
 */
function getUrlDetails(passedUrl, campaignId) {
  return new Promise(function (resolve, reject) {
    var url = passedUrl; //get URL
    //get MetaData and Content

    x(url, {
      title: 'title',
      metatags: x('meta', [{
        tagName: '@name',
        tagContent: '@content'
      }]),
      meta: 'meta'
    })(function (err, obj) {
      if (err) {
        console.error("getURLDetails ERROR: ", err);
        reject(err); //reject err
      }

      if (obj !== undefined) {
        var objToDisplay = {};
        objToDisplay.campaignId = campaignId; //add campaignId to obj
        objToDisplay.url = url; //add url to obj
        objToDisplay.title = obj.title; //add title to obj


        obj.metatags.forEach(function (item) {
          if (item.tagName === 'description') {
            objToDisplay.description = item.tagContent; //add description to obj
            var lang = lngDetector.detect(item.tagContent); //detect language
            objToDisplay.lang = lang[0][0]; //add lang to obj
          }
          if (item.tagName === 'author') {
            objToDisplay.author = item.tagContent; //add author to obj
          }
          if (moment(item.tagContent, moment.ISO_8601, true).isValid()
            && moment(item.tagContent, moment.ISO_8601, true).year() <= moment().year()
            && moment(item.tagContent, moment.ISO_8601, true).year()>2000 ) {

            objToDisplay.postDate = item.tagContent; //add postDate to obj
          }
        });
        resolve(objToDisplay); //resolve objToDisplay
      }
    });
  });
};
