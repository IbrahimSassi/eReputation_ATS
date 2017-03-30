/**
 * Created by ninou on 3/29/2017.
 */

/***
 *  CHART 1
 */

google.charts.load('current', {'packages':['corechart','bar']});



function drawStacked() {
  var data = google.visualization.arrayToDataTable([
    ['Genre',  'Positive', 'Neutral', 'Negative', { role: 'annotation' } ],
    ['03/30/2017', 10, 24, 20, ''],
    ['03/29/2017', 16, 22, 43,''],
    ['03/28/2017', 28, 19, 29, '']
  ]);

  var options = {
    title: 'Overview about How people reacts between 3/28/2017 and 3/30/2017',
    colors: ['#04B404', '#F7FE2E','#DF0101' ],
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
    ['positive',     11],
    ['neutral',      82],
    ['negative',  42]
  ]);

  var options = {
    title: 'overall mentions ',
    colors: ['#04B404', '#F7FE2E','#DF0101' ],
    pieHole: 0.4,

  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
}


function drawVisualization() {
  // Some raw data (not necessarily accurate)
  var data = google.visualization.arrayToDataTable([
    ['Month', 'Positive', 'Neutral', 'Negative', 'Average'],
    ['2017/05',  165,      938,         522,             614.6],
    ['2017/06',  135,      1120,        599,             682],
    ['2017/07',  157,      1167,        587,             623],
    ['2017/08',  139,      1110,        615,             609.4],
    ['2017/09',  136,      691,         629,             569.6]
  ]);

  var options = {
    title : 'Number of Tweets by Time and sentiment',
    colors: ['#04B404', '#F7FE2E','#DF0101','#0404B4' ],
    vAxis: {title: 'Motions'},
    hAxis: {title: 'Month'},
    seriesType: 'bars',
    series: {3: {type: 'line'}}
  };

  var chart = new google.visualization.ComboChart(document.getElementById('chart_div3'));
  chart.draw(data, options);
}






google.charts.setOnLoadCallback(
  function() { // Anonymous function that calls drawChart1 and drawChart2
    drawVisualization();
    donutChart();
    drawStacked();



  });
