var express = require('express');
var router = express.Router();
var google = require('google');
var myRequest = require('request');
var scraper = require('./scraper');


/* POST home page. */
router.post('/', function (request, result, next) {
  /**Vars Definition*/
  var allResult = [];
  var allChannels = request.body.channels;
  var allKeywords = request.body.keywords;
  var postBodyVerif = request.body.postBody;
  google.resultsPerPage = request.body.minPostNb;
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
          var myPromise =scraper.scrapeArticle(url, allResult, link).then(function (content) {
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

router.get('/', function(req, res, next) {
  // var jsonString=JSON.stringify({
  //   "channels": [
  //     "www.mosaiquefm.net"
  //   ],
  //   "keywords": [
  //     {
  //       "w": "football",
  //       "inTitle": true,
  //       "inText": true,
  //       "state": "active"
  //     },
  //     {
  //       "w": "football",
  //       "inTitle": false,
  //       "inText": true,
  //       "state": "active"
  //     }
  //   ],
  //   "minPostNb": 2,
  //   "postBody": true
  // });
  // res.send("this_method_work_with_post_exemple_body : \n\n "+JSON.stringify(JSON.parse(jsonString),null,2)+"");

  myRequest({
    url: 'http://apidemo.theysay.io/api/v1/sentiment', //URL to hit
    method: 'POST', // specify the request type
    headers: { // speciyfy the headers
      'Content-Type': 'application/json'
    },
    body: '{"text": "i love this product", "level": "sentence"}' //Set the body as a string
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log(response.statusCode, body);
      res.json(JSON.parse(body));

    }
  });

});


module.exports = router;
