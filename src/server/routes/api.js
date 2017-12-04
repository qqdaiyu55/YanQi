const express = require('express');
const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const Video = require('mongoose').model('Video');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');

const router = new express.Router();

router.post('/userinfo', (req, res, next) => {
  const token = req.body.token;
  const decode = jwt.verify(token, config.jwtSecret);
  const subId = decode.sub;

  User.findById(subId, (err, user) => {
    if (err) {
      res.status(400).json({
        error: 'Cannot find user!'
      });
    }

    res.status(200).json({
      username: user.username,
      avatar: user.avatar
    });
  });

});

router.post('/updateAvatar', (req, res, next) => {
  const token = req.body.token;
  const decode = jwt.verify(token, config.jwtSecret);
  const subId = decode.sub;
  const avatar = req.body.avatar;

  User.findOneAndUpdate({_id: subId}, {avatar: avatar}, {upsert: True}, (err, res) => {
    if (err) {
      res.status(400).json({
        error: 'Failure in updating avatar!'
      });
    }
  });
});

router.post('/updateTags', (req, res, next) => {
  const info = JSON.parse(req.body.json);
  const token = info.token;
  const decode = jwt.verify(token, config.jwtSecret);
  const subId = decode.sub;
  const tags = info.tags;

  User.findOneAndUpdate({_id: subId}, {tags: tags}, {upsert: true}, (err, res) => {
    if (err) {
      res.status(400).json({
        error: 'Failure in updating tags!'
      });
    }
  });
});

router.post('/uploadVideos', (req, res, next) => {
  const info = req.body;
  const _id = mongoose.mongo.ObjectId();

  Video.create([{
    // "_id": mongoose.mongo.ObjectId(),
    title: info.title,
    backDrop: info.backDrop,
    rscInfo: info.rscInfo,
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


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/backdrop/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage }).single('cover');
router.post('/uploadCover', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        error: 'Something wrong when uploading cover.'
      });
    }
  });
});

router.get('/videos', (req, res) => {
  Video.search({
    "match": { "title" : req.query.q }
  }, (err, results) => {
    if (err) throw err;
    res.json({
      num: results.hits.total,
      hits: results.hits.hits
    });
  });
});

module.exports = router;
