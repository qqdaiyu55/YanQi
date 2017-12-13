const express = require('express')
const passport = require('passport')
const fs = require('fs')
const inviteCode = require('../management/invite-code.json')
const blocklist = require('../management/blocklist.json')

const router = new express.Router()

const inviteCodeSysPath = './src/server/management/invite-code.json'

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length == 0) {
    isFormValid = false
    message = 'Please input valid username.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false
    message = 'Password must have at least 8 characters.'
  }

  if (!inviteCode.hasOwnProperty(payload.inviteCode)) {
    isFormValid = false
    message = 'Incorrect invite code.'
  } else if (inviteCode[payload.inviteCode] === 0) {
    isFormValid = false
    message = 'The invite code is expired.'
  } else {
    inviteCode[payload.inviteCode] -= 1
    fs.writeFile(inviteCodeSysPath, JSON.stringify(inviteCode))
  }

  return {
    success: isFormValid,
    message
  }
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  // **check if errors is needed in the future**
  let errors = {}
  let isFormValid = true
  let message = ''

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false
    message = 'Please input valid username.'
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false
    message = 'Please provide your password.'
  }

  if (blocklist.users.includes(payload.username)) {
    isFormValid = false
    message = 'The account is banned.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

router.post('/signup', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }


  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication username error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'This username is already taken.',
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.'
    });
  })(req, res, next)
})

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body)
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    })
  }


  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      })
    }


    return res.status(200).json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    })
  })(req, res, next)
})


module.exports = router
