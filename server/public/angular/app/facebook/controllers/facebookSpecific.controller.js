/**
 * Created by Ibrahim on 24/04/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .controller('FacebookSpecificController', FacebookSpecificControllerFN);

  FacebookSpecificControllerFN.$inject = ['$scope',
    'FacebookService', 'ChannelService', '$stateParams', 'CampaignService',
    '$rootScope'];


  /* @ngInject */
  function FacebookSpecificControllerFN($scope, FacebookService, ChannelService, $stateParams, CampaignService, $rootScope) {
    var vm = this;
    vm.connectedUserId = $rootScope.currentUser._id;
    vm.selectedCampaign = $stateParams.idCampaign; //TODO Change It Dynamic

    vm.selectedChannel = {};
    vm.myChannels = [];

    vm.display = false;
    activate();

    ////////////////

    function activate() {


      vm.since = moment().subtract(1, 'weeks');
      vm.until = moment();

      getSelectedCampaign();
    }


    function getSelectedCampaign() {
      vm.myChannels = [];
      if (vm.selectedCampaign !== undefined) {
        CampaignService.getCampaignById(vm.selectedCampaign).then(function (data) {
          data[0].channels.forEach(function (channelPartial) {
            ChannelService.getChannelByID(channelPartial.channelId).then(function (channel) {
              if (channel.type == "facebook" && channel.personal)
                vm.myChannels.push(channel);
            })
          });
        })
          .catch(function (err) {
            console.error(err);
          });
      }

    }


    vm.pasteUrl = function (event) {
      console.log(event)
      vm.url = event.originalEvent.clipboardData;

    }

  }

})();

