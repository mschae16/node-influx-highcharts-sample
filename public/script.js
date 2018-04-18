const fetchData = (place) => {
  return fetch(`/api/v1/tide/${place}`)
    .then(res => {
      if (res.status !== 200) {
        console.log(res);
      }
      return res;
    })
    .then(res => res.json())
    .catch(error => console.log(error));
}

const fetchAllLocations = () => {
  return Promise.all([
            fetchData('hilo'),
            fetchData('hanalei'),
            fetchData('honolulu'),
            fetchData('kahului')
          ])
          .then(parsedRes => {
            if (parsedRes.length) {
              const mutatedArray = parsedRes.map( arr => {
                return Object.assign({}, {
                  name: arr[0].location,
                  data: arr.map( obj => Object.assign({}, {
                    x: (moment(obj.time).unix())*1000,
                    y:obj.height
                  }))
                });
              });

              const myChart = Highcharts.chart('container', {
                chart: {
                  backgroundColor: {
                      linearGradient: [0, 350, 0, 0],
                      stops: [
                        [0, 'rgb(110, 234, 234)'],
                        [1, 'rgb(255, 255, 255)']
                      ]
                  },
                  type: 'spline'
                },
                title: {
                  text: 'Hawaii Ocean Tides'
                },
                xAxis: {
                  type: 'datetime'
                },
                yAxis: {
                  title: {
                    text: 'Height (ft)'
                  }
                },
                plotOptions: {
                  series: {
                    turboThreshold: 2000,
                  }
                },
                series: mutatedArray
              });
            }
            return;
          });

};

fetchAllLocations();
