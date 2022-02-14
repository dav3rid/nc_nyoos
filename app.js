const express = require('express');
const { getArticleById, patchArticleById } = require('./controllers/articles');
const { getTopics } = require('./controllers/topics');
const {
  handle404s,
  handle500s,
  handleCustomErrors,
  handlePSQLErrors,
} = require('./errors');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.all('/*', handle404s);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);

module.exports = app;
