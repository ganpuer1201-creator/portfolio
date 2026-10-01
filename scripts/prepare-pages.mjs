import { cp, mkdir, writeFile } from 'node:fs/promises';

const output = new URL('../dist/client/', import.meta.url);
const runtime = new URL('_worker.js/', output);
await mkdir(runtime, { recursive: true });
await cp(new URL('../dist/server/', import.meta.url), runtime, {
  recursive: true,
  filter: source => !source.endsWith('/wrangler.json'),
});
await writeFile(new URL('_routes.json', output), JSON.stringify({
  version: 1,
  include: ['/*'],
  exclude: ['/_next/*', '/projects/*', '/figma/*', '/favicon.svg', '/og.png'],
}));
console.log('Pages output prepared in dist/client');
