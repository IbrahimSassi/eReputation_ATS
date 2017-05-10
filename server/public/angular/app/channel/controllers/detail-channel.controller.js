/**
 * Created by Ibrahim on 20/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.channel')
    .controller('DetailChannel', DetailChannel);


  DetailChannel.$inject = [
    'ChannelService',
    '$state',
    '$stateParams',
    '$rootScope',
    'FacebookService',
    'UtilsService',
    '$filter'
  ];


  /* @ngInject */
  function DetailChannel(ChannelService,
                         $state,
                         $stateParams,
                         $rootScope,
                         FacebookService,
                         UtilsService,
                         $filter) {
    //On Init Start
    var vm = this;
    vm.title = 'Channel List';
    vm.selectedChannel = {};
    vm.myFacebookPages = [];
    vm.myChannels = [];
    // vm.availableOptions = [
    //   {id: '1', name: 'facebook'},
    //   {id: '2', name: 'twitter'},
    //   {id: '3', name: 'website'}
    // ];

    init();

    function init() {

      FacebookService.loadSDK();

      vm.channelId = $stateParams.channelId;
      vm.connectedUserId = $rootScope.currentUser._id;
      // vm.userConnectedId = "58d3dc815d391346a06f48c3";

      ChannelService.getChannelByID(vm.channelId).then(function (channel) {
        vm.selectedChannel = channel;
      });
      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (data) {
        vm.myChannels = data;
      });


    }


    vm.editChannel = function (form) {



      if (!form.$valid) {
        UtilsService.AlertToast("Fill all fields", "rounded", 3000);
        return;
      }


      ChannelService.updateChannel(vm.selectedChannel).then(function (data, err) {
        if (err) {
          console.log(err);
          UtilsService.AlertToast(
            $('<span class="red-text">There Was an error , please try again</span>'), "rounded", 3000);
          return;
        }
        UtilsService.AlertToast(
          $('<span class="green-text">New Channel has just updated</span>'), "rounded", 3000);
        $state.go('channels');


      });
    };


    vm.getPermissions = function () {
      FacebookService.initFacebookApi()
        .then(function (data) {
          var token = data.authResponse.accessToken;

          FacebookService.getLongLivedToken(token).then(function (newLongToken) {
            vm.selectedChannel.accessToken = newLongToken.longToken;
            data.user.accounts.data.forEach(function (page) {
              vm.myFacebookPages.push({value: "https://www.facebook.com/" + page.id, text: page.name})

              var $toastContent = $('<span class="green-text">Your permission has granted , now pick a page</span>');
              var rounded = "rounded";
              Materialize.toast($toastContent, 3000, rounded);

            });
          })

        });
    };


  }

})();
