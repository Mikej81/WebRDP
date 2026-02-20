// src/mstsc.js
function $(id) {
  return document.getElementById(id);
}
function elementOffset(el) {
  let x = 0;
  let y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: y, left: x };
}
function browser() {
  if (typeof InstallTrigger !== "undefined") {
    return "firefox";
  }
  if (window.chrome) {
    return "chrome";
  }
  if (document.documentMode) {
    return "ie";
  }
  return null;
}
function locale() {
  return window.navigator.userLanguage || window.navigator.language;
}

// src/keyboard.js
var KeyMap = {
  "": 0,
  "Escape": 1,
  "Digit1": 2,
  "Digit2": 3,
  "Digit3": 4,
  "Digit4": 5,
  "Digit5": 6,
  "Digit6": 7,
  "Digit7": 8,
  "Digit8": 9,
  "Digit9": 10,
  "Digit0": 11,
  "Minus": 12,
  "Equal": 13,
  "Backspace": 14,
  "Tab": 15,
  "KeyQ": 16,
  "KeyW": 17,
  "KeyE": 18,
  "KeyR": 19,
  "KeyT": 20,
  "KeyY": 21,
  "KeyU": 22,
  "KeyI": 23,
  "KeyO": 24,
  "KeyP": 25,
  "BracketLeft": 26,
  "BracketRight": 27,
  "Enter": 28,
  "ControlLeft": 29,
  "KeyA": 30,
  "KeyS": 31,
  "KeyD": 32,
  "KeyF": 33,
  "KeyG": 34,
  "KeyH": 35,
  "KeyJ": 36,
  "KeyK": 37,
  "KeyL": 38,
  "Semicolon": 39,
  "Quote": 40,
  "Backquote": 41,
  "ShiftLeft": 42,
  "Backslash": 43,
  "KeyZ": 44,
  "KeyX": 45,
  "KeyC": 46,
  "KeyV": 47,
  "KeyB": 48,
  "KeyN": 49,
  "KeyM": 50,
  "Comma": 51,
  "Period": 52,
  "Slash": 53,
  "ShiftRight": 54,
  "NumpadMultiply": 55,
  "AltLeft": 56,
  "Space": 57,
  "CapsLock": 58,
  "F1": 59,
  "F2": 60,
  "F3": 61,
  "F4": 62,
  "F5": 63,
  "F6": 64,
  "F7": 65,
  "F8": 66,
  "F9": 67,
  "F10": 68,
  "Pause": 69,
  "ScrollLock": 70,
  "Numpad7": 71,
  "Numpad8": 72,
  "Numpad9": 73,
  "NumpadSubtract": 74,
  "Numpad4": 75,
  "Numpad5": 76,
  "Numpad6": 77,
  "NumpadAdd": 78,
  "Numpad1": 79,
  "Numpad2": 80,
  "Numpad3": 81,
  "Numpad0": 82,
  "NumpadDecimal": 83,
  "PrintScreen": 84,
  "IntlBackslash": 86,
  "F11": 87,
  "F12": 88,
  "NumpadEqual": 89,
  "F13": 100,
  "F14": 101,
  "F15": 102,
  "F16": 103,
  "F17": 104,
  "F18": 105,
  "F19": 106,
  "F20": 107,
  "F21": 108,
  "F22": 109,
  "F23": 110,
  "KanaMode": 112,
  "Lang2": 113,
  "Lang1": 114,
  "IntlRo": 115,
  "F24": 118,
  "Convert": 121,
  "NonConvert": 123,
  "IntlYen": 125,
  "NumpadComma": 126,
  "MediaTrackPrevious": 57360,
  "MediaTrackNext": 57369,
  "NumpadEnter": 57372,
  "ControlRight": 57373,
  "VolumeMute": 57376,
  "LaunchApp2": 57377,
  "MediaPlayPause": 57378,
  "MediaStop": 57380,
  "VolumeDown": 57390,
  "VolumeUp": 57392,
  "BrowserHome": 57394,
  "NumpadDivide": 57397,
  "AltRight": 57400,
  "NumLock": 57413,
  "Home": 57415,
  "ArrowUp": 57416,
  "PageUp": 57417,
  "ArrowLeft": 57419,
  "ArrowRight": 57421,
  "End": 57423,
  "ArrowDown": 57424,
  "PageDown": 57425,
  "Insert": 57426,
  "Delete": 57427,
  "OSLeft": 57435,
  "OSRight": 57436,
  "ContextMenu": 57437,
  "Power": 57438,
  "BrowserSearch": 57445,
  "BrowserFavorites": 57446,
  "BrowserRefresh": 57447,
  "BrowserStop": 57448,
  "BrowserForward": 57449,
  "BrowserBack": 57450,
  "LaunchApp1": 57451,
  "LaunchMail": 57452,
  "MediaSelect": 57453
};
var UnicodeToCodeFirefox_FR = {
  27: "Escape",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  0: "Backquote",
  49: "Digit1",
  50: "Digit2",
  51: "Digit3",
  52: "Digit4",
  53: "Digit5",
  54: "Digit6",
  55: "Digit7",
  56: "Digit8",
  57: "Digit9",
  48: "Digit0",
  169: "Minus",
  61: "Equal",
  8: "Backspace",
  9: "Tab",
  65: "KeyQ",
  90: "KeyW",
  69: "KeyE",
  82: "KeyR",
  84: "KeyT",
  89: "KeyY",
  85: "KeyU",
  73: "KeyI",
  79: "KeyO",
  80: "KeyP",
  160: "BracketLeft",
  164: "BracketRight",
  13: "Enter",
  20: "CapsLock",
  81: "KeyA",
  83: "KeyS",
  68: "KeyD",
  70: "KeyF",
  71: "KeyG",
  72: "KeyH",
  74: "KeyJ",
  75: "KeyK",
  76: "KeyL",
  77: "Semicolon",
  165: "Quote",
  170: "Backslash",
  16: "ShiftLeft",
  60: "IntlBackslash",
  87: "KeyZ",
  88: "KeyX",
  67: "KeyC",
  86: "KeyV",
  66: "KeyB",
  78: "KeyN",
  188: "KeyM",
  59: "Comma",
  58: "Period",
  161: "Slash",
  17: "ControlLeft",
  91: "OSLeft",
  18: "AltLeft",
  32: "Space",
  37: "ArrowLeft",
  38: "ArrowUp",
  40: "ArrowDown",
  39: "ArrowRight",
  144: "NumLock",
  111: "NumpadDivide",
  106: "NumpadMultiply",
  109: "NumpadSubtract",
  103: "Numpad7",
  104: "Numpad8",
  105: "Numpad9",
  107: "NumpadAdd",
  100: "Numpad4",
  101: "Numpad5",
  102: "Numpad6",
  97: "Numpad1",
  98: "Numpad2",
  99: "Numpad3",
  96: "Numpad0",
  110: "NumpadDecimal",
  93: "ContextMenu"
};
var UnicodeToCodeChrome_FR = {
  27: "Escape",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  0: "Backquote",
  49: "Digit1",
  50: "Digit2",
  51: "Digit3",
  52: "Digit4",
  53: "Digit5",
  54: "Digit6",
  55: "Digit7",
  56: "Digit8",
  57: "Digit9",
  48: "Digit0",
  219: "Minus",
  187: "Equal",
  8: "Backspace",
  9: "Tab",
  65: "KeyQ",
  90: "KeyW",
  69: "KeyE",
  82: "KeyR",
  84: "KeyT",
  89: "KeyY",
  85: "KeyU",
  73: "KeyI",
  79: "KeyO",
  80: "KeyP",
  221: "BracketLeft",
  186: "BracketRight",
  13: "Enter",
  20: "CapsLock",
  81: "KeyA",
  83: "KeyS",
  68: "KeyD",
  70: "KeyF",
  71: "KeyG",
  72: "KeyH",
  74: "KeyJ",
  75: "KeyK",
  76: "KeyL",
  77: "Semicolon",
  192: "Quote",
  220: "Backslash",
  16: "ShiftLeft",
  60: "IntlBackslash",
  87: "KeyZ",
  88: "KeyX",
  67: "KeyC",
  86: "KeyV",
  66: "KeyB",
  78: "KeyN",
  188: "KeyM",
  190: "Comma",
  191: "Period",
  223: "Slash",
  17: "ControlLeft",
  91: "OSLeft",
  18: "AltLeft",
  32: "Space",
  37: "ArrowLeft",
  38: "ArrowUp",
  40: "ArrowDown",
  39: "ArrowRight",
  144: "NumLock",
  111: "NumpadDivide",
  106: "NumpadMultiply",
  109: "NumpadSubtract",
  103: "Numpad7",
  104: "Numpad8",
  105: "Numpad9",
  107: "NumpadAdd",
  100: "Numpad4",
  101: "Numpad5",
  102: "Numpad6",
  97: "Numpad1",
  98: "Numpad2",
  99: "Numpad3",
  96: "Numpad0",
  110: "NumpadDecimal",
  93: "ContextMenu"
};
var UnicodeToCode_EN = {
  27: "Escape",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  192: "Backquote",
  49: "Digit1",
  50: "Digit2",
  51: "Digit3",
  52: "Digit4",
  53: "Digit5",
  54: "Digit6",
  55: "Digit7",
  56: "Digit8",
  57: "Digit9",
  48: "Digit0",
  173: "Minus",
  61: "Equal",
  8: "Backspace",
  9: "Tab",
  81: "KeyQ",
  87: "KeyW",
  69: "KeyE",
  82: "KeyR",
  84: "KeyT",
  89: "KeyY",
  85: "KeyU",
  73: "KeyI",
  79: "KeyO",
  80: "KeyP",
  219: "BracketLeft",
  221: "BracketRight",
  13: "Enter",
  20: "CapsLock",
  65: "KeyA",
  83: "KeyS",
  68: "KeyD",
  70: "KeyF",
  71: "KeyG",
  72: "KeyH",
  74: "KeyJ",
  75: "KeyK",
  76: "KeyL",
  59: "Semicolon",
  222: "Quote",
  220: "Backslash",
  16: "ShiftLeft",
  90: "KeyZ",
  88: "KeyX",
  67: "KeyC",
  86: "KeyV",
  66: "KeyB",
  78: "KeyN",
  77: "KeyM",
  188: "Comma",
  190: "Period",
  191: "Slash",
  17: "ControlLeft",
  18: "AltLeft",
  91: "OSLeft",
  32: "Space",
  37: "ArrowLeft",
  38: "ArrowUp",
  40: "ArrowDown",
  39: "ArrowRight",
  144: "NumLock",
  111: "NumpadDivide",
  106: "NumpadMultiply",
  109: "NumpadSubtract",
  103: "Numpad7",
  104: "Numpad8",
  105: "Numpad9",
  107: "NumpadAdd",
  100: "Numpad4",
  101: "Numpad5",
  102: "Numpad6",
  97: "Numpad1",
  98: "Numpad2",
  99: "Numpad3",
  96: "Numpad0",
  110: "NumpadDecimal",
  93: "ContextMenu"
};
var UnicodeToCode = {
  "firefox": {
    "fr": UnicodeToCodeFirefox_FR,
    "en": UnicodeToCode_EN
  },
  "chrome": {
    "fr": UnicodeToCodeChrome_FR,
    "en": UnicodeToCode_EN
  }
};
function scancode(e) {
  const loc = locale();
  const lang = ["fr", "en"].indexOf(loc) > 0 && loc || "en";
  return KeyMap[e.code || UnicodeToCode[browser() || "firefox"][lang][e.keyCode]];
}

// src/canvas.js
function decompress(bitmap) {
  let fName = null;
  switch (bitmap.bitsPerPixel) {
    case 15:
      fName = "bitmap_decompress_15";
      break;
    case 16:
      fName = "bitmap_decompress_16";
      break;
    case 24:
      fName = "bitmap_decompress_24";
      break;
    case 32:
      fName = "bitmap_decompress_32";
      break;
    default:
      throw new Error("invalid bitmap data format");
  }
  const input = new Uint8Array(bitmap.data);
  const inputPtr = window.Module._malloc(input.length);
  const inputHeap = new Uint8Array(window.Module.HEAPU8.buffer, inputPtr, input.length);
  inputHeap.set(input);
  const output_width = bitmap.destRight - bitmap.destLeft + 1;
  const output_height = bitmap.destBottom - bitmap.destTop + 1;
  const outputSize = output_width * output_height * 4;
  const outputPtr = window.Module._malloc(outputSize);
  const outputHeap = new Uint8Array(window.Module.HEAPU8.buffer, outputPtr, outputSize);
  window.Module.ccall(
    fName,
    "number",
    ["number", "number", "number", "number", "number", "number", "number", "number"],
    [outputHeap.byteOffset, output_width, output_height, bitmap.width, bitmap.height, inputHeap.byteOffset, input.length]
  );
  const output = new Uint8ClampedArray(outputHeap.buffer, outputHeap.byteOffset, outputSize);
  window.Module._free(inputPtr);
  window.Module._free(outputPtr);
  return { width: output_width, height: output_height, data: output };
}
function reverse(bitmap) {
  return { width: bitmap.width, height: bitmap.height, data: new Uint8ClampedArray(bitmap.data) };
}
var Canvas = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }
  update(bitmap) {
    let output = null;
    if (bitmap.isCompress) {
      output = decompress(bitmap);
    } else {
      output = reverse(bitmap);
    }
    const imageData = this.ctx.createImageData(output.width, output.height);
    imageData.data.set(output.data);
    this.ctx.putImageData(imageData, bitmap.destLeft, bitmap.destTop);
  }
};
function createCanvas(canvas) {
  return new Canvas(canvas);
}

// src/client.js
function mouseButtonMap(button) {
  switch (button) {
    case 0:
      return 1;
    case 2:
      return 2;
    default:
      return 0;
  }
}
var Client = class {
  constructor(canvas) {
    this.canvas = canvas;
    this.render = createCanvas(this.canvas);
    this.socket = null;
    this.activeSession = false;
    this.install();
  }
  install() {
    const self = this;
    this.canvas.addEventListener("mousemove", (e) => {
      if (!self.socket) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit("mouse", e.clientX - offset.left, e.clientY - offset.top, 0, false);
      e.preventDefault();
      if (!self.activeSession) return false;
      return false;
    });
    this.canvas.addEventListener("mousedown", (e) => {
      if (!self.socket) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit("mouse", e.clientX - offset.left, e.clientY - offset.top, mouseButtonMap(e.button), true);
      e.preventDefault();
      return false;
    });
    this.canvas.addEventListener("mouseup", (e) => {
      if (!self.socket || !self.activeSession) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit("mouse", e.clientX - offset.left, e.clientY - offset.top, mouseButtonMap(e.button), false);
      e.preventDefault();
      return false;
    });
    this.canvas.addEventListener("contextmenu", (e) => {
      if (!self.socket || !self.activeSession) return;
      const offset = elementOffset(self.canvas);
      self.socket.emit("mouse", e.clientX - offset.left, e.clientY - offset.top, mouseButtonMap(e.button), false);
      e.preventDefault();
      return false;
    });
    this.canvas.addEventListener("wheel", (e) => {
      if (!self.socket || !self.activeSession) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      const step = Math.round(Math.abs(delta) * 15 / 8);
      const offset = elementOffset(self.canvas);
      self.socket.emit("wheel", e.clientX - offset.left, e.clientY - offset.top, step, delta > 0, isHorizontal);
      e.preventDefault();
      return false;
    });
    window.addEventListener("keydown", (e) => {
      if (!self.socket || !self.activeSession) return;
      self.socket.emit("scancode", scancode(e), true);
      e.preventDefault();
      return false;
    });
    window.addEventListener("keyup", (e) => {
      if (!self.socket || !self.activeSession) return;
      self.socket.emit("scancode", scancode(e), false);
      e.preventDefault();
      return false;
    });
    return this;
  }
  connect(next) {
    const self = this;
    this.socket = io(window.location.protocol + "//" + window.location.host).on("rdp-connect", () => {
      console.log("[WebRDP] connected");
      self.activeSession = true;
    }).on("rdp-bitmap", (bitmap) => {
      self.render.update(bitmap);
    }).on("headerBackground", (data) => {
      document.getElementById("header").style.backgroundColor = data;
    }).on("header", (data) => {
      document.getElementById("header").textContent = data;
    }).on("rdp-close", () => {
      next(null);
      console.log("[WebRDP] close");
      self.activeSession = false;
    }).on("rdp-error", (err) => {
      next(err);
      console.log("[WebRDP] error : " + err.code + "(" + err.message + ")");
      self.activeSession = false;
    });
    this.socket.emit("infos", {
      screen: {
        width: this.canvas.width,
        height: this.canvas.height
      },
      locale: locale()
    });
  }
};
function createClient(canvas) {
  return new Client(canvas);
}
window.WebRDP = { $, createClient };
export {
  createClient
};
//# sourceMappingURL=webrdp.js.map
