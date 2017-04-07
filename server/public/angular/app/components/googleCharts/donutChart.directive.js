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
          positive: '@positive',
          negative: '@negative',
          neutral: '@neutral',
        },
        templateUrl: 'angular/app/components/googleCharts/donutChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['corechart', 'bar']});
            function donutChart() {
              var data = google.visualization.arrayToDataTable([
                ['Etat', 'percent'],
                ['positive', parseFloat(scope.positive)],
                ['neutral', parseFloat(scope.neutral)],
                ['negative', parseFloat(scope.negative)]
              ]);

              var options = {
                title: '',
                colors: ['#04B404', '#FE9F0C', '#DF0101'],
                pieHole: 0.4,

              };

              var chart = new google.visualization.PieChart(document.getElementById('donutchart' + scope.myId));
              chart.draw(data, options);
            }

            google.charts.setOnLoadCallback(
              function () { // Anonymous function that calls drawChart1 and drawChart2
                donutChart();

              });

          }, 0);

        }

      };
    });

})(angular);

