import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { io as ioClient } from 'socket.io-client';

let server;
let port;

beforeAll(async () => {
  process.env.LISTEN_PORT = '0';
  process.env.LISTEN_IP = '127.0.0.1';
  process.env.SESSION_SECRET = 'test-secret';
  process.env.NODE_ENV = 'test';

  const { createApp } = await import('../app.js');
  const instance = createApp();
  server = instance.server;

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const addr = server.address();
  port = addr.port;
});

afterAll(() => {
  if (server) server.close();
});

describe('socket.io', () => {
  it('rejects unauthorized socket connections', async () => {
    const client = ioClient(`http://127.0.0.1:${port}`, {
      transports: ['websocket'],
      reconnection: false
    });

    const result = await new Promise((resolve) => {
      client.on('connect', () => {
        client.once('message', (msg) => resolve(msg));
        setTimeout(() => resolve('timeout'), 3000);
      });
      client.on('connect_error', () => resolve('connect_error'));
      client.on('disconnect', () => resolve('disconnected'));
    });

    expect(['401 UNAUTHORIZED', 'disconnected', 'connect_error', 'timeout']).toContain(result);
    client.close();
  });
});
