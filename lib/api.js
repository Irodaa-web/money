import { randomBytes } from 'node:crypto';
import TaskPhoto from '../models/TaskPhoto.js';
import { decodePhoto, canViewPhoto } from './photo.js';
import { telegramReady, makeTelegramLink, drainTelegram } from './telegram.js';
import { NextResponse } from 'next/server';
import { connectDB } from './db.js';
import User from '../models/User.js';
import { currentUser, requireUser, publicUser, createSession, logout } from './auth.js';
import { AppError, ensure, cleanText, hashPassword, checkPassword, hashToken, rateLimit } from './security.js';
import { familyStore } from './store.js';
import { createTask, changeTask, createGoal, changeGoal, createPayout, changePayout, snapshot } from './domain.js';

const json = (value, status = 200) => NextResponse.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
async function getBody(request, limit = 16000) {
  const raw = await request.text();
  ensure(raw.length < limit, 'Yuborilgan ma’lumot juda katta.', 413);
  try { const b = JSON.parse(raw); ensure(b && typeof b === 'object' && !Array.isArray(b), 'Noto‘g‘ri so‘rov.'); return b; }
  catch { throw new AppError('So‘rov JSON formatida bo‘lishi kerak.'); }
}
function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const configuredOrigin = process.env.APP_ORIGIN;

  ensure(
    configuredOrigin,
    '.env.local faylida APP_ORIGIN manzilini kiriting.',
    500
  );

  const allowedOrigin = new URL(configuredOrigin).origin;

  ensure(
    origin === allowedOrigin,
    'So‘rov manbasi tasdiqlanmadi.',
    403
  );

  const contentType = request.headers.get('content-type') || '';

  ensure(
    contentType.startsWith('application/json'),
    'JSON so‘rov kerak.',
    415
  );
}
async function family(user) {
  return user.role === 'parent' ? String(user._id) : String(user.parentId);
}
export async function handle(request, context) {
  try {
    const { path = [] } = await context.params;
    const route = path.join('/');
    const method = request.method;
    const mutation = method !== 'GET';
    if (mutation) sameOrigin(request);
    const body = mutation ? await getBody(request, method === 'PATCH' && path[0] === 'tasks' ? 2200000 : 16000) : {};
    if (method === 'POST' && ['auth/register', 'auth/login'].includes(route)) {
      const username = cleanText(body.username, 'Login', 32, 3).toLowerCase();
      ensure(/^[a-z0-9_.-]+$/.test(username), 'Login uchun lotin harflari, raqam, nuqta, pastki chiziq ishlating.');
      const password = cleanText(body.password, 'Parol', 128, 8);
      rateLimit(`auth:${username}`, 15);
      rateLimit('auth:global', 200);
      await connectDB();
      if (route === 'auth/login') {
        const user = await User.findOne({ username }).select('+passwordHash');
        // Run the same password work when a username does not exist.
        const valid = await checkPassword(password, user?.passwordHash || `${'0'.repeat(32)}:${'0'.repeat(128)}`);
        ensure(user && valid, 'Login yoki parol noto‘g‘ri.', 401);
        await createSession(user);
        return json({ user: publicUser(user) });
      }
      ensure(['parent', 'child'].includes(body.role), 'Ota-ona yoki bola rolini tanlang.');
      const name = cleanText(body.name, 'Ism', 60, 2);
      ensure(!await User.exists({ username }), 'Bu login band. Boshqa login tanlang.', 409);
      const passwordHash = await hashPassword(password);
      let parent = null, invitation = null;
      if (body.role === 'child') {
        const code = cleanText(body.inviteCode, 'Oila kodi', 16, 12).toUpperCase();
        rateLimit('invite:global', 100);
        invitation = { hash: hashToken(code), expiresAt: { $gt: new Date() } };
        parent = await User.findOneAndUpdate({ role: 'parent', invitations: { $elemMatch: invitation } },
          { $pull: { invitations: { hash: invitation.hash } } });
        ensure(parent, 'Oila kodi xato, ishlatilgan yoki muddati tugagan. Ota-onadan yangi kod so‘rang.');
      }
      let user;
      try { user = await User.create({ name, username, passwordHash, role: body.role, parentId: parent?._id || null }); }
      catch (error) {
        if (parent) {
          const original = parent.invitations.find(i => i.hash === invitation.hash);
          if (original) await User.updateOne({ _id: parent._id }, { $push: { invitations: original.toObject() } });
        }
        throw error;
      }
      await createSession(user);
      return json({ user: publicUser(user) }, 201);
    }
    if (route === 'auth/logout' && method === 'POST') { await logout(); return json({ ok: true }); }
    if (route === 'auth/me' && method === 'GET') {
      const user = await currentUser(); ensure(user, 'Avval tizimga kiring.', 401); return json({ user: publicUser(user) });
    }
    const user = await requireUser();
    const actor = publicUser(user);
    if (mutation) rateLimit(`user:${actor.id}`, 120, 60000);
    if (route === 'onboarding' && method === 'POST') {
      await User.updateOne({ _id: user._id }, { $set: { onboarded: true } }); return json({ ok: true });
    }
    if (route === 'family/invite' && method === 'POST') {
      ensure(actor.role === 'parent', 'Taklifni ota-ona yaratadi.', 403);
      const code = randomBytes(6).toString('hex').toUpperCase();
      const expiresAt = new Date(Date.now() + 86400000);
      await User.updateOne({ _id: user._id }, { $pull: { invitations: { expiresAt: { $lte: new Date() } } } });
      await User.updateOne({ _id: user._id }, { $push: { invitations: { $each: [{ hash: hashToken(code), expiresAt }], $slice: -5 } } });
      return json({ code, expiresAt });
    }
    const familyId = await family(user);
    if (route.startsWith('telegram/')) {
      ensure(actor.role === 'parent', 'Telegram’ni ota-ona ulaydi.', 403);
      if (route === 'telegram/status' && method === 'GET') {
        const queue = await familyStore(familyId, d => d.telegramOutbox || [], true);
        return json({ configured: telegramReady(), linked: Boolean(user.telegram?.chatId), username: user.telegram?.username || '',
          waiting: queue.length, failed: queue.filter(j => j.status === 'failed').length });
      }
      if (route === 'telegram/link' && method === 'POST') return json(await makeTelegramLink(actor.id));
      if (route === 'telegram/disconnect' && method === 'POST') {
        await User.updateOne({ _id: user._id }, { $unset: { telegram: 1 } }); return json({ ok: true });
      }
      if (route === 'telegram/resend' && method === 'POST') {
        ensure(user.telegram?.chatId, 'Avval Telegram’ni ulang.');
        await familyStore(familyId, d => { for (const j of d.telegramOutbox || []) if (j.status !== 'sending') {
          j.status = 'queued'; j.nextAttemptAt = 0;
        } });
        await drainTelegram(familyId); return json({ ok: true });
      }
    }
    if (path[0] === 'photos' && path.length === 2 && method === 'GET') {
      ensure(/^[a-f0-9]{24}$/.test(path[1]), 'Rasm topilmadi.', 404);
      const photo = await TaskPhoto.findById(path[1]).select('+bytes');
      ensure(photo && canViewPhoto(photo, actor), 'Rasm topilmadi.', 404);
      return new Response(new Uint8Array(photo.bytes), { headers: {
        'Content-Type': 'image/jpeg', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline; filename="vazifa.jpg"',
      } });
    }

    const children = actor.role === 'parent' ? (await User.find({ parentId: user._id, role: 'child' }).sort({ createdAt: 1 })).map(publicUser) : [];
    if (route === 'state' && method === 'GET') {
      return json(await familyStore(familyId, data => snapshot(data, actor, children), true));
    }
    if (route === 'notifications/read' && method === 'POST') {
      await familyStore(familyId, data => { data.notifications.forEach(n => { if (n.userId === actor.id) n.read = true; }); });
      return json({ ok: true });
    }
    if (route === 'tasks' && method === 'POST') {
      ensure(actor.role === 'parent', 'Vazifani ota-ona yaratadi.', 403);
      const task = await familyStore(familyId, data => createTask(data, actor.id, body, children.map(c => c.id)));
      return json({ task }, 201);
    }
    if (path[0] === 'tasks' && path.length === 2 && method === 'PATCH') {
      // The browser may never choose another upload's ID.
      const safeBody = { action: body.action, note: body.note };
      let photo = null;
      if (body.action === 'submit') {
        await familyStore(familyId, data => {
          const task = data.tasks.find(t => t.id === path[1]);
          ensure(actor.role === 'child' && task?.childId === actor.id, 'Bu vazifa sizga tegishli emas.', 403);
          ensure(task.status === 'active', 'Vazifa allaqachon yuborilgan.', 409);
        }, true);
        cleanText(body.note || '', 'Izoh', 500, 0);
        const bytes = await decodePhoto(body.photo);
        if (bytes) {
          photo = await TaskPhoto.create({ familyId, childId: actor.id, taskId: path[1], bytes });
          safeBody.photoId = String(photo._id);
        }
      }
      if (photo) await TaskPhoto.updateOne({ _id: photo._id }, { $unset: { expiresAt: 1 } });
      try { await familyStore(familyId, data => changeTask(data, actor, path[1], safeBody)); }
      catch (e) { if (photo) await TaskPhoto.deleteOne({ _id: photo._id }); throw e; }
      // Submission is committed; delivery failures must not turn success into an error.
      if (body.action === 'submit') {
        try { await drainTelegram(familyId, 1); } catch { /* Saved queue is retried by cron or parent. */ }
      }
      return json({ ok: true });
    }
    if (route === 'goals' && method === 'POST') {
      ensure(actor.role === 'child', 'Maqsadni bola yaratadi.', 403);
      await familyStore(familyId, data => createGoal(data, actor.id, body)); return json({ ok: true }, 201);
    }
    if (path[0] === 'goals' && path.length === 2 && method === 'PATCH') {
      ensure(actor.role === 'child', 'Maqsadni bola boshqaradi.', 403);
      await familyStore(familyId, data => changeGoal(data, actor.id, path[1], body)); return json({ ok: true });
    }
    if (route === 'payouts' && method === 'POST') {
      ensure(actor.role === 'child', 'So‘rovni bola yuboradi.', 403);
      await familyStore(familyId, data => createPayout(data, actor, body)); return json({ ok: true }, 201);
    }
    if (path[0] === 'payouts' && path.length === 2 && method === 'PATCH') {
      ensure(actor.role === 'parent', 'So‘rovni ota-ona tasdiqlaydi.', 403);
      await familyStore(familyId, data => changePayout(data, actor.id, path[1], body)); return json({ ok: true });
    }
    return json({ error: 'Bunday API manzil yoki amal mavjud emas.' }, 404);
  } catch (error) {
    if (error instanceof AppError) return json({ error: error.message }, error.status);
    if (error.code === 11000) return json({ error: 'Bu login band. Boshqasini tanlang.' }, 409);
    if (['MongooseServerSelectionError', 'MongoServerSelectionError', 'MongoNetworkError'].includes(error.name)) {
      return json({ error: 'Ma’lumotlar bazasiga ulanish bo‘lmadi. MongoDB serveri ishlayotganini va .env.local dagi manzilni tekshiring.' }, 503);
    }
    console.error('[Birinchi Pul]', error.name, error.message);
    return json({ error: 'Serverda xatolik. Iltimos, qayta urinib ko‘ring.' }, 500);
  }
}
