/**
 * Created by Ibrahim on 12/04/2017.
 */

(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("columnChart", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          myTable: '@myTable',
          title: '@title',
          hAxis: "@hAxis"
        },
        templateUrl: 'angular/app/components/googleCharts/ColumnChart/columnChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['bar']});
            // google.charts.setOnLoadCallback(drawChart);

            var LocalData = JSON.parse(scope.myTable);

            function drawChart() {
              var data = google.visualization.arrayToDataTable(
                JSON.parse(scope.myTable)
              );

              var options = {
                chart: {
                  title: scope.title,
                },
                colors: ['#2ecc71', '#e74c3c', '#f1c40f', '#95a5a6'],
                backgroundColor: {fill: '#e74c3c'}

              };

              var chart = new google.charts.Bar(document.getElementById('columnChart' + scope.myId));

              chart.draw(data, options);


            }

            if (LocalData && LocalData.length > 1) {
              google.charts.setOnLoadCallback(
                function () { // Anonymous function that calls drawChart1 and drawChart2
                  drawChart();

                });

              scope.$watch('myTable', function (newValue, oldValue) {
                drawChart();
              });

            }


          }, 0);

        }

      };
    });

})(angular);

