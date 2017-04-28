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
          myTable: '@myTable',
          title: '@title',
          hAxis: "@hAxis"
        },
        templateUrl: 'angular/app/components/googleCharts/AreaChart/areaChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['corechart']});


            var LocalData = JSON.parse(scope.myTable);

            function drawChart() {

                var data = google.visualization.arrayToDataTable(JSON.parse(scope.myTable));

                var options = {
                  title: scope.title,
                  hAxis: {title: scope.hAxis, titleTextStyle: {color: '#333'}},
                  vAxis: {minValue: 0},
                  // "backgroundColor": "#eeeeee"

                };

                var chart = new google.visualization.AreaChart(document.getElementById('areaChart' + scope.myId));
                chart.draw(data, options);

            }

            if (LocalData && LocalData.length > 1) {
              google.charts.setOnLoadCallback(
                function () { // Anonymous function that calls drawChart1 and drawChart2
                  drawChart();
                });

            }

            scope.$watch('myTable', function (newValue, oldValue) {
              drawChart();
            });




          }, 0);

        }

      };
    });

})(angular);

