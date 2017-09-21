const mongoose = require('mongoose');

const SourceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  entry: [{
    title: String,
    url: {
      type: String,
      required: true,
    },
  }],
}, {
  versionKey: false,
});

module.exports = mongoose.model('Source', SourceSchema);
