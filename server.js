const express = require('express')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

const userController = require('./controllers/user')
app.use('/user', userController)

app.get('/', (req, res) => {
  res.send('found')
})

app.listen(PORT, () => {
  console.log('Listening ... ')
})