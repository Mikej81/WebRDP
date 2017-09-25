var path = require('path')
var express = require('express');
var http = require('http');
var myutil = require('./util')
var config = require('read-config')(path.join(__dirname, 'config.json'))
var validator = require('validator')
//var io = require('socket.io')(server);

var session = require('express-session')({
  secret: config.session.secret,
  name: config.session.name,
  resave: true,
  saveUninitialized: false,
  unset: 'destroy'
})

var app = express();

app.use(session)
app.use(myutil.basicAuth)
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/client'))

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/client/html/index.html');
});
app.get('/rdp/host/:host?', function (req, res, next) {
  res.render ('index', { host: req.params.host})
})
var server = http.createServer(app).listen(process.env.PORT || 9250);
var io = require('socket.io').listen(server);

require('./server.js')(server);
