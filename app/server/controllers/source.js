const Source = require('../models/Source');

const getAll = async (ctx, next) => {
  const sources = await Source.find({})
    .exec();
  ctx.body = { sources };
  await next();
};

module.exports = {
  getAll,
};
