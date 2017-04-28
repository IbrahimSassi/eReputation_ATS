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


      setTimeout(function () {

        if (JSON.parse($scope.lineData)) {
          var data = JSON.parse($scope.lineData);
          var labels = JSON.parse($scope.lineLabels);
          for (var i = 0; i < data.length; i++) {
            window.lineChart.datasets[0].points[i].label = labels[i];
            window.lineChart.datasets[0].points[i].value = data[i];
          }
          window.lineChart.update()


        }


      }, 1000)



      // updateData();

    });


  }

})(angular);

