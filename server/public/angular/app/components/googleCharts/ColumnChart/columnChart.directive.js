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
            var LocalData = JSON.parse(scope.myTable);
            if (LocalData && LocalData.length > 1) {
              google.charts.setOnLoadCallback(drawChart);

              scope.$watch('myTable', function (newValue, oldValue) {
                google.charts.setOnLoadCallback(drawChart);
              });

            }


            function drawChart() {
              var data = google.visualization.arrayToDataTable(
                JSON.parse(scope.myTable)
              );

              var options = {
                chart: {
                  title: scope.title,
                },
                bars: 'vertical',
                hAxis: {
                  format: 'decimal'
                },
                colors: ['#2ecc71', '#e74c3c', '#f1c40f', '#95a5a6'],

              };

              var chart = new google.charts.Bar(document.getElementById('columnChart' + scope.myId));

              chart.draw(data, google.charts.Bar.convertOptions(options));


            }




          }, 0);

        }

      };
    });

})(angular);

