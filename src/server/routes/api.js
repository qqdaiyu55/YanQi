const express = require('express');
const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const Video = require('mongoose').model('Video');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');

const router = new express.Router();

// Get user profile
router.post('/profile', (req, res, next) => {
  const token = req.body.token
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub

  User.findById(subId, (err, user) => {
    if (err) throw err

    res.status(200).json({
      username: user.username,
      avatarUrl: user.avatar_url,
      tags: user.tags
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
  const info = req.body;
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
  var parsedQuery = req.query.q.split(':')
  var searchPattern = {}
  if (parsedQuery[0] === 'title') {
    searchPattern = {
      'match': {
        'title': parsedQuery[1]
      }
    }
  } else if (parsedQuery[1] === 'tags') {
    searchPattern = {
      'terms': {
        'tags': [parsedQuery[1]]
      }
    }
  } else {
    console.log('Error: Illegal search pattern!')
    return
  }

  Video.search(searchPattern, (err, results) => {
    if (err) throw err;
    res.json({
      num: results.hits.total,
      hits: results.hits.hits
    })
  })
})

router.get('/video', (req, res) => {
  const id = req.query.id;

  Video.findById(id, (err, video) => {
    if (err) throw err;

    res.status(200).json(video);
  })
})


module.exports = router;
