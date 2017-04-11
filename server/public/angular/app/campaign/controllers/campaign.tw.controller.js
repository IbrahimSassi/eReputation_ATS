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


  CampaignTwCtrl.$inject = ['CampaignService', 'ChannelService', 'FacebookService', 'angularLoad', '$scope', '$rootScope','$stateParams','TwitterService'];
  /**End Of Injection**/


  /** Route Config **/

  /**End of Route Config**/


  function CampaignTwCtrl(CampaignService, ChannelService, FacebookService, angularLoad, $scope, $rootScope,$stateParams,TwitterService) {

    /**Scope Replace**/
    var vm = this;
    vm.idCampaign = $stateParams.idCampaign;
    vm.allChannelsInArray = [];
    var allChannels=null;

    /**
     * View Detail Methods
     */

    vm.getCampaignDetail = function(id)
    {
      if(id!==undefined)
      {
        CampaignService.getCampaignById(id).then(function (data) {
          allChannels = data[0].channels;
          vm.detailCampaign=data[0];
        }).catch(function (err) {
          console.error(err);
        });
      }

    }
    vm.getCampaignDetail(vm.idCampaign);



//Get all channels start

      CampaignService.getCampaignById(vm.idCampaign).then(function (data) {
        console.info('Compain data: ',data[0].channels);
        allChannels = data[0].channels;

        var allChannelsLength = allChannels.length;

        for (var i =0; i<allChannelsLength;i++)
        {
          console.log('Boucle: ',allChannels[i].channelId)

          TwitterService.GetChannelByID(allChannels[i].channelId).then(function (data) {

            if (data.type=='twitter')
            {
              vm.allChannelsInArray.push(data)
              //console.log('data: ',vm.allChannelsInArray)
            }

          }).catch(function (err) {
            console.error(err);
          });

        }
        //console.log('All Channels: ',allChannels[0].channelId)
        vm.detailCampaign=data[0];
      }).catch(function (err) {
        console.error(err);
      });
//Get all chanels end








console.log('the array ',vm.allChannelsInArray)

    //Get user data on select change
    vm.onSelectChannel = function  () {

      var pathArray = vm.selectChannelValue.split( '/' );
      var ScreenName = pathArray[3];
      console.log('url ',ScreenName)
      TwitterService.GetUserInfo(ScreenName).then(function (item) {

        console.log(item)
        vm.name = item.name;
        vm.created_at=moment(item.created_at, 'DD-MM-YYYY')._i;
        vm.screen_name = item.screen_name;
        vm.location = item.location;
        vm.followers_count = item.followers_count;
        vm.friends_count = item.friends_count;
        vm.favourites_count = item.favourites_count;
        vm.statuses_count = item.statuses_count;
        vm.profile_banner_url = item.profile_banner_url;
        vm.profile_sidebar_fill_color = '#'+item.profile_sidebar_border_color;
        console.log(vm.profile_sidebar_fill_color)
      }).catch(function (err) {
        console.error(err);
      });;

    };
//End Get user data on select change










    /***
     * End
     */
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


