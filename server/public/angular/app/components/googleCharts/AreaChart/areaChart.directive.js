/**
 * Created by Ibrahim on 11/04/2017.
 */
/**
 * Created by ninou on 4/6/2017.
 */



(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("areaChart", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          myTable:'@myTable'
        },
        templateUrl: 'angular/app/components/googleCharts/AreaChart/areaChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['corechart']});



            function drawChart() {
              var data = google.visualization.arrayToDataTable(JSON.parse(scope.myTable));

              var options = {
                title: 'Company Performance',
                hAxis: {title: 'Year', titleTextStyle: {color: '#333'}},
                vAxis: {minValue: 0}
              };

              var chart = new google.visualization.AreaChart(document.getElementById('areaChart' + scope.myId));
              chart.draw(data, options);
            }

            google.charts.setOnLoadCallback(
              function () { // Anonymous function that calls drawChart1 and drawChart2
                drawChart();

              });

          }, 0);

        }

      };
    });

})(angular);

