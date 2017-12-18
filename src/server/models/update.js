const express = require('express');
const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const Video = require('mongoose').model('Video');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');

const router = new express.Router();

router.post('/videolist', (req, res) => {
  console.log(req)
  const token = req.body.token
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub
  const videoId = req.body.videoId

  if (req.body.add) {
    User.findOneAndUpdate(
      { _id: subId },
      { $pull: { video_list: videoId }}, (err) => {
        if (err) throw err
    })
  } else {
    User.findOneAndUpdate(
      { _id: subId },
      { $push: { video_list: videoId }}, (err) => {
        if (err) throw err
    })
  }
})
