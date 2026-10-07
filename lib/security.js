import { randomBytes, scrypt as rawScrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(rawScrypt);
export const hashToken = token => createHash('sha256').update(token).digest('hex');
export const newToken = () => randomBytes(32).toString('hex');
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `${salt}:${key.toString('hex')}`;
}
export async function checkPassword(password, stored) {
  const [salt, hex] = stored.split(':');
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(hex, 'hex');
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
export class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export function ensure(condition, message, status = 400) {
  if (!condition) throw new AppError(message, status);
}
export function cleanText(value, label, max = 500, min = 1) {
  ensure(typeof value === 'string', `${label}ni kiriting.`);
  const text = value.trim();
  ensure(text.length >= min && text.length <= max, `${label}: ${min}–${max} ta belgi kiriting.`);
  return text;
}
export function money(value) {
  ensure(typeof value === 'number' && Number.isSafeInteger(value) && value >= 1000 && value <= 10000000,
    'Summa 1 000 dan 10 000 000 so‘mgacha butun son bo‘lsin.');
  return value;
}
// Single-server burst protection. Use a shared limiter when scaling beyond one Node instance.
const attempts = globalThis.__bpAttempts ||= new Map();
export function rateLimit(key, max = 20, windowMs = 600000) {
  const now = Date.now();
  if (attempts.size > 10000) for (const [k, v] of attempts) if (v.until <= now) attempts.delete(k);
  let item = attempts.get(key);
  if (!item || item.until <= now) { item = { count: 0, until: now + windowMs }; attempts.set(key, item); }
  ensure(++item.count <= max, 'Urinishlar ko‘payib ketdi. Birozdan keyin qayta urinib ko‘ring.', 429);
}
