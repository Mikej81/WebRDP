// app.js
//

var path = require('path')
var config = require('read-config')(path.join(__dirname, 'config.json'))
//  var logger = require('morgan')
//  var validator = require('validator')
var myutil = require('./util')

var session = require('express-session')({
  secret: 'MySecret',
  name: 'WebRDP',
  resave: true,
  saveUninitialized: false,
  unset: 'destroy'
})

var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var socket = require('./socket')

// Express
app.use(session)
app.use(myutil.basicAuth)
app.use(express.static(__dirname + '/client'))

app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/client/html/index.html')
})

app.get('/rdp/host/:host?', function (req, res, next) {
  req.session.host = req.params.host
  res.sendFile(__dirname + '/client/html/client.html')
})

// Express error handling
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

server.listen(4200)

// socket.io
// expose express session with socket.request.session
io.use(function (socket, next) {
  (socket.request.res) ? session(socket.request, socket.request.res, next)
    : next()
})

// bring up socket
io.on('connection', socket)

module.exports = {server: server, config: config}
