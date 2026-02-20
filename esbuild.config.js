import { build } from 'esbuild';
import { copyFileSync, mkdirSync } from 'node:fs';

mkdirSync('client/js', { recursive: true });
mkdirSync('client/css', { recursive: true });

// Copy rle.js as-is (Emscripten WASM artifact — must not be processed)
copyFileSync('src/rle.js', 'client/js/rle.js');

// Copy CSS
copyFileSync('src/bootstrap.min.css', 'client/css/bootstrap.min.css');
copyFileSync('src/signin.css', 'client/css/signin.css');

// Bundle client JS modules
await build({
  entryPoints: ['src/client.js'],
  bundle: true,
  format: 'esm',
  outfile: 'client/js/webrdp.js',
  minify: false,
  sourcemap: true,
  target: ['es2020'],
  external: []
});

// Minified version
await build({
  entryPoints: ['src/client.js'],
  bundle: true,
  format: 'esm',
  outfile: 'client/js/webrdp.min.js',
  minify: true,
  target: ['es2020'],
  external: []
});

console.log('Build complete.');
