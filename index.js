const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const compression = require('compression')
const helmet = require('helmet')
const config = require('./src/server/config')

// connect to the database and load models
require('./src/server/models').connect(config.dbUri)

var PORT = Number(process.argv[2]) || 3000

const app = express()
// tell the app to look for static files in these directories
app.use(express.static('./src/client/static/'))
app.use(express.static('./build/'))
app.use(express.static('./public/'))

// compression
app.use(compression())

// use Helmet to protect against well known vulnerabilities
app.use(helmet())

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// pass the passport middleware
app.use(passport.initialize())

// load passport strategies
const localSignupStrategy = require('./src/server/passport/local-signup')
const localLoginStrategy = require('./src/server/passport/local-login')
passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localLoginStrategy)

// pass the authorization checker middleware
const authCheckMiddleware = require('./src/server/middleware/auth-check')
app.use('/api', authCheckMiddleware)
app.use('/update', authCheckMiddleware)

// routes
const authRoutes = require('./src/server/routes/auth')
const apiRoutes = require('./src/server/routes/api')
const updateRoutes = require('./src/server/routes/update')
const uploadRoutes = require('./src/server/routes/upload')
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)
app.use('/update', updateRoutes)
app.use('/upload', uploadRoutes)

// docs
app.use('/doc', express.static('./docs/'))

// start the server
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT + ' or http://127.0.0.1:' + PORT);
});
