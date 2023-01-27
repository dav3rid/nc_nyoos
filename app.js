const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const {
  routeNotFound,
  handleSQLErrors,
  handleCustomErrors,
  handle500
} = require('./errors');

const app = express();
app.use(express.json());

app.get('/api/hello', (req, res, next) => {
  console.log(req);
  console.log(req.body);
  console.log(req.headers);
  res.status(200).send({ msg: 'Hello everyone!' });
});

console.log(process.platform, '<< platform');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handleSQLErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
