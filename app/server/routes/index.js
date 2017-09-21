const Router = require('koa-router');
const topic = require('../controllers/topic');
const keyword = require('../controllers/keyword');
const source = require('../controllers/source');

const router = new Router({ prefix: '/api' });

router
  .get('/topics', topic.getAll)
  .get('/topics/:id', topic.getOne)
  .get('/keywords', keyword.getAll)
  .get('/sources', source.getAll);

module.exports = router;
