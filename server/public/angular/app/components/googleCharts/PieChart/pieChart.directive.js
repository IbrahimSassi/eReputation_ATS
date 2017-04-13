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

            function drawChart() {
              if (LocalData)
                var data = google.visualization.arrayToDataTable(
                  JSON.parse(scope.myTable)
                );

              var options = {
                title: scope.title,
                colors:["#00897b","#b71c1c","#ff9800"],
                height :scope.height,
                width :scope.width,
              };

              var chart = new google.visualization.PieChart(document.getElementById('piechart' + scope.myId));

              chart.draw(data, options);

              function selectHandler() {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                  var value = data.getValue(selectedItem.row, selectedItem.column);
                  alert('The user selected ' + value);
                }
              }

              // Listen for the 'select' event, and call my function selectHandler() when
              // the user selects something on the chart.
              google.visualization.events.addListener(chart, 'select', selectHandler);


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

