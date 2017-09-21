const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const responseParser = require('./middlewares/response-parser');
const jobs = require('./jobs');
const database = require('./database');
const config = require('../config');
const router = require('./routes');

const api = new Koa();
api.use(logger());
api.use(bodyParser());
api.use(router.routes());
api.use(responseParser());

(async () => {
  try {
    const db = await database.connect(config.MONGODB_URI);
    console.log(`Connected to database ${db.host}:${db.port}/${db.name}`);
  } catch (error) {
    console.log(error);
    console.error('Unable to connect to database');
  }
  await api.listen(3000);
  console.log('API Server is running on http://localhost:3000');
  jobs.start();
})();
