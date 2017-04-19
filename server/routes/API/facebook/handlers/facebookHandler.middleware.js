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

  var channelPromise = new Promise(function (resolve, reject) {
    request(config.host + "/api/channels/" + req.body.channelId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var channel = JSON.parse(body);
        // console.log()
        resolve(channel.url.split("/"));
      }
      else {
        reject(error);
      }
    })
  });

  channelPromise.then(function (channel) {

    console.log("channel[3]", channel[3])
    var page_id = channel[3];
    var node = page_id + "/posts";
    var fields = "?fields=message,link,created_time,type,name,id" +
      // ",comments" +
      ",shares" +
      ",reactions" +
      ".limit(0).summary(true)" +
      "&since=" + encodeURIComponent(req.body.since) +
      "&until=" + encodeURIComponent(req.body.until) +
      "&limit=100";

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

        console.log(url)
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
                    else {
                      reject(reactionError)
                    }
                  });
                });

                //Transform Data to match with our DB
                story = transformPosts(story, req.body.channelId, req.body.campaignId);
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
      channelId: req.body.channelId,
      campaignId: req.body.campaignId,
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
                urls.push(url);
                var nextPromise = handleData(initialComments, 'next');

                nextPromise
                  .then(function (data) {
                    resolve(urls)
                  })
                  .catch(function (err) {
                    console.log("next promise error", err)
                    resolve(urls)
                  });

              }
              else {
                console.log("first page")
                for (var i = 0; i < initialComments.data.length; i++)
                  comments.push(transformComments(initialComments.data[i], req.body.channelId, post.id, req.body.campaignId))
                // console.log("commentscomments", comments)
                resolve(comments)

              }
            }
            else {
              reject(error)
            }
          });

        });

        promise.then(function () {
          // console.log(post)
          callback();
        })
          .catch(function (err) {

            console.log("getting comments err", err)
            callback();
          })


      }, function done() {
        console.log("urls", urls)

        async.eachSeries(urls, function iteratee(u, callback) {
          var postId = getPostId(u);

          var SavePromise = new Promise(function (resolve, reject) {
            request(u, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var LocalBody = JSON.parse(body);
                for (var i = 0; i < LocalBody.data.length; i++) {
                  comments.push(transformComments(LocalBody.data[i], req.body.channelId, postId, req.body.campaignId));
                }
                resolve(comments);
              }
              else {
                reject(error)
              }
            });

          });

          SavePromise
            .then(function (data) {
              callback()
            })
            .catch(function (err) {
              callback()
            })

        }, function done() {
          // console.log("req.comments", comments)
          setTimeout(function () {
            req.comments = comments;
            next()
          }, 1100)

        });


      });
    })

}


function handleData(data, direction) {
  console.log("direction", direction)
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
    reject({error:'error handling next paging'})

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


function transformPosts(post, author, campaignId) {
  return {
    id: post.id,
    content: post.message != "undefined" ? post.message.replace(/(\r\n|\n|\r)/gm, "") : '',
    dateContent: post.created_time,
    type: post.type,
    sourceLink: "https://www.facebook.com/" + post.id,
    name: post.name,
    // name: post.name != "undefined" ? post.name.replace(/(\r\n|\n|\r)/gm, "") : '' ,
    link: post.link,
    author: {
      name: author
    },
    shares: typeof post.shares != "undefined" ? post.shares.count : 0,
    channelId: author,
    campaignId: campaignId

  }

}

function transformComments(comment, channel, parent, campaign) {
  return {

    id: comment.id,
    content: comment.message != "undefined" ? comment.message.replace(/(\r\n|\n|\r)/gm, "") : '',
    dateContent: comment.created_time,
    author: {
      name: comment.from.name,
      id: comment.from.id
    },
    channelId: channel,
    parentId: parent,
    campaignId: campaign
  }

}

function getPostId(url) {
  var parts = url.split('/');
  if (url.indexOf('localhost') !== -1)
    return parts[6];
  else
    return parts[4]
}
