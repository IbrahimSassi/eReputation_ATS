/**
 * Created by Ibrahim on 01/04/2017.
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
        templateUrl: 'angular/app/components/charts/lineChart/lineCharts.template.html',

      };
    })
    .controller('lineChartCtrl', lineChartCtrl);
  ;


  function lineChartCtrl($scope) {
    $scope.now = Date.now();




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

        var lineChartData = {
          labels : JSON.parse($scope.lineLabels),
          datasets : [
            {
              label: "My dataset",
              fillColor : "rgba(255,255,255,0)",
              strokeColor : "#fff",
              pointColor : "#00796b ",
              pointStrokeColor : "#fff",
              pointHighlightFill : "#fff",
              pointHighlightStroke : "rgba(220,220,220,1)",
              data: JSON.parse($scope.lineData)
            }
          ]

        };


        var lineChart = document.getElementById("line-chart").getContext("2d");
        window.lineChart = new Chart(lineChart).Line(lineChartData, {
          scaleShowGridLines: false,
          bezierCurve: false,
          scaleFontSize: 12,
          scaleFontStyle: "normal",
          scaleFontColor: "#fff",
          responsive: true,
        });


      }, 1000);


    }


    $scope.$watch('lineData', function (newValue, oldValue) {

      // console.log($scope.lineLabels)
      // console.log($scope.lineData)
      // var localLabel = JSON.parse($scope.lineLabels);
      // var localData = JSON.parse($scope.lineData);
      console.log("salemm")
      console.log($scope.lineLabels)
      console.log($scope.lineData)
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

