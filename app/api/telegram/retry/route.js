import User from '@/models/User';
import FamilyState from '@/models/FamilyState';
import { connectDB } from '@/lib/db';
import { drainTelegram, secretMatches } from '@/lib/telegram';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request) {
  if (!secretMatches(request.headers.get('authorization'), process.env.CRON_SECRET && `Bearer ${process.env.CRON_SECRET}`)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const now = Date.now();
  const linked = await User.find({ role: 'parent', 'telegram.chatId': { $exists: true } }).select('_id').lean();
  const families = await FamilyState.find({ _id: { $in: linked.map(u => String(u._id)) }, 'data.telegramOutbox': { $elemMatch: { $or: [
    { status: 'queued', nextAttemptAt: { $lte: now } }, { status: 'sending', leaseUntil: { $lt: now } },
  ] } } }).sort({ updatedAt: 1 }).select('_id').limit(10).lean();
  await Promise.all(families.map(f => drainTelegram(f._id, 1)));
  return Response.json({ ok: true, checked: families.length });
}
