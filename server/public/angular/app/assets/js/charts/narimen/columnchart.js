/**
 * Created by ninou on 3/29/2017.
 */

/***
 *  CHART 1
 */

google.charts.load('current', {'packages':['corechart','bar']});



function drawStacked() {
  var data = google.visualization.arrayToDataTable([
    ['Genre',  'Positive', 'Negative', 'Neutal', { role: 'annotation' } ],
    ['03/30/2017', 10, 24, 20, ''],
    ['03/29/2017', 16, 22, 43,''],
    ['03/28/2017', 28, 19, 29, '']
  ]);

  var options = {
    title: 'Overview about How people reacts between 3/28/2017 and 3/30/2017',
    chartArea: {width: '50%'},
    isStacked: 'percent',
    height: 300,
    legend: {position: 'top', maxLines: 3},
    hAxis: {
      minValue: 0,
      ticks: [0, .3, .6, .9, 1]
    }
  };


  var chart = new google.visualization.BarChart(document.getElementById('stacked_chart_div'));
  chart.draw(data, options);
}


function donutChart() {
  var data = google.visualization.arrayToDataTable([
    ['Etat', 'percent'],
    ['instagram',     11],
    ['facebook',      82],
    ['mosaique',  42],
    ['Blog',  18],
    ['tweeter',  32]
  ]);

  var options = {
    title: 'overall mentions | Publications by Media',
    pieHole: 0.4,

  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}



google.charts.setOnLoadCallback(
  function() { // Anonymous function that calls drawChart1 and drawChart2
    donutChart();
    drawStacked();



  });
