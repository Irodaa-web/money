import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import { familyStore } from '../lib/store.js';
import FamilyState from '../models/FamilyState.js';
const testUri = process.env.MONGODB_TEST_URI;
// This used to test a removed JSON-file store. Use an explicitly supplied test database.
test('MongoDB concurrent writes are atomic and failed mutations do not persist', { skip: !testUri }, async () => {
  process.env.MONGODB_URI = testUri;
  const id = randomBytes(12).toString('hex');
  try {
    await Promise.all(Array.from({ length: 6 }, () => familyStore(id, data => { data.wallets.child = (data.wallets.child || 0) + 1000; })));
    assert.equal(await familyStore(id, d => d.wallets.child, true), 6000);
    await assert.rejects(familyStore(id, data => { data.wallets.child = -99; throw new Error('abort'); }));
    assert.equal(await familyStore(id, d => d.wallets.child, true), 6000);
    await assert.rejects(familyStore('../escape', () => null));
  } finally { await FamilyState.deleteOne({ _id: id }); await mongoose.disconnect(); }
});
