/**
 * Created by Ibrahim on 24/03/2017.
 */

var config = require('../../../../config/facebook.config.js');
var request = require('request');
var async = require('async');
var urls = [];


module.exports.transformPostsData = function (req, res, next) {
  urls = [];
  var page_id = req.params.id;
  var node = page_id + "/posts";
  var fields = "?fields=message,link,created_time,type,name,id" +
    // ",comments" +
    ",shares" +
    ",reactions" +
    ".limit(0).summary(true)" +
    //TODO Change This Dynamic
    "&since=" + req.params.since +
    "&until=" + req.params.until;
  var parameters = "&access_token=" + config.ACCESS_TOKEN;
  var url = config.base + node + fields + parameters;
  // console.log(url);
  var posts;
  var promiseNext;
  var promisePrevious;
  var promiseReactions;
  var AllPosts = [];
  //Getting First Page
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      posts = JSON.parse(body);

      //Getting All Nexr and previous paging urls
      promiseNext = handleData(posts, "next");
      promisePrevious = handleData(posts, "previous");
      Promise.all([promisePrevious, promiseNext]).then(function (tab) {

        //Requesting Data for all those urls
        async.eachSeries(tab[0], function iteratee(listItem, callback) {
          request(listItem, function (error, response, body) {
            var localData = JSON.parse(body).data;
            localData.forEach(function (story) {

              // Getting Reactions For each story
              promiseReactions = new Promise(function (resolveReaction, reject) {
                request('http://localhost:3000/api/facebook/posts/' + story.id + '/reactions', function (reactionError, reactionResponse, reactionBody) {
                  if (!reactionError && reactionResponse.statusCode == 200) {
                    var reactions = JSON.parse(reactionBody);
                    resolveReaction(reactions)
                  }
                });
              });

              //Transform Data to match with our DB
              story = transformPosts(story, req.params.id)
              promiseReactions.then(function (data) {
                story.reactions = [];
                data.date = new Date();
                story.reactions.push(data)
                AllPosts.push(story);
              });
            });
            callback(error, body);
          });
        }, function done() {
          req.posts = AllPosts;
          next();
        });
      });
    }
  });
};

function handleData(data, direction) {
  return new Promise(function (resolve, reject) {
    if (data.paging && data.paging[direction]) {
      urls.push(data.paging[direction]);
      getData(data.paging[direction]).then(function (newData) {
        handleData(newData, direction).then(function (data) {
          resolve(urls)
        })
      })
    }
    else {
      resolve(urls)
    }
  })
}


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


function transformPosts(post, author) {
  return {
    id: post.id,
    content: post.message,
    dateContent: post.created_time,
    type: post.type,
    sourceLink: "https://www.facebook.com/" + post.id,
    name: post.name,
    link: post.link,
    author: {
      name: author
    },
    shares: typeof post.shares != "undefined" ? post.shares.count : 0,
    channelId: author
  }

}
