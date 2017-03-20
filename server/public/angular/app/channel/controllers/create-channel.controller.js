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
    '$rootScope'
  ];


  /* @ngInject */
  function CreateChannelFN(ChannelService,
                           $state,
                           $stateParams,
                           $rootScope) {
    //On Init Start
    var vm = this;

    vm.connectedUserId = 1;
    vm.title = 'Create Channel';
    vm.channel = {
      name: "",
      url: "",
      type: "",
      access_token: "",
      personnel: false,
      userId : vm.connectedUserId
    };

    init();

    function init() {

    }


    vm.createChannel = function () {
      ChannelService.addChannel(vm.channel).then(function (result) {
        console.log("result", result);
        $state.go('channels');

      });
    }


  }

})();
