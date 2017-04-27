/**
 * Created by Ibrahim on 29/03/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.facebook')
    .directive("radarChart", function () {
      return {
        restrict: 'EA',
        controller: 'radarChartCtrl',
        controllerAs: 'vm',
        scope: {
          labels: '@labels',
          data: '@data'
        },
        templateUrl: 'angular/app/components/charts/radarChart/radarchart.template.html',
        link: function (scope, elem, attrs) {
          scope.date = scope.labels;

          scope.now = Date.now() + Math.random();
          var localLabel = ["other", "page post", "fan", "user post", "checkin", "question", "coupon", "event", "mention"];
          var localData = [0, 0, 0, 0, 0, 0, 0, 0, 0];


          // var trendingRadarChart;

          updateData();
          //
          scope.$watch('data', function (newValue, oldValue) {

            setTimeout(function () {

              var Data = JSON.parse(newValue);

              var localLabel = Object.keys(Data);
              var localData = Object.values(Data);

              for (var i = 0; i < localData.length; i++) {
                window.trendingRadarChart.datasets[0].points[i].label = localLabel[i];
                window.trendingRadarChart.datasets[0].points[i].value = localData[i];
              }
              window.trendingRadarChart.update();


            }, 1000);


            // updateData();
          });


          function updateData() {


            var radarChartData = {
              labels: localLabel,
              datasets: [
                {
                  label: "First dataset",
                  fillColor: "rgba(255,255,255,0.2)",
                  strokeColor: "#fff",
                  pointColor: "#00796b",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "#fff",
                  data: localData
                }
              ]
            };

            setTimeout(function () {


              var id = "radar-chart-component";
              // console.log('id', id)
              window.trendingRadarChart = new Chart(document.getElementById(id.toString()).getContext("2d")).Radar(radarChartData, {

                angleLineColor: "rgba(255,255,255,0.5)",//String - Colour of the angle line
                pointLabelFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
                pointLabelFontColor: "#fff",//String - Point label font colour
                pointDotRadius: 4,
                animationSteps: 15,
                pointDotStrokeWidth: 2,
                pointLabelFontSize: 12,
                responsive: true
              });


            }, 1000)

          }

        }

        // }


      };
    })
    .controller('radarChartCtrl', radarChartCtrl)
  ;


  function radarChartCtrl($scope) {


  }

})(angular);

