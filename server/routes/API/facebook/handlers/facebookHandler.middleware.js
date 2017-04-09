/**
 * Created by Ibrahim on 24/03/2017.
 */

var config = require('../../../../config/facebook.config');
var request = require('request');
var async = require('async');
var urls = [];
var DataProvider = require('../../../../models/dataProvider/dataProvider.model');
var moment = require("moment");


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

      urls.push(url);
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
                request(config.host + '/api/facebook/posts/' + story.id + '/reactions', function (reactionError, reactionResponse, reactionBody) {
                  if (!reactionError && reactionResponse.statusCode == 200) {
                    var reactions = JSON.parse(reactionBody);
                    resolveReaction(reactions);
                  }
                });
              });

              //Transform Data to match with our DB
              story = transformPosts(story, req.params.id);
              promiseReactions.then(function (data) {
                story.reactions = [];
                data.date = new Date();
                story.reactions.push(data);
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


module.exports.transformCommentsData = function (req, res, next) {

  var since = moment(req.body.since).format();
  var until = moment(req.body.until).format();
  var comments = [];
  urls = [];
  DataProvider.getDataProvidersByConditionModel(
    {
      source: 'FacebookPostsProvider',
      dateContent: {$gte: since, $lte: until}
    }, function (err, posts) {

      async.eachSeries(posts, function iteratee(post, callback) {
        // var newFacebookPost = new DataProvider.FacebookPostsProvider(post);

        var url = config.host + "/api/facebook/posts/" + post.id + "/comments";
        var promise = new Promise(function (resolve, reject) {
          request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var initialComments = JSON.parse(body);
              if (initialComments.paging && initialComments.paging.next) {
                // console.log("initialComments.data", initialComments.data)
                urls.push(url)
                var nextPromise = handleData(initialComments, 'next');

                nextPromise.then(function (data) {
                  console.log("dataaa", data)
                  resolve(urls)
                });

              }
              else {
                for (var i = 0; i < initialComments.data.length; i++)
                  comments.push(transformComments(initialComments.data[i], post.channelId, post.id))

                resolve(body)

              }
            }
            else {
              reject(error)
            }
          });

        });

        promise.then(function () {
          callback();
        })


      }, function done() {
        console.log("urls", urls)

        var prom = new Promise(function (resolve, reject) {
          urls.forEach(function (u) {
            var postId = getPostId(u);
            console.log("postId", postId)
            request(u, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var LocalBody = JSON.parse(body);
                for (var i = 0; i < LocalBody.data.length; i++) {
                  comments.push(transformComments(LocalBody.data[i],postId,postId));
                  // comments.push(transformComments(LocalBody.data[i]),post.channelId, post.id)
                }
              }
            });
          });
          resolve(comments);

        });
        prom.then(function (data) {
          setTimeout(function () {
            req.comments = comments;
            next()
          }, 1100)

        });

        // async.eachSeries(urls, function iteratee(u, callback) {
        //   request(u, function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //       var LocalBody = JSON.parse(body);
        //       for (var i = 0; i < LocalBody.data.length; i++)
        //         comments.push(LocalBody.data[i])
        //     }
        //   });
        //   callback()
        //
        // }, function done() {
        //   setTimeout(function () {
        //     console.log(comments.length)
        //     res.json(comments);
        //   }, 1100)
        // });

      });
    })

}


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

function transformComments(comment, channel, parent) {
  return {
    id: comment.id,
    content: comment.message,
    dateContent: comment.created_time,
    author: {
      name: comment.from.name,
      id: comment.from.id
    },
    channelId: channel,
    parentId: parent
  }

}

function getPostId(url) {
  var parts = url.split('/');
  if (url.indexOf('localhost') !== -1)
    return parts[6];
  else
    return parts[4]
}
