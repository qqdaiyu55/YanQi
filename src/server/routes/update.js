const express = require('express')
const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Video = require('mongoose').model('Video')
const jwt = require('jsonwebtoken')
const config = require('../config')
const multer = require('multer')

const router = new express.Router()

router.post('/tags', (req, res, next) => {
  const info = req.body
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub
  const tags = info.tags

  User.findOneAndUpdate({_id: subId}, {tags: tags}, (err, res) => {
    if (err) {
      res.status(400).json({
        error: 'Failure in updating tags!'
      })
    }
  })
})

router.post('/videolist', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub
  var videoId = req.body.videoId

  User.findById(subId, (err, user) => {
    if (err) throw err
    
    var videoList = user.video_list
    var inList = false
    // type of element of user.video_list is mongoose.Types.ObjectId
    for (var i = 0; i < videoList.length; i++) {
      if (String(videoList[i]) === videoId) {
        inList = true
        break
      }
    }

    if (inList) {
      User.findOneAndUpdate(
        { _id: subId },
        { $pull: { video_list: videoId } }, (err) => {
          if (err) throw err
      })
    } else {
      User.findOneAndUpdate(
        { _id: subId },
        { $push: { video_list: videoId } }, (err) => {
          if (err) throw err
      })
    }
  })
})

module.exports = router
