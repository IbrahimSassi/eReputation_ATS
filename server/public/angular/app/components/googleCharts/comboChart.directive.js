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

                  title: '@title',
                  myTable: '@myTable'

                },
                templateUrl: 'angular/app/components/googleCharts/comboChart.template.html',
                link: function (scope, elem, attrs) {
                  scope.$watchGroup(['title','myTable'], function (newValue, oldValue) {
                    setTimeout(function () {
                      google.charts.load('current', {'packages': ['corechart', 'bar']});
                      var LocalData = JSON.parse(newValue[1]);

                      function drawVisualization() {
                        if (LocalData)
                        // Some raw data (not necessarily accurate)
                          var data = google.visualization.arrayToDataTable(
                            LocalData
                            /*  [
                             ['Month', 'Positive', 'Neutral', 'Negative', 'Average'],
                             [moment().add(-4, 'days').format('DD/MM/YYYY'), parseFloat(scope.oooldPositive), parseFloat(scope.oooldNeutral), parseFloat(scope.oooldNegative), parseFloat(scope.oooldAvg)],
                             [moment().add(-3, 'days').format('DD/MM/YYYY'), parseFloat(scope.ooldPositive), parseFloat(scope.ooldNeutral), parseFloat(scope.ooldNegative), parseFloat(scope.ooldAvg)],
                             [moment().add(-2, 'days').format('DD/MM/YYYY'), parseFloat(scope.oldPositive), parseFloat(scope.oldNeutral), parseFloat(scope.oldNegative), parseFloat(scope.oldAvg)],
                             [moment().add(-1, 'days').format('DD/MM/YYYY'), parseFloat(scope.yesPositive), parseFloat(scope.yesNeutral), parseFloat(scope.yesNegative), parseFloat(scope.yesAvg)],
                             [moment().format('DD/MM/YYYY'), parseFloat(scope.nowPositive), parseFloat(scope.nowNeutral), parseFloat(scope.nowNegative), parseFloat(scope.nowAvg)]
                             ]*/
                          );

                        var options = {
                          title: newValue[0],

                          /* titleTextStyle: {
                           color: '#848484',    // any HTML string color ('red', '#cc00cc')
                           fontName: 'Arial Black', // i.e. 'Times New Roman'
                           fontSize: 22, // 12, 18 whatever you want (don't specify px)
                           // bold: true,    // true or false
                           // italic: true   // true of false
                           },*/
                          colors: ['#46BFBD', '#F7464A', '#FDB45C', '#BF00FF'],
                          vAxis: {title: 'Motions'},
                          hAxis: {title: 'Days'},
                          seriesType: 'bars',
                          series: {3: {type: 'line'}},
                          // backgroundColor: {fill: 'transparent'},
                          height: 300
                        };

                        var chart = new google.visualization.ComboChart(document.getElementById('combochart' + scope.myId));
                        chart.draw(data, options);
                      }

                      google.charts.setOnLoadCallback(
                        function () { // Anonymous function that calls drawChart1 and drawChart2
                          drawVisualization();

                        });
                      scope.$watch('myTable', function (newValue, oldValue) {
                        drawVisualization();
                      });

                    }, 0);
                  });
                }

            };
        });

})(angular);
