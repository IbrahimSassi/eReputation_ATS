/**
 * Created by Ibrahim on 31/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .directive("doughnutChart", function () {
      return {
        restrict: 'EA',
        controller: 'doughnutChartCtrl',
        controllerAs: 'vm',
        scope: {
          doughnutData: '@doughnutData'
        },
        templateUrl: 'angular/app/components/charts/doughnutChart/doughnutChart.template.html'

      };
    })
    .controller('doughnutChartCtrl', doughnutChartCtrl);
  ;


  function doughnutChartCtrl($scope) {
    $scope.doughnutData = JSON.parse($scope.doughnutData);
    console.log("hello worlddd", $scope.doughnutData)


    updateData();


    function updateData() {

      setTimeout(function () {


        var colors = [
          {
            color: "#F7464A",
            highlight: "#FF5A5E"
          }
          , {
            color: "#46BFBD",
            highlight: "#5AD3D1"
          }
          , {
            color: "#FDB45C",
            highlight: "#FFC870"

          }
          , {
            color: "#27ae60",
            highlight: "#2ecc71"

          }
          , {
            color: "#16a085",
            highlight: "#1abc9c"

          }
          , {
            color: "#8e44ad",
            highlight: "#9b59b6"

          }
          , {
            color: "#2c3e50",
            highlight: "#34495e"

          }
        ];
        var max = 6;
        var min = 0;

        var doughnutData = [];


        if (JSON.parse($scope.doughnutData).length) {
          JSON.parse($scope.doughnutData).forEach(function (obj) {
            console.log("obj", obj)
            var random = Math.floor(Math.random() * (max - min) + min);
            doughnutData.push({
              color: colors[random].color,
              highlight: colors[random].highlight,
              value: obj.value,
              label: obj.label
            })
          });


        }

        var doughnutChart = document.getElementById("doughnut-chart").getContext("2d");
        window.myDoughnut = new Chart(doughnutChart).Doughnut(doughnutData, {
          segmentStrokeColor: "#fff",
          tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
          animationSteps: 15,
          segmentStrokeWidth: 4,
          animateScale: true,
          percentageInnerCutout: 60,
          responsive: true
        });


      }, 500);


    }


    $scope.$watch('doughnutData', function (newValue, oldValue) {
      // $scope.doughnutData = JSON.parse($scope.doughnutData);

      updateData();

    });


  }

})(angular);

