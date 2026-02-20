
# WebRDP

Web-based RDP client proxy using Express, Socket.io, and HTML5 Canvas.

Proxies a WebSocket/Socket.io connection from the browser to an RDP server via Node.js. Renders the remote desktop in an HTML5 Canvas element with keyboard and mouse input forwarding.

## Requirements

- Node.js >= 20
- Or Docker

## Quick Start

### Node.js

```bash
git clone https://github.com/Mikej81/WebRDP.git
cd WebRDP
cp .env.example .env    # edit as needed
npm install
npm run build
node app.js
```

### Docker

```bash
docker compose up -d
```

Then open `http://localhost:4200/rdp/host/<RDP_HOST_IP>` in your browser.

You'll be prompted for HTTP Basic Auth credentials — these are forwarded as the RDP username/password. Use `DOMAIN\username` format for domain-joined hosts.

## Configuration

All settings are configured via environment variables (or a `.env` file). See [`.env.example`](.env.example) for the full list:

| Variable | Default | Description |
|----------|---------|-------------|
| `LISTEN_IP` | `127.0.0.1` | Bind address |
| `LISTEN_PORT` | `4200` | Listen port |
| `SESSION_SECRET` | (random) | Express session secret |
| `RDP_DEFAULT_PORT` | `3389` | Default RDP port |
| `LOG_SCREEN_ON_MOUSECLICKS` | `false` | Save screenshots on click |
| `HEADER_TEXT` | (none) | Header bar text |
| `HEADER_BACKGROUND` | `green` | Header bar color |
| `TLS_KEY_PATH` | (none) | Path to TLS private key (enables HTTPS) |
| `TLS_CERT_PATH` | (none) | Path to TLS certificate |

## Usage

### URL Parameters

```
http://localhost:4200/rdp/host/<host>?port=3389&header=MySession&headerBackground=blue
```

- **host** — IP, FQDN, or hostname of the RDP target
- **port** — RDP port (default: 3389)
- **header** — Custom header text
- **headerBackground** — Header bar CSS color

### Authentication

HTTP Basic Auth credentials are passed through to the RDP connection:
- **Username**: `DOMAIN\user` or just `user`
- **Password**: your RDP password

## Development

```bash
npm install
npm run build        # esbuild: bundles client JS
npm run dev          # starts server with --watch
npm run lint         # eslint
npm test             # vitest
```

## (new) Architecture

```
Browser (Canvas + Socket.io client)
    ↕ WebSocket
Node.js (Express + Socket.io server)
    ↕ RDP protocol
Windows RDP Server
```

- **Server**: Express handles auth and routing; Socket.io proxies input/output events between the browser and the RDP library (`@electerm/rdpjs`)
- **Client**: Canvas renders bitmap updates; keyboard/mouse events are captured and forwarded over Socket.io
- **RLE Decompression**: An Emscripten/WASM module (`rle.js`) handles client-side bitmap decompression

## License

Copyright (c) 2017 Mikej81
Licensed under the GPL license.
