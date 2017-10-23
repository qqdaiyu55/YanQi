const express = require('express');
const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const config = require('../config');

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


module.exports = router;
