/**
 * Created by Ibrahim on 20/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.channel')
    .controller('CreateChannelCtrl', CreateChannelFN);


  CreateChannelFN.$inject = [
    'ChannelService',
    '$state',
    '$stateParams',
    '$rootScope',
    'FacebookService'
  ];


  /* @ngInject */
  function CreateChannelFN(ChannelService,
                           $state,
                           $stateParams,
                           $rootScope,
                           FacebookService) {
    //On Init Start
    var vm = this;

    vm.connectedUserId = 1;
    vm.title = 'Create Channel';
    vm.channel = {
      name: "",
      url: "",
      type: "",
      accessToken: "",
      personnel: false,
      userId: vm.connectedUserId
    };

    vm.myFacebookPages = [];

    init();

    function init() {

    }


    vm.createChannel = function (form) {

      if(form)
      {
        ChannelService.addChannel(vm.channel)
          .then(function (result) {
            console.log("result", result);
            $state.go('channels');
            var $toastContent = $('<span class="green-text">New Channel has just created</span>');
            var rounded = "rounded"
            Materialize.toast($toastContent, 3000, rounded);
          });
      }

    };

    vm.getPermissions = function () {
      FacebookService.initFacebookApi()
        .then(function (data) {
          console.log("here we are token  + user ,,promise bouh kalb", data);
          var token = data.authResponse.accessToken;

          FacebookService.getLongLivedToken(token).then(function (newLongToken) {
            console.log(newLongToken);
            vm.channel.accessToken = newLongToken.longToken;
            data.user.accounts.data.forEach(function (page) {
              vm.myFacebookPages.push({value: page.id, text: page.name})

              var $toastContent = $('<span class="green-text">Your permission has granted , now pick a page</span>');
              var rounded = "rounded"
              Materialize.toast($toastContent, 3000, rounded);

            });
          })

        });
    };


  }

})();
