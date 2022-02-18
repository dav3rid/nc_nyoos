const express = require('express');
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require('./controllers/articles');
const { getCommentsByArticleId } = require('./controllers/comments');
const { getTopics } = require('./controllers/topics');
const { getUsers } = require('./controllers/users');
const {
  handle404s,
  handle500s,
  handleCustomErrors,
  handlePSQLErrors,
} = require('./errors');

const app = express();

app.use(express.json());

app.get('/greeting', (req, res, next) => {
  res.status(200).send({ msg: 'Hello everyone!' });
});

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/users', getUsers);

app.all('/*', handle404s);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);

module.exports = app;
