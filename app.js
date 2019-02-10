const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/router')

const {
  checkEnviron
} = require('./utils/testUtils')

/**
 * Check the presence of all needed environmental variables
 */
checkEnviron()

// Until JavaScript figures out an easier way to work with async iterators
Array.prototype.forEachAsync = async function (callback) {
  for (let i = 0; i < this.length; i++) {
    await callback(this[i], i)
  }
}

// Until JavaScript figures out an easier way to check if an object is empty
Object.prototype.isEmpty = function () {
  for (let key in this) {
    if (this.hasOwnProperty(key)) return false
  }
  return true
}

if (process.env.TEST_API !== 'enabled') {
  // If not in the test environment, disable logging altogether
  console.log = () => {}
}

const PORT = process.env.PORT || 12345

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * Allow CORS
 */
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.type('application/json')
  next()
})

/**
 * Expose all the routes for the application
 */
app.use('/v1', routes)

/**
 * 404 Error Catcher
 */
app.use(function (req, res, next) {
  let err = new Error('Endpoint not found')
  err.status = 404
  next(err)
})

if (process.env.TEST_API) {
  // Show the real error message if in the test environment
  app.use((err, req, res, next) => {
    res.send(JSON.stringify({
      status: err.status || 500,
      message: err.message
    }))
  })
} else {
  // Otherwise respond with a generic 500 - INTERNAL SERVER ERROR
  app.use((err, req, res, next) => {
    res.send(JSON.stringify({
      status: 500,
      message: 'Internal Server Error'
    }))
  })
}

app.listen(PORT, function () {
  console.log(`Data4Help backend ready, listening on port: ${PORT}`)
  console.log('DATABASE ON ' + process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL)
  console.log('DEBUG ACTIVE')
})
