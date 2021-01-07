const express = require('express')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, () => {
  console.log(`Connected to MongoDB at ${MONGODB_URI}`)
})

const userController = require('./controllers/user')
app.use('/user', userController)

app.get('/', (req, res) => {
  res.send('found')
})

app.listen(PORT, () => {
  console.log('Listening ... ')
})