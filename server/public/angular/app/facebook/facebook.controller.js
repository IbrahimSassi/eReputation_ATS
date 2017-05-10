/**
 * Created by Ibrahim on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook', [])
    .config(config)
    .controller('FacebookController', FacebookControllerFN);

  FacebookControllerFN.$inject = ['$scope', 'FacebookService', 'ChannelService', 'CampaignService', '$rootScope', '$stateParams'];
  config.$inject = ['$stateProvider', '$urlRouterProvider'];


  /* @ngInject */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('campaignDetail.campaignFbAnalysis.facebookOverview', {
        url: '/myPages',
        templateUrl: 'angular/app/facebook/views/overview.view.html',
        controller: 'FacebookController as vm',
        cache: false,
        authenticate: true,
        shouldConfirmed: true

      })
      .state('campaignDetail.campaignFbAnalysis.facebookCommunity', {
        url: '/community',
        templateUrl: 'angular/app/facebook/views/facebookCommunity.view.html',
        controller: 'FacebookCommunityController as vm',
        cache: false,
        authenticate: true,
        shouldConfirmed: true

      })
      .state('campaignDetail.campaignFbAnalysis.facebookSpecific', {
        url: '/specific',
        templateUrl: 'angular/app/facebook/views/facebookSpecific.view.html',
        controller: 'FacebookSpecificController as vm',
        cache: false,
        authenticate: true,
        shouldConfirmed: true
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
  function FacebookControllerFN($scope, FacebookService, ChannelService, CampaignService, $rootScope, $stateParams) {
    var vm = this;
    vm.title = 'FacebookController';
    // vm.connectedUserId = "58d3dc815d391346a06f48c3";

    vm.selectedCampaign = $stateParams.idCampaign; //TODO Change It Dynamic
    vm.connectedUserId = $rootScope.currentUser._id;
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
    vm.TotalStories = {};
    activate();

    ////////////////

    function activate() {


      vm.since = moment().subtract(1, 'weeks');
      vm.until = moment();

      getSelectedCampaign();


      // initPageFansInsights();


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

          vm.min = moment(data[0].dateStart);
          vm.max = moment(data[0].dateEnd);

        })
          .catch(function (err) {
            // console.error(err);
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
        initChart();

      }
    };

    function initChart() {
      initPageFansInsights();
      initPageStorytellersByAgeGender();
      initPageFansOnlinePerDayInsights();
      initPositiveFeedbackInsights();
      initPageActionsPostReactions();
      initPageViewsTotalInsights();
      initPositiveFeedbackInsights();
      initNegativeFeedbackInsights();
      initPageStoriesByStoryType();

    }


    vm.onSelect = function () {
      ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
        vm.selectedChannel = item;
        // console.log(item)
        vm.labelsPageFans = [];
        vm.dataPageFans = [];
        initChart();
      });

    };


    function initPageStoriesByStoryType() {

      vm.range = "Between " + moment(new Date(vm.since)).format("DD-MM-YYYY") + " and "
        + moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY");

      vm.pageStories = []
      FacebookService.getPageStoriesByStoryType(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (stories) {
          vm.pageStories = stories.data[2].values;


          vm.TotalStories = {
            "page_post": 0,
            "other": 0,
            "fan": 0,
            "user_post": 0,
            "checkin": 0,
            "question": 0,
            "coupon": 0,
            "event": 0,
            "mention": 0
          };

          for (var type in vm.TotalStories) {
            vm.pageStories.forEach(function (story) {
              for (var i in story.value) {
                if (i == type)
                  vm.TotalStories[type] += story.value[i]
              }
            })
          }


        }
      )


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


      })
    }


    function initPageFansInsights() {

      vm.dataPage = [];
      vm.dataPage.push(['Date', 'Number Of Fans'])
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
        vm.totalFans = insights.data[0].values[insights.data[0].values.length - 1].value;
        vm.totalFansPercent =
          (( insights.data[0].values[insights.data[0].values.length - 1].value -
          insights.data[0].values[insights.data[0].values.length - 2].value ) /
          insights.data[0].values[insights.data[0].values.length - 2].value ) * 100;
        vm.totalFansPercent = vm.totalFansPercent.toFixed(4);


        insights.data[0].values.forEach(function (fans) {
          vm.labelsPageFans.push(moment(fans.end_time).format("DD-MM-YYYY"));
          vm.dataPageFans.push(fans.value);
          vm.dataPage.push([moment(fans.end_time).format("DD-MM-YYYY"), fans.value])

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
        vm.PageFansOnlinePerDayInsights.forEach(function (onlineFans) {
          vm.labelsPageFansOnline.push(moment(onlineFans.end_time).format("DD-MM-YYYY"));
          vm.dataPageFansOnline.push(onlineFans.value);

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

})
();

