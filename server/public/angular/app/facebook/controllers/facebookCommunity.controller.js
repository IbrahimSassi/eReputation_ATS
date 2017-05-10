/**
 * Created by Ibrahim on 31/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .controller('FacebookCommunityController', FacebookCommunityControllerFN);

  FacebookCommunityControllerFN.$inject = [
    'FacebookService', 'ChannelService', '$stateParams', 'CampaignService',
    '$rootScope', 'UtilsService'];


  /* @ngInject */
  function FacebookCommunityControllerFN(FacebookService, ChannelService, $stateParams, CampaignService, $rootScope, UtilsService) {
    var vm = this;
    vm.connectedUserId = $rootScope.currentUser._id;
    vm.selectedCampaign = $stateParams.idCampaign;

    vm.selectedChannel = {};
    vm.myChannels = [];
    vm.pageStorytellers = [];
    vm.Dates = [];
    vm.labelsPageEngagedUsers = [];
    vm.dataPageEngagedUsers = [];
    vm.TotalStoryByGender = [{label: "Men", value: 0}, {label: "Women", value: 0}]
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
        CampaignService.getCampaignById(vm.selectedCampaign)
          .then(function (data) {
            data[0].channels.forEach(function (channelPartial) {
              ChannelService.getChannelByID(channelPartial.channelId).then(function (channel) {
                if (channel.type == "facebook" && channel.personal)
                  vm.myChannels.push(channel);
              })
            });
            vm.min = moment(data[0].dateStart);
            vm.max = moment(data[0].dateEnd);

          })
          .catch(function (err) {
            console.error(err);
          });
      }

    }


    vm.onChange = function () {
      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");
      }
      else if (new Date(vm.until) > new Date() || new Date(vm.since) > new Date()) {
        Materialize.toast("Until Date or Since Date Can t be greater than today", 3000, "rounded");
      }
      else {
        initPageStorytellersByAgeGender();
        initPageEngagedUsersInsights();
      }
    };

    vm.onChangeSelectedDate = function () {
      vm.storytellersLabels = Object.keys(vm.pageStorytellers[vm.selectedDate].value);
      vm.storytellersData = Object.values(vm.pageStorytellers[vm.selectedDate].value);
      vm.display = true
    };


    vm.onSelect = function () {
      ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
        vm.selectedChannel = item;
        console.log(vm.selectedChannel);
        initPageStorytellersByAgeGender()
        initPageEngagedUsersInsights();
      });

    };


    function initPageStorytellersByAgeGender() {
      FacebookService.getPageStorytellersByAgeGender(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights1) {

        if (!insights1.data.length) {
          Materialize.toast("There is no data in this range", 3000, "rounded");
          return;
        }

        insights1.data.forEach(function (period) {
          if (period.period == "days_28")
            vm.pageStorytellers = period.values;
        });

        vm.selectedDate = vm.pageStorytellers[0].end_time;
        vm.Dates = [];
        vm.TotalStoryByGender = [{label: "Men", value: 0}, {label: "Women", value: 0}]
        vm.pageStorytellers.forEach(function (obj) {
          vm.Dates.push({value: obj.end_time, text: moment(obj.end_time).format("DD-MM-YYYY")});
          var TempKeys = Object.keys(obj.value);
          var TempValues = Object.values(obj.value);
          if (obj.value) {
            for (var i = 0; i < TempKeys.length; i++) {
              if (TempKeys[i].charAt(0) == "M") {
                vm.TotalStoryByGender[0].value = vm.TotalStoryByGender[0].value + TempValues[i];
              }
              else {
                vm.TotalStoryByGender[1].value = vm.TotalStoryByGender[1].value + TempValues[i];
              }
            }
          }
        });


      })
        .catch(function () {
          UtilsService.AlertToast(
            $('<span class="red-text">There Was an error on getting these insights</span>'), "rounded", 3000);
        });
      ;
    }


    function initPageEngagedUsersInsights() {
      vm.labelsPageEngagedUsers = [];
      vm.dataPageEngagedUsers = [];
      FacebookService.getPageEngagedUsers(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (PageEngagedUsersInsights) {
        vm.PageEngagedUsers = PageEngagedUsersInsights.data[0].values;
        vm.PageEngagedUsers.forEach(function (EngagedUsers) {
          vm.labelsPageEngagedUsers.push(moment(EngagedUsers.end_time).format("DD-MM-YYYY"));
          vm.dataPageEngagedUsers.push(EngagedUsers.value);

        });

      })
        .catch(function () {
          UtilsService.AlertToast(
            $('<span class="red-text">There Was an error on getting these insights</span>'), "rounded", 3000);
        });
      ;

    }


  }

})();

