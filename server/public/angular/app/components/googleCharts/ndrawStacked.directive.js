/**
 * Created by ninou on 4/6/2017.
 */



(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("ndrawStacked", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          myTable: '@myTable',
          myTitle: '@myTitle',

        },
        templateUrl: 'angular/app/components/googleCharts/ndrawStacked.template.html',
        link: function (scope, elem, attrs) {
          scope.$watchGroup(['myTitle','myTable'], function (newValue, oldValue) {
            setTimeout(function () {
              google.charts.load('current', {'packages': ['corechart', 'bar']});
              var LocalData = JSON.parse(newValue[1]);
              function drawStacked() {

                var data = google.visualization.arrayToDataTable(

                  LocalData
                );

                var options = {
                  title: scope.myTitle == undefined ? 'Overview about How people reacts for this compaign' : newValue[0],
                  colors: ['#46BFBD', '#F7464A', '#FDB45C'],
                  chartArea: {width: '50%'},
                  isStacked: 'percent',
                  height: 300,
                  legend: {position: 'top', maxLines: 3},
                  hAxis: {
                    minValue: 0,
                    ticks: [0, .3, .6, .9, 1]
                  },

                };


                var chart = new google.visualization.BarChart(document.getElementById('ndrawChart' + scope.myId));
                chart.draw(data, options);
              }

              google.charts.setOnLoadCallback(
                function () { // Anonymous function that calls drawChart1 and drawChart2
                  drawStacked();

                });
              scope.$watch('myTable', function (newValue, oldValue) {
                drawStacked();
              });

            }, 0);
          });

        }

      };
    });

})(angular);
