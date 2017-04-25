/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign')
    .controller('CampaignTwCtrl', CampaignTwCtrl)

  /**End My Module Init**/

  /**Injection**/


  CampaignTwCtrl.$inject = ['CampaignService', 'ChannelService', 'FacebookService', 'angularLoad', '$scope', '$rootScope', '$stateParams', 'TwitterService'];
  /**End Of Injection**/


  /** Route Config **/

  /**End of Route Config**/


  function CampaignTwCtrl(CampaignService, ChannelService, FacebookService, angularLoad, $scope, $rootScope, $stateParams, TwitterService) {

    /**Scope Replace**/
    var vm = this;
    vm.idCampaign = $stateParams.idCampaign;
    vm.allChannelsInArray = [];
    var allChannels = null;
    vm.since = moment().subtract(1, 'weeks');
    vm.until = moment();

//For tab management
    vm.overview = true;
    vm.live = false;

    vm.pn = 1;

    var filterSentimentalForMention =
      {
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "channelId": null,
        "campaignId": null
      };
    var filterSentimentalForReply =
      {
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "channelId": null,
        "campaignId": null
      };
//For All
    var filterSentimentalForAll =
      {
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "campaignId": null
      };
    var topNegativeAll =
      {
        "tweetType": null,
        "score": null,
        "campaignId": null,
        "channelId": "all",
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "pn": 1
      };
    var topPositiveAll =
      {

        "score": null,
        "campaignId": null,
        "channelId": "all",
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "pn": 1
      };
    var topHashtagsAll =
      {

        "campaignId": null,
        "channelId": "all",
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
      };
    //End For All
    var topNegativeMention =
      {
        "tweetType": null,
        "score": null,
        "campaignId": null,
        "channelId": null,
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "pn": 1
      };
    var topPositiveMention =
      {
        "tweetType": null,
        "score": null,
        "campaignId": null,
        "channelId": null,
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "pn": 1
      };

    var topNegativeReply =
      {
        "tweetType": null,
        "score": null,
        "campaignId": null,
        "channelId": null,
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "pn": 1
      };
    var topPositiveReply =
      {
        "tweetType": null,
        "score": null,
        "campaignId": null,
        "channelId": null,
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
        "pn": 1
      };

    var topHashtagsReply =
      {
        "tweetType": null,
        "campaignId": null,
        "channelId": null,
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
      };

    var topHashtagsMention =
      {
        "tweetType": null,
        "campaignId": null,
        "channelId": null,
        "since": "2017-04-01T00:00:00+01:00",
        "until": "2017-04-15T00:00:00+01:00",
      };


    /**
     * View Detail Methods
     */

    vm.getCampaignDetail = function (id) {
      if (id !== undefined) {
        CampaignService.getCampaignById(id).then(function (data) {
          allChannels = data[0].channels;
          vm.detailCampaign = data[0];
          console.log("Campaign: ", data[0])
        }).catch(function (err) {
          console.error(err);
        });
      }

    }
    vm.getCampaignDetail(vm.idCampaign);

    /**
     //Get all channels start
     */
    CampaignService.getCampaignById(vm.idCampaign).then(function (data) {

      allChannels = data[0].channels;

      var allChannelsLength = allChannels.length;

      for (var i = 0; i < allChannelsLength; i++) {
        console.log('Boucle: ', allChannels[i].channelId)

        TwitterService.GetChannelByID(allChannels[i].channelId).then(function (data) {

          if (data.type == 'twitter') {
            vm.allChannelsInArray.push(data)
            //console.log('data: ',vm.allChannelsInArray)
          }

        }).catch(function (err) {
          console.error(err);
        });

      }
      //console.log('All Channels: ',allChannels[0].channelId)
      vm.detailCampaign = data[0];
    }).catch(function (err) {
      console.error(err);
    });
    /**
     //Get all chanels end
     */

    console.log('the array ', vm.allChannelsInArray)
    /**
     //Get user data on select change
     */

    vm.onSelectChannel = function () {

      TwitterService.GetChannelByID(vm.selectChannelValue).then(function (data) {

        var pathArray = data.url.split('/');
        var ScreenName = pathArray[3];
        console.log('url ', ScreenName)
        if (vm.selectChannelValue != 'all') {
          TwitterService.GetUserInfo(ScreenName).then(function (item) {

            console.log(item)


            if (vm.selectChannelValue != 'all') {
              vm.name = item.name;
              vm.created_at = moment(item.created_at).format('DD-MMMM-YYYY');
              vm.screen_name = item.screen_name;
              vm.location = item.location;
              vm.followers_count = item.followers_count;
              vm.friends_count = item.friends_count;
              vm.favourites_count = item.favourites_count;
              vm.statuses_count = item.statuses_count;
              vm.profile_banner_url = item.profile_banner_url;
              vm.profile_sidebar_fill_color = '#' + item.profile_sidebar_border_color;
              console.log(vm.profile_sidebar_fill_color)

            }


          }).catch(function (err) {
            console.error(err);
          });
        }
      }).catch(function (err) {
        console.error(err);
      });
      if (vm.selectChannelValue == 'all') {
        SentimentalAttrInitializer()
        initReputationBySentimentForAll();
        initTopHashtags();
        requestTopHashtags();

      }
      else {
        SentimentalAttrInitializer()
        //initReputationBySentimentForAll()
        initReputationBySentiment();
        initTopTweets(1);
        requestTopTweets(1);
        initTopHashtags();
        requestTopHashtags();
      }

    };
    /**
     //End Get user data on select change
     */
    //OnDateChange
    vm.onChange = function () {


      console.log("onChange", vm.since);
      console.log("onChange", vm.until);

      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");

      }
      else if (new Date(vm.until) > new Date() || new Date(vm.since) > new Date()) {
        Materialize.toast("Until Date or Since Date Can t be greater than today", 3000, "rounded");
      }

      else {


        if (vm.selectChannelValue != 'all') {
          SentimentalAttrInitializer()
          //initReputationBySentimentForAll()
          initReputationBySentiment();
          initTopTweets(1);
          requestTopTweets(1);
          initTopHashtags();
          requestTopHashtags();
        }
        if (vm.selectChannelValue == 'all') {
          SentimentalAttrInitializer()
          initReputationBySentimentForAll();
          initTopHashtags();
          requestTopHashtags();

        }


      }

    };
    /**
     //End OndAteChNAGE
     */


    /**
     //StartPieChartInsights
     */


    function SentimentalAttrInitializer() {
      filterSentimentalForMention.since = moment(vm.since).format();//2017-04-02
      filterSentimentalForMention.until = moment(vm.until).format();
      filterSentimentalForMention.channelId = vm.selectChannelValue;
      filterSentimentalForMention.campaignId = vm.idCampaign;
      filterSentimentalForReply.since = moment(vm.since).format();
      filterSentimentalForReply.until = moment(vm.until).format(); //"2017-04-12T02:35:14+01:00"
      filterSentimentalForReply.channelId = vm.selectChannelValue;
      filterSentimentalForReply.campaignId = vm.idCampaign;

      filterSentimentalForAll.since = moment(vm.since).format();//2017-04-02
      filterSentimentalForAll.until = moment(vm.until).format();
      filterSentimentalForAll.campaignId = vm.idCampaign;

    }


    function initReputationBySentiment() {
      console.log("wanted oneeee", filterSentimentalForAll);
      vm.reputationBySentimentMention = [];
      vm.reputationBySentimentReply = [];
      console.log(vm.selectedChannel)
      vm.reputationBySentimentMention.push(['Type', 'Number'])
      vm.reputationBySentimentReply.push(['Type', 'Number'])
      //vm.reputationBySentiment.push(['Positive', 70]);
      //vm.reputationBySentiment.push(['Negative', 20]);
      //vm.reputationBySentiment.push(['Neutral', 10]);
      //console.log("heyyyyyyyyyyyyyyyyyyyyyyy", filterSentimentalForReply)
      //console.log("/////////////////")
      TwitterService.GetSentimentalForOneChannelForMention(filterSentimentalForReply).then(function (data) {
        data.forEach(function (obj) {
          console.log('objdogdof: ', obj);
          vm.reputationBySentimentMention.push(['Positive', obj.positive_score]);
          vm.reputationBySentimentMention.push(['Negative', obj.negative_score]);
          vm.reputationBySentimentMention.push(['Neutral', obj.neutral_score]);
        });
      })

      TwitterService.GetSentimentalForOneChannelForReply(filterSentimentalForMention).then(function (data) {
        data.forEach(function (obj) {
          //console.log('obj: ', obj);
          vm.reputationBySentimentReply.push(['Positive', obj.positive_score]);
          vm.reputationBySentimentReply.push(['Negative', obj.negative_score]);
          vm.reputationBySentimentReply.push(['Neutral', obj.neutral_score]);
        });
      })
    }


    function initReputationBySentimentForAll() {

      vm.reputationBySentimentAll = [];
      vm.reputationBySentimentAll.push(['Type', 'Number'])

      TwitterService.getTwitterSentimentalForAll(filterSentimentalForAll).then(function (data) {
        data.forEach(function (obj) {
          console.log('obj for all: ', obj);
          vm.reputationBySentimentAll.push(['Positive', obj.positive_score]);
          vm.reputationBySentimentAll.push(['Negative', obj.negative_score]);
          vm.reputationBySentimentAll.push(['Neutral', obj.neutral_score]);
        });
      })

    }

    function initTopTweets() {

      topNegativeMention.tweetType = 'Mention'
      topNegativeMention.score = 'negative'
      topNegativeMention.campaignId = vm.idCampaign
      topNegativeMention.channelId = vm.selectChannelValue;
      topNegativeMention.since = moment(vm.since).format();//2017-04-02
      topNegativeMention.until = moment(vm.until).format();
      topNegativeMention.pn = vm.pn;

      topNegativeReply.tweetType = 'Reply'
      topNegativeReply.score = 'negative'
      topNegativeReply.campaignId = vm.idCampaign
      topNegativeReply.channelId = vm.selectChannelValue;
      topNegativeReply.since = moment(vm.since).format();//2017-04-02
      topNegativeReply.until = moment(vm.until).format();
      topNegativeReply.pn = vm.pn;

      topPositiveMention.tweetType = 'Mention'
      topPositiveMention.score = 'positive'
      topPositiveMention.campaignId = vm.idCampaign
      topPositiveMention.channelId = vm.selectChannelValue;
      topPositiveMention.since = moment(vm.since).format();//2017-04-02
      topPositiveMention.until = moment(vm.until).format();
      topPositiveMention.pn = vm.pn;

      topPositiveReply.tweetType = 'Reply'
      topPositiveReply.score = 'positive'
      topPositiveReply.campaignId = vm.idCampaign
      topPositiveReply.channelId = vm.selectChannelValue;
      topPositiveReply.since = moment(vm.since).format();//2017-04-02
      topPositiveReply.until = moment(vm.until).format();
      topPositiveReply.pn = vm.pn;

      topPositiveAll.score = 'positive'
      topPositiveAll.campaignId = vm.idCampaign
      topPositiveAll.since = moment(vm.since).format();//2017-04-02
      topPositiveAll.until = moment(vm.until).format();
      topPositiveAll.pn = vm.pn;

      topNegativeAll.score = 'negative'
      topNegativeAll.campaignId = vm.idCampaign
      topNegativeAll.since = moment(vm.since).format();//2017-04-02
      topNegativeAll.until = moment(vm.until).format();
      topNegativeAll.pn = vm.pn;
      //console.log("topNegativeMention", topNegativeMention);
      //console.log("topNegativeReply", topNegativeReply);
      //console.log("topPositiveMention", topPositiveMention);
      //console.log("topPositiveReply", topPositiveReply);

    }


    function requestTopTweets(pn) {
      TwitterService.GetTopTweet(topPositiveReply).then(function (data) {
        //console.log("topPositiveReplyData: ", data)
        document.getElementById('topPositiveReply'+pn).innerHTML = "";
        twttr.widgets.createTweet(
          data.id,
          document.getElementById('topPositiveReply'+pn),
          {}
        );


      })

      TwitterService.GetTopTweet(topPositiveMention).then(function (data) {
        //console.log("topPositiveMentionData: ", data)
        document.getElementById('topPositiveMention'+pn).innerHTML = "";
        twttr.widgets.createTweet(
          data.id,
          document.getElementById('topPositiveMention'+pn),
          {}
        );
      })

      TwitterService.GetTopTweet(topNegativeReply).then(function (data) {
        //console.log("topNegativeReplyData: ", data)
        document.getElementById('topNegativeReply'+pn).innerHTML = "";
        twttr.widgets.createTweet(
          data.id,
          document.getElementById('topNegativeReply'+pn),
          {}
        );
      })

      TwitterService.GetTopTweet(topNegativeMention).then(function (data) {
        //console.log("topNegativeMentionData: ", data)
        document.getElementById('topNegativeMention'+pn).innerHTML = "";
        twttr.widgets.createTweet(
          data.id,
          document.getElementById('topNegativeMention'+pn),
          {}
        );
      })

    }

    vm.topPageClicked = function(pn) {
      vm.pn = pn;
      initTopTweets(pn);
      requestTopTweets(pn);

    }

    function initTopHashtags() {

      topHashtagsReply.tweetType = 'Reply'
      topHashtagsReply.campaignId = vm.idCampaign
      topHashtagsReply.channelId = vm.selectChannelValue;
      topHashtagsReply.since = moment(vm.since).format();
      topHashtagsReply.until = moment(vm.until).format();

      topHashtagsMention.tweetType = 'Mention'
      topHashtagsMention.campaignId = vm.idCampaign
      topHashtagsMention.channelId = vm.selectChannelValue;
      topHashtagsMention.since = moment(vm.since).format();
      topHashtagsMention.until = moment(vm.until).format();

      topHashtagsAll.campaignId = vm.idCampaign;
      topHashtagsAll.since = moment(vm.since).format();
      topHashtagsAll.until = moment(vm.until).format();

      console.log("topHashtagsReply: ", topHashtagsReply)
      console.log("topHashtagsMention: ", topHashtagsMention)
    }

    function requestTopHashtags() {


      if (vm.selectChannelValue != 'all') {

        console.log("alllllllllllllllllllllll")

        vm.HashtagsReply = []
        vm.HashtagsMention = []
        vm.HashtagsAll = []
        vm.HRS = 0;
        vm.HMS = 0;
        vm.HA = 0
        TwitterService.GetTopHashtags(topHashtagsReply).then(function (data) {
          vm.HashtagsReply = []
          for (var i = 0; i < 5; i++) {
            if (data[i]) {
              vm.HRS = vm.HRS + data[i].nb;
              vm.HashtagsReply.push(data[i])
            }
          }

          console.log("HashtagsReply: ", vm.HashtagsReply)

        })

        TwitterService.GetTopHashtags(topHashtagsMention).then(function (data) {
          vm.HashtagsMention = []
          for (var i = 0; i < 5; i++) {
            if (data[i]) {
              vm.HMS = vm.HMS + data[i].nb;
              vm.HashtagsMention.push(data[i])
            }
          }
          console.log("HashtagsMention: ", vm.HashtagsMention)
        })

      }

      else {
        TwitterService.GetTopHashtags(topHashtagsAll).then(function (data) {
          vm.HashtagsAll = []
          for (var i = 0; i < 5; i++) {
            if (data[i]) {
              vm.HA = vm.HA + data[i].nb;
              vm.HashtagsAll.push(data[i])
            }
          }
          console.log("HashtagsMention: ", vm.HashtagsMention)
        })


      }
    }


    //Tab Management
    vm.overviewClicked = function () {
      vm.overview = true;
      vm.live = false;
    }

    vm.liveClicked = function() {
      vm.overview = false;
      vm.live = true;
    }

    // initReputationBySentiment();
    /**
     //End PieChartInsights
     */

    /** Scripts Loading first Refresh **/
    angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
    }).catch(function () {
      console.log('err script 1');
    });
    /** END of Scripts Loading first Refresh **/

  };


})();






