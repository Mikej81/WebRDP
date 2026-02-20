import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';

let server;
let request;

function basicHeader(user, pass) {
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

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

  request = supertest(server);
});

afterAll(() => {
  if (server) server.close();
});

describe('routes', () => {
  it('GET / returns HTML with auth', async () => {
    const res = await request
      .get('/')
      .set('Authorization', basicHeader('admin', 'pass'));
    expect(res.status).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });

  it('GET / returns 401 without auth', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(401);
  });

  it('GET /rdp/host/192.168.1.1 returns client page', async () => {
    const res = await request
      .get('/rdp/host/192.168.1.1')
      .set('Authorization', basicHeader('admin', 'pass'));
    expect(res.status).toBe(200);
    expect(res.text).toContain('WebRDP');
  });

  it('GET /nonexistent returns 404', async () => {
    const res = await request
      .get('/nonexistent')
      .set('Authorization', basicHeader('admin', 'pass'));
    expect(res.status).toBe(404);
  });
});
