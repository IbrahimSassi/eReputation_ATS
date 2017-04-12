/**
 * Created by HP on 20/03/2017.
 */

(function () {
  'use strict';

  /**My Module init**/
  angular
    .module('ATSApp.campaign')
    .controller('CampaignTwCtrl', CampaignTwCtrl);

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

    var filterSentimentalForMention =
      {
        "since": "2017-04-02T02:35:14+01:00",
        "until": "2017-04-12T19:35:14+01:00",
        "channelId": "58ecb8ee9f4c535d345dfc03",
        "campaignId": "58ecba269f4c535d345dfc05"
      };
    var filterSentimentalForReply =
      {
        "since": "2017-04-02T02:35:14+01:00",
        "until": "2017-04-12T19:35:14+01:00",
        "channelId": "58ecb8ee9f4c535d345dfc03",
        "campaignId": "58ecba269f4c535d345dfc05"
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
        TwitterService.GetUserInfo(ScreenName).then(function (item) {

          console.log(item)
          vm.name = item.name;
          vm.created_at = moment(item.created_at, 'DD-MM-YYYY')._i;
          vm.screen_name = item.screen_name;
          vm.location = item.location;
          vm.followers_count = item.followers_count;
          vm.friends_count = item.friends_count;
          vm.favourites_count = item.favourites_count;
          vm.statuses_count = item.statuses_count;
          vm.profile_banner_url = item.profile_banner_url;
          vm.profile_sidebar_fill_color = '#' + item.profile_sidebar_border_color;
          console.log(vm.profile_sidebar_fill_color)
        }).catch(function (err) {
          console.error(err);
        });

      }).catch(function (err) {
        console.error(err);
      });


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

      }
    };
    /**
     //End OndAteChNAGE
     */


    /**
     //StartPieChartInsights
     */
    function initReputationBySentiment() {
      vm.reputationBySentimentMention = [];
      vm.reputationBySentimentReply = [];
      console.log(vm.selectedChannel)
      vm.reputationBySentimentMention.push(['Type', 'Number'])
      vm.reputationBySentimentReply.push(['Type', 'Number'])
      //vm.reputationBySentiment.push(['Positive', 70]);
      //vm.reputationBySentiment.push(['Negative', 20]);
      //vm.reputationBySentiment.push(['Neutral', 10]);
      TwitterService.GetSentimentalForOneChannelForMention(filterSentimentalForMention).then(function (data) {
        data.forEach(function (obj) {
          console.log('obj: ', obj);
          vm.reputationBySentimentMention.push(['Positive', obj.positive_score]);
          vm.reputationBySentimentMention.push(['Negative', obj.negative_score]);
          vm.reputationBySentimentMention.push(['Neutral', obj.neutral_score]);
        });
      })

      TwitterService.GetSentimentalForOneChannelForReply(filterSentimentalForMention).then(function (data) {
        data.forEach(function (obj) {
          console.log('obj: ', obj);
          vm.reputationBySentimentReply.push(['Positive', obj.positive_score]);
          vm.reputationBySentimentReply.push(['Negative', obj.negative_score]);
          vm.reputationBySentimentReply.push(['Neutral', obj.neutral_score]);
        });
      })
    }
    initReputationBySentiment();
    /**
     //End PieChartInsights
     */

  };


})();


