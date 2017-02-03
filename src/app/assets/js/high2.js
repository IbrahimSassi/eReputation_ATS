
Highcharts.chart({
  colors: ['#e74c3c','#95a5a6','#2ecc71'],
  chart: {
    renderTo: 'npn',
    type: 'column'
  },
  title: {
    text: 'Positive Negative Neutral Messages'
  },
  xAxis: {
    categories: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May']
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Total Message Analysed'
    },
    stackLabels: {
      enabled: true,
      style: {
        fontWeight: 'bold',
        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
      }
    }
  },
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
      }
    }
  },
  series: [{
    name: 'Positive',
    data: [9, 8, 9, 2, 6]
  }, {
    name: 'Neutral',
    data: [1, 1, 2, 1, 2]
  }, {
    name: 'Negative',
    data: [2, 2, 1, 8, 4]
  }]
});
