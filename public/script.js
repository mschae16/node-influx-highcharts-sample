$(function () {
    var myChart = Highcharts.chart('container', {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Hawaii Ocean Tides'
        },
        xAxis: {
          title: {
            text: 'Time'
          }
        },
        yAxis: {
          title: {
            text: 'Height (ft)'
          }
        },
        series: [
          {
            name: 'Hanalei',
            data: [{x:0,y:1},{x:1, y:0},{x:2,y:4},{x:3,y:6}]
          },
          {
            name: 'Hilo',
            data: [{x:0,y:3},{x:1,y:2},{x:2,y:5},{x:3,y:10}]
          },
        ]
    });
});

const fetchAll = (place, appendMethod) => {
  fetch(`/api/v1/tide/${place}`)
    .then( res => {
      if (res.status !== 200) {
        console.log(res);
      }
      return res;
    })
    .then( res => res.json() )
    .then( parsedRes => {
      return parsedRes.map( object => appendMethod(object) )
    })
    .catch( error => console.log(error) );
}
