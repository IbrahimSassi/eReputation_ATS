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
      userId : vm.connectedUserId
    };

    init();

    function init() {

    }


    vm.createChannel = function () {
      ChannelService.addChannel(vm.channel)
        .then(function (result) {
        console.log("result", result);
        $state.go('channels');

      });
    };

    vm.getPermissions = function () {
      FacebookService.initFacebookApi()
        .then(function (data) {
        console.log("here we are token  + user ,,promise bouh kalb",data);
        var token = data.authResponse.accessToken;

        FacebookService.getLongLivedToken(token).then(function (newLongToken) {
          console.log(newLongToken);
          vm.channel.accessToken =newLongToken.longToken;
        })

      });
    };


  }

})();
