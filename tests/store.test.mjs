import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { familyStore } from '../lib/store.js';
const id = 'f'.repeat(24);
test('parallel writes are atomic and failed mutations leave persisted state unchanged', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'bp-test-')); process.env.DATA_DIR = dir;
  try {
    await Promise.all(Array.from({ length: 20 }, () => familyStore(id, data => { data.wallets.child = (data.wallets.child || 0) + 1000; })));
    assert.equal(await familyStore(id, d => d.wallets.child, true), 20000);
    await assert.rejects(familyStore(id, data => { data.wallets.child = -99; throw new Error('abort'); }));
    assert.equal(JSON.parse(await readFile(path.join(dir, `${id}.json`), 'utf8')).wallets.child, 20000);
    await assert.rejects(familyStore('../escape', () => null));
  } finally { await rm(dir, { recursive: true, force: true }); delete process.env.DATA_DIR; }
});
