/**
 * Created by Ibrahim on 20/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.channel')
    .controller('DetailChannel', CreateChannelFN);


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
    vm.title = 'Create Channel';

    init();

    function init() {

    }


    vm.createChannel = function () {
      ChannelService.addChannel(vm.selectedChannel);
      $state.go('channels');
    }


  }

})();
