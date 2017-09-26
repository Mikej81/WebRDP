var path = require('path')
var express = require('express');
var http = require('http');
var myutil = require('./util')
var config = require('read-config')(path.join(__dirname, 'config.json'))
var validator = require('validator')


var session = require('express-session')({
  secret: config.session.secret,
  name: config.session.name,
  resave: true,
  saveUninitialized: false,
  unset: 'destroy'
})

//Set up Express to share session data with ws://, support Basic Auth and use the Pug
//view engine.
var app = express();
app.use(session)
app.use(myutil.basicAuth)
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/client'))

//If user comes in without a host path, present a GUI.
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/client/html/index.html');
});
//When user comes in with a host, strip that out and pass to the template.
app.get('/rdp/host/:host?', function (req, res, next) {
  console.log('CONNECT ' + req.params.host, req.session.username, req.session.userpassword);
  res.render ('index', { host: req.params.host, domain: 'f5lab', username: req.session.username, password: req.session.userpassword})
})

// express error handling
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

var server = http.createServer(app).listen(process.env.PORT || 9250);
var io = require('socket.io').listen(server);
//var socket = require('./socket')

// socket.io
// expose express session with socket.request.session
io.use(function (socket, next) {
  (socket.request.res) ? session(socket.request, socket.request.res, next)
    : next()
})

require('./server.js')(server);

module.exports = {server: server, config: config}
