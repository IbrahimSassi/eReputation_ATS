/**
 * Created by Ibrahim on 12/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("pieChart", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          myTable: '@myTable',
          title: '@title',
          hAxis: "@hAxis"
        },
        templateUrl: 'angular/app/components/googleCharts/PieChart/pieChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages':['corechart']});

            var LocalData = JSON.parse(scope.myTable);

            function drawChart() {
              if (LocalData)
                var data = google.visualization.arrayToDataTable(
                  JSON.parse(scope.myTable)
                );

              var options = {
                title: scope.title,
              };

              var chart = new google.visualization.PieChart(document.getElementById('piechart'+scope.myId));

              chart.draw(data, options);
            }

            google.charts.setOnLoadCallback(
              function () { // Anonymous function that calls drawChart1 and drawChart2
                drawChart();

              });

            scope.$watch('myTable', function (newValue, oldValue) {
              drawChart();
            });


          }, 0);

        }

      };
    });

})(angular);

