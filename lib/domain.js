import { randomUUID } from 'node:crypto';
import { ensure, cleanText, money } from './security.js';
import { queueSubmission } from './telegram-queue.js';
import { childProgress, TASK_XP } from './progression.js';
const now = () => new Date().toISOString();
export function notify(data, userId, text, details = {}) {
  const notification = { id: randomUUID(), userId, text, read: false, createdAt: now(), ...details };
  data.notifications.unshift(notification);
  data.notifications = data.notifications.slice(0, 500);
  return notification;
}
export function wallet(data, childId) {
  const balance = data.wallets[childId] || 0;
  const reserved = data.payouts.filter(p => p.childId === childId && p.status === 'pending').reduce((a, p) => a + p.amount, 0);
  return { balance, reserved, available: balance - reserved };
}
export function createTask(data, parentId, body, children) {
  ensure(children.includes(body.childId), 'Farzandingizni tanlang.', 403);
  const due = new Date(body.dueAt);
  ensure(Number.isFinite(due.getTime()) && due.getTime() > Date.now(), 'Muddat kelajakdagi sana va vaqt bo‘lsin.');
  const task = { id: randomUUID(), parentId, childId: body.childId, title: cleanText(body.title, 'Vazifa nomi', 120),
    description: cleanText(body.description || '', 'Izoh', 1000, 0), amount: money(body.amount), dueAt: due.toISOString(),
    status: 'active', createdAt: now(), revisionNote: '' };
  data.tasks.unshift(task);
  notify(data, task.childId, `Yangi vazifa: ${task.title}`);
  return task;
}
export function changeTask(data, actor, id, body) {
  const task = data.tasks.find(t => t.id === id);
  ensure(task, 'Vazifa topilmadi yoki allaqachon tasdiqlangan.', 404);
  const isParent = actor.role === 'parent' && actor.id === task.parentId;
  const isChild = actor.role === 'child' && actor.id === task.childId;
  ensure(isParent || isChild, 'Bu vazifa sizga tegishli emas.', 403);
  if (body.action === 'submit') {
    ensure(isChild, 'Vazifani faqat farzand bajarishga yuboradi.', 403);
    ensure(task.status === 'active', 'Vazifa allaqachon tekshirishga yuborilgan.', 409);
    const note = cleanText(body.note || '', 'Izoh', 500, 0);
    task.status = 'pending'; task.submittedAt = now();
    task.completionNote = note;
    task.photoId = body.photoId || null;
    const notification = notify(data, task.parentId, `Tekshirish kerak: ${actor.name} “${task.title}” vazifasini bajardi.`,
      { taskId: task.id, childId: task.childId, completionNote: note, photoId: task.photoId, telegramStatus: 'queued' });
    queueSubmission(data, task, actor, notification.id);
  } else if (body.action === 'approve') {
    ensure(isParent, 'Faqat ota-ona tasdiqlaydi.', 403);
    ensure(task.status === 'pending', 'Avval bola vazifani tekshirishga yuborsin.', 409);
    const previousProgress = childProgress(data, task.childId);
    data.experience ||= {};
    data.experience[task.childId] = previousProgress.totalXp + TASK_XP;
    data.wallets[task.childId] = (data.wallets[task.childId] || 0) + task.amount;
    data.transactions.unshift({ id: randomUUID(), childId: task.childId, type: 'reward', amount: task.amount, title: task.title, createdAt: now() });
    data.tasks = data.tasks.filter(t => t.id !== id);
    const progress = childProgress(data, task.childId);
    const levelMessage = progress.level > previousProgress.level ? ` Barakalla! ${progress.level}-darajaga ko‘tarildingiz!` : '';
    notify(data, task.childId, `Tasdiqlandi! “${task.title}” uchun ${task.amount.toLocaleString('en-US')} so‘m virtual mukofot va ${TASK_XP} XP qo‘shildi.${levelMessage}`);
  } else if (body.action === 'return') {
    ensure(isParent, 'Faqat ota-ona qaytaradi.', 403);
    ensure(task.status === 'pending', 'Bu vazifa tekshirishni kutmayapti.', 409);
    task.revisionNote = cleanText(body.note, 'Qaytarish sababi', 500);
    task.status = 'active'; delete task.submittedAt;
    notify(data, task.childId, `Vazifani qayta ko‘rib chiqing: ${task.revisionNote}`);
  } else if (body.action === 'delete') {
    ensure(isParent, 'Faqat ota-ona vazifani bekor qiladi.', 403);
    data.tasks = data.tasks.filter(t => t.id !== id);
    notify(data, task.childId, `“${task.title}” vazifasi ota-ona tomonidan bekor qilindi.`);
  } else ensure(false, 'Noma’lum amal.');
}
export function createGoal(data, childId, body) {
  ensure(data.goals.filter(g => g.childId === childId).length < 10, 'Ko‘pi bilan 10 ta maqsad qo‘shish mumkin.');
  data.goals.unshift({ id: randomUUID(), childId, title: cleanText(body.title, 'Maqsad nomi', 80), target: money(body.target), saved: 0, createdAt: now() });
}
export function changeGoal(data, childId, id, body) {
  const goal = data.goals.find(g => g.id === id && g.childId === childId);
  ensure(goal, 'Maqsad topilmadi.', 404);
  if (body.action === 'save') {
    const amount = money(body.amount);
    ensure(wallet(data, childId).available >= amount, 'Bo‘sh balans yetarli emas.');
    ensure(goal.saved + amount <= goal.target, 'Maqsadga kerakligidan ortiq summa kiritildi.');
    data.wallets[childId] = (data.wallets[childId] || 0) - amount;
    goal.saved += amount;
  } else if (body.action === 'release') {
    ensure(goal.saved > 0, 'Maqsadda hali pul yo‘q.');
    data.wallets[childId] = (data.wallets[childId] || 0) + goal.saved; goal.saved = 0;
  } else if (body.action === 'delete') {
    ensure(goal.saved === 0, 'Avval jamg‘armani balansga qaytaring.');
    data.goals = data.goals.filter(g => g.id !== id);
  } else ensure(false, 'Noma’lum amal.');
}
export function createPayout(data, child, body) {
  const amount = money(body.amount);
  ensure(wallet(data, child.id).available >= amount, 'Bo‘sh balans yetarli emas.');
  data.payouts.unshift({ id: randomUUID(), childId: child.id, amount, title: cleanText(body.title, 'So‘rov maqsadi', 120), status: 'pending', createdAt: now() });
  notify(data, child.parentId, `${child.name} ${amount} so‘mlik pul berish so‘rovini yubordi.`);
}
export function changePayout(data, parentId, id, body) {
  const p = data.payouts.find(p => p.id === id);
  ensure(p, 'So‘rov topilmadi.', 404);
  ensure(p.status === 'pending', 'So‘rov avval ko‘rib chiqilgan.', 409);
  ensure(['approve', 'reject'].includes(body.action), 'Noma’lum amal.');
  if (body.action === 'approve') {
    ensure((data.wallets[p.childId] || 0) >= p.amount, 'Balans yetarli emas.', 409);
    data.wallets[p.childId] -= p.amount;
    data.transactions.unshift({ id: randomUUID(), childId: p.childId, type: 'payout', amount: -p.amount, title: p.title, createdAt: now() });
  }
  p.status = body.action === 'approve' ? 'approved' : 'rejected'; p.resolvedAt = now();
  notify(data, p.childId, body.action === 'approve' ? 'Ota-ona pul berilganini qayd etdi. Virtual balans yangilandi.' : 'Pul berish so‘rovi rad etildi. Band summa yana foydalanish uchun ochiq.');
}
export function familyBalances(data, children) {
  const balances = children.map(child => {
    const funds = wallet(data, child.id);
    const saved = data.goals.filter(g => g.childId === child.id).reduce((sum, g) => sum + g.saved, 0);
    return { childId: child.id, name: child.name, ...funds, saved, owed: funds.balance + saved };
  });
  const totals = balances.reduce((sum, child) => ({
    balance: sum.balance + child.balance,
    reserved: sum.reserved + child.reserved,
    available: sum.available + child.available,
    saved: sum.saved + child.saved,
    owed: sum.owed + child.owed,
  }), { balance: 0, reserved: 0, available: 0, saved: 0, owed: 0 });
  return { children: balances, totals };
}

export function snapshot(data, actor, children) {
  const all = actor.role === 'parent';
  const own = list => list.filter(item => all || item.childId === actor.id);
  const ids = all ? children.map(c => c.id) : [actor.id];
  return { tasks: own(data.tasks), goals: own(data.goals), payouts: own(data.payouts), transactions: own(data.transactions).slice(0, 100),
    wallets: Object.fromEntries(ids.map(id => [id, wallet(data, id)])),
    progression: Object.fromEntries(ids.map(id => [id, childProgress(data, id)])),
    ...(all ? { familyBalances: familyBalances(data, children) } : {}),
    notifications: data.notifications.filter(n => n.userId === actor.id), children };
}
