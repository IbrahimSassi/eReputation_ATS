Highcharts.chart('container', {

  chart: {
    type: 'bubble',
    plotBorderWidth: 1,
    zoomType: 'xy'
  },

  legend: {
    enabled: false
  },

  title: {
    text: 'Density of each keyword'
  },

  subtitle: {
    text: 'Source: Digital Reputation'
  },

  xAxis: {
    gridLineWidth: 1,
    title: {
      text: 'Keywords Apparition'
    },
    labels: {
      format: '{value} K'
    },
    plotLines: [{
      color: 'black',
      dashStyle: 'dot',
      width: 2,
      value: 65,
      label: {
        rotation: 0,
        y: 15,
        style: {
          fontStyle: 'italic'
        },
        text: 'Channels Apparition'
      },
      zIndex: 3
    }]
  },

  yAxis: {
    startOnTick: false,
    endOnTick: false,
    title: {
      text: 'Channels Apparition'
    },
    labels: {
      format: '{value} .'
    },
    maxPadding: 0.2,
    plotLines: [{
      color: 'black',
      dashStyle: 'dot',
      width: 2,
      value: 50,
      label: {
        align: 'right',
        style: {
          fontStyle: 'italic'
        },
        text: 'Channels Apparition',
        x: -10
      },
      zIndex: 3
    }]
  },

  tooltip: {
    useHTML: true,
    headerFormat: '<table>',
    pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
    '<tr><th>Keyword Apparition:</th><td>{point.x}K</td></tr>' +
    '<tr><th>Channels Apparition:</th><td>{point.y}.</td></tr>' +
    '<tr><th>Importance:</th><td>{point.z}%</td></tr>',
    footerFormat: '</table>',
    followPointer: true
  },

  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    }
  },

  series: [{
    data: [
      {x: 95, y: 30, z: 30, name: 'iphone 6', country: 'iphone 6'},
      {x: 86, y: 102, z:60 , name: 'iphone 6 price', country: 'iphone 6 price'},
      {x: 80, y: 20, z:10 , name: 'iphone 6 battery', country: 'iphone 6 battery'}

    ]
  }]

});
