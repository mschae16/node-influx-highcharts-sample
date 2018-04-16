const fetchData = (place) => {
  return fetch(`/api/v1/tide/${place}`)
    .then( res => {
      if (res.status !== 200) {
        console.log(res);
      }
      return res;
    })
    .then( res => res.json() )
    .catch( error => console.log(error) );
}


Promise.all([
  fetchData('hilo'),
  fetchData('hanalei'),
  fetchData('honolulu'),
  fetchData('kahului')
])
  .then(parsedRes => {
    console.log({ parsedRes });
    if (parsedRes.length) {
      const mutatedArray = parsedRes.map( arr => {
        return Object.assign({}, {
          name: arr[0].location,
          data: arr.map( obj => Object.assign({}, {x:moment(obj.time).unix(), y:obj.height}))
        });
      });

      const myChart = Highcharts.chart('container', {
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
          series: mutatedArray
      });
    }
    return;
  });
