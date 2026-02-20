import { describe, it, expect } from 'vitest';

describe('config', () => {
  it('loads with sensible defaults', async () => {
    const { default: config } = await import('../lib/config.js');
    expect(config.listen.ip).toBe('127.0.0.1');
    expect(config.listen.port).toBe(4200);
    expect(config.rdp.port).toBe(3389);
    expect(config.rdp.readyTimeout).toBe(20000);
    expect(config.header.background).toBe('green');
    expect(config.logging.logScreenOnMouseclicks).toBe(false);
    expect(config.logging.logKeypress).toBe(false);
  });

  it('has session config', async () => {
    const { default: config } = await import('../lib/config.js');
    expect(config.session.name).toBe('WebRDP');
  });

  it('has tls config placeholders', async () => {
    const { default: config } = await import('../lib/config.js');
    expect(config.tls.keyPath).toBe('');
    expect(config.tls.certPath).toBe('');
  });
});
