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


  CampaignFbCtrl.$inject = ['CampaignService',
    'ChannelService', 'FacebookService',
    'angularLoad',
    '$stateParams',
    'ConstantFactory'];
  /**End Of Injection**/


  /** Route Config **/

  /**End of Route Config**/


  function CampaignFbCtrl(CampaignService,
                          ChannelService,
                          FacebookService,
                          angularLoad,
                          $stateParams,
                          ConstantFactory) {

    /**Scope Replace**/
    var vm = this;
    vm.selectedCampaign = $stateParams.idCampaign;
    vm.selectedChannel = {
      _id: "all"
    };

    var filter =
      {
        "since": moment(vm.since).format(),
        "until": moment(vm.until).format(),
        "channelId": vm.selectedChannel._id,
        "campaignId": vm.selectedCampaign,
        "source": "",
        "keywords": []
      };


    init();

    function init() {

      vm.since = moment().subtract(15, 'days');
      vm.until = moment().add(1, 'days');

      selectDate();

      delete filter.channelId;
      getSelectedCampaign().then(function (data) {
        initCharts();

      });
    }

    function initCharts() {
      initFacebookPost();
      initFacebookComments();
      initFacebookSentimental();
      initReputationByReaction();
      initReputationByShares();
      initReputationByTypes();
      initTopPosts();
    }

    function selectDate() {
      filter.since = moment(vm.since).format();
      filter.until = moment(vm.until).format();

    }

    vm.onSelect = function () {

      if (vm.selectedChannel._id !== "all") {
        ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
          vm.selectedChannel = item;
          filter.channelId = item._id;

          selectDate();
          // console.log("vm.selectedChannel",vm.selectedChannel)
          initReputationByStorytellersByCountry();

          initCharts();

        });
      }
      else {
        delete filter.channelId;
        selectDate();

        initCharts();
      }
    };


    vm.onChange = function () {
      selectDate();

      initCharts();

    };


    function getSelectedCampaign() {

      return new Promise(function (resolve, reject) {
        vm.myChannels = [];
        vm.myKeywords = [];
        if (vm.selectedCampaign !== undefined) {
          CampaignService.getCampaignById(vm.selectedCampaign).then(function (data) {
            vm.selectedCampaignData = data[0];
            vm.min = moment(data[0].dateStart);
            vm.max = moment(data[0].dateEnd);

            data[0].keywords.forEach(function (keyword) {
              vm.myKeywords.push(keyword.content);
            });

            data[0].channels.forEach(function (channelPartial) {
              ChannelService.getChannelByID(channelPartial.channelId).then(function (channel) {
                if (channel.type == "facebook")
                  vm.myChannels.push(channel);

              });
            });
            resolve(data)
          })
            .catch(function (err) {
              // console.error(err);
              reject(err)
            });
        }

      })


    }


    function initFacebookComments() {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.source = "FacebookCommentsProvider";

      if (LocalFilter.keywords)
        delete LocalFilter.keywords;

      vm.Comments = [];
      FacebookService.getFacebookPosts(LocalFilter).then(function (data) {
        vm.Comments = data;
      });


    }

    function initFacebookPost() {
      var LocalFilter = $.extend({}, filter);
      LocalFilter.source = "FacebookPostsProvider";

      vm.Posts = [];
      vm.Shares = 0;
      vm.Likes = 0;
      LocalFilter.keywords = vm.myKeywords;
      FacebookService.getFacebookPosts(LocalFilter).then(function (data) {
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
      var LocalFilter = $.extend({}, filter);
      if (LocalFilter.source)
        delete LocalFilter.source;

      vm.SentimentalFacebookData = [];
      vm.SentimentalFacebookData.push(
        [ConstantFactory.DATE,
          ConstantFactory.POSITIVITY,
          ConstantFactory.NEGATIVITY,
          ConstantFactory.NEUTRALITY
        ]);
      delete LocalFilter.keywords;
      // console.log("filterSentimental", LocalFilter)
      FacebookService.getReputationBySentimental(LocalFilter).then(function (data) {
        // console.log("Sentimental", data);
        data.forEach(function (obj) {
          if(obj.positive_score!==null)
          vm.SentimentalFacebookData.push([obj._id.dateContent, obj.positive_score, obj.negative_score, obj.neutral_score]);
        });
        vm.SentimentalFacebookData.sort(function (a, b) {
          return new Date(a[0]) - new Date(b[0]);
        });

        // console.log("vm.SentimentalFacebookData")
        // console.log(vm.SentimentalFacebookData)

      })
    }

    function initReputationByReaction() {
      var LocalFilter = $.extend({}, filter);
      if (LocalFilter.source)
        delete LocalFilter.source;

      LocalFilter.keywords = vm.myKeywords;
      vm.reputationByReactions = [];
      vm.reputationByReactions.push(['Date', 'Like', 'Love', 'Sad', 'Angry']);
      FacebookService.getReputationByReaction(LocalFilter).then(function (data) {
        data.forEach(function (obj) {
          // console.log("reactions",obj);
          vm.reputationByReactions.push(
            [obj._id.dateContent, obj.like, obj.love, obj.sad, obj.angry]);
        });
        vm.reputationByReactions.sort(function (a, b) {
          return new Date(a[0]) - new Date(b[0]);
        });

      })
    }

    function initReputationByShares() {
      var LocalFilter = $.extend({}, filter);
      if (LocalFilter.source)
        delete LocalFilter.source;

      LocalFilter.keywords = vm.myKeywords;
      vm.reputationByShares = [];
      vm.reputationByShares.push(['Date', 'Shares']);
      FacebookService.getReputationByShares(LocalFilter).then(function (data) {
        data.forEach(function (obj) {
          vm.reputationByShares.push([obj._id.dateContent, obj.shares]);
        });
        vm.reputationByShares.sort(function (a, b) {
          return new Date(a[0]) - new Date(b[0]);
        });

      })
    }

    function initReputationByTypes() {
      var LocalFilter = $.extend({}, filter);
      if (LocalFilter.source)
        delete LocalFilter.source;

      vm.reputationByTypes = [];
      vm.typesLink = [];
      vm.typesStatus = [];
      vm.typesVideo = [];
      vm.typesPhoto = [];
      LocalFilter.keywords = vm.myKeywords;
      vm.reputationByTypes.push([ConstantFactory.TYPE, ConstantFactory.NUMBER]);
      vm.typesLink.push([ConstantFactory.NUMBER, ConstantFactory.NUMBER]);
      vm.typesStatus.push([ConstantFactory.SENTIMENTAL, ConstantFactory.NUMBER]);
      vm.typesVideo.push([ConstantFactory.SENTIMENTAL, ConstantFactory.NUMBER]);
      vm.typesPhoto.push([ConstantFactory.SENTIMENTAL, ConstantFactory.NUMBER]);
      FacebookService.getReputationByTypes(LocalFilter).then(function (data) {
        data.forEach(function (obj) {
          if (obj._id.type !== null)
            vm.reputationByTypes.push([obj._id.type, obj.nb]);
          if (obj._id.type == "link" && obj.positive_score!=null) {
            vm.typesLink.push([ConstantFactory.POSITIVE, obj.positive_score]);
            vm.typesLink.push([ConstantFactory.NEGATIVE, obj.negative_score]);
            vm.typesLink.push([ConstantFactory.NEUTRAL, obj.neutral_score]);
          }
          if (obj._id.type == "video" && obj.positive_score!=null) {
            vm.typesVideo.push([ConstantFactory.POSITIVE, obj.positive_score]);
            vm.typesVideo.push([ConstantFactory.NEGATIVE, obj.negative_score]);
            vm.typesVideo.push([ConstantFactory.NEUTRAL, obj.neutral_score]);
          }
          if (obj._id.type == "photo" && obj.positive_score!=null) {
            vm.typesPhoto.push([ConstantFactory.POSITIVE, obj.positive_score]);
            vm.typesPhoto.push([ConstantFactory.NEGATIVE, obj.negative_score]);
            vm.typesPhoto.push([ConstantFactory.NEUTRAL, obj.neutral_score]);
          }
          if (obj._id.type == "status" && obj.positive_score!=null) {
            vm.typesStatus.push([ConstantFactory.POSITIVE, obj.positive_score]);
            vm.typesStatus.push([ConstantFactory.NEGATIVE, obj.negative_score]);
            vm.typesStatus.push([ConstantFactory.NEUTRAL, obj.neutral_score]);
          }
        });
      })
    }

    function initReputationByStorytellersByCountry() {
      var LocalFilter = $.extend({}, filter);
      if (LocalFilter.source)
        delete LocalFilter.source;

      vm.storytellersByCountry = [];
      FacebookService.getPageStorytellersByCountry(
        "DonaldTrump", "null",
        encodeURIComponent(LocalFilter.since),
        encodeURIComponent(LocalFilter.until)).then(function (data) {

        var keys = Object.keys(data);
        var values = Object.values(data);
        vm.storytellersByCountry.push(['Country', 'Storytellers'])
        for (var i = 0; i < keys.length; i++)
          vm.storytellersByCountry.push([keys[i], values[i]]);


      });
    }

    function initTopPosts() {


      var LocalFilter = $.extend({}, filter);
      if (LocalFilter.source)
        delete LocalFilter.source;

      LocalFilter.keywords = vm.myKeywords;

      vm.topSharedPost = {};
      vm.topLikedPost = {};
      FacebookService.getTopPosts(LocalFilter, 'shares').then(function (data) {
        vm.topSharedPost = data[0];
        // console.log("topSharedPost", vm.topSharedPost);
      });

      FacebookService.getTopPosts(LocalFilter, 'likes').then(function (data) {
        data.sort(function (a, b) {
          return b.reactions[0].like.summary.total_count - a.reactions[0].like.summary.total_count;
        });

        setTimeout(function () {
          vm.topLikedPost = data[0];

        }, 50)


      });


    }


    /** Scripts Loading first Refresh **/
    angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
    }).catch(function () {
      // console.log('err script 1');
    });
    /** END of Scripts Loading first Refresh **/


  };


})();


