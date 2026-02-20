import { createClient } from '../lib/rdp-client.js';

export default function socketHandler(socket) {
  if (!socket.request.session) {
    socket.emit('401 UNAUTHORIZED');
    console.log('SOCKET: No Express Session / REJECTED');
    socket.disconnect(true);
    return;
  }

  let rdpClient = null;

  socket.on('infos', (infos) => {
    if (rdpClient) {
      rdpClient.close();
    }

    const session = socket.request.session;
    console.log(`WebRDP Login: user=${session.username} from=${socket.handshake.address} host=${session.rdp.host} port=${session.rdp.port} sessionID=${socket.request.sessionID}/${socket.id} allowreplay=${session.rdp.allowreplay}`);

    socket.emit('title', `rdp://${session.rdp.host}`);
    if (session.rdp.header.background) socket.emit('headerBackground', session.rdp.header.background);
    if (session.rdp.header.name) socket.emit('header', session.rdp.header.name);

    rdpClient = createClient({
      domain: session.rdpdomain,
      userName: session.username,
      password: session.userpassword,
      screen: infos.screen,
      locale: infos.locale,
      logLevel: process.argv[2] || 'INFO'
    });

    rdpClient
      .on('connect', () => {
        socket.emit('rdp-connect');
      })
      .on('bitmap', (bitmap) => {
        socket.emit('rdp-bitmap', bitmap);
      })
      .on('close', () => {
        socket.emit('rdp-close');
      })
      .on('error', (err) => {
        socket.emit('rdp-error', err);
      })
      .connect(session.rdp.host, session.rdp.port || 3389);
  });

  socket.on('mouse', (x, y, button, isPressed) => {
    if (!rdpClient) return;
    rdpClient.sendPointerEvent(x, y, button, isPressed);
  });

  socket.on('wheel', (x, y, step, isNegative, isHorizontal) => {
    if (!rdpClient) return;
    rdpClient.sendWheelEvent(x, y, step, isNegative, isHorizontal);
  });

  socket.on('scancode', (code, isPressed) => {
    if (!rdpClient) return;
    rdpClient.sendKeyEventScancode(code, isPressed);
  });

  socket.on('unicode', (code, isPressed) => {
    if (!rdpClient) return;
    rdpClient.sendKeyEventUnicode(code, isPressed);
  });

  socket.on('disconnect', () => {
    if (!rdpClient) return;
    rdpClient.close();
  });
}
