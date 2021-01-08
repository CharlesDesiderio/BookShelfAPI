const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
  console.log(`Listening on ${PORT}`)
})