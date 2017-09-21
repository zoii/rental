const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const TopicSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  keyword: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Keyword',
  },
  reply: String,
  replyTime: String,
  crawlTime: String,
  source: String,
}, {
  versionKey: false,
});

TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Topic', TopicSchema);
