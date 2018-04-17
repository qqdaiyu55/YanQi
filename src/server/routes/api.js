const express = require('express')
const mongoose = require('mongoose')
const User = require('mongoose').model('User')
const Video = require('mongoose').model('Video')
const jwt = require('jsonwebtoken')
const config = require('../config')
const multer = require('multer')

const router = new express.Router()

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
      upload: user.upload,
      peerId: subId
    });
  });
});


router.get('/videos', (req, res) => {
  const term = req.query.term
  const type = req.query.type
  const start = req.query.start
  const size = req.query.size

  var searchPattern = {}
  if (type === 'title') {
    searchPattern = {
      from: start,
      size: size,
      query: {
        match: {
          'title.cn': term
        }
      }
    }
  } else if (type === 'tag') {
    searchPattern = {
      from: start,
      size: size,
      query: {
        match: {
          'tags.keyword': term
        }
      }
    }
  } else {
    throw new Error('Error: Illegal search pattern!')
    return
  }

  Video.esSearch(searchPattern, (err, results) => {
    if (err) throw err

    const data = results.hits.hits.map((v) => {
      return ({
        'id': v._id,
        'title': v._source.title,
        'backdrop': v._source.backdrop
      })
    })
    res.json({
      num: results.hits.total,
      data: data
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

router.get('/new', (req, res) => {
  var searchPattern = {
    from: req.query.start,
    size: req.query.size,
    sort: {
      update_time: 'desc'
    },
    query: {
      match_all: {}
    }
  }

  Video.esSearch(searchPattern, (err, results) => {
    if (err) throw err
    const data = results.hits.hits.map((v) => {
      return ({
        'id': v._id,
        'title': v._source.title,
        'backdrop': v._source.backdrop
      })
    })

    res.status(200).json({ data: data })
  })
})

// Prefix which helps tracker to identify user's client (webtorrent) and version
const VERSION_PREFIX = '-WW0098-'
router.get('/peerId', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decode = jwt.verify(token, config.jwtSecret)
  const subId = decode.sub

  res.status(200).json({ peer_id: Buffer.from(VERSION_PREFIX).toString('hex') + subId})
})


// Generate 8 bits unique id
var uuidv8 = () => {
  return Math.random().toString(16).substr(2, 8)
}

module.exports = router
