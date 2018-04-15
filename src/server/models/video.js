const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoosastic = require('mongoosastic')

// define the Video model schema
const VideoSchema = new Schema({
  _id: Schema.ObjectId,
  title: { type: String, es_indexed: true },
  backdrop: { type: String, es_indexed: true},
  rsc_info: Array,
  tags: { type: [String], es_indexed: true },
  introduction: String,
  creat_time: { type: Date, default: Date.now() },
  update_time: { type: Date, default: Date.now(), es_indexed: true }
})

VideoSchema.plugin(mongoosastic)

var Video = mongoose.model('Video', VideoSchema)

Video.createMapping({
  "mappings": {
    "video": {
      "properties": {
        "title": {
          "type": "text",
          "fields": {
            "cn": {
              "type": "text",
              "analyzer": "ik_max_word",
              "search_analyzer": "ik_smart"
            }
          }
        },
        "tags": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "text",
              "analyzer": "keyword"
            }
          }
        }
      }
    }
  }
}, (err, mapping) => {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)')
    console.log(err)
  } else {
    console.log('mapping created!')
    console.log(mapping)
  }
})

// module.exports = mongoose.model('Video', VideoSchema)
module.exports = Video
