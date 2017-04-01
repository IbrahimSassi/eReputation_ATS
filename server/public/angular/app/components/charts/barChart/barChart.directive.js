/**
 * Created by Ibrahim on 01/04/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .directive("barChart", function () {
      return {
        restrict: 'EA',
        controller: 'barChartCtrl',
        controllerAs: 'vm',
        scope: {
          barLabels: '@barLabels',
          barData: '@barData'
        },
        templateUrl: 'angular/app/components/charts/barChart/barchart.template.html',

      };
    })
    .controller('barChartCtrl', barChartCtrl);
  ;


  function barChartCtrl($scope) {

    updateData();


    function updateData() {

      setTimeout(function () {

        var dataBarChart = {
          labels: JSON.parse($scope.barLabels),
          datasets: [
            {
              label: "Bar dataset",
              fillColor: "#46BFBD",
              strokeColor: "#46BFBD",
              highlightFill: "rgba(70, 191, 189, 0.4)",
              highlightStroke: "rgba(70, 191, 189, 0.9)",
              data: JSON.parse($scope.barData)
            }
          ]
        };


        var trendingBarChart = document.getElementById("bar-chart-component").getContext("2d");
        window.trendingBarChart = new Chart(trendingBarChart).Bar(dataBarChart, {
          scaleShowGridLines: false,///Boolean - Whether grid lines are shown across the chart
          showScale: true,
          animationSteps: 15,
          tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
          responsive: true
        });


      }, 1000);


    }


    $scope.$watch('barData', function (newValue, oldValue) {
      console.log("get called")
      updateData();

    });


  }

})(angular);

