const express = require('express');
const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const Video = require('mongoose').model('Video');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer = require('multer');

const router = new express.Router();

// Get user profile
router.get('/profile', (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub

  User.findById(subId, (err, user) => {
    if (err) throw err

    res.status(200).json({
      username: user.username,
      avatarUrl: user.avatar_url,
      tags: user.tags,
      download: user.download,
      upload: user.upload
    });
  });
});


router.get('/videos', (req, res) => {
  var parsedQuery = req.query.q.split(':')
  var searchPattern = {}
  if (parsedQuery[0] === 'title') {
    searchPattern = {
      'match': {
        'title.cn': parsedQuery[1]
      }
    }
  } else if (parsedQuery[0] === 'tag') {
    searchPattern = {
      'terms': {
        'tags.keyword': [parsedQuery[1]]
      }
    }
  } else {
    console.log('Error: Illegal search pattern!')
    return
  }

  Video.search(searchPattern, (err, results) => {
    if (err) throw err
    res.json({
      num: results.hits.total,
      hits: results.hits.hits
    })
  })
})

router.get('/video', (req, res) => {
  const id = req.query.id

  Video.findById(id, (err, video) => {
    if (err) throw err

    res.status(200).json(video)
  })
})


router.get('/videolist/id', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub

  User.findById(subId, (err, user) => {
    if (err) throw err;

    const data = {
      video_list: user.video_list
    }
    res.status(200).json(data)
  })
})

router.get('/videolist/all', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub

  User.findById(subId, (err, user) => {
    if (err) throw err

    const videoListIds = user.video_list
    Video.find({ '_id': { $in: videoListIds }}, (err, videos) => {
      if (err) throw err

      // console.log(videos)
      const data = videos.map((v) => {
        return ({
          'id': v._id,
          'title': v.title,
          'backdrop': v.backdrop
        })
      })
      res.status(200).json({ data: data })
    })
  })
})

module.exports = router;
