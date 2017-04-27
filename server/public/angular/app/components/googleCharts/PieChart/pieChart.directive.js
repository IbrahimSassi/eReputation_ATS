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
          hAxis: "@hAxis",
          height: "@height",
          width: "@width"
        },
        templateUrl: 'angular/app/components/googleCharts/PieChart/pieChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['corechart']});

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
                title: scope.title,
                colors: ["#00897b", "#b71c1c", "#ff9800","#2980b9"],
                height: scope.height,
                width: scope.width
              };

              var chart = new google.visualization.PieChart(document.getElementById('piechart' + scope.myId));

              chart.draw(data, options);


            }

          }, 0);

        }

      };
    });

})(angular);

