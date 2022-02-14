const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return article;
    });
};

exports.updateArticleById = (article_id, votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
  `,
      [article_id, votes]
    )
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return article;
    });
};
