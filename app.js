import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

import express from 'express';
import expressSession from 'express-session';
import validator from 'validator';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';

import config from './lib/config.js';
import { basicAuth } from './lib/auth.js';
import socketHandler from './socket/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const sessionSecret = config.session.secret || crypto.randomBytes(32).toString('hex');

  const sessionMiddleware = expressSession({
    secret: sessionSecret,
    name: config.session.name || 'WebRDP',
    resave: true,
    saveUninitialized: false,
    unset: 'destroy'
  });

  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        upgradeInsecureRequests: null
      }
    }
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  }));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  app.use(sessionMiddleware);
  app.use(basicAuth);
  app.use(express.static(path.join(__dirname, '/client')));

  // Routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/html/index.html'));
  });

  app.get('/rdp/host/:host?', (req, res) => {
    req.session.rdp = {
      host: (validator.isIP(req.params.host + '') && req.params.host) ||
        (validator.isFQDN(req.params.host) && req.params.host) ||
        (/^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test(req.params.host) &&
          req.params.host) || config.rdp.host,
      port: (validator.isInt(req.query.port + '', { min: 1, max: 65535 }) &&
        req.query.port) || config.rdp.port,
      header: {
        name: req.query.header || config.header.text,
        background: req.query.headerBackground || config.header.background
      },
      allowreplay: validator.isBoolean(req.headers.allowreplay + '') || false,
      log: {
        screencapture: config.logging.logScreenOnMouseclicks || false
      },
      readyTimeout: (validator.isInt(req.query.readyTimeout + '', { min: 1, max: 300000 }) &&
        req.query.readyTimeout) || config.rdp.readyTimeout
    };

    if (req.session.rdp.header.name) {
      req.session.rdp.header.name = validator.escape(req.session.rdp.header.name);
    }
    if (req.session.rdp.header.background) {
      req.session.rdp.header.background = validator.escape(req.session.rdp.header.background);
    }

    res.sendFile(path.join(__dirname, '/client/html/client.html'));
  });

  // Error handling
  app.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
  });

  app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Create server (HTTPS if TLS configured, otherwise HTTP)
  let server;
  if (config.tls.keyPath && config.tls.certPath) {
    const tlsOptions = {
      key: fs.readFileSync(config.tls.keyPath),
      cert: fs.readFileSync(config.tls.certPath)
    };
    server = https.createServer(tlsOptions, app);
  } else {
    server = http.createServer(app);
  }

  // Socket.io
  const io = new SocketIOServer(server, {
    cors: {
      origin: false
    }
  });

  io.engine.use(sessionMiddleware);
  io.on('connection', socketHandler);

  return { app, server, io, config };
}

// Auto-start when run directly (not imported by tests)
const isMainModule = process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMainModule) {
  const instance = createApp();
  const listenPort = config.listen.port || 4200;
  const listenIp = config.listen.ip || '127.0.0.1';

  instance.server.listen(listenPort, listenIp, () => {
    console.log(`WebRDP listening on ${config.tls.keyPath ? 'https' : 'http'}://${listenIp}:${listenPort}`);
  });
}

export { config };
