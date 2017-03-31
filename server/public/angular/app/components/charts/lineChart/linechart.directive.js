/**
 * Created by Ibrahim on 29/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .directive("lineChart", function () {
      return {
        restrict: 'EA',
        controller: 'lineChartCtrl',
        controllerAs: 'vm',
        scope: {
          lineLabels: '@lineLabels',
          lineData: '@lineData'
        },
        templateUrl: 'angular/app/components/charts/lineChart/linechart.template.html',

      };
    })
    .controller('lineChartCtrl', lineChartCtrl);
  ;


  function lineChartCtrl($scope) {
    // console.log("hello world")
    // console.log(this)
    // console.log($scope)
    $scope.lineLabels = []
    $scope.lineData = []
    // $scope.lineLabels = ["Apple", "Samsung", "SONY", "Motorola", "Nokia", "Microsoft", "Xiaomi"]
    // $scope.lineData = [100, 50, 20, 40, 80, 50, 80]
    $scope.now = Date.now();
    var FacebookFansLineChart;


    updateData();

    //
    // setInterval(function () {
    //   console.log("get called")
    //   console.log(typeof $scope.FacebookFansLineChart)
    //
    //   if (typeof $scope.FacebookFansLineChart != "undefined") {
    //     console.log("helooo")
    //     // Update one of the points in the second dataset
    //     $scope.FacebookFansLineChart.datasets[0].points =  JSON.parse($scope.lineData);
    //     $scope.FacebookFansLineChart.labels = JSON.parse($scope.lineLabels);
    //     $scope.FacebookFansLineChart.update();
    //   }
    //
    // }, 1000);

    function updateData() {

      setTimeout(function () {
        $scope.data = {
          labels: JSON.parse($scope.lineLabels),
          datasets: [
            {
              label: "fans",
              fillColor: "rgba(128, 222, 234, 0.6)",
              strokeColor: "#ffffff",
              pointColor: "#00bcd4",
              pointStrokeColor: "#ffffff",
              pointHighlightFill: "#ffffff",
              pointHighlightStroke: "#ffffff",
              data: JSON.parse($scope.lineData)
            }
          ]
        };


        FacebookFansLineChart = document.getElementById("line-chart-component" + $scope.now).getContext("2d");
        window.FacebookFansLineChart = new Chart(FacebookFansLineChart).Line($scope.data, {
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

      }, 1000);


    }


    $scope.$watch('lineData', function (newValue, oldValue) {

      // console.log($scope.lineLabels)
      // console.log($scope.lineData)
      // var localLabel = JSON.parse($scope.lineLabels);
      // var localData = JSON.parse($scope.lineData);

      updateData();
      // if (typeof FacebookFansLineChart != "undefined") {
      //   console.log(window.FacebookFansLineChart)
      //   for (var i = 0; i < localLabel.length - 1; i++) {
      //     window.FacebookFansLineChart.datasets[0].points[i].value = localData[i];
      //     window.FacebookFansLineChart.datasets[0].points[i].label = localLabel[i];
      //   }
      //   $scope.data.labels = localLabel;
      //   window.FacebookFansLineChart.update();
      //
      // }

    });


  }

})(angular);

