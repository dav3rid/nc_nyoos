const request = require('supertest');
const app = require('../app');
const testData = require('../db/data');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('app', () => {
  describe('/api/topics', () => {
    describe('GET', () => {
      test('status: 200 - responds with an array of topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe('/api/articles', () => {
    describe('GET', () => {
      test('status: 200 - responds with an array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test('status: 200 - articles sorted by created_at descening by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at', { descending: true });
          });
      });
      test('status: 200 - each article contains a comment_count property', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(typeof article.comment_count).toBe('number');
            });
          });
      });
    });
  });
  describe('/api/articles/:article_id', () => {
    describe('GET', () => {
      test('status: 200 - responds with an article object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
              })
            );
          });
      });
      test('status: 200 - article includes a comment_count property', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(11);
          });
      });
      test('status: 200 - accounts for no comments associated with article', () => {
        return request(app)
          .get('/api/articles/2')
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(0);
          });
      });
      test('status: 404 - valid but non existent article_id', () => {
        return request(app)
          .get('/api/articles/99999')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Article not found');
          });
      });
      test('status: 400 - invalid article_id', () => {
        return request(app)
          .get('/api/articles/pigeons')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
    });
    describe('PATCH', () => {
      test('status: 200 - responds with the updated article - increment', () => {
        const requestBody = { inc_votes: 5 };
        return request(app)
          .patch('/api/articles/1')
          .send(requestBody)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 105,
              })
            );
          });
      });
      test('status: 200 - responds with the updated article - 0', () => {
        const requestBody = { inc_votes: 0 };
        return request(app)
          .patch('/api/articles/3')
          .send(requestBody)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
              })
            );
          });
      });
      test('status: 200 - responds with the updated article - decrement', () => {
        const requestBody = { inc_votes: -10 };
        return request(app)
          .patch('/api/articles/2')
          .send(requestBody)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 2,
                title: 'Sony Vaio; or, The Laptop',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                created_at: '2020-10-16T05:03:00.000Z',
                votes: -10,
              })
            );
          });
      });
      test('status: 404 - valid but non existent article_id', () => {
        const requestBody = { inc_votes: 5 };
        return request(app)
          .patch('/api/articles/999999')
          .send(requestBody)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Article not found');
          });
      });
      test('status: 400 - invalid article_id', () => {
        const requestBody = { inc_votes: 5 };
        return request(app)
          .patch('/api/articles/pigeons')
          .send(requestBody)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
      test('status: 400 - missing inc_votes key on request body', () => {
        const requestBody = { pigeons: 5 };
        return request(app)
          .patch('/api/articles/1')
          .send(requestBody)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
      test('status: 400 - invalid inc_votes key on request body', () => {
        const requestBody = { inc_votes: 'pigeons' };
        return request(app)
          .patch('/api/articles/1')
          .send(requestBody)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
    });
  });
  describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
      test('status: 200 - responds with an array of comments for the specified article_id', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  author: expect.any(String),
                  article_id: 1,
                  created_at: expect.any(String),
                })
              );
            });
          });
      });
      test('status: 200 - accounts for no comments associated with specified article_id', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });
      test('status: 404 - valid but non existent article_id', () => {
        return request(app)
          .get('/api/articles/9999999/comments')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Article not found');
          });
      });
      test('status: 400 - invalid article_id', () => {
        return request(app)
          .get('/api/articles/pigeons/comments')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
    });
  });
  describe('/api/users', () => {
    describe('GET', () => {
      test('status: 200 - responds with an array of user objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
          });
      });
    });
  });

  test('status: 404 - path not found', () => {
    return request(app)
      .get('/api/random')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Path not found');
      });
  });
});
