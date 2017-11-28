const mongoose = require('mongoose');

// define the Video model schema
const VideoSchema = new mongoose.Schema({
  title: String,
  coverFile: String,
  rscInfo: Array,
  tags: Array,
  introduction: String
});


module.exports = mongoose.model('Video', VideoSchema);
