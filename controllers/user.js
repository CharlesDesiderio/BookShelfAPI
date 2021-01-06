const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const users = express.Router()

const User = require('../models/user')

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
  console.log(req.body)
  User.find({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else if (foundUser.length > 0) {
      res.status(400).json({
        error: 'User already exists'
      })
    } else {
      req.body.bookCollection = []
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      User.create(req.body, (err, createdUser) => {
        if (err) {
          res.status(400).json({
            error: err
          })
        } else {
          const user = {
            userId: createdUser._id,
            email: createdUser.email,
            userName: createdUser.userName,
            bookCollection: createdUser.bookCollection
          }
          jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
            if (err) {
              res.status(400).json({
                error: err
              })
            } else {
              res.status(200).json({
                user: createdUser,
                token: token
              })
            }
          })
        }
      })
    }
  })
})

users.post('/login', (req, res) => { // Add the verify middleware after testing!
  User.find({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    } else if (foundUser.length === 0) {
      res.status(400).json({
        error: 'Invalid login'
      })
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser[0].password)) {
        const user = {
          userId: foundUser[0]._id,
          email: foundUser[0].email,
          userName: foundUser[0].userName,
          bookCollection: foundUser[0].bookCollection
        }
        jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
          if (err) {
            res.status(400).json({
              error: err
            })
          } else {
            res.status(200).json({
              user: user,
              token: token
            })
          }
        })
      } else {
        res.status(400).json({
          error: 'Invalid login'
        })
      }
    }
  })
})

module.exports = users

