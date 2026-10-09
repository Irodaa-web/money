import { receiveTelegram, secretMatches } from '@/lib/telegram';
import { connectDB } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  if (!secretMatches(request.headers.get('x-telegram-bot-api-secret-token'), process.env.TELEGRAM_WEBHOOK_SECRET)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const raw = await request.text();
    if (raw.length > 20000) return Response.json({ error: 'Too large' }, { status: 413 });
    const update = JSON.parse(raw);
    await connectDB(); await receiveTelegram(update);
    return Response.json({ ok: true });
  } catch { return Response.json({ error: 'Temporary failure' }, { status: 503 }); }
}
