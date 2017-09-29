var rdp = require('node-rdpjs')
// var fs = require('fs')
var base64Img = require('base64-img')
var rle = require('../rle.js')

  /**
   * decompress bitmap from RLE algorithm
   * @param bitmap  {object} bitmap object of bitmap event of node-rdpjs
   */
  function decompress (bitmap) {
    var fName = null;
    switch (bitmap.bitsPerPixel) {
    case 15:
      fName = 'bitmap_decompress_15';
      break;
    case 16:
      fName = 'bitmap_decompress_16';
      break;
    case 24:
      fName = 'bitmap_decompress_24';
      break;
    case 32:
      fName = 'bitmap_decompress_32';
      break;
    default:
      throw 'invalid bitmap data format';
    }

    var input = new Uint8Array(bitmap.data);
    var inputPtr = rle._malloc(input.length);
    var inputHeap = new Uint8Array(rle.HEAPU8.buffer, inputPtr, input.length);
    inputHeap.set(input);

    var output_width = bitmap.destRight - bitmap.destLeft + 1;
    var output_height = bitmap.destBottom - bitmap.destTop + 1;
    var ouputSize = output_width * output_height * 4;
    var outputPtr = rle._malloc(ouputSize);

    var outputHeap = new Uint8Array(rle.HEAPU8.buffer, outputPtr, ouputSize);

    var res = rle.ccall(fName,
      'number',
      ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number'],
      [outputHeap.byteOffset, output_width, output_height, bitmap.width, bitmap.height, inputHeap.byteOffset, input.length]
    );

    var output = new Uint8ClampedArray(outputHeap.buffer, outputHeap.byteOffset, ouputSize);

    rle._free(inputPtr);
    rle._free(outputPtr);

    return { width : output_width, height : output_height, data : output };
  }

  /**
   * Un compress bitmap are reverse in y axis
   */
  function reverse (bitmap) {
    return { width : bitmap.width, height : bitmap.height, data : new Uint8ClampedArray(bitmap.data) };
  }

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
  var screenBuff = null

  socket.on('infos', function (infos) {
    if (rdpClient) {
        // clean older connection
      rdpClient.close()
    }
    console.log('WebRDP Login: user=' + socket.request.session.username + ' from=' + socket.handshake.address + ' host=' + socket.request.session.rdp.host + ' port=' + socket.request.session.rdp.port + ' sessionID=' + socket.request.sessionID + '/' + socket.id + ' allowreplay=' + socket.request.session.rdp.allowreplay)
    socket.emit('title', 'rdp://' + socket.request.session.rdp.host)
    socket.request.session.rdp.header.background && socket.emit('headerBackground', socket.request.session.rdp.header.background)
    socket.request.session.rdp.header.name && socket.emit('header', socket.request.session.rdp.header.name)

    socket.emit('headerBackground', 'green')
    socket.emit('header', '//HEADER//')

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
      screenBuff = bitmap
      socket.emit('rdp-bitmap', bitmap)
    }).on('close', function () {
      socket.emit('rdp-close')
    }).on('error', function (err) {
      socket.emit('rdp-error', err)
    }).connect(socket.request.session.host, 3389)
  }).on('mouse', function (x, y, button, isPressed, canvas) {
    if (!rdpClient) return
    if(isPressed) {
      var newDate = new Date();
      var screenCapDate = parseInt(newDate.getMonth()+1)+'-'+newDate.getDate()+'-'+newDate.getFullYear()+'-'+newDate.getTime()
      base64Img.img(canvas, './screenshots', screenCapDate + '-' + socket.request.session.username, function(err, filepath) {})
    }
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
<<<<<<< HEAD
=======
function bitmapUpdate(bitmap) {
      var output = null;
      if (bitmap.isCompress) {
        output = decompress(bitmap);
      }
      else {
        output = reverse(bitmap);
      }
      return output
}
>>>>>>> origin/master
