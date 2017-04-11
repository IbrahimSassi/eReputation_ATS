/**
 * Created by HP on 10/04/2017.
 */
var express = require('express');
var router = express.Router();
var DataProvider = require('../../../models/dataProvider/dataProvider.model');
var CampaignModel = require('../../../models/campaign.model');
var Channel = require('../../../models/channel/channel.model');
var google = require('google');
var myRequest = require('request');
var scraper = require('../webScraping/scraper');
var async = require('async');
router.post('/', function (req, res, next) {

  var newWebsitesArticle = new DataProvider.websitesProvider(req.body);

  DataProvider.createDataProviderModel(newWebsitesArticle, function (err, item) {
    if (err) return handleError(res, err);
    else {
      console.log('Success websites article saved');
      console.log(item);
      res.status(201)
        .json(item);
    }
  });

});

// function websitesToWorkOn() {
//   return new Promise(function (resolve, reject) {
//     myCampaign.find({_id: id}, function (err, docs) {
//       if (err) {
//         reject(err);
//       }
//       resolve(docs);
//     });
//   });
// }

router.get('/', function (req, result, next) {
  var websitesAndKeywords = [];

  CampaignModel.findAllCampaigns().then(function (campaigns) {

    var channelPromise;
    async.eachSeries(campaigns, function iteratee(campaign, callback) {
      campaign.channels.forEach(function (campaignChannel) {

        channelPromise = new Promise(function (resolve, reject) {
          Channel.getChannelByIdModel(campaignChannel.channelId, function (err, channelById) {
            if (!channelById) {
              console.log("nooo");
              resolve(channelById);

            }
            else {

              console.log("heyy");
              if (channelById.type === "website") {
                websitesAndKeywords.push({
                  "campaignId": campaign._id,
                  "url": channelById.url,
                  "keywords": campaign.keywords
                });
                // console.log(campaign);
              }
              resolve(channelById);
            }
          });
        })

      });

      channelPromise.then(function (data) {
        callback()

      })

    }, function done() {

      //res.json(websitesAndKeywords);

    //  HEY HERE DATA DONE


      var allChannels = [];
      /**Vars Definition*/
      var allResult = [];
      var allKeywords = [];
      var myChannelPromise;
      async.eachSeries(websitesAndKeywords, function iteratee(data, callback) {
        // websitesAndKeywords.forEach(function (data) {
        allChannels.push(data.url);
        myChannelPromise = new Promise(function (resolve, reject) {
        data.keywords.forEach(function (key) {
          allKeywords.push(
            {
              "w": key.content,
              "inTitle": true,
              "inText": true,
              "state": "active"
            }
          )
          resolve(key);

        });
      });
        channelPromise.then(function (data) {
          callback();
        })
      }, function done() {


      var postBodyVerif = false;
      google.resultsPerPage = 2;
      /**End of Vars Definition*/


      /**Queries Definition*/
      var searchQueryChannles = "";
      var searchQueryKeywords = "";
      var searchQuery = "";
      var promesses = [];
      allChannels.forEach(function (channel, idx) {
        if (idx === allChannels.length - 1) {
          searchQueryChannles += "site:" + channel;
        } else {
          searchQueryChannles += "site:" + channel + " OR ";
        }

      });

      allKeywords.forEach(function (keyword, idx) {
        if (keyword.state === "active") {


          if (idx === allKeywords.length - 1) {

            searchQueryKeywords += (keyword.inTitle === true ? "intitle:" + keyword.w : "");
            searchQueryKeywords += (keyword.inText === true ? "intext:" + keyword.w : "");


          } else {

            searchQueryKeywords += (keyword.inTitle === true ? "intitle:" + keyword.w + " OR " : "");
            searchQueryKeywords += (keyword.inText === true ? "intext:" + keyword.w + " OR " : "");
          }
        }

      });
      console.log("\n Search Query Channles : " + searchQueryChannles + " \n");
      console.log("\n Search Query Keywords : " + searchQueryKeywords + " \n");

      searchQuery = searchQueryChannles + ' ' + searchQueryKeywords;
      console.log("\n Search Query  : " + searchQuery + " \n");

      /**End of Queries Definition*/

      /**Begin Search crawl*/


      google(searchQuery, function (err, res) {
        if (err) console.error(err);

        if (res.links.length > 0) {

          for (var i = 0; i < res.links.length; ++i) {
            var link = res.links[i];
            link = {
              "title": link.title,
              "link": link.link,
              "description": link.description
            }
            var url = link.link;
            console.log("url : " + url);


            /**Get Post Full Body*/
            if (postBodyVerif === true) {
              var myPromise = scraper.scrapeArticle(url, allResult, link).then(function (content) {
                //console.log(content);
                return content;
              });
              promesses.push(myPromise);
            }
            /**End Get Post Full Body*/
            else {
              allResult.push(link);

            }


          }


          if (postBodyVerif === true) {
            Promise.all(promesses).then(function (data) {
              result.json(data);
            });
          } else {
            result.json(allResult);
          }


        } else {
          result.json(allResult);
        }


      });
      });
    // END HEY HERE DATA DONE

    });


  }).catch(function (err) {

  });


});


module.exports = router;
