/**
 * Created by Ibrahim on 24/03/2017.
 */

var config = require('../../../../config/facebook.config');
var request = require('request');
var async = require('async');
var DataProvider = require('../../../../models/dataProvider/dataProvider.model');
var moment = require("moment");
var utils = require('../../helpers/utils.helper');
var _urls = [];


module.exports = {
  transformPostsData:transformPostsData,
  transformCommentsData:transformCommentsData,
  getComments:getComments,
  extendToken:extendToken
};

function transformPostsData(req, res, next) {
  _urls = [];

  var channelPromise = getChannelSelected(req.body.channelId);

  channelPromise.then(function (channel) {


    var since = moment(req.body.since).format("DD-MM-YYYY");
    var until = moment(req.body.until).format("DD-MM-YYYY");
    console.log("Channel Selected :", channel);
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
            async.eachSeries(posts.data, function iteratee(story, callback) {

              // Getting Reactions For each story
              var reactionsUrl = config.host + '/api/facebook/posts/' + story.id + '/reactions';
              getData(reactionsUrl)
                .then(function (reactions) {
                  return reactions;
                })
                .then(function (reaction) {
                  //Transform Data to match with our DB
                  story = transformPosts(story, req.body.channelId, req.body.campaignId);
                  story.reactions = [];
                  data.date = new Date();
                  story.reactions.push(reaction);
                  AllPosts.push(story);
                  return true;

                })
                .then(function () {
                  callback()
                })
                .catch(function (err) {
                  console.log(err)
                });


            }, function done() {
              callback();
            });


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

function transformCommentsData (req, res, next) {

  var since = moment(req.body.since).format();
  var until = moment(req.body.until).format();
  var _comments = [];
  DataProvider.getDataProvidersByConditionModel(
    {
      source: 'FacebookPostsProvider',
      channelId: req.body.channelId,
      campaignId: req.body.campaignId,
      dateContent: {$gte: since, $lte: until}
    }, function (err, posts) {

      //For Each post we will request its comments
      async.eachSeries(posts, function iteratee(post, callback) {

        //Tab to store all urls to get comments for one post (Pagination Urls)
        _urls = [];

        var post_id = post.id;
        var fields = "/comments?limit=100";
        var parameters = "&access_token=" + config.ACCESS_TOKEN;
        var url = config.base + post_id + fields + parameters;
        _urls.push(url);

        //Get Comment For The First Comment
        getData(url)
          .then(function (initialComments) {

            //Start Handling Paging to get all comments urls request
            handleFbPaging(initialComments, 'next', post.id)
              .then(function () {

                //All Urls are here, we will loop through them to get all comments and store them in our _comments
                console.log("Urls For Posts " + post.id, _urls);
                async.eachSeries(_urls, function iteratee(u, cb) {
                  getData(u)
                    .then(function (comments) {

                      comments.data.forEach(function (comment) {
                        _comments.push(transformComments(comment, req.body.channelId, post.id, req.body.campaignId));
                      });

                    })
                    .then(function () {
                      cb();
                    })
                }, function done() {
                  callback();

                });

              })
              .catch(function (err) {
                console.log("next promise error", err)
              });


          })
          .catch(function (err) {
            console.log("Error When Getting Comments From Post " + post.id, err);
            // reject(err)
          });


      }, function done() {

        setTimeout(function () {
          req.comments = _comments;
          next()
        }, 1100)

      });
    })

};

function getComments(req, res, next) {

  utils.getFacebookLongUrl(req.body.url)
    .then(function (post_id) {
      console.log(post_id)
      var fields = "/comments?limit=100";
      var parameters = "&access_token=" + config.ACCESS_TOKEN;
      var url = config.base + post_id + fields + parameters;

      var _comments = [];
      _urls = [];
      _urls.push(url);
      utils.getData(url)
        .then(function (initialComments) {
          handleFbPaging(initialComments, 'next', post_id)
            .then(function () {

              async.eachSeries(_urls, function iteratee(u, callback) {

                getData(u)
                  .then(function (comments) {

                    comments.data.forEach(function (comment) {
                      _comments.push(comment);
                    });
                    callback();

                  })

              }, function done() {
                req.comments = _comments;
                next()
              })


            })

        })
    })
    .catch(function (err) {
      console.log("error", err);
      res.json(err);
    });

}

function extendToken (req, res, next) {

  var node = "oauth/access_token?" +
    "client_id=" + config.APP_ID + "&" +
    "client_secret=" + config.APP_SECRET + "&" +
    "grant_type=fb_exchange_token&" +
    "fb_exchange_token=" + req.params.token;

  var url = config.base + node;

  console.log("before **", req.params.token);

  var promise = new Promise(function (resolve, reject) {
    getData(url).then(function (data) {

      var ExtendedToken = data.access_token;
      resolve(ExtendedToken);
      console.log("after **", ExtendedToken);

    });
  });

  req.ExtendedToken = promise;
  next();


};


function handleFbPaging(data, direction, postId) {
  console.log("Gettin Data .. From " + postId, direction);
  return new Promise(function (resolve, reject) {
    if (data.paging && data.paging[direction]) {
      _urls.push(data.paging[direction]);
      getData(data.paging[direction])
        .then(function (newData) {
          handleFbPaging(newData, direction, postId)
            .then(function () {
              resolve(_urls)
            }).catch(function () {
            reject({error: 'error handling next paging'})

          })
        }).catch(function () {
        reject({error: 'error handling next paging'})

      })
    }
    else {
      console.log("Resolving Urls for post ", postId);
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
    content: !post.message ? "" : utils.cleanText(post.message),
    // content: !post.message ? "" : post.message.replace(/(\r\n|\n|\r)/gm, ""),
    dateContent: post.created_time,
    type: post.type,
    sourceLink: "https://www.facebook.com/" + post.id,
    name: !post.name ? "" : utils.cleanText(post.name),
    // name: !post.name ? "" : post.name.replace(/(\r\n|\n|\r)/gm, ""),
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
    content: !comment.message ? "" : utils.cleanText(comment.message),
    // content: !comment.message ? "" : comment.message.replace(/(\r\n|\n|\r)/gm, ""),
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
//
// function getPostId(url) {
//   var parts = url.split('/');
//   if (url.indexOf('localhost') !== -1)
//     return parts[6];
//   else
//     return parts[4]
// }
