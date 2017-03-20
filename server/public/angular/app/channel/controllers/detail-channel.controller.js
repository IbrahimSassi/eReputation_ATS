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

    init();

    function init() {
      vm.channelId = $stateParams.channelId;
      console.log(vm.channelId);
      vm.userConnectedId = 1;


    }

    // ** Init end **//

    // ** Channel Detail start **/


    //getting channel id passed in params to get channel

    // vm.getSelectedChannel = function () {
    //
    // };


  };

})();
