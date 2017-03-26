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
      vm.userConnectedId = "58d3dc815d391346a06f48c3";

      ChannelService.getChannelByID(vm.channelId).then(function (channel) {
        vm.selectedChannel = channel;
      });

    }


    vm.editChannel = function () {
      ChannelService.updateChannel(vm.selectedChannel).then(function (data, err) {
        if (err) {
          console.log(err)
          Materialize.toast("There were an error", 3000, "rounded");
          return;
        }
        console.log(data)
        Materialize.toast("Channel Updated", 3000, "rounded");
        $state.go('channels');


      });
    }


  }

})();
