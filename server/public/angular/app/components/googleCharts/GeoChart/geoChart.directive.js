/**
 * Created by Ibrahim on 12/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('ATSApp.campaign')
    .directive("geoChart", function () {
      return {
        restrict: 'EA',
        scope: {
          myId: '@myId',
          myTable: '@myTable',
          title: '@title'
        },
        templateUrl: 'angular/app/components/googleCharts/GeoChart/geoChart.template.html',
        link: function (scope, elem, attrs) {
          setTimeout(function () {
            google.charts.load('current', {'packages': ['geochart']});


            function drawChart() {
              var data = google.visualization.arrayToDataTable(
                JSON.parse(scope.myTable)
                // [
                //   ['Country', 'Popularity'],
                //   ['Germany', 200],
                //   ['United States', 300],
                //   ['Brazil', 400],
                //   ['Canada', 500],
                //   ['France', 600],
                //   ['RU', 700]
                // ]
              );

              var options = {
                title: scope.title
                // colors: ['#2ecc71', '#e74c3c', '#f1c40f', '#95a5a6'],
                // backgroundColor: {fill: '#e74c3c'}
              };

              var chart = new google.visualization.GeoChart(document.getElementById('regions-chart' + scope.myId));

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

