var rdp = require('node-rdpjs')

/**
 * Create proxy between rdp layer and socket io
 * @param server {http(s).Server} http server
 */
module.exports = function (socket) {
  // if websocket connection arrives without an express session, kill it
  if (!socket.request.session) {
    socket.emit('401 UNAUTHORIZED')
    console.log('SOCKET: No Express Session / REJECTED')
    socket.disconnect(true)
    return
  }
  var rdpClient = null
  socket.on('infos', function (infos) {
    if (rdpClient) {
        // clean older connection
      rdpClient.close()
    }

    rdpClient = rdp.createClient({
      domain: socket.request.session.rdpdomain,
      userName: socket.request.session.username,
      password: socket.request.session.userpassword,
      enablePerf: true,
      autoLogin: true,
      screen: infos.screen,
      locale: infos.locale,
      logLevel: process.argv[2] || 'INFO'
    }).on('connect', function () {
      socket.emit('rdp-connect')
    }).on('bitmap', function (bitmap) {
      socket.emit('rdp-bitmap', bitmap)
    }).on('close', function () {
      socket.emit('rdp-close')
    }).on('error', function (err) {
      socket.emit('rdp-error', err)
    }).connect(socket.request.session.host, 3389)
  }).on('mouse', function (x, y, button, isPressed) {
    if (!rdpClient) return

    rdpClient.sendPointerEvent(x, y, button, isPressed)
  }).on('wheel', function (x, y, step, isNegative, isHorizontal) {
    if (!rdpClient) {
      return
    }
    rdpClient.sendWheelEvent(x, y, step, isNegative, isHorizontal)
  }).on('scancode', function (code, isPressed) {
    if (!rdpClient) return

    rdpClient.sendKeyEventScancode(code, isPressed)
  }).on('unicode', function (code, isPressed) {
    if (!rdpClient) return

    rdpClient.sendKeyEventUnicode(code, isPressed)
  }).on('disconnect', function () {
    if (!rdpClient) return

    rdpClient.close()
  })
}
