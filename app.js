const Influx = require('influx');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const hanalei = require('./data/tides-hanalei.js');
const hilo = require('./data/tides-hilo.js');
const honolulu = require('./data/tides-honolulu.js');
const kahului = require('./data/tides-kahului.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', 3000);

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'ocean_tides',
  schema: [
    {
      measurement: 'tide',
      fields: { height: Influx.FieldType.FLOAT },
      tags: ['unit', 'location']
    }
  ]
});

const writeDataToInflux = (locationObj) => {
  locationObj.rawtide.rawTideObs.forEach(tidePoint => {
    influx.writePoints([
      {
        measurement: 'tide',
        tags: {
          unit: locationObj.rawtide.tideInfo[0].units,
          location: locationObj.rawtide.tideInfo[0].tideSite,
        },
        fields: { height: tidePoint.height },
        timestamp: tidePoint.epoch,
      }
    ], {
      database: 'ocean_tides',
      precision: 's',
    })
    .catch(error => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`)
    });
  });
}

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('ocean_tides')) {
      return influx.createDatabase('ocean_tides');
    }
  })
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`Listening on ${app.get('port')}.`);
    });
    writeDataToInflux(hanalei);
    writeDataToInflux(hilo);
    writeDataToInflux(honolulu);
    writeDataToInflux(kahului);
  })
  .catch(error => console.log({ error }));

app.get('/api/v1/tide/:place', (request, response) => {
  const { place } = request.params;
  influx.query(`
    select * from tide
    where location =~ /(?i)(${place})/
  `)
  .then(result => response.status(200).json(result))
  .catch(error => response.status(500).json({ error }));
});
