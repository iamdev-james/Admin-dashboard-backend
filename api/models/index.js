const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  username: String,
  title: String,
  subTitle: String,
  category: Array,
  article: String,
  createdAt: Date
})

module.exports = mongoose.model('Article', articleSchema);
