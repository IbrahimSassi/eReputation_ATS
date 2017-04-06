/**
 * Created by ninou on 4/6/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("comboChart", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          positive: '@positive',
          negative: '@negative',
          neutral: '@neutral',
        },
        templateUrl: 'angular/app/components/googleCharts/comboChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['corechart', 'bar']});
            function drawVisualization() {
              // Some raw data (not necessarily accurate)
              var data = google.visualization.arrayToDataTable([
                ['Month', 'Positive', 'Neutral', 'Negative', 'Average'],
                ['2017/05',  165,      938,         522,             614.6],
                ['2017/06',  135,      1120,        599,             682],
                ['2017/07',  157,      1167,        587,             623],
                ['2017/08',  139,      1110,        615,             609.4],
                ['2017/09',  136,      691,         629,             569.6]
              ]);

              var options = {
                title : 'Number of Tweets by Time and sentiment',
                colors: ['#04B404', '#FE9F0C','#DF0101','#0404B4' ],
                vAxis: {title: 'Motions'},
                hAxis: {title: 'Month'},
                seriesType: 'bars',
                series: {3: {type: 'line'}}
              };

              var chart = new google.visualization.ComboChart(document.getElementById('combochart'+ scope.myId));
              chart.draw(data, options);
            }

            google.charts.setOnLoadCallback(
              function () { // Anonymous function that calls drawChart1 and drawChart2
                drawVisualization();

              });

          }, 0);

        }

      };
    });

})(angular);
