const Keyword = require('../models/Keyword');

const getAll = async (ctx, next) => {
  const keywords = await Keyword.find({})
    .populate('topic')
    .exec();
  ctx.body = { keywords };
  await next();
};

const getOne = async (ctx, next) => {
  const keyword = await Keyword.findById(ctx.params.id);
  ctx.body = { keyword };
  await next();
};

module.exports = {
  getAll,
  getOne,
};
