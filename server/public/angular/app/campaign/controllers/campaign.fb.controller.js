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
    // vm.selectedCampaign = $stateParams.idCampaign; //TODO Change It Dynamic
    vm.selectedCampaign = "58eaaacdff57b30edc92fc4e";

    var filter1 =
      {
        "since": "2017-04-03T02:35:14+01:00",
        "until": "2017-04-04T19:35:14+01:00",
        "channelId": "techcrunch",
        "campaignId": vm.selectedCampaign,
        "source": "FacebookPostsProvider",
        "keywords": []
      };
    var filter2 =
      {
        "since": "2017-04-03T02:35:14+01:00",
        "until": "2017-04-04T19:35:14+01:00",
        "channelId": "techcrunch",
        "campaignId": vm.selectedCampaign,
        "source": "FacebookCommentsProvider",
      };
    init();

    function init() {
      FacebookService.getFacebookPosts(filter1).then(function (data) {
        console.log("facebook posts ", data)
        vm.Posts = data;

        vm.Shares = 0;
        vm.Likes = 0;
        vm.Posts.forEach(function (post) {
          vm.Shares =vm.Shares+post.shares;
        })

      });


      FacebookService.getFacebookPosts(filter2).then(function (data) {
        console.log("facebook comments ", data)
        vm.Comments = data;
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


