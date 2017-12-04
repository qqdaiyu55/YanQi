const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic');

// define the Video model schema
const VideoSchema = new Schema({
  title: { type: String, es_indexed: true },
  backDrop: { type: String, es_indexed: true},
  rscInfo: Array,
  tags: { type: Array, es_type: 'string', es_indexed: true, index: 'not_analyzed' },
  introduction: { type: String, es_indexed: true }
});

VideoSchema.plugin(mongoosastic)


module.exports = mongoose.model('Video', VideoSchema);
