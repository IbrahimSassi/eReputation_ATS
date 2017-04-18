/**
 * Created by HP on 25/03/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("donutChart", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          myTitle:'@myTitle',
          positive: '@positive',
          negative: '@negative',
          neutral: '@neutral',
        },
        templateUrl: 'angular/app/components/googleCharts/donutChart.template.html',
        link: function (scope, elem, attrs) {
          scope.$watchGroup(['positive','neutral','negative','myTitle','myId'], function (newValue, oldValue) {
            //This gets called when data changes.

            setTimeout(function () {
              google.charts.load('current', {'packages': ['corechart', 'bar']});
              function donutChart() {

                var data = google.visualization.arrayToDataTable([
                  ['Etat', 'percent'],
                  ['positive', parseFloat(newValue[0])],
                  ['neutral', parseFloat(newValue[1])],
                  ['negative', parseFloat(newValue[2])]
                ]);

                var options = {
                  title: newValue[3],
                  colors: ['#46BFBD', '#FDB45C', '#F7464A'],
                  pieHole: 0.4,
                  'width': 500,
                  'height': 300,
                  // backgroundColor: {fill: 'transparent'}
                };

                var chart = new google.visualization.PieChart(document.getElementById('donutchart' + newValue[4]));
                chart.draw(data, options);
              }

              google.charts.setOnLoadCallback(
                function () { // Anonymous function that calls drawChart1 and drawChart2
                  donutChart();

                });

            }, 0);
          });

        }

      };
    });

})(angular);

