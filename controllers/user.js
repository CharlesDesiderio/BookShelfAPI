const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const users = express.Router()

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    req.user = jwt.verify(req.token, process.env.TOKEN_SECRET)
    next()
  } else {
    res.status(403).json({
      error: 'Forbidden'
    })
  }
}

users.post('/register', (req, res) => {
  
})

users.get('/profile', (req, res) => { // Add the verify middleware after testing!
  res.send('gotcha')
})

module.exports = users