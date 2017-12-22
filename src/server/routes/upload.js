const express = require('express');
const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const Video = require('mongoose').model('Video');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');

const router = new express.Router();


var storageBackdrop = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/backdrop/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var uploadBackdrop = multer({ storage: storageBackdrop }).single('backdrop')
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
  const info = req.body;

  Video.create([{
    title: info.title,
    backdrop: info.backdrop,
    rsc_info: info.rscInfo,
    tags: info.tags,
    introduction: info.introduction
    }], (err, res) => {
      if (err) {
        res.status(400).json({
          error: 'Failure in uploading videos!'
        });
      }
  })
});

module.exports = router;
