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
    'FacebookService'
  ];


  /* @ngInject */
  function DetailChannel(ChannelService,
                         $state,
                         $stateParams,
                         $rootScope,
                         FacebookService) {
    //On Init Start
    var vm = this;
    vm.title = 'Channel List';
    vm.selectedChannel = {};
    vm.myFacebookPages = [];
    // vm.availableOptions = [
    //   {id: '1', name: 'facebook'},
    //   {id: '2', name: 'twitter'},
    //   {id: '3', name: 'website'}
    // ];

    init();

    function init() {
      vm.channelId = $stateParams.channelId;
      vm.connectedUserId = $rootScope.currentUser._id;
      // vm.userConnectedId = "58d3dc815d391346a06f48c3";

      ChannelService.getChannelByID(vm.channelId).then(function (channel) {
        vm.selectedChannel = channel;
      });

    }


    vm.editChannel = function () {
      ChannelService.updateChannel(vm.selectedChannel).then(function (data, err) {
        if (err) {
          console.log(err);
          Materialize.toast("There were an error", 3000, "rounded");
          return;
        }
        console.log(data);
        Materialize.toast("Channel Updated", 3000, "rounded");
        $state.go('channels');


      });
    };


    vm.getPermissions = function () {
      console.log("getPermissions");
      FacebookService.initFacebookApi()
        .then(function (data) {
          console.log("here we are token  + user ,,promise bouh kalb", data);
          var token = data.authResponse.accessToken;

          FacebookService.getLongLivedToken(token).then(function (newLongToken) {
            console.log(newLongToken);
            vm.selectedChannel.accessToken = newLongToken.longToken;
            data.user.accounts.data.forEach(function (page) {
              vm.myFacebookPages.push({value: page.id, text: page.name});

              var $toastContent = $('<span class="green-text">Your permission has granted , now pick a page</span>');
              var rounded = "rounded";
              Materialize.toast($toastContent, 3000, rounded);

            });
          })

        });
    };


  }

})();
