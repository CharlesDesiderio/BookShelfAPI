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

const sendError = () => {
  res.status(400).json({
    error: err
  })
}

users.post('/register', (req, res) => {
  console.log(req.body)
  User.find({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      sendError()
    } else if (foundUser.length > 0) {
      res.status(400).json({
        error: 'User already exists'
      })
    } else {

      User.find({ userName: req.body.userName }, (err, foundUser) => {
        if (foundUser.length > 0) {
          res.status(400).json({
            error: 'User name in use'
          })
        } else {
          req.body.bookCollection = []
          req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
          User.create(req.body, (err, createdUser) => {
            if (err) {
              sendError()
            } else {
              const user = {
                userId: createdUser._id,
                email: createdUser.email,
                userName: createdUser.userName,
                displayName: createdUser.displayName,
                bookCollection: createdUser.bookCollection
              }
              jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
                if (err) {
                  sendError()
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
    }
  })
})

users.post('/login', (req, res) => { // Add the verify middleware after testing!
  User.find({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      sendError()
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
          displayName: foundUser[0].displayName,
          bookCollection: foundUser[0].bookCollection
        }
        jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
          if (err) {
            sendError()
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

users.get('/profile/:userName', (req, res) => {
  User.find({ userName: req.params.userName }, (err, foundUser) => {
    if (err) {
      sendError()
    } else {
      const displayUser = {
        userName: foundUser[0].userName,
        displayName: foundUser[0].displayName,
        bookCollection: foundUser[0].bookCollection
      }
      
      res.status(200).json({
        user: displayUser
      })
    }
  })
})

users.put('/addBook', verifyToken, (req, res) => {
  User.find({ userName: req.body.userName }, (err, foundUser) => {
    if (err) {
      sendError()
    } else if (foundUser[0].bookCollection.includes(req.body.bookIsbn)) {
      res.status(400).json({
        error: 'Book already in collection'
      })
    } else {
      const userWithNewBook = foundUser[0]
      userWithNewBook.bookCollection.push(req.body.bookIsbn)
      User.findByIdAndUpdate(foundUser[0]._id, userWithNewBook, (err, updatedUser) => {
        if (err) {
          sendError()
        } else {
          res.status(200).json({
            message: 'Successfully added!'
          })
        }
      })
    }
  })
})

users.put('/removeBook', verifyToken, (req, res) => {
  User.find({ userName: req.body.userName }, (err, foundUser) => {
    if (err) {
      sendError()
    } else if (!foundUser[0].bookCollection.includes(req.body.bookIsbn)) {
      res.status(400).json({
        error: 'Book not in collection'
      })
    } else {
      const userWithoutBook = foundUser[0]
      userWithoutBook.bookCollection.splice(userWithoutBook.bookCollection.indexOf(req.body.bookIsbn), 1)
      User.findByIdAndUpdate(foundUser[0]._id, userWithoutBook, (err, updatedUser) => {
        if (err) {
          sendError()
        } else {
          res.status(200).json({
            message: 'Successfully removed!'
          })
        }
      })
    }
  })
})

module.exports = users

