/**
 * Created by Ibrahim on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook', [])
    .config(config)
    .controller('FacebookController', FacebookControllerFN);

  FacebookControllerFN.$inject = ['$scope', 'FacebookService', 'ChannelService', '$filter'];
  config.$inject = ['$stateProvider', '$urlRouterProvider'];


  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('page_fans', {
        url: '/facebook/pageFans',
        templateUrl: 'angular/app/facebook/views/pageFans.view.html',
        controller: 'FacebookController as vm',
        cache: false
      })
    // .state('page_stories_by_story_type', {
    //   url: '/facebook/pageFans',
    //   templateUrl: 'angular/app/facebook/views/pageFans.view.html',
    //   controller: 'FacebookController as vm',
    //   cache: false
    // })
    ;

  };


  /* @ngInject */
  function FacebookControllerFN($scope, FacebookService, ChannelService, $filter) {
    var vm = this;
    vm.title = 'FacebookController';
    vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.selectedChannel = {};
    vm.myChannels = [];
    // vm.pageFans = [];
    vm.pageStories = [];
    vm.labelsPageFans = [];
    vm.dataPageFans = [];
    vm.labelsPageStoriesByType = [];
    vm.dataPageStoriesByType = [];


    // vm.labels = ["January", "February", "March", "April", "May", "June", "July"];
    // vm.data = [65, 59, 80, 81, 56, 55, 40];
    activate();

    ////////////////

    function activate() {

      // var currentDate = moment();
      // vm.until = currentDate.format();
      // // vm.since = currentDate.format();
      // vm.since = moment(currentDate).subtract(7, 'days').format();

      vm.since = moment().subtract(1, 'weeks');
      vm.until = moment();

      console.log(vm.since);
      console.log(vm.until);

      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (myChannels) {
        vm.myChannels = $filter('filter')(myChannels, {type: 'facebook', personal: true});
        console.log(vm.myChannels)
        // vm.selectedChannel = vm.myChannels[1];
      });


      // initPageFansInsights();


    }


    vm.onChange = function () {
      console.log("onChange", vm.since);
      console.log("onChange", vm.until);

      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");

      }
      else {
        vm.labelsPageFans = [];
        vm.dataPageFans = [];
        initPageFansInsights();
        initPageStoriesByStoryType();

      }

      // console.log("sinceTransformed",new Date(vm.since));
      // console.log("UntilTransformed", new Date(vm.until));
      // console.log("sinceTransformed",moment(new Date(vm.since)).format("DD-MM-YYYY"));
      // console.log("UntilTransformed", moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY"));
    };


    vm.onSelect = function () {
      // $scope.labelsPageFans = [];
      // $scope.dataPageFans = [];
      // console.log(vm.selectedChannel._id)
      ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
        vm.selectedChannel = item;
        vm.labelsPageFans = [];
        vm.dataPageFans = [];
        initPageFansInsights();
        initPageStoriesByStoryType()

      });

    };


    function initPageStoriesByStoryType() {


      FacebookService.getPageStoriesByStoryType(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (stories, err) {
        // console.log(stories.data[2].values);
        vm.pageStories = stories.data[2].values;

        console.log("vm.pageStories",vm.pageStories)

        // Object.keys(stories.data[2].values[0].value).map(function (key) {
        //   vm.labelsPageStoriesByType.push(key)
        //   vm.dataPageStoriesByType.push(stories.data[2].values[0].value[key])
        //   return stories.data[2].values[0].value[key]
        // });

        // stories.data[2].values[0].forEach(function (story) {
        //   console.log(story)
        //   Object.keys(story.value).map(function(key){
        //
        //     vm.labelsPageStoriesByType.push(key)
        //     vm.labelsPageStoriesByType.push(story.value[key])
        //     return story.value[key]
        //   });
        //
        // })
      })


    }


    function initPageFansInsights() {


      FacebookService.getFansPage(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        // vm.pageFans = insights.data[0].values;
        console.log("data", insights);
        insights.data[0].values.forEach(function (fans) {
          vm.labelsPageFans.push(moment(fans.end_time).format("DD-MM-YYYY"));
          vm.dataPageFans.push(fans.value);

        });


      });

    }


  }

})();

