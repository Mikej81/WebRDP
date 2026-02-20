import rdp from '@electerm/rdpjs';

export function createClient(opts) {
  const rdpClient = rdp.createClient({
    domain: opts.domain,
    userName: opts.userName,
    password: opts.password,
    enablePerf: false,
    autoLogin: true,
    decompress: false,
    screen: opts.screen,
    locale: opts.locale,
    logLevel: opts.logLevel || 'INFO'
  });

  return {
    connect(host, port) {
      rdpClient.connect(host, port);
      return this;
    },
    on(event, handler) {
      rdpClient.on(event, handler);
      return this;
    },
    sendPointerEvent(x, y, button, isPressed) {
      rdpClient.sendPointerEvent(x, y, button, isPressed);
    },
    sendWheelEvent(x, y, step, isNegative, isHorizontal) {
      rdpClient.sendWheelEvent(x, y, step, isNegative, isHorizontal);
    },
    sendKeyEventScancode(code, isPressed) {
      rdpClient.sendKeyEventScancode(code, isPressed);
    },
    sendKeyEventUnicode(code, isPressed) {
      rdpClient.sendKeyEventUnicode(code, isPressed);
    },
    close() {
      rdpClient.close();
    }
  };
}
