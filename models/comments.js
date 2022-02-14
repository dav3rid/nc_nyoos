const db = require('../db/connection');
const { checkIfArticleExists } = require('./articles');

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query('SELECT * FROM comments WHERE article_id = $1', [article_id])
    .then(({ rows }) => {
      const values = [rows];
      if (!rows.length) {
        values.push(checkIfArticleExists(article_id));
      }
      return Promise.all(values);
    })
    .then(([rows]) => rows);
};
