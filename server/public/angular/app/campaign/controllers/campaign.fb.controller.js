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

    var filter1 =
      {
        "since": "2017-04-03T02:35:14+01:00",
        "until": "2017-04-12T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.selectedCampaign,
        "source": "FacebookPostsProvider",
        "keywords": []
      };
    var filter2 =
      {
        "since": "2017-04-03T02:35:14+01:00",
        "until": "2017-04-11T19:35:14+01:00",
        "channelId": "all",
        "campaignId": vm.selectedCampaign,
        "source": "FacebookCommentsProvider",
        "keywords": []
      };
    init();

    function init() {

      delete filter1.channelId;
      delete filter2.channelId;
      getSelectedCampaign();
      initFacebookPost();
      initFacebookComments();
    }



    vm.onSelect = function () {
      if(vm.selectedChannel._id !=="all")
      {
        ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
          vm.selectedChannel = item;
          filter1.channelId =item._id;
          filter2.channelId =item._id;
          initFacebookPost();
          initFacebookComments()
        });
      }
      else
      {
        delete filter1.channelId;
        delete filter2.channelId;
        initFacebookPost();
        initFacebookComments()
      }
    }

    function getSelectedCampaign() {
      vm.myChannels = [];
      if (vm.selectedCampaign !== undefined) {
        CampaignService.getCampaignById(vm.selectedCampaign).then(function (data) {
          data[0].channels.forEach(function (channelPartial) {
            console.log(channelPartial.channelId)
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
      vm.Comments =[];
      FacebookService.getFacebookPosts(filter2).then(function (data) {
        console.log("facebook comments ", data)
        vm.Comments = data;
      });


    }

    function initFacebookPost() {
      console.log(filter1)
      vm.Posts=[];
      vm.Shares = 0;
      vm.Likes = 0;
      FacebookService.getFacebookPosts(filter1).then(function (data) {
        console.log("facebook posts ", data)
        vm.Posts = data;

        vm.Posts.forEach(function (post) {
          vm.Shares = vm.Shares + post.shares;
          post.reactions.forEach(function (reaction) {
            vm.Likes += reaction.like.summary.total_count;
          })
        })

      });

    }

    /** Scripts Loading first Refresh **/
    // angularLoad.loadScript('angular/app/assets/js/charts/ggleloader.js').then(function () {
    //   angularLoad.loadScript('angular/app/assets/js/charts/chartTest.js').then(function () {
    //
    //   }).catch(function () {
    //     console.log('err script 1');
    //   });
    // }).catch(function () {
    //   console.log('err script 1');
    // });
    /** END of Scripts Loading first Refresh **/

  };


})();


