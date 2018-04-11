const Influx = require('influx');
const http = require('http');
const express = require('express');
const path = require('path');
const os = require('os');
const bodyParser = require('body-parser');
const apiKey = require('./key.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', 3000);

const options = {
  host: 'api.wunderground.com',
  port: 80,
  path: `/api/${apiKey}/tide/q/HI/Hanalei.json`,
};

http.get(options, (res) => {
  console.log("Got response: " + res.statusCode);
}).on('error', (e) => {
  console.log("Got error: " + e.message);
});

app.get('/', (request, response) => {
  response.send('Hello world!');
});

app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}.`);
});
