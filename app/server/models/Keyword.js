const mongoose = require('mongoose');

const KeywordSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  type: {
    type: Number,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('Keyword', KeywordSchema);
