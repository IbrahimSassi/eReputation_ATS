/**
 * Created by Ibrahim on 31/03/2017.
 */
/**
 * Created by Ibrahim on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .controller('FacebookCommunityController', FacebookCommunityControllerFN);

  FacebookCommunityControllerFN.$inject = ['$scope',
    'FacebookService', 'ChannelService', '$filter', 'colorPickerService',
    '$rootScope'];


  /* @ngInject */
  function FacebookCommunityControllerFN($scope, FacebookService, ChannelService, $filter, colorPickerService, $rootScope) {
    var vm = this;
    vm.title = 'FacebookController';
    // vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.connectedUserId = $rootScope.currentUser._id;
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

      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (myChannels) {
        vm.myChannels = $filter('filter')(myChannels, {type: 'facebook', personal: true});
        // console.log(vm.myChannels)
        // vm.selectedChannel = vm.myChannels[1];
      });
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
        // console.log(vm.selectedChannel);
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


      });
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

      });

    }


  }

})();

