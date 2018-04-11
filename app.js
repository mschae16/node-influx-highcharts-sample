const Influx = require('node-influx');
const express = require('express');
const path = require('path');
const os = require('os');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', 3000);

app.get('/', (request, response) => {
  response.send('Hello world!');
});

app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}.`);
});
