import { randomUUID } from 'node:crypto';
export function queueSubmission(data, task, actor, notificationId) {
  data.telegramOutbox ||= [];
  const job = { id: notificationId, parentId: task.parentId, childId: actor.id, childName: actor.name,
    taskId: task.id, title: task.title, note: task.completionNote, photoId: task.photoId || null,
    submittedAt: task.submittedAt, status: 'queued', attempts: 0, nextAttemptAt: 0 };
  data.telegramOutbox.push(job);
  return job;
}
export function claimJob(data, now = Date.now()) {
  const job = (data.telegramOutbox || []).find(j =>
    (j.status === 'queued' && j.nextAttemptAt <= now) || (j.status === 'sending' && j.leaseUntil < now));
  if (!job) return null;
  job.status = 'sending'; job.lease = randomUUID(); job.leaseUntil = now + 90000; job.attempts++;
  return structuredClone(job);
}
export function finishJob(data, claimed, result, now = Date.now()) {
  const job = (data.telegramOutbox || []).find(j => j.id === claimed.id && j.lease === claimed.lease);
  if (!job) return;
  const note = data.notifications.find(n => n.id === job.id);
  if (result.ok) {
    if (note) { note.telegramStatus = 'sent'; note.telegramSentAt = new Date(now).toISOString(); }
    data.telegramOutbox = data.telegramOutbox.filter(j => j.id !== job.id);
  } else {
    job.status = result.permanent ? 'failed' : 'queued';
    job.nextAttemptAt = now + Math.max(result.retryAfter || 0, Math.min(3600, 30 * 2 ** Math.min(job.attempts, 7))) * 1000;
    job.lastError = result.reason || 'Telegram bilan ulanish bo‘lmadi.';
    delete job.lease; delete job.leaseUntil;
    if (note) note.telegramStatus = result.permanent ? 'failed' : 'queued';
  }
}
export function submissionCaption(job) {
  const time = new Intl.DateTimeFormat('uz-UZ', { timeZone: 'Asia/Tashkent', dateStyle: 'short', timeStyle: 'short' }).format(new Date(job.submittedAt));
  return `✅ Vazifa tekshirishga yuborildi\n\n👤 Farzand: ${job.childName}\n📋 Vazifa: ${job.title}\n💬 Izoh: ${job.note || 'Izoh qoldirilmagan'}\n🕒 ${time} (Toshkent)\n\nMukofot siz tasdiqlaganingizdan keyin beriladi.`;
}
