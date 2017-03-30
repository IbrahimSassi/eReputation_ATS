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
          // var vm = this;
          // console.log("hello from radar");
          // console.log("vm",vm);
          console.log("label", scope.labels);
          scope.now = Date.now() + Math.random();
          var localLabel = ["Chrome", "Mozilla", "Safari", "IE10", "iPhone"];
          var localData = [5, 6, 7, 8, 6];
          // $scope.localLabel = ["a", "b", "c"];
          // $scope.localData = [1, 2, 3];

          updateData();
          //
          scope.$watch('data', function (newValue, oldValue) {
            // console.log('newValue radar', newValue);
            //   console.log('oldValue radar', oldValue);
            //
            //
            //   Object.keys(JSON.parse(newValue).value).map(function (key) {
            //
            //     // console.log("key",key)
            //     // console.log("value",JSON.parse(newValue).value[key])
            //     $scope.localLabel.push(key)
            //     $scope.localData.push(JSON.parse(newValue).value[key])
            //     // return JSON.parse(newValue).value[key]
            //   });
            //
            //   console.log("keys",Object.keys(JSON.parse(newValue).value));
            //   console.log("values",Object.values(JSON.parse(newValue).value));
            console.log
            localLabel = Object.keys(JSON.parse(newValue).value);
            localData = Object.values(JSON.parse(newValue).value);

            console.log("keys", localLabel);
            console.log("values", localData);
            //
            updateData();
          });


          function updateData() {


            // if (localData.length == 9) {

            // console.log("now data"+$scope.now,$scope.localData)
            // console.log("now labels"+$scope.now,$scope.localLabel)

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


              var id = "radar-chart-component" + "-" + scope.now;
              console.log('id', id)
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

