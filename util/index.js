// util/index.js

// private
require('colors') // allow for color property extensions in log messages
var debug = require('debug')('WebRDP')
var Auth = require('basic-auth')

exports.basicAuth = function basicAuth (req, res, next) {
  var myAuth = Auth(req)
  if (myAuth) {
    var userstr = myAuth.name.toString()
    if (userstr.indexOf('\\') > -1) {
      //console.log(myAuth.name)
      var parts = myAuth.name.split('\\')
      req.session.rdpdomain = parts[0].replace('\\', '')
      req.session.username = parts[1].replace('\\', '')
    } else {
      req.session.rdpdomain = ''
      req.session.username = myAuth.name
    }
    req.session.userpassword = myAuth.pass
    debug('myAuth.name: ' + myAuth.name.yellow.bold.underline +
      ' and password ' + ((myAuth.pass) ? 'exists'.yellow.bold.underline
      : 'is blank'.underline.red.bold))
    next()
  } else {
    res.statusCode = 401
    debug('basicAuth credential request (401)')
    res.setHeader('WWW-Authenticate', 'Basic realm="WebRDP"')
    res.end('Username and password required for web RDP service.')
  }
}
