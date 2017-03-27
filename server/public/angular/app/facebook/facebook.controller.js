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
      .state('test', {
        url: '/facebook/analytics',
        templateUrl: 'angular/app/facebook/views/facebookAnalytics.view.html',
        controller: 'FacebookController as vm',
        cache: false
      })
    ;

  };


  /* @ngInject */
  function FacebookControllerFN($scope, FacebookService, ChannelService, $filter) {
    var vm = this;
    vm.title = 'FacebookController';
    vm.connectedUserId = "58d3dc815d391346a06f48c3";
    vm.selectedChannel = {};
    vm.myChannels = [];
    vm.pageFans = [];
    vm.labels = [];
    vm.data = [];
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


      // initFacebookChart();


      // vm.dataSource = {
      //   chart: {
      //     caption: "Harry's SuperMart",
      //     subCaption: "Top 5 stores in last month by revenue",
      //     numberPrefix: "$",
      //     theme: "fint",
      //     // usePlotGradientColor:0
      //   },
      //   data: [{
      //     label: "Bakersfield Central",
      //     value: "880000"
      //   },
      //     {
      //       label: "Garden Groove harbour",
      //       value: "730000"
      //     },
      //     {
      //       label: "Los Angeles Topanga",
      //       value: "590000"
      //     },
      //     {
      //       label: "Compton-Rancho Dom",
      //       value: "520000"
      //     },
      //     {
      //       label: "Daly City Serramonte",
      //       value: "330000"
      //     }],
      //   "trendlines": [
      //     {
      //       "line": [
      //         {
      //           "startvalue": "700000",
      //           "color": "#1aaf5d",
      //           "valueOnRight": "1",
      //           "displayvalue": "Monthly Target"
      //         }
      //       ]
      //     }
      //   ]
      //
      // };
      //
      //
      //
      // vm.selectedValue = "Please click on a column";
      // vm.events = {
      //   dataplotclick: function(ev, props) {
      //     $scope.$apply(function() {
      //       console.log(props)
      //       vm.selectedValue = "You clicked on: " + props.categoryLabel;
      //     });
      //   }
      // };


    }


    vm.onChange = function () {
      console.log("onChange", vm.since);
      console.log("onChange", vm.until);

      if (new Date(vm.since) > new Date(vm.until)) {
        Materialize.toast("Until Date Must be greater than since", 3000, "rounded");

      }
      else {
        vm.labels = [];
        vm.data = [];
        initFacebookChart();
      }

      // console.log("sinceTransformed",new Date(vm.since));
      // console.log("UntilTransformed", new Date(vm.until));
      // console.log("sinceTransformed",moment(new Date(vm.since)).format("DD-MM-YYYY"));
      // console.log("UntilTransformed", moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY"));
    };


    vm.onSelect = function () {
      // console.log(vm.selectedChannel._id)
      ChannelService.getChannelByID(vm.selectedChannel._id).then(function (item) {
        vm.selectedChannel = item;
        initFacebookChart()
      });

    }


    function initFacebookChart() {




      FacebookService.getFansPage(
        vm.selectedChannel.url,
        vm.selectedChannel.accessToken,
        moment(new Date(vm.since)).format("DD-MM-YYYY"),
        moment(new Date(vm.until)).add(1, 'days').format("DD-MM-YYYY")
      ).then(function (insights) {
        vm.pageFans = insights.data[0].values;
        console.log("data", insights);
        vm.pageFans.forEach(function (fans) {

          vm.labels.push(moment(fans.end_time).format("DD-MM-YYYY"));
          vm.data.push(fans.value);
        });


      });

      var data = {
        labels: vm.labels,
        datasets: [
          {
            label: "fans",
            fillColor: "rgba(128, 222, 234, 0.6)",
            strokeColor: "#ffffff",
            pointColor: "#00bcd4",
            pointStrokeColor: "#ffffff",
            pointHighlightFill: "#ffffff",
            pointHighlightStroke: "#ffffff",
            data: vm.data
          }
        ]
      };

      setTimeout(function () {

        var FacebookFansLineChart = document.getElementById("trending-line-chart").getContext("2d");
        window.FacebookFansLineChart = new Chart(FacebookFansLineChart).Line(data, {
          scaleShowGridLines: true,///Boolean - Whether grid lines are shown across the chart
          scaleGridLineColor: "rgba(255,255,255,0.4)",//String - Colour of the grid lines
          scaleGridLineWidth: 1,//Number - Width of the grid lines
          scaleShowHorizontalLines: true,//Boolean - Whether to show horizontal lines (except X axis)
          scaleShowVerticalLines: false,//Boolean - Whether to show vertical lines (except Y axis)
          bezierCurve: true,//Boolean - Whether the line is curved between points
          bezierCurveTension: 0.4,//Number - Tension of the bezier curve between points
          pointDot: true,//Boolean - Whether to show a dot for each point
          pointDotRadius: 5,//Number - Radius of each point dot in pixels
          pointDotStrokeWidth: 2,//Number - Pixel width of point dot stroke
          pointHitDetectionRadius: 20,//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
          datasetStroke: true,//Boolean - Whether to show a stroke for datasets
          datasetStrokeWidth: 3,//Number - Pixel width of dataset stroke
          datasetFill: true,//Boolean - Whether to fill the dataset with a colour
          animationSteps: 15,// Number - Number of animation steps
          animationEasing: "easeOutQuart",// String - Animation easing effect
          scaleFontSize: 12,// Number - Scale label font size in pixels
          scaleFontStyle: "normal",// String - Scale label font weight style
          scaleFontColor: "#fff",// String - Scale label font colour
          tooltipEvents: ["mousemove", "touchstart", "touchmove"],// Array - Array of string names to attach tooltip events
          tooltipFillColor: "rgba(255,255,255,0.8)",// String - Tooltip background colour
          tooltipFontSize: 12,// Number - Tooltip label font size in pixels
          tooltipFontColor: "#000",// String - Tooltip label font colour
          tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
          tooltipTitleFontSize: 14,// Number - Tooltip title font size in pixels
          tooltipTitleFontStyle: "bold",// String - Tooltip title font weight style
          tooltipTitleFontColor: "#000",// String - Tooltip title font colour
          tooltipYPadding: 8,// Number - pixel width of padding around tooltip text
          tooltipXPadding: 16,// Number - pixel width of padding around tooltip text
          tooltipCaretSize: 10,// Number - Size of the caret on the tooltip
          tooltipCornerRadius: 6,// Number - Pixel radius of the tooltip border
          tooltipXOffset: 10,// Number - Pixel offset from point x to tooltip edge
          responsive: true
        });

      }, 1000)


    }


  }

})();

