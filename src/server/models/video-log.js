const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define the Video Log model schema
const VideoLogSchema = new Schema({
  
})

var Video = mongoose.model('Video', VideoSchema)

// module.exports = mongoose.model('Video', VideoSchema)
module.exports = Video
