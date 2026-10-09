import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { decodePhoto, canViewPhoto } from '../lib/photo.js';
import { createTask, changeTask, snapshot } from '../lib/domain.js';
import { emptyFamily } from '../lib/store.js';
import { claimJob, finishJob, submissionCaption } from '../lib/telegram-queue.js';
import { secretMatches, telegramCall } from '../lib/telegram.js';
const parent = { id: 'a'.repeat(24), role: 'parent', name: 'Ota' };
const child = { id: 'b'.repeat(24), parentId: parent.id, role: 'child', name: 'Bola' };
function submission(photoId = 'c'.repeat(24)) {
  const data = emptyFamily();
  const task = createTask(data, parent.id, { childId: child.id, title: 'Xonani tozalash', amount: 20000, dueAt: new Date(Date.now() + 86400000).toISOString() }, [child.id]);
  changeTask(data, child, task.id, { action: 'submit', note: 'Tayyor!', photoId });
  return { data, task };
}
test('evidence, note, site notification and outbox are committed together; no reward until approval', () => {
  const { data, task } = submission();
  assert.equal(task.photoId, 'c'.repeat(24)); assert.equal(task.completionNote, 'Tayyor!');
  assert.equal(data.notifications[0].photoId, task.photoId);
  assert.equal(data.telegramOutbox[0].id, data.notifications[0].id);
  assert.equal(data.wallets[child.id], undefined);
  assert.throws(() => changeTask(data, child, task.id, { action: 'submit' }));
  assert.equal(data.telegramOutbox.length, 1);
  assert.equal(snapshot(data, child, []).telegramOutbox, undefined);
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(data.wallets[child.id], 20000);
  assert.ok(data.notifications.find(n => n.photoId === task.photoId), 'evidence remains in parent notification');
});
test('only owner and own parent may read photos', () => {
  const photo = { familyId: parent.id, childId: child.id };
  assert.ok(canViewPhoto(photo, parent)); assert.ok(canViewPhoto(photo, child));
  assert.equal(canViewPhoto(photo, { ...child, id: 'sibling' }), false);
  assert.equal(canViewPhoto(photo, { ...parent, id: 'other' }), false);
});
test('photo decoder rejects fake images and oversized inputs; strips metadata and bounds resolution', async () => {
  await assert.rejects(decodePhoto('data:image/jpeg;base64,SGVsbG8='));
  await assert.rejects(decodePhoto('data:image/svg+xml;base64,PHN2Zz4='));
  await assert.rejects(decodePhoto('x'.repeat(2100001)));
  assert.equal(await decodePhoto(undefined), null);
  const png = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: 'green' } }).png().toBuffer();
  const jpg = await decodePhoto(`data:image/png;base64,${png.toString('base64')}`);
  const meta = await sharp(jpg).metadata();
  assert.equal(meta.format, 'jpeg'); assert.equal(meta.width, 1600); assert.equal(meta.exif, undefined);
});
test('queue lease prevents concurrent sends; transient failure backs off; success removes only the claimed job', () => {
  const { data } = submission(); const job = claimJob(data, 1000);
  assert.equal(claimJob(data, 1001), null);
  finishJob(data, { ...job, lease: 'wrong' }, { ok: true }); assert.equal(data.telegramOutbox.length, 1);
  finishJob(data, job, { ok: false, retryAfter: 120 }, 2000);
  assert.equal(claimJob(data, 3000), null);
  const retry = claimJob(data, 123000); assert.ok(retry);
  finishJob(data, retry, { ok: true }); assert.equal(data.telegramOutbox.length, 0);
  assert.equal(data.notifications[0].telegramStatus, 'sent');
});
test('expired worker lease recovers and permanent errors stay failed until manual retry', () => {
  const { data } = submission(); claimJob(data, 1000);
  const retry = claimJob(data, 92000); assert.ok(retry);
  finishJob(data, retry, { ok: false, permanent: true });
  assert.equal(data.notifications[0].telegramStatus, 'failed'); assert.equal(claimJob(data, Date.now() + 99999999), null);
});
test('webhook secret must match; captions fit Telegram photo limit with maximum input', () => {
  assert.equal(secretMatches('', ''), false); assert.equal(secretMatches('secret', 'wrong'), false);
  assert.equal(secretMatches('secret', 'secret'), true);
  const { data } = submission(); const job = data.telegramOutbox[0];
  const caption = submissionCaption({ ...job, childName: 'x'.repeat(60), title: 'x'.repeat(120), note: 'x'.repeat(500) });
  assert.ok(caption.length < 1024); assert.match(caption, /Toshkent/);
});
test('resubmission without a new photo clears previous task evidence but preserves notification history', () => {
  const { data, task } = submission();
  changeTask(data, parent, task.id, { action: 'return', note: 'Qaytadan' });
  changeTask(data, child, task.id, { action: 'submit', note: '' });
  assert.equal(task.photoId, null); assert.equal(data.telegramOutbox.length, 2);
});
test('Telegram API request uses multipart photo bytes and sanitized errors', async () => {
  const original = globalThis.fetch, oldToken = process.env.TELEGRAM_BOT_TOKEN;
  process.env.TELEGRAM_BOT_TOKEN = 'test-secret';
  try {
    const form = new FormData(); form.set('photo', new Blob(['abc']), 'vazifa.jpg'); form.set('chat_id', '123');
    globalThis.fetch = async (url, opts) => { assert.match(url, /sendPhoto$/); assert.equal(opts.body, form); return Response.json({ ok: true, result: { message_id: 1 } }); };
    assert.equal((await telegramCall('sendPhoto', form)).message_id, 1);
    globalThis.fetch = async () => Response.json({ ok: false, error_code: 429, parameters: { retry_after: 90 }, description: 'secret details' }, { status: 429 });
    await assert.rejects(telegramCall('sendMessage', {}), e => e.retryAfter === 90 && !e.message.includes('secret'));
  } finally { globalThis.fetch = original; if (oldToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN; else process.env.TELEGRAM_BOT_TOKEN = oldToken; }
});
