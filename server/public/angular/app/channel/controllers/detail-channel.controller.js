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
    '$rootScope'
  ];


  /* @ngInject */
  function DetailChannel(ChannelService,
                         $state,
                         $stateParams,
                         $rootScope) {
    //On Init Start
    var vm = this;
    vm.title = 'Channel List';
    vm.selectedChannel = {};
    // vm.availableOptions = [
    //   {id: '1', name: 'facebook'},
    //   {id: '2', name: 'twitter'},
    //   {id: '3', name: 'website'}
    // ];

    init();

    function init() {
      vm.channelId = $stateParams.channelId;
      vm.userConnectedId = 1;

      ChannelService.getChannelByID(vm.channelId).then(function (channel) {
        vm.selectedChannel = channel;
      });

    }


    vm.editChannel = function () {
      ChannelService.updateChannel(vm.selectedChannel);
      $state.go('channels');
    }


  }

})();
