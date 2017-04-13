/**
 * Created by ninou on 4/6/2017.
 */



(function () {
    'use strict';

    angular
        .module('ATSApp.campaign')
        .directive("ndrawStacked", function () {
            return {
                restrict: 'EA',
                scope: {
                    myId: '@myId',
                   /* nowPositive: '@nowPositive',
                    nowNegative: '@nowNegative',
                    nowNeutral: '@nowNeutral',
                    yesPositive: '@yesPositive',
                    yesNegative: '@yesNegative',
                    yesNeutral: '@yesNeutral',
                    oldPositive: '@oldPositive',
                    oldNegative: '@oldNegative',
                    oldNeutral: '@oldNeutral',*/
                     myTable: '@myTable'
                },
                templateUrl: 'angular/app/components/googleCharts/ndrawStacked.template.html',
                link: function (scope, elem, attrs) {
                    setTimeout(function () {
                        google.charts.load('current', {'packages': ['corechart', 'bar']});
                          var LocalData = JSON.parse(scope.myTable);
                      // var LocalData = [["date","positive","negative","neutre"],["2017-04-07",12,78,80],["2017-04-12",12,78,80]]
                        function drawStacked() {
                          if (LocalData)

                            var data = google.visualization.arrayToDataTable(
                             // [
                               // ['Genre',  'Positive', 'Neutral', 'Negative', { role: 'annotation' } ],
                               // [moment().format('DD/MM/YYYY'), parseFloat(scope.nowPositive), parseFloat(scope.nowNeutral), parseFloat(scope.nowNegative), ''],
                               // [moment().add(-1,'days').format('DD/MM/YYYY'),parseFloat(scope.yesPositive), parseFloat(scope.yesNeutral), parseFloat(scope.yesNegative),''],
                               // [moment().add(-2,'days').format('DD/MM/YYYY'), parseFloat(scope.oldPositive), parseFloat(scope.oldNeutral), parseFloat(scope.oldNegative), ''],
                                //   [moment().add(-3,'days').format('DD/MM/YYYY'), parseFloat(scope.nowPositive), parseFloat(scope.nowNeutral), parseFloat(scope.nowNegative), '']

                           // ]
                              LocalData
                            );

                            var options = {
                                title: 'Overview about How people reacts for this compaign ',
                                colors: ['#46BFBD', '#F7464A', '#FDB45C'],
                                chartArea: {width: '50%'},
                                isStacked: 'percent',
                                height: 300,
                                legend: {position: 'top', maxLines: 3},
                                hAxis: {
                                    minValue: 0,
                                    ticks: [0, .3, .6, .9, 1]
                                },
                                backgroundColor: { fill:'transparent' }
                            };


                            var chart = new google.visualization.BarChart(document.getElementById('ndrawChart'+ scope.myId));
                            chart.draw(data, options);
                        }

                        google.charts.setOnLoadCallback(
                            function () { // Anonymous function that calls drawChart1 and drawChart2
                                drawStacked();

                            });
                      scope.$watch('myTable', function (newValue, oldValue) {
                        drawStacked();
                      });

                    }, 0);

                }

            };
        });

})(angular);
