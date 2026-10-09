import { timingSafeEqual, randomBytes } from 'node:crypto';
import User from '../models/User.js';
import TaskPhoto from '../models/TaskPhoto.js';
import { ensure, hashToken } from './security.js';
import { familyStore } from './store.js';
import { claimJob, finishJob, submissionCaption } from './telegram-queue.js';
export function telegramReady() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_USERNAME && process.env.TELEGRAM_WEBHOOK_SECRET && process.env.APP_ORIGIN);
}
export function secretMatches(actual, expected) {
  if (!actual || !expected) return false;
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function telegramCall(method, payload) {
  ensure(process.env.TELEGRAM_BOT_TOKEN, 'Telegram bot hali sozlanmagan.', 503);
  let response, result;
  try {
    response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST', signal: AbortSignal.timeout(10000),
      ...(payload instanceof FormData ? { body: payload } : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    });
    result = await response.json();
  } catch { const e = new Error('Telegram bilan ulanish bo‘lmadi.'); e.retryAfter = 30; throw e; }
  if (!response.ok || !result.ok) {
    // Never expose the request URL/token or untrusted Telegram text in logs.
    const e = new Error('Telegram xabarni qabul qilmadi.');
    e.code = result.error_code || response.status;
    e.retryAfter = result.parameters?.retry_after || 30;
    e.permanent = [400, 401, 403, 404].includes(e.code);
    throw e;
  }
  return result.result;
}
export async function makeTelegramLink(userId) {
  ensure(telegramReady(), 'Telegram hali sozlanmagan. Sayt egasi bot sozlamalarini kiritishi kerak.', 503);
  const token = randomBytes(24).toString('hex');
  await User.updateOne({ _id: userId, role: 'parent' }, { $set: {
    'telegram.linkHash': hashToken(token), 'telegram.linkExpiresAt': new Date(Date.now() + 10 * 60000),
  } });
  const username = process.env.TELEGRAM_BOT_USERNAME.replace(/^@/, '');
  ensure(/^[A-Za-z0-9_]{5,32}$/.test(username), 'Bot username sozlamasi noto‘g‘ri.', 503);
  return { url: `https://t.me/${username}?start=${token}` };
}
export async function drainTelegram(familyId, limit = 3) {
  if (!telegramReady()) return;
  const parent = await User.findOne({ _id: familyId, role: 'parent' });
  const chatId = parent?.telegram?.chatId;
  if (!chatId) return;
  for (let i = 0; i < limit; i++) {
    const job = await familyStore(familyId, data => claimJob(data));
    if (!job) break;
    let result;
    try {
      // A disconnect cancels further deliveries, even during a drain.
      if (!await User.exists({ _id: familyId, 'telegram.chatId': chatId })) {
        await familyStore(familyId, data => finishJob(data, job, { ok: false })); break;
      }
      const caption = submissionCaption(job);
      const markup = { inline_keyboard: [[{ text: 'Vazifani ko‘rish', url: `${new URL(process.env.APP_ORIGIN).origin}/parent/tasks#task-${job.taskId}` }]] };
      if (job.photoId) {
        const photo = await TaskPhoto.findOne({ _id: job.photoId, familyId, childId: job.childId }).select('+bytes');
        ensure(photo, 'Vazifa rasmi topilmadi.', 404);
        const form = new FormData();
        form.set('chat_id', chatId); form.set('caption', caption);
        form.set('reply_markup', JSON.stringify(markup));
        form.set('photo', new Blob([photo.bytes], { type: 'image/jpeg' }), 'vazifa.jpg');
        await telegramCall('sendPhoto', form);
      } else await telegramCall('sendMessage', { chat_id: chatId, text: caption, reply_markup: markup });
      result = { ok: true };
    } catch (e) { result = { ok: false, permanent: Boolean(e.permanent), retryAfter: e.retryAfter, reason: 'Telegram orqali yetkazilmadi. Bot ulanishini tekshiring.' }; }
    await familyStore(familyId, data => finishJob(data, job, result));
    if (!result.ok) break;
  }
}
export async function receiveTelegram(update) {
  const message = update.message;
  if (!message || message.chat?.type !== 'private' || message.from?.is_bot || message.from?.id !== message.chat?.id) return;
  const chatId = String(message.chat.id);
  const text = message.text || '';
  if (/^\/stop(?:@\w+)?$/.test(text)) {
    await User.updateMany({ 'telegram.chatId': chatId }, { $unset: { telegram: 1 } });
    await telegramCall('sendMessage', { chat_id: chatId, text: 'Xabarnomalar to‘xtatildi. Qayta ulash uchun saytdagi “Telegram’ni ulash” tugmasini bosing.' });
    return;
  }
  const match = /^\/start(?:@\w+)? ([a-f0-9]{48})$/.exec(text);
  let reply = 'Birinchi Pul xabarnomalari uchun ota-ona kabinetingizdagi “Telegram’ni ulash” tugmasini bosing. /stop — ulanishni uzish.';
  if (match) {
    // Consume the short-lived token atomically. Telegram username is never used as identity.
    const parent = await User.findOneAndUpdate({ role: 'parent', 'telegram.linkHash': hashToken(match[1]), 'telegram.linkExpiresAt': { $gt: new Date() } }, {
      $set: { 'telegram.chatId': chatId, 'telegram.username': message.from.username || '', 'telegram.linkedAt': new Date() },
      $unset: { 'telegram.linkHash': 1, 'telegram.linkExpiresAt': 1 },
    }, { new: true });
    reply = parent ? '✅ Telegram ulandi! Endi farzandingiz topshirgan vazifa, rasm va izoh shu yerga keladi. /stop — ulanishni uzish.'
      : 'Havola ishlatilgan yoki muddati tugagan. Saytdan yangi ulash havolasini oling.';
  }
  await telegramCall('sendMessage', { chat_id: chatId, text: reply });
}
