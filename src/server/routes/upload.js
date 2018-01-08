const express = require('express')
const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Video = require('mongoose').model('Video')
const jwt = require('jsonwebtoken')
const config = require('../config')
const multer = require('multer')
// import ImageCompressor from '@xkeshi/image-compressor'
// const ImageCompressor = require('@xkeshi/image-compressor')

const router = new express.Router()


var storageBackdrop = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/backdrop/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
// var uploadBackdrop = multer({ storage: storageBackdrop }).single('backdrop')
var uploadBackdrop = multer({ storage: storageBackdrop }).fields([{ name: 'backdrop', maxCount: 1 }, { name: 'backdrop_thumbnail', maxCount: 1 }])
router.post('/backdrop', (req, res) => {
  uploadBackdrop(req, res, (err) => {
    if (err) {
      res.status(400).json({
        error: 'Something wrong when uploading backdrop.'
      })
    }
  })
})


var storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadAvatar = multer({ storage: storageAvatar }).single('avatar')
router.post('/avatar', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub

  uploadAvatar(req, res, (err) => {
    if (err) {
      throw err
      res.status(400).json({ success: false })
      return
    }

    const avatarUrl = req.file.filename
    User.findOneAndUpdate({ _id: subId }, { avatar_url: avatarUrl }, (err) => {
      if (err) {
        throw err
        res.status(400).json({ success: false })
        return
      }
    })
  })
  res.status(200).json({ success: true })
})


router.post('/video', (req, res, next) => {
  const info = req.body
  // 'edit' mode
  if (info.mode === 'edit') {
    if (info.coverChanged) {
      var data = {
        title: info.title,
        tags: info.tags,
        backdrop: info.backdrop,
        rsc_info: info.rscInfo,
        introduction: info.introduction,
        update_time: Date.now()
      }
    } else {
      var data = {
        title: info.title,
        tags: info.tags,
        rsc_info: info.rscInfo,
        introduction: info.introduction,
        update_time: Date.now()
      }
    }
    // {new: true} is necessary to force elasticsearch update after findOneAndUpdate
    Video.findOneAndUpdate({ _id: info.id }, data, { new: true, upsert: false }, (err) => {
      if (err) throw err
    })
  }
  // 'add' mode
  else {
    Video.create([{
      title: info.title,
      backdrop: info.backdrop,
      rsc_info: info.rscInfo,
      tags: info.tags,
      introduction: info.introduction
      }], (err) => {
        if (err) throw err
    })
  }
});

module.exports = router;
