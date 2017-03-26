/**
 * Created by Ibrahim on 24/03/2017.
 */

var config = require('../../../../config/facebook.config.js');
var request = require('request');
var async = require('async');
var FacebookController = require('../facebookPosts.controller');

module.exports.transformPostsData = function (req, res, next) {

  var page_id = req.params.id;
  var node = page_id + "/posts";
  var fields = "?fields=message,link,created_time,type,name,id" +
    // ",comments" +
    ",shares" +
    ",reactions" +
    ".limit(0).summary(true)" +
    //TODO Change This Dynamic
    "&since=" + "24-03-2017";
  var parameters = "&access_token=" + config.ACCESS_TOKEN;

  var url = config.base + node + fields + parameters;
  // console.log(url);
  var secondPromise;
  var newPosts = [];
  var promise = new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var posts = JSON.parse(body);


        posts.data.forEach(function (post) {

          // console.log("iddd",post.id)
          secondPromise = new Promise(function (resolveReaction, reject) {
            request('http://localhost:3000/api/facebook/posts/' + post.id + '/reactions', function (reactionError, reactionResponse, reactionBody) {
              if (!reactionError && reactionResponse.statusCode == 200) {
                var reactions = JSON.parse(reactionBody);
                // console.log("there");
                // console.log("reactions", reactions);
                resolveReaction(reactions)
              }
            });

          });
          //
          //
          // //
          var newPost = {
            id: post.id,
            content: post.name,
            dateContent: post.created_time,
            type: post.type,
            sourceLink: "http://facebook.com/" + post.id,
            link: post.link,
            author: {
              name: req.params.id
            },
            shares: typeof post.shares != "undefined" ? post.shares.count : 0
          };
          //
          secondPromise.then(function (data) {
            // console.log("data", data);
            newPost.reaction = data;
            newPost.reaction.date = new Date();
            // console.log(newPost.id);
            newPosts.push(newPost);

          });
          //
          // FacebookController.saveFacebookPosts()
          // post.save(asyncdone);
        });
        resolve(posts);
        req.postsTransformed = promise;
        res.newPosts = newPosts;
        next();


      }
    });
  });


};
