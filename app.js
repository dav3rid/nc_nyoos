const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');
const {
  routeNotFound,
  handleSQLErrors,
  handleCustomErrors,
  handle500,
} = require('./errors');

console.log(process.platform, '<< platform');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/api', apiRouter);

app.get('/api/hello', (req, res, next) => {
  res.status(200).send({ msg: 'Brand new message!' });
});

app.all('/*', routeNotFound);

app.use(handleSQLErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
