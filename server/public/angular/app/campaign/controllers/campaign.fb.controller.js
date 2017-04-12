/**
 * Created by Ibrahim on 09/04/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign')
    .controller('CampaignFbCtrl', CampaignFbCtrl);

  /**End My Module Init**/

  /**Injection**/


  CampaignFbCtrl.$inject = ['CampaignService', 'ChannelService', 'FacebookService', 'angularLoad', '$scope', '$rootScope', '$stateParams'];
  /**End Of Injection**/


  /** Route Config **/

  /**End of Route Config**/


  function CampaignFbCtrl(CampaignService, ChannelService, FacebookService, angularLoad, $scope, $rootScope, $stateParams) {

    /**Scope Replace**/
    var vm = this;
    vm.selectedCampaign = $stateParams.idCampaign; //TODO Change It Dynamic
    // vm.selectedCampaign = "58ec64b17b0eab2accff5f34";
    // vm.selectedCampaign = "58eaaacdff57b30edc92fc4e";
    var filterPosts =
      {
        "since": "2017-04-03T02:35:14+01:00",
        "until": "2017-04-12T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.selectedCampaign,
        "source": "FacebookPostsProvider",
        "keywords": []
      };
    var filterComments =
      {
        "since": "2017-04-03T02:35:14+01:00",
        "until": "2017-04-11T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.selectedCampaign,
        "source": "FacebookCommentsProvider",
        "keywords": []
      };
    var filterSentimental =
      {
        "since": "2017-04-02T02:35:14+01:00",
        "until": "2017-04-12T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.selectedCampaign
      };
    init();

    function init() {

      delete filterPosts.channelId;
      delete filterComments.channelId;
      getSelectedCampaign();
      initFacebookPost();
      initFacebookComments();
      initFacebookSentimental();
      initReputationByReaction();
      initReputationByShares();
      initReputationByTypes();
      initReputationByStorytellersByCountry();
    }


    vm.onSelect = function () {
      if (vm.selectedChannel._id !== "all") {
        ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
          vm.selectedChannel = item;
          filterPosts.channelId = item._id;
          filterComments.channelId = item._id;
          filterSentimental.channelId = item._id;

          initFacebookPost();
          initFacebookComments();
          initFacebookSentimental();
          initReputationByReaction();
          initReputationByShares();
          initReputationByTypes();

        });
      }
      else {
        delete filterPosts.channelId;
        delete filterComments.channelId;
        initFacebookPost();
        initFacebookComments();
        initFacebookSentimental();
        initReputationByShares();
        initReputationByTypes();
      }
    }

    function getSelectedCampaign() {
      vm.myChannels = [];
      if (vm.selectedCampaign !== undefined) {
        CampaignService.getCampaignById(vm.selectedCampaign).then(function (data) {
          data[0].channels.forEach(function (channelPartial) {
            // console.log(channelPartial.channelId)
            ChannelService.getChannelByID(channelPartial.channelId).then(function (channel) {
              if (channel.type == "facebook")
                vm.myChannels.push(channel);
            })
          });
        })
          .catch(function (err) {
            console.error(err);
          });
      }
    }


    function initFacebookComments() {
      vm.Comments = [];
      FacebookService.getFacebookPosts(filterComments).then(function (data) {
        // console.log("facebook comments ", data)
        vm.Comments = data;
      });


    }

    function initFacebookPost() {
      console.log(filterPosts)
      vm.Posts = [];
      vm.Shares = 0;
      vm.Likes = 0;
      FacebookService.getFacebookPosts(filterPosts).then(function (data) {
        // console.log("facebook posts ", data)
        vm.Posts = data;

        vm.Posts.forEach(function (post) {
          vm.Shares = vm.Shares + post.shares;
          post.reactions.forEach(function (reaction) {
            vm.Likes += reaction.like.summary.total_count;
          })
        })

      });

    }

    function initFacebookSentimental() {
      vm.SentimentalFacebookData = [];
      // console.log(vm.selectedChannel)
      vm.SentimentalFacebookData.push(['Date', 'Postivity', 'Negativity', 'Neutrality']);
      FacebookService.getReputationBySentimental(filterSentimental).then(function (data) {
        // console.log("Sentimental", data);
        data.forEach(function (obj) {
          vm.SentimentalFacebookData.push([obj._id.dateContent, obj.positive_score, obj.negative_score, obj.neutral_score]);
        });
      })
    }

    function initReputationByReaction() {
      vm.reputationByReactions = [];
      // console.log(vm.selectedChannel)
      vm.reputationByReactions.push(['Date', 'Like', 'Love', 'Sad', 'Angry']);
      FacebookService.getReputationByReaction(filterSentimental).then(function (data) {
        data.forEach(function (obj) {
          vm.reputationByReactions.push(
            [obj._id.dateContent, obj.like, obj.love, obj.sad, obj.angry]);
        });
      })
    }

    function initReputationByShares() {
      vm.reputationByShares = [];
      // console.log(vm.selectedChannel)
      vm.reputationByShares.push(['Date', 'Shares']);
      FacebookService.getReputationByShares(filterSentimental).then(function (data) {
        data.forEach(function (obj) {
          vm.reputationByShares.push([obj._id.dateContent, obj.shares]);
        });
      })
    }

    function initReputationByTypes() {
      vm.reputationByTypes = [];
      vm.typesLink = [];
      vm.typesStatus = [];
      vm.typesVideo = [];
      vm.typesPhoto = [];
      vm.reputationByTypes.push(['Type', 'Number']);
      vm.typesLink.push(['Sentimental', 'Number']);
      vm.typesStatus.push(['Sentimental', 'Number']);
      vm.typesVideo.push(['Sentimental', 'Number']);
      vm.typesPhoto.push(['Sentimental', 'Number']);
      FacebookService.getReputationByTypes(filterSentimental).then(function (data) {
        data.forEach(function (obj) {
          vm.reputationByTypes.push([obj._id.type, obj.nb]);
          if (obj._id.type == "link") {
            vm.typesLink.push(['Positive', obj.positive_score])
            vm.typesLink.push(['Negative', obj.negative_score])
            vm.typesLink.push(['Neutral', obj.neutral_score])
          }
          if (obj._id.type == "video") {
            vm.typesVideo.push(['Positive', obj.positive_score])
            vm.typesVideo.push(['Negative', obj.negative_score])
            vm.typesVideo.push(['Neutral', obj.neutral_score])
          }
          if (obj._id.type == "photo") {
            vm.typesPhoto.push(['Positive', obj.positive_score])
            vm.typesPhoto.push(['Negative', obj.negative_score])
            vm.typesPhoto.push(['Neutral', obj.neutral_score])
          }
          if (obj._id.type == "status") {
            vm.typesStatus.push(['Positive', obj.positive_score])
            vm.typesStatus.push(['Negative', obj.negative_score])
            vm.typesStatus.push(['Neutral', obj.neutral_score])
          }
        });
      })
    }

    function initReputationByStorytellersByCountry() {
      vm.storytellersByCountry = [];
      FacebookService.getPageStorytellersByCountry(
        "mosaiquefm", "null",
        encodeURIComponent(filterSentimental.since),
        encodeURIComponent(filterSentimental.until)).then(function (data) {

        var keys = Object.keys(data);
        var values = Object.values(data);
        vm.storytellersByCountry.push(['Country', 'Storytellers'])
        for (var i = 0; i < keys.length; i++)
          vm.storytellersByCountry.push([keys[i], values[i]]);


        console.log("vm.storytellersByCountry", vm.storytellersByCountry)
      });
    }


  };


})();


