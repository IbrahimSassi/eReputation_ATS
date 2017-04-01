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
      .state('facebookOverview', {
        url: '/facebook/overview',
        templateUrl: 'angular/app/facebook/views/overview.view.html',
        controller: 'FacebookController as vm',
        cache: false
      })
      .state('facebookCommunity', {
        url: '/facebook/community',
        templateUrl: 'angular/app/facebook/views/facebookCommunity.view.html',
        controller: 'FacebookCommunityController as vm',
        cache: false
      })
    // .state('page_stories_by_story_type', {
    //   url: '/facebook/pageFans',
    //   templateUrl: 'angular/app/facebook/views/overview.view.html',
    //   controller: 'FacebookController as vm',
    //   cache: false
    // })
    ;

  }


  /* @ngInject */
  function FacebookControllerFN($scope, FacebookService, ChannelService, $filter) {
    var vm = this;
    vm.title = 'FacebookController';
    vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.selectedChannel = {};
    vm.myChannels = [];
    vm.pageFans = [];
    vm.pageStories = [];
    vm.labelsPageFans = [];
    vm.dataPageFans = [];
    vm.labelsPageStoriesByType = [];
    vm.dataPageStoriesByType = [];
    vm.pageStorytellers = [];
    vm.labelsPageFansOnline = [];
    vm.dataPageFansOnline = [];
    vm.labelsPageViews = [];
    vm.dataPageViews = [];

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

      // console.log(vm.since);
      // console.log(vm.until);

      ChannelService.getChannelsByUser(vm.connectedUserId).then(function (myChannels) {
        vm.myChannels = $filter('filter')(myChannels, {type: 'facebook', personal: true});
        console.log(vm.myChannels);
        // vm.selectedChannel = vm.myChannels[0];

      });


      // initPageFansInsights();


    }


    vm.onChange = function () {
      console.log("onChange", vm.since);
      console.log("onChange", vm.until);

      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");

      }
      else if (new Date(vm.until) > new Date() || new Date(vm.since) > new Date()) {
        Materialize.toast("Until Date or Since Date Can t be greater than today", 3000, "rounded");
      }

      else {
        initPageFansInsights();
        initPageStorytellersByAgeGender();
        initPageFansOnlinePerDayInsights();
        initPositiveFeedbackInsights();
        initNegativeFeedbackInsights();
        initPageActionsPostReactions();
        initPageViewsTotalInsights();
        initPositiveFeedbackInsights();
        initNegativeFeedbackInsights();
        initPageStoriesByStoryType();


      }
    };


    vm.onSelect = function () {
      ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
        vm.selectedChannel = item;
        vm.labelsPageFans = [];
        vm.dataPageFans = [];
        initPageFansInsights();
        initPageStorytellersByAgeGender();
        initPageFansOnlinePerDayInsights();
        initPositiveFeedbackInsights();
        initNegativeFeedbackInsights();
        initPageActionsPostReactions();
        initPageViewsTotalInsights();
        initPositiveFeedbackInsights();
        initNegativeFeedbackInsights();
        initPageStoriesByStoryType();

      });

    };


    function initPageStoriesByStoryType() {

      vm.pageStories = []
      FacebookService.getPageStoriesByStoryType(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (stories, err) {
        vm.pageStories = stories.data[2].values;

        console.log("vm.pageStories", vm.pageStories)

      })


    }


    function initPageStorytellersByAgeGender() {
      vm.pageStorytellers = [];
      FacebookService.getPageStorytellersByAgeGender(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights1) {

        if (!insights1.data.length) {
          Materialize.toast("There is no data in this range for Page Storytellers By AgeGender", 3000, "rounded");
          return;
        }

        vm.pageStorytellers = insights1.data[0].values;
        // console.log("insights1", vm.pageStorytellers);

      })
    }


    function initPageFansInsights() {


      vm.labelsPageFans = [];
      vm.dataPageFans = [];

      FacebookService.getFansPage(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        if (!insights.data.length) {
          Materialize.toast("There is no data in this range for Page Fans", 3000, "rounded");
          return;
        }

        insights.data[0].values.forEach(function (fans) {
          vm.labelsPageFans.push(moment(fans.end_time).format("DD-MM-YYYY"));
          vm.dataPageFans.push(fans.value);

        });


      });

    }

    function initPageFansOnlinePerDayInsights() {
      vm.labelsPageFansOnline = [];
      vm.dataPageFansOnline = [];
      FacebookService.getPageFansOnline(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (PageFansOnlinePerDayInsights) {
        if (!PageFansOnlinePerDayInsights.data.length) {
          Materialize.toast("There is no data in this range for Fans Online Per Day", 3000, "rounded");
          return;
        }

        vm.PageFansOnlinePerDayInsights = PageFansOnlinePerDayInsights.data[0].values;
        // console.log("vm.PageFansOnlinePerDayInsights", vm.PageFansOnlinePerDayInsights)
        vm.PageFansOnlinePerDayInsights.forEach(function (onlineFans) {
          vm.labelsPageFansOnline.push(moment(onlineFans.end_time).format("DD-MM-YYYY"));
          vm.dataPageFansOnline.push(onlineFans.value);
          // console.log(vm.labelsPageFansOnline)
          // console.log(vm.dataPageFansOnline)

        });


      });

    }


    function initPositiveFeedbackInsights() {
      FacebookService.getPagePositiveFeedbackByType(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        if (!insights.data.length) {
          Materialize.toast("There is no data in this range for positive feedback", 3000, "rounded");
          return;
        }
        // console.log("positive feedback", insights)
        insights.data.forEach(function (obj) {
          if (obj.period == "days_28")
            vm.PostiveFeedback = obj.values;
        });
        vm.totalPositiveFeedback = 0;

        vm.PostiveFeedback.forEach(function (obj1) {
          if (obj1.value) {

            var TempKeys = Object.values(obj1.value);
            for (var i = 0; i < TempKeys.length; i++) {
              vm.totalPositiveFeedback += TempKeys[i];
            }
          }
        });
        console.log("vm.totalPositiveFeedback", vm.totalPositiveFeedback)
      });

    }


    function initNegativeFeedbackInsights() {
      FacebookService.getPageNegativeFeedback(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        if (!insights.data.length) {
          Materialize.toast("There is no data in this range for negative feedback", 3000, "rounded");
          return;
        }
        insights.data.forEach(function (obj) {
          if (obj.period == "days_28")
            vm.NegativeFeedback = obj.values;
        });
        vm.totalNegativeFeedback = 0;

        vm.NegativeFeedback.forEach(function (obj1) {
          if (obj1.value) {

            var TempKeys = Object.values(obj1.value);
            for (var i = 0; i < TempKeys.length; i++) {
              vm.totalNegativeFeedback += TempKeys[i];
            }
          }
        });
        console.log("vm.totalNegativeFeedback", vm.totalNegativeFeedback)
      });

    }


    function initPageActionsPostReactions() {
      FacebookService.getPageActionsPostReactionsTotal(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        if (!insights.data.length) {
          Materialize.toast("There is no data in this range for Page Actions posts reactions", 3000, "rounded");
          return;
        }
        vm.PageActionsPostReactions = insights.data[0].values;

        vm.PageActionsPostReactions.forEach(function (reactions) {
          if (reactions.value) {
            var tempKeys = Object.keys(reactions.value);
            var tempValues = Object.values(reactions.value);

            vm.TotalLikes = 0;
            vm.TotalLoves = 0;
            vm.TotalAngers = 0;
            for (var i = 0; i < tempKeys.length; i++) {
              switch (tempKeys[i]) {
                case "like":
                  vm.TotalLikes += tempValues[i];
                  break;
                case "love":
                  vm.TotalLoves += tempValues[i];
                  break;
                case "anger":
                  vm.TotalAngers += tempValues[i];
                  break;
                default:

              }
            }
          }
        });

        // insights.data.forEach(function (obj) {
        //   if (obj.period == "days_28")
        //     vm.NegativeFeedback = obj.values;
        // });
        // vm.totalNegativeFeedback = 0;
        //
        // vm.NegativeFeedback.forEach(function (obj1) {
        //   if (obj1.value) {
        //
        //     var TempKeys = Object.values(obj1.value);
        //     for (var i = 0; i < TempKeys.length; i++) {
        //       vm.totalNegativeFeedback += TempKeys[i];
        //     }
        //   }
        // });
        // console.log("vm.totalNegativeFeedback",vm.totalNegativeFeedback)
      });
    }


    function initPageViewsTotalInsights() {
      vm.labelsPageViews = [];
      vm.dataPageViews = [];
      FacebookService.getPageViewsTotal(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        if (!insights.data.length) {
          Materialize.toast("There is no data in this range for page views", 3000, "rounded");
          return;
        }
        // console.log("initPageViewsTotalInsights", insights)
        insights.data.forEach(function (obj) {
          if (obj.period == "days_28")
            vm.PageViews = obj.values;
        });

        vm.PageViews.forEach(function (obj1) {
          if (obj1.value) {
            vm.labelsPageViews.push(moment(obj1.end_time).format("DD-MM-YYYY"));
            vm.dataPageViews.push(obj1.value);
          }
        });
      });

    }


  }

})();

