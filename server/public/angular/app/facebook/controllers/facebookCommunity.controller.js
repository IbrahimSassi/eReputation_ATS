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

  FacebookCommunityControllerFN.$inject = ['$scope', 'FacebookService', 'ChannelService', '$filter'];


  /* @ngInject */
  function FacebookCommunityControllerFN($scope, FacebookService, ChannelService, $filter) {
    var vm = this;
    vm.title = 'FacebookController';
    vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.selectedChannel = {};
    vm.myChannels = [];
    vm.pageStorytellers = [];
    vm.Dates = [];
    vm.TotalStoryByGender = [{label: "Men", value: 0, color: ""}, {label: "Women", value: 0, color: ""}]
    vm.display = false;
    activate();

    ////////////////

    function activate() {


      vm.since = moment().subtract(1, 'weeks');
      vm.until = moment();
      // vm.selectedDate = moment()
      // console.log(vm.selectedDate);

      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (myChannels) {
        vm.myChannels = $filter('filter')(myChannels, {type: 'facebook', personal: true});
        console.log(vm.myChannels)
        // vm.selectedChannel = vm.myChannels[1];
      });


      // initPageStorytellersByAgeGender();


    }


    vm.onChange = function () {
      // console.log("onChange", vm.since);
      // console.log("onChange", vm.until);

      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");

      }
      else {
        initPageStorytellersByAgeGender()

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

      });

    };


    function initPageStorytellersByAgeGender() {
      console.log("storytellers")
      FacebookService.getPageStorytellersByAgeGender(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights1) {
        console.log("insights1", insights1);

        if (!insights1.data.length) {
          Materialize.toast("There is no data in this range", 3000, "rounded");
          return;

        }

        insights1.data.forEach(function (period) {
          if (period.period == "days_28")
            vm.pageStorytellers = period.values;
        });

        // vm.pageStorytellers = insights1.data[0].values;
        console.log("insights2", vm.pageStorytellers);
        vm.selectedDate = vm.pageStorytellers[0].end_time;
        vm.Dates = [];
        vm.TotalStoryByGender = [{label: "Men", value: 0, color: ""}, {label: "Women", value: 0, color: ""}]
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


  }

})();

