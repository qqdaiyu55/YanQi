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
router.post('/upload/backdrop', (req, res) => {
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
var uploadAvatar = multer({ storage: storageBackdrop }).single('avatar')
router.post('/upload/avatar', (req, res) => {
  const token = req.body.token
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub
  const avatar = req.body.avatar

  uploadBackdrop(req, res, (err) => {
    if (err) {
      res.status(400).json({
        error: 'Something wrong when uploading backdrop.'
      })
    }
  })

  User.findOneAndUpdate({_id: subId}, {avatarUrl: avatar}, (err, res) => {
    if (err) {
      res.status(400).json({
        error: 'Failure in updating avatar!'
      })
    }
  })
})

module.exports = router;
