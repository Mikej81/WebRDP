import 'dotenv/config';

function envBool(key, fallback = false) {
  const val = process.env[key];
  if (val === undefined || val === '') return fallback;
  return val === 'true' || val === '1';
}

function envInt(key, fallback) {
  const val = process.env[key];
  if (val === undefined || val === '') return fallback;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? fallback : parsed;
}

const config = {
  listen: {
    ip: process.env.LISTEN_IP || '127.0.0.1',
    port: envInt('LISTEN_PORT', 4200)
  },
  session: {
    name: process.env.SESSION_NAME || 'WebRDP',
    secret: process.env.SESSION_SECRET || ''
  },
  rdp: {
    host: process.env.RDP_DEFAULT_HOST || null,
    port: envInt('RDP_DEFAULT_PORT', 3389),
    readyTimeout: envInt('RDP_READY_TIMEOUT', 20000)
  },
  logging: {
    logScreenOnMouseclicks: envBool('LOG_SCREEN_ON_MOUSECLICKS', false),
    logKeypress: envBool('LOG_KEYPRESS', false)
  },
  header: {
    text: process.env.HEADER_TEXT || null,
    background: process.env.HEADER_BACKGROUND || 'green'
  },
  tls: {
    keyPath: process.env.TLS_KEY_PATH || '',
    certPath: process.env.TLS_CERT_PATH || ''
  }
};

export default config;
