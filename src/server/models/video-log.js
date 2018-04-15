const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define the Video Log model schema
const VideoLogSchema = new Schema({
  _id: Schema.ObjectId,
  operations: [Schema.Types.Mixed]
})

module.exports = mongoose.model('VideoLog', VideoLogSchema)
