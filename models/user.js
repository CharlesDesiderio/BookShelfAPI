const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    reqired: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  bookCollection: [String]
})

const User = mongoose.model('User', userSchema)

module.exports = User