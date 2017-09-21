const Topic = require('../models/Topic');

const getAll = async (ctx, next) => {
  const { page = 1, limit = 20, keyword } = ctx.request.query;
  let search = {};
  if (keyword) {
    search = { keyword };
  }
  const topics = await Topic
    .paginate(search, {
      page,
      limit,
      populate: 'keyword',
      sort: { replyTime: -1 },
    });
  ctx.body = { topics };
  await next();
};


const getOne = async (ctx, next) => {
  const topic = await Topic.findById(ctx.params.id);
  ctx.body = { topic };
  await next();
};

module.exports = {
  getAll,
  getOne,
};
