const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// Define the User model schema
const UserSchema = new Schema({
  username: {
    type: String,
    index: { unique: true }
  },
  password: String,
  avatar_url: {
    type: String,
    default: 'default.png'
  },
  tags: {
    type: Array,
    default: ['movie', 'anime', 'tv show']
  },
  upload: {
    type: Number,
    default: 0.0
  },
  download: {
    type: Number,
    default: 0.0
  },
  video_list: {
    type: [Schema.Types.ObjectId]
  }
})


/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback)
}


/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this

  // Proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next()

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError) }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError) }

      // Replace a password string with hash value
      user.password = hash;

      return next()
    })
  })
})


module.exports = mongoose.model('User', UserSchema)
