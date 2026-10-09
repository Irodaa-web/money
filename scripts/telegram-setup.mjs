// Run locally. Tokens stay in .env.local and are never printed or put in a URL in the terminal.
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
if (process.argv.includes('--secrets')) {
  console.log(`TELEGRAM_WEBHOOK_SECRET=${randomBytes(32).toString('hex')}`);
  console.log(`CRON_SECRET=${randomBytes(32).toString('hex')}`);
  process.exit(0);
}
const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_WEBHOOK_SECRET: secret, APP_ORIGIN: origin } = process.env;
if (!token || !secret || !origin) { console.error('.env.local: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET va APP_ORIGIN ni to‘ldiring.'); process.exit(1); }
if (!/^[A-Za-z0-9_-]{1,256}$/.test(secret)) { console.error('Webhook secret faqat harf, raqam, _ va - bo‘lsin.'); process.exit(1); }
if (!origin.startsWith('https://')) { console.error('APP_ORIGIN Vercel saytingizning https:// manzili bo‘lishi kerak.'); process.exit(1); }
async function call(method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  const result = await response.json(); if (!result.ok) throw new Error(`Telegram ${method}: xatolik ${result.error_code}. Token va sozlamalarni tekshiring.`);
  return result.result;
}
try {
  const me = await call('getMe', {});
  console.log(`Bot: @${me.username}. TELEGRAM_BOT_USERNAME shu qiymatga teng bo‘lsin.`);
  const url = `${new URL(origin).origin}/api/telegram/webhook`;
  await call('setWebhook', { url, secret_token: secret, allowed_updates: ['message'], drop_pending_updates: false });
  const info = await call('getWebhookInfo', {});
  console.log(`Webhook o‘rnatildi: ${info.url}`);
  console.log(`Kutilayotgan yangilanishlar: ${info.pending_update_count}`);
  if (info.last_error_message) console.log('Telegram oldingi yetkazishda xato qayd etgan. Deploy va secret mosligini tekshiring.');
} catch (e) { console.error(e.message?.includes('Telegram ') ? e.message : 'Telegram bilan ulanish bo‘lmadi. Internet va sozlamalarni tekshiring.'); process.exitCode = 1; }
