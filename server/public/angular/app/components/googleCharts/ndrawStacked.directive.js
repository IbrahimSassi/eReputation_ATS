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
          positive: '@positive',
          negative: '@negative',
          neutral: '@neutral',
        },
        templateUrl: 'angular/app/components/googleCharts/ndrawStacked.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['corechart', 'bar']});
            function drawStacked() {
              var data = google.visualization.arrayToDataTable([
                ['Genre',  'Positive', 'Neutral', 'Negative', { role: 'annotation' } ],
                ['03/30/2017', 10, 24, 20, ''],
                ['03/29/2017', 16, 22, 43,''],
                ['03/28/2017', 28, 19, 29, '']
              ]);

              var options = {
                title: 'Overview about How people reacts between 3/28/2017 and 3/30/2017',
                colors: ['#0B3B0B', '#AEB404','#8A0808' ],
                chartArea: {width: '50%'},
                isStacked: 'percent',
                height: 300,
                legend: {position: 'top', maxLines: 3},
                hAxis: {
                  minValue: 0,
                  ticks: [0, .3, .6, .9, 1]
                }
              };


              var chart = new google.visualization.BarChart(document.getElementById('stacked_chart_div'+ scope.myId));
              chart.draw(data, options);
            }

            google.charts.setOnLoadCallback(
              function () { // Anonymous function that calls drawChart1 and drawChart2
                ndrawStacked();

              });

          }, 0);

        }

      };
    });

})(angular);

