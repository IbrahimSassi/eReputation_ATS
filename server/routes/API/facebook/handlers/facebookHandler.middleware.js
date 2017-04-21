/**
 * Created by Ibrahim on 24/03/2017.
 */

var config = require('../../../../config/facebook.config');
var request = require('request');
var async = require('async');
var DataProvider = require('../../../../models/dataProvider/dataProvider.model');
var moment = require("moment");

var _urls = [];

module.exports.transformPostsData = function (req, res, next) {
  _urls = [];

  var channelPromise = getChannelSelected(req.body.channelId);

  channelPromise.then(function (channel) {


    var since = moment(req.body.since).format("DD-MM-YYYY");
    var until = moment(req.body.until).format("DD-MM-YYYY");
    console.log("Channel Selected :", channel)
    var page_id = channel;
    var node = page_id + "/posts";
    var fields = "?fields=message,link,created_time,type,name,id" +
      ",shares" +
      ",reactions" +
      ".limit(0).summary(true)" +
      "&since=" + encodeURIComponent(req.body.since) +
      "&until=" + encodeURIComponent(req.body.until) +
      // "&since=" + new Date(req.body.since).getTime() /1000 + //Unix timestamps
      // "&until=" + new Date(req.body.until).getTime() /1000 +
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
    getData(url).then(function (data) {

      _urls.push(url);
      //Getting All Nexr and previous paging _urls
      promiseNext = handleFbPaging(data, "next");
      promisePrevious = handleFbPaging(data, "previous");
      Promise.all([promisePrevious, promiseNext]).then(function () {

        //Requesting Data for all those urls
        async.eachSeries(_urls, function iteratee(url, callback) {
          getData(url).then(function (posts) {
            posts.data.forEach(function (story) {

              // Getting Reactions For each story
              promiseReactions = new Promise(function (resolve, reject) {
                var reactionsUrl = config.host + '/api/facebook/posts/' + story.id + '/reactions';
                getData(reactionsUrl)
                  .then(function (reactions) {
                    resolve(reactions);
                  })
                  .catch(function (err) {
                    reject(err)
                  });
              });

              //Transform Data to match with our DB
              promiseReactions.then(function (reaction) {
                story = transformPosts(story, req.body.channelId, req.body.campaignId);
                story.reactions = [];
                data.date = new Date();
                story.reactions.push(reaction);
                AllPosts.push(story);

              });

            });
            callback();
          });

        }, function done() {
          setTimeout(function () {
            req.posts = AllPosts;
            next();
          }, 1000)
        });
      });

    });


  });

};


module.exports.transformCommentsData = function (req, res, next) {

  var since = moment(req.body.since).format();
  var until = moment(req.body.until).format();
  var comments = [];
  _urls = [];
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
          getData(url).then(function (initialComments) {
            if (initialComments.paging && initialComments.paging.next) {
              // console.log("initialComments.data", initialComments.data)
              _urls.push(url);
              var nextPromise = handleFbPaging(initialComments, 'next');

              nextPromise
                .then(function (data) {
                  resolve(_urls)
                })
                .catch(function (err) {
                  console.log("next promise error", err)
                  resolve(_urls)
                });

            }
            else {
              // console.log("first page")
              for (var i = 0; i < initialComments.data.length; i++)
                comments.push(transformComments(initialComments.data[i], req.body.channelId, post.id, req.body.campaignId))
              resolve(comments)

            }

          }).catch(function (err) {
            reject(err)
          });

        });

        promise.then(function () {
          callback();
        })
          .catch(function (err) {

            console.log("getting comments err", err)
            callback();
          })


      }, function done() {

        async.eachSeries(_urls, function iteratee(u, callback) {
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


function handleFbPaging(data, direction) {
  console.log("Getting Data .. From", direction)
  return new Promise(function (resolve, reject) {
    if (data.paging && data.paging[direction]) {
      _urls.push(data.paging[direction]);
      getData(data.paging[direction]).then(function (newData) {
        handleFbPaging(newData, direction).then(function (data) {
          resolve(_urls)
        }).catch(function () {
          reject({error: 'error handling next paging'})

        })
      }).catch(function () {
        reject({error: 'error handling next paging'})

      })
    }
    else {
      resolve(_urls)
    }
  })
}

function getChannelSelected(channelId) {
  return new Promise(function (resolve, reject) {
    request(config.host + "/api/channels/" + channelId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var channel = JSON.parse(body);
        // console.log()
        resolve(channel.url.split("/")[3]);
      }
      else {
        reject(error);
      }
    })
  });
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
    content: !post.message ? "" : post.message.replace(/(\r\n|\n|\r)/gm, ""),
    dateContent: post.created_time,
    type: post.type,
    sourceLink: "https://www.facebook.com/" + post.id,
    name: !post.name ? "" : post.name.replace(/(\r\n|\n|\r)/gm, ""),
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
    content: !comment.message ? "" : comment.message.replace(/(\r\n|\n|\r)/gm, ""),
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
