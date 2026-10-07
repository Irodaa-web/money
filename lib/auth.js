import { cookies } from 'next/headers';
import { connectDB } from './db.js';
import User from '../models/User.js';
import { hashToken, newToken, ensure } from './security.js';

const cookieName = 'bp_session';
const cookieOptions = { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.COOKIE_SECURE === 'true' };
export function publicUser(user) {
  return { id: String(user._id), name: user.name, username: user.username, role: user.role,
    parentId: user.parentId ? String(user.parentId) : null, onboarded: user.onboarded };
}
export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  await connectDB();
  return User.findOne({ sessions: { $elemMatch: { hash: hashToken(token), expiresAt: { $gt: new Date() } } } });
}
export async function requireUser(role) {
  const user = await currentUser();
  ensure(user, 'Kabinetga kirish uchun avval tizimga kiring.', 401);
  ensure(!role || user.role === role, 'Bu amal sizning kabinetingiz uchun emas.', 403);
  return user;
}
export async function createSession(user) {
  const token = newToken();
  await User.updateOne({ _id: user._id }, { $pull: { sessions: { expiresAt: { $lte: new Date() } } } });
  await User.updateOne({ _id: user._id }, { $push: { sessions: {
    $each: [{ hash: hashToken(token), expiresAt: new Date(Date.now() + 7 * 86400000) }], $slice: -10,
  } } });
  (await cookies()).set(cookieName, token, { ...cookieOptions, maxAge: 7 * 86400 });
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) { await connectDB(); await User.updateOne({ 'sessions.hash': hashToken(token) }, { $pull: { sessions: { hash: hashToken(token) } } }); }
  jar.set(cookieName, '', { ...cookieOptions, maxAge: 0 });
}
