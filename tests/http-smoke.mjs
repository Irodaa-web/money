// Run after npm run build. No MongoDB installation is needed for these public/unauthenticated checks.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const base = 'http://localhost:3198';
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(3000) });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3198', '--hostname', '127.0.0.1'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, APP_ORIGIN: base } });
let logs = '';
server.stdout.on('data', d => logs += d); server.stderr.on('data', d => logs += d);
try {
  let ready = false;
  for (let i = 0; i < 10; i++) {
    try { if ((await request(base)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, logs);
  for (const route of ['/', '/login', '/register', '/parent', '/child', '/parent/tasks', '/child/goals']) {
    const r = await request(base + route); assert.equal(r.status, 200, route);
    assert.ok((await r.text()).includes('<html lang="uz">'), route);
  }
  for (const route of ['/api/auth/me', '/api/state']) assert.equal((await request(base + route)).status, 401, route);
  const csrf = await request(base + '/api/auth/logout', { method: 'POST', headers: { origin: 'https://example.invalid', 'content-type': 'application/json' }, body: '{}' });
  assert.equal(csrf.status, 403);
  assert.equal((await request(base + '/api/telegram/webhook', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status, 401);
  assert.equal((await request(base + '/api/telegram/retry')).status, 401);
  assert.equal((await request(base + '/api/photos/' + 'a'.repeat(24))).status, 401);
  console.log('PASS: 7 page routes, 2 unauthenticated API denials, cross-origin mutation denial.');
} finally {
  server.kill('SIGTERM');
  if (server.exitCode === null) await new Promise(resolve => server.once('exit', resolve));
}
