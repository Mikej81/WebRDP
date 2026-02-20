import { describe, it, expect, vi } from 'vitest';
import { basicAuth } from '../lib/auth.js';

function createMockReqRes(authHeader) {
  const req = {
    headers: authHeader ? { authorization: authHeader } : {},
    session: {}
  };
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, val) { this.headers[key] = val; },
    end: vi.fn()
  };
  return { req, res };
}

function basicHeader(user, pass) {
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

describe('basicAuth', () => {
  it('returns 401 without credentials', () => {
    const { req, res } = createMockReqRes();
    const next = vi.fn();
    basicAuth(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.headers['WWW-Authenticate']).toBe('Basic realm="WebRDP"');
    expect(next).not.toHaveBeenCalled();
  });

  it('parses domain\\user format', () => {
    const { req, res } = createMockReqRes(basicHeader('CORP\\jdoe', 'secret'));
    const next = vi.fn();
    basicAuth(req, res, next);
    expect(req.session.rdpdomain).toBe('CORP');
    expect(req.session.username).toBe('jdoe');
    expect(req.session.userpassword).toBe('secret');
    expect(next).toHaveBeenCalled();
  });

  it('handles username without domain', () => {
    const { req, res } = createMockReqRes(basicHeader('admin', 'pass123'));
    const next = vi.fn();
    basicAuth(req, res, next);
    expect(req.session.rdpdomain).toBe('');
    expect(req.session.username).toBe('admin');
    expect(req.session.userpassword).toBe('pass123');
    expect(next).toHaveBeenCalled();
  });
});
