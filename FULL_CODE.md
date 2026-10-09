# Birinchi Pul — joriy kod nusxasi

Ishga tushirish uchun alohida fayllarni ishlating. Telegram sozlash: TELEGRAM-ORNATISH.md.

## app/api/[...path]/route.js

```javascript
import { handle } from '@/lib/api';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = handle;
export const POST = handle;
export const PATCH = handle;

export const maxDuration = 60;

```

## app/api/telegram/retry/route.js

```javascript
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

```

## app/api/telegram/webhook/route.js

```javascript
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

```

## app/child/[section]/page.js

```javascript
import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
export default async function ChildSection({ params }) {
  const { section } = await params;
  if (!['tasks', 'goals', 'wallet', 'notifications', 'learn'].includes(section)) notFound();
  return <Dashboard role="child" section={section} />;
}

```

## app/child/page.js

```javascript
import Dashboard from '@/components/Dashboard';
export default function ChildPage() { return <Dashboard role="child" />; }

```

## app/error.js

```javascript
'use client';
export default function ErrorPage({ reset }) { return <main className="center-page"><div className="card"><h1>Sahifa yuklanmadi</h1><p>Ulanishni tekshirib, qayta urinib ko‘ring.</p><button className="button primary" onClick={reset}>Qayta urinish</button></div></main>; }

```

## app/globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;450;500;550;600;650;700&family=Manrope:wght@400;500;600;650;700;750;800&display=swap');
:root{--bg:#f7f8fa;--paper:#fff;--ink:#202f2b;--muted:#7c8782;--green:#247451;--green-dark:#17593d;--lime:#eaf1d4;--soft:#eef6ee;--line:#e8ece8;--amber:#996321;--radius:18px;--shadow:0 12px 40px #23362b08}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:var(--bg);font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.55}h1,h2,h3,h4,p{margin-top:0}h1,h2,h3{font-family:'Manrope',Arial,sans-serif;line-height:1.3;letter-spacing:-.04em}h1{font-size:34px;font-weight:800}h2{font-size:23px;font-weight:750}h3{font-size:17px;font-weight:750}p{color:var(--muted)}a{color:inherit;text-decoration:none}button,input,select,textarea{font:inherit}button,a,input,textarea,select{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:disabled{cursor:not-allowed;opacity:.58}button{border:0}button:focus-visible,a:focus-visible{outline:3px solid #8dba78;outline-offset:4px}input:focus,select:focus,textarea:focus{outline:2px solid #6d9c7b;outline-offset:1px}svg{flex-shrink:0}em{font-style:normal;color:var(--green)}small{font-size:12px;color:var(--muted)}.button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:44px;padding:11px 18px;border-radius:10px;font-size:13px;font-weight:650;transition:background .15s,transform .15s;text-align:center;border:1px solid transparent}.button:hover:not(:disabled){transform:translateY(-1px)}.primary{background:var(--green);color:white}.primary:hover:not(:disabled){background:var(--green-dark)}.light{background:#f4f6f3;border-color:var(--line);color:var(--ink)}.white{background:white;color:var(--green)}.ghost{background:transparent;color:var(--muted)}.danger{background:#aa403c;color:white}.full{width:100%}.text-button{background:transparent;color:var(--green);padding:8px 0;font-size:12px;font-weight:600}.text-link{font-size:13px;font-weight:650;color:var(--green);display:inline-flex;align-items:center;gap:7px}.danger-text{color:#b55c52}.icon-button{width:39px;height:39px;display:inline-flex;align-items:center;justify-content:center;border-radius:11px;background:transparent;color:var(--muted)}.icon-button:hover{background:#f0f3ef}.eyebrow{font-size:10px;font-weight:750;letter-spacing:1.8px;color:var(--green);display:block;margin-bottom:12px}.brand{display:inline-flex;align-items:center;gap:10px;white-space:nowrap;font-family:'Manrope',Arial,sans-serif;font-size:23px;font-weight:800;letter-spacing:-1px}.brand-mark{width:37px;height:37px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:var(--green);color:#e6f4cf}.brand-light{font-weight:500}.brand i{display:inline-block;width:5px;height:5px;background:#a9bf7c;border-radius:50%;margin-left:2px}.avatar{width:37px;height:37px;border-radius:50%;background:#f0e9d8;display:inline-flex;align-items:center;justify-content:center;color:#776244;font-weight:750;flex-shrink:0}.avatar.big{height:48px;width:48px;font-size:20px}.dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#6b9a5b}.card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:25px;box-shadow:var(--shadow)}.progress{height:8px;background:#edf0e6;overflow:hidden;border-radius:20px}.progress>span{display:block;height:100%;border-radius:20px;background:#7ca966;transition:width .4s}.alert{padding:13px 15px;font-size:12px;line-height:1.6;background:#f5f3e8;color:#7d7050;border:1px solid #eee9d5;border-radius:10px;margin:14px 0;overflow-wrap:anywhere}.alert.error{background:#fff0ee;border-color:#efd4cf;color:#a1413c}.alert.success{background:#edf6eb;border-color:#d5e7cf;color:#357041}.page-alert{display:flex;justify-content:space-between;align-items:center;gap:12px}.center-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}.center-page>.card{max-width:560px}.loading{text-align:center}.spinner{display:inline-block;width:32px;height:32px;border:3px solid var(--line);border-top-color:var(--green);border-radius:50%;animation:spin 1s linear infinite}.loading p{margin-top:18px}@keyframes spin{to{transform:rotate(360deg)}}
/* Landing */
.landing{background:#fbfcf7}.landing-nav{height:100px;max-width:1220px;margin:auto;display:flex;align-items:center;justify-content:space-between;padding:0 40px}.landing-nav>div{display:flex;gap:36px;align-items:center;font-size:13px}.hero{max-width:1220px;margin:auto;padding:85px 40px 100px;display:grid;grid-template-columns:1.1fr 1fr;gap:70px;align-items:center}.pill{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;font-size:11px;font-weight:600;background:#edf2e5;color:#54734b;border:1px solid #e2e8d8;border-radius:40px}.hero h1{font-size:57px;letter-spacing:-3px;line-height:1.16;margin:25px 0}.hero>div>p{max-width:450px;font-size:16px;line-height:1.85}.hero-actions{display:flex;gap:24px;align-items:center;margin-top:30px}.hero-note{font-size:11px;color:var(--muted);display:flex;gap:10px;align-items:center;margin-top:27px}.hero-art{position:relative;padding:35px 10px}.art-orbit{position:absolute;width:460px;height:460px;border-radius:50%;background:#eaf0db;top:0;left:-15px}.hero-preview{position:relative;background:#fff;border:1px solid #e1e6d9;border-radius:24px;padding:25px;width:100%;max-width:370px;margin:auto;transform:rotate(-4deg);box-shadow:0 24px 70px #3b532320}.preview-top{display:flex;gap:12px;align-items:center;margin-bottom:25px}.preview-top small{display:block;font-size:9px;letter-spacing:1px}.preview-top strong{font-size:12px}.preview-balance{background:var(--green);color:white;padding:25px 20px;border-radius:16px}.preview-balance small{color:#c9e3d2;font-size:9px;letter-spacing:1px}.preview-balance h2{font-size:32px;margin:10px 0}.preview-balance h2 span{font-size:14px;font-weight:500}.preview-balance>span{font-size:10px;color:#cee1cf}.preview-goal{display:flex;gap:14px;align-items:center;margin:25px 0 18px}.goal-emoji{background:#f4f0e6;border-radius:12px;font-size:28px;padding:8px}.preview-goal strong{font-size:12px}.preview-goal small{display:block;margin-top:4px;font-size:10px}.preview-caption{display:block;font-size:9px;margin-top:18px;text-align:center}.floating-badge{position:absolute;display:flex;align-items:center;gap:12px;right:-20px;top:5px;background:white;border:1px solid var(--line);padding:15px 20px;border-radius:14px;box-shadow:0 10px 30px #39483112;transform:rotate(5deg);z-index:2;font-size:10px}.floating-badge strong{display:block;color:var(--green);font-size:15px;margin-top:3px}.success-icon{background:#ecf3df;color:#598544;width:35px;height:35px;border-radius:50%;display:flex;align-items:center;justify-content:center}.floating-star{position:absolute;color:#b6c976;font-size:70px;bottom:5px;right:0;transform:rotate(18deg)}.how-section{max-width:1140px;margin:auto;padding:60px 0 90px;border-top:1px solid #e4e9dc}.how-section>h2{font-size:32px}.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:45px;margin-top:38px}.how-number{display:flex;align-items:center;justify-content:space-between;color:var(--green);margin-bottom:22px}.how-number>span{font-size:35px;letter-spacing:-2px;color:#d1dbc6;font-family:'Manrope',sans-serif;font-weight:800}.how-grid p{font-size:13px;line-height:1.9}.landing footer{padding:35px 40px;max-width:1220px;margin:auto;border-top:1px solid #e4e9dc;display:flex;align-items:center;justify-content:space-between;gap:20px}.landing footer p{margin:0;font-size:12px}.landing footer>span{font-size:10px;color:var(--muted)}
/* Authentication */
.auth-page{min-height:100vh;display:grid;grid-template-columns:44% 56%;background:white}.auth-story{padding:45px 65px;background:#edf2e4;display:flex;flex-direction:column;justify-content:space-between;min-height:100vh}.auth-story>div{margin:60px 0 30px}.auth-story h1{font-size:46px;letter-spacing:-2px;line-height:1.25}.auth-story p{max-width:330px;font-size:15px;line-height:1.8}.auth-story>small{font-size:11px}.story-graphic{position:relative;height:230px;margin-top:35px;display:flex;align-items:center;justify-content:center;max-width:330px}.goal-illustration{padding:30px;background:#fffdf4;border:1px solid #e4e8d5;border-radius:20px;display:flex;flex-direction:column;gap:14px;align-items:center;transform:rotate(-5deg);color:var(--green);width:235px;box-shadow:0 15px 30px #3b532310}.goal-illustration .progress{width:100%}.goal-illustration small{font-size:9px}.coin{position:absolute;width:55px;height:55px;border-radius:50%;background:#dcc68b;border:5px solid #efe0b1;display:flex;align-items:center;justify-content:center;color:#92772f;font-size:26px;z-index:2}.coin-one{top:15px;right:-5px}.coin-two{bottom:5px;left:-5px;width:43px;height:43px;font-size:18px}.auth-main{padding:35px 60px;display:flex;flex-direction:column}.back-link{font-size:12px;color:var(--muted);align-self:flex-start}.auth-form{width:100%;max-width:400px;margin:auto;padding:50px 0}.auth-form h2{font-size:29px}.auth-form>p{font-size:13px;line-height:1.7}.role-switch{display:flex;gap:5px;background:#f4f6f1;padding:5px;border-radius:11px;margin:25px 0}.role-switch button{width:50%;display:flex;align-items:center;justify-content:center;gap:8px;background:transparent;border-radius:8px;padding:10px 5px;font-size:12px;color:var(--muted)}.role-switch button.selected{background:white;color:var(--green);box-shadow:0 2px 6px #263f1910;font-weight:700}form label{display:block;font-size:12px;font-weight:650;margin-bottom:17px}input,select,textarea{display:block;width:100%;padding:12px 13px;background:white;color:var(--ink);border:1px solid #dfe5df;border-radius:9px;margin-top:7px;min-height:44px;font-size:13px}input::placeholder,textarea::placeholder{color:#a3aba4;font-weight:400}textarea{resize:vertical}label small{display:block;font-size:10px;font-weight:400;line-height:1.5;margin-top:6px}.password-field{position:relative}.password-field input{padding-right:75px}.password-field button{position:absolute;right:8px;top:7px;bottom:7px;background:transparent;font-size:10px;color:var(--green)}.auth-form form>.button{margin-top:7px}.auth-bottom{text-align:center;margin:22px 0 0}.auth-bottom a{color:var(--green);font-weight:700}
/* Dashboard frame */
.app-shell{display:flex;min-height:100vh}.sidebar{width:240px;padding:28px 20px 18px;background:white;position:fixed;inset:0 auto 0 0;border-right:1px solid var(--line);display:flex;flex-direction:column;z-index:10;overflow-y:auto}.sidebar .brand{margin-left:7px;font-size:23px}.workspace-label{font-size:9px;font-weight:650;letter-spacing:1.8px;color:#9aa49d;margin:40px 13px 13px}.nav-item{display:flex;align-items:center;gap:12px;width:100%;padding:12px 13px;margin-bottom:5px;border-radius:9px;font-size:12px;color:#7b867f;text-align:left;background:transparent;white-space:nowrap}.nav-item:hover{background:#f5f7f2}.nav-item.active{background:#edf4e9;color:var(--green);font-weight:750}.nav-item b{font-size:9px;padding:0 5px;border-radius:5px;background:#dce9d4;margin-left:auto;min-width:18px;text-align:center;color:var(--green)}.sidebar-bottom{margin-top:auto;padding-top:35px}.grow-note{background:#f8f9f2;border:1px solid #eef1e5;border-radius:13px;padding:17px 14px;margin-bottom:15px}.grow-note>span{display:block;font-size:25px;margin-bottom:8px}.grow-note strong{font-size:11px}.grow-note p{font-size:10px;line-height:1.7;margin:7px 0 0}.app-main{margin-left:240px;width:calc(100% - 240px)}.topbar{height:85px;padding:0 38px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);background:#fff}.breadcrumb{font-size:11px;color:#9aA39d;display:flex;gap:12px;align-items:center}.breadcrumb strong{font-weight:500;color:#5e6e63}.topbar-right{display:flex;align-items:center;gap:15px}.virtual-label{display:flex;align-items:center;gap:6px;font-size:10px;color:#87927e;background:#f5f7ee;border-radius:6px;padding:5px 8px}.notification-button{position:relative;margin-left:4px}.notification-button i{position:absolute;top:7px;right:8px;width:6px;height:6px;background:#df9d64;border:1px solid white;border-radius:50%}.profile-text strong{display:block;font-size:11px}.profile-text small{display:block;font-size:9px}.dashboard-content{padding:37px 38px 0;max-width:1600px;margin:auto}.page-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:28px}.page-heading .eyebrow{font-size:8px;letter-spacing:1.6px;margin-bottom:8px;color:#96a08f}.page-heading h1{font-size:29px;letter-spacing:-1.3px;margin:0 0 8px}.page-heading p{font-size:12px;margin:0}.wave{font-size:26px}.stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:17px;margin-bottom:25px}.stat-card{background:#fff;border:1px solid var(--line);padding:19px 21px;border-radius:14px;box-shadow:var(--shadow);min-width:0}.stat-card>div{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#a0aba0;font-size:10px}.stat-card>div>span{color:#859181}.stat-card>strong{display:block;font-family:'Manrope',sans-serif;font-size:27px;letter-spacing:-1px;margin:12px 0 7px;overflow-wrap:anywhere}.stat-card>small{font-size:9px}.stat-card.green{background:#edf3e5;border-color:#e0e9d6}.stat-card.green strong{color:#426a3d}.stat-card.warm{background:#fffaf0;border-color:#f0e9d9}.stat-card.warm strong{color:#91763f}.feature-banner{background:#eaf0dc;border:1px solid #e0e7ce;border-radius:16px;padding:27px 32px;display:flex;justify-content:space-between;gap:25px;margin-bottom:34px;overflow:hidden}.feature-banner .eyebrow{font-size:8px;color:#73905a;margin-bottom:9px}.feature-banner h2{font-size:22px;margin-bottom:9px;color:#405335;letter-spacing:-.7px}.feature-banner p{color:#849275;font-size:11px;max-width:550px;margin-bottom:16px}.feature-banner .text-link{font-size:11px}.banner-art{position:relative;display:flex;align-items:center;justify-content:center;width:130px;min-width:130px;color:#738c52}.banner-art:before{content:'';position:absolute;border:1px solid #b9c898;border-radius:50%;width:118px;height:118px;transform:rotate(-20deg)}.banner-art>span{position:absolute;top:0;right:0;font-size:28px;color:#a0b475}.banner-art>i{position:absolute;bottom:0;left:0;font-size:20px;color:#a0b475}.dashboard-content>section{margin:28px 0 34px}.section-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:0 0 18px}.section-heading h2{font-size:18px;margin:0;display:flex;align-items:center;gap:10px;letter-spacing:-.5px}.section-heading .text-link{font-size:11px}.count{background:#eaf0e4;padding:2px 7px;min-width:23px;text-align:center;border-radius:7px;font-size:10px;font-family:'DM Sans',sans-serif;font-weight:600;color:#70895e}.section-note{font-size:10px;color:#9aa398;line-height:1.8;margin-top:18px}.dashboard-footer{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--line);font-size:9px;color:#98a393;padding:23px 0;margin-top:50px;gap:15px}
/* Tasks, goals and family */
.task-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.task-card{background:white;border:1px solid var(--line);border-radius:15px;padding:22px;box-shadow:var(--shadow);display:flex;flex-direction:column;min-width:0}.task-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:17px}.tag{display:inline-flex;align-items:center;padding:4px 8px;background:#eff5ea;color:#73935e;font-size:9px;font-weight:600;border-radius:5px;white-space:nowrap}.tag.amber{background:#fbf2e2;color:#b18743}.child-label{font-size:10px;color:#8d9789;overflow-wrap:anywhere}.task-card h3{font-size:16px;letter-spacing:-.3px;margin-bottom:9px;overflow-wrap:anywhere;white-space:pre-wrap}.task-description{font-size:11px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;margin-bottom:15px}.task-deadline{display:flex;align-items:center;gap:6px;color:#8f998d;font-size:10px;margin-top:auto;padding-top:7px}.task-deadline.overdue{color:#b46b56}.task-reward{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #eef1eb;margin-top:19px;padding-top:17px;gap:8px}.task-reward>span{font-size:10px;color:#96a090}.task-reward>strong{font-size:14px;color:var(--green);white-space:nowrap}.task-actions{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin-top:17px}.task-actions .button{min-height:37px;padding:8px 13px;font-size:11px}.task-actions .text-button{font-size:10px;margin-left:auto}.waiting{background:#f7f4e9;color:#9a875e;border:1px solid #ece6d4;font-size:11px!important;opacity:1!important}.filter-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}.filter-tabs{display:flex;gap:4px;background:#edf0e9;padding:4px;border-radius:10px}.filter-tabs button{padding:8px 12px;font-size:11px;color:#8a9584;background:transparent;border-radius:7px;white-space:nowrap}.filter-tabs button.active{background:white;color:#456438;box-shadow:0 2px 5px #263f1908}.filter-tabs span{font-size:9px;margin-left:6px;opacity:.7}.filter-bar select{width:auto;min-width:150px;margin:0;font-size:11px;min-height:38px;padding:8px 12px}.empty-state{padding:38px 25px;text-align:center;border:1px dashed #dce4d5;background:#fcfdf9;border-radius:15px}.empty-state>span{width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:#eff4e7;color:#7c9866;border-radius:18px;margin:0 auto 18px}.empty-state h3{font-size:17px;margin-bottom:8px}.empty-state p{font-size:12px;max-width:400px;margin:0 auto 20px;line-height:1.8}.empty-state .button{font-size:11px;min-height:40px}.goal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.goal-card{padding:23px}.goal-heading{display:flex;align-items:center;gap:10px;margin-bottom:18px}.goal-icon{height:43px;width:43px;background:#f5f0e1;color:#a39360;border-radius:12px;display:flex;align-items:center;justify-content:center}.percent{margin-left:auto;font-size:14px;font-weight:650;color:var(--green)}.goal-card h3{font-size:17px;margin:10px 0 22px;overflow-wrap:anywhere}.goal-numbers{display:flex;justify-content:space-between;gap:12px;margin-top:10px}.goal-numbers strong{font-size:11px;color:#60824d}.goal-numbers small{font-size:10px}.goal-card>p{font-size:10px;margin:12px 0 0}.goal-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.goal-actions .button{font-size:11px;padding:8px 12px;min-height:38px}.goal-achieved{color:#688740!important;font-weight:600}.family-layout{display:grid;grid-template-columns:.95fr 1.05fr;gap:25px;align-items:start}.invite-card h2{font-size:22px;margin-top:20px}.steps-list{list-style:none;padding:0;margin:25px 0}.steps-list li{display:flex;gap:13px;margin-bottom:23px}.steps-list li>span{height:26px;min-width:26px;border-radius:50%;background:#eef3e4;color:#7b965c;text-align:center;line-height:26px;font-size:11px}.steps-list strong{font-size:12px}.steps-list p{font-size:11px;margin:4px 0 0;line-height:1.7}.invite-code{text-align:center;padding:20px;background:#f6f8ef;border:1px dashed #b4c69e;border-radius:13px;margin-bottom:20px;display:flex;flex-direction:column;align-items:center;gap:10px}.invite-code small{font-size:9px;letter-spacing:1px}.invite-code strong{font-size:26px;letter-spacing:3px;color:var(--green);user-select:all;font-family:monospace}.invite-code>span{font-size:10px;color:#8c9d7e}.invite-code .button{font-size:10px;min-height:33px;padding:5px 10px}.child-card{display:flex;align-items:center;gap:13px;padding:20px;margin-bottom:15px;flex-wrap:wrap}.child-card h3{font-size:15px;margin:0 0 3px}.child-card p{font-size:11px;margin:0}.child-card small{font-size:10px}.child-card>strong{margin-left:auto;font-size:13px;color:var(--green)}
/* Wallet, lessons, notifications */
.wallet-hero{background:#236e50;padding:32px;color:white;border-radius:18px;display:flex;align-items:center;gap:25px;position:relative;overflow:hidden}.wallet-hero .eyebrow{color:#b9d6bd;font-size:9px}.wallet-hero h2{font-size:38px;margin:10px 0}.wallet-hero p{color:#c3d6c9;font-size:11px;margin-bottom:0}.wallet-hero>.button{margin-left:auto;font-size:11px;position:relative;z-index:1}.wallet-hero>svg{opacity:.15;position:absolute;right:30px;bottom:20px;transform:rotate(-12deg)}.request-list{display:flex;flex-direction:column;gap:14px}.request-card{display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding:22px}.request-card>div:first-child{flex:1;min-width:150px}.request-card h3{font-size:15px;margin:10px 0 4px;overflow-wrap:anywhere}.request-card small{font-size:10px}.request-card>strong{font-size:16px}.row-actions{display:flex;gap:7px}.row-actions .button{font-size:11px;padding:8px 11px;min-height:36px}.ledger{padding:5px 22px}.ledger-row{display:flex;align-items:center;gap:14px;padding:19px 0;border-bottom:1px solid #eef0ea}.ledger-row:last-child{border:0}.ledger-icon{width:35px;height:35px;display:flex;align-items:center;justify-content:center;background:#eef4e7;color:#84a069;border-radius:11px}.ledger-icon.payout{background:#f7f0e7;color:#b49a75}.ledger-row>div{flex:1;min-width:0}.ledger-row strong{font-size:12px;display:block;overflow-wrap:anywhere}.ledger-row small{font-size:10px}.ledger-row>span:last-child{font-size:12px;white-space:nowrap}.positive{color:var(--green);font-weight:650}.notification-list{display:flex;flex-direction:column;gap:12px}.notification-card{display:flex;align-items:center;gap:18px;padding:20px}.notification-card p{margin:0 0 6px;color:#607056;font-size:12px;overflow-wrap:anywhere}.notification-card small{font-size:10px}.notification-card.unread{background:#f4f8ed;border-color:#dce8cb}.notification-card>div{flex:1}.lesson-icon{display:inline-flex;width:46px;height:46px;align-items:center;justify-content:center;background:#eff4e5;border-radius:13px;color:#82a15f;flex-shrink:0}.notification-card .lesson-icon{width:36px;height:36px}.lesson-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.lesson-card .eyebrow{font-size:9px;margin:22px 0 12px}.lesson-card h2{font-size:20px}.lesson-card>p{font-size:12px;line-height:1.85}.lesson-card h3{font-size:13px;letter-spacing:0;line-height:1.65;margin:22px 0 13px}.answers{display:flex;flex-direction:column;gap:8px}.answers button{background:#f7f8f3;border:1px solid #e5eadd;border-radius:9px;padding:10px;font-size:11px;color:#6f7e64;text-align:left;line-height:1.6}.answers button.correct{background:#e9f4df;border-color:#91b86d;color:#4b752f}.answers button.incorrect{background:#fff0e9;border-color:#dcb6a1;color:#a76e4b}
/* Dialogs, tours and feedback */
.modal-backdrop{position:fixed;inset:0;background:#152b246b;backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:24px;z-index:100}.modal{width:100%;max-width:500px;max-height:90vh;overflow-y:auto;background:white;border-radius:21px;box-shadow:0 24px 90px #1f312735;padding:27px}.modal-title{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:24px}.modal-title h2{font-size:22px;margin:0}.modal-title p{font-size:12px;margin:9px 0 0}.modal-title .icon-button{width:30px;height:30px;flex-shrink:0;margin-top:-4px}.modal p{font-size:13px;line-height:1.85}.modal-summary{background:#f5f8f0;border-radius:10px;padding:13px;font-weight:650;color:#4b6540;font-size:13px;overflow-wrap:anywhere}.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:25px}.modal-actions .button{font-size:12px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:15px}.optional{font-weight:400;color:#a0a996}.date-preview{display:block;color:#718c5f;margin:-6px 0 20px;font-size:11px}.modal form>small{display:block;margin:10px 0 20px;line-height:1.8}.tour-backdrop{z-index:200;backdrop-filter:none;background:#1d2c2155;align-items:flex-end;padding-bottom:40px}.tour-backdrop .modal{max-width:490px;box-shadow:0 15px 90px #26362140}.tour-highlight{position:relative!important;z-index:201!important;outline:3px solid #adcf74!important;outline-offset:4px;background:#f1f6e7!important;color:#2b5530!important;border-radius:10px;pointer-events:none}.sidebar:has(.tour-highlight){z-index:201}.tour-step .eyebrow{font-size:9px}.tour-step p{font-size:14px}.tour-dots{display:flex;gap:6px;margin-top:20px}.tour-dots span{width:7px;height:7px;border-radius:20px;background:#e1e9d7}.tour-dots span.active{width:22px;background:#76a252}.toast{position:fixed;bottom:25px;left:50%;transform:translateX(-50%);z-index:300;display:flex;align-items:center;gap:12px;padding:16px 22px;background:#204f39;color:white;border-radius:12px;box-shadow:0 8px 30px #183a2a30;font-size:12px;max-width:90vw}
@media(min-width:1550px){.dashboard-content{padding-top:45px}.task-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.stats-grid{gap:24px}.stat-card{padding:25px}}
@media(max-width:1180px){.sidebar{width:210px;padding:25px 13px}.app-main{margin-left:210px;width:calc(100% - 210px)}.dashboard-content{padding:30px 25px 0}.topbar{padding:0 25px}.stat-card{padding:17px 14px}.stat-card>strong{font-size:23px}.lesson-grid{grid-template-columns:1fr}.lesson-card{display:block}.family-layout{grid-template-columns:1fr 1fr}.hero{gap:30px}.hero h1{font-size:48px}.art-orbit{width:350px;height:350px;top:40px}.floating-badge{right:-3px}.how-section{margin:0 40px}.auth-story{padding:40px}.auth-main{padding:30px 40px}.auth-story h1{font-size:40px}}
@media(max-width:960px){.sidebar{width:185px;padding:25px 10px}.sidebar .brand{font-size:19px;gap:7px}.sidebar .brand-mark{height:30px;width:30px;border-radius:10px}.nav-item{font-size:11px;gap:9px;padding:11px 10px}.app-main{margin-left:185px;width:calc(100% - 185px)}.topbar{padding:0 22px}.dashboard-content{padding:28px 22px 0}.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.family-layout{grid-template-columns:1fr}.feature-banner h2{font-size:20px}.feature-banner{padding:23px}.banner-art{width:90px;min-width:90px}.banner-art:before{width:85px;height:85px}.banner-art>svg{width:55px}.page-heading h1{font-size:26px}.breadcrumb{display:none}.topbar{justify-content:flex-end}.task-card{padding:18px}.task-top{flex-wrap:wrap}.goal-card{padding:19px}.hero{padding-top:55px;padding-bottom:70px}.hero h1{font-size:42px}.hero-actions{flex-wrap:wrap;gap:17px}.hero>div>p{font-size:14px}.hero-preview{max-width:310px;padding:20px}.hero-note{flex-wrap:wrap}.floating-badge{padding:10px 14px;font-size:9px}.art-orbit{width:300px;height:300px}.landing-nav{height:85px}.auth-page{grid-template-columns:40% 60%}.auth-story{padding:30px}.auth-story h1{font-size:33px}.auth-story p{font-size:13px}.story-graphic{max-width:210px}.goal-illustration{width:190px;padding:20px}.coin-one{right:-10px}.coin-two{left:-10px}.auth-main{padding:30px}.auth-form h2{font-size:25px}.landing footer>span{display:none}.how-grid{gap:25px}}
@media(max-width:720px){.app-shell{display:block}.sidebar{position:relative;width:100%;height:auto;padding:16px;border-right:0;border-bottom:1px solid var(--line);overflow:visible}.sidebar .brand{margin:0;font-size:22px}.sidebar .brand-mark{width:34px;height:34px}.workspace-label{position:absolute;right:18px;top:23px;margin:0;font-size:8px;letter-spacing:1px}.sidebar nav{display:flex;overflow-x:auto;gap:5px;padding:17px 0 1px;margin-bottom:-4px;scrollbar-width:thin}.nav-item{margin:0;font-size:10px;padding:10px;gap:7px;width:auto}.nav-item svg{width:16px;height:16px}.sidebar-bottom{padding:0;margin:0;display:flex;justify-content:flex-end;position:absolute;top:62px;right:0;pointer-events:none;visibility:hidden}.sidebar-bottom .grow-note{display:none}.app-main{margin:0;width:100%}.topbar{height:66px;padding:0 18px;justify-content:space-between}.topbar:before{content:'BIRGA ULG‘AYAMIZ';font-size:8px;letter-spacing:1.3px;color:#9aa78f}.topbar-right{gap:10px}.profile-text{display:none}.virtual-label{font-size:9px;padding:4px 6px}.dashboard-content{padding:25px 18px 0}.page-heading{align-items:flex-start;gap:14px;flex-wrap:wrap}.page-heading h1{font-size:27px}.page-heading p{font-size:11px}.page-heading>.button{font-size:11px;min-height:39px;padding:9px 12px}.stats-grid{gap:11px}.stat-card{padding:17px}.stat-card>strong{font-size:23px}.stat-card>small{font-size:8px}.feature-banner{padding:22px;margin-bottom:28px}.feature-banner h2{font-size:19px}.feature-banner p{font-size:11px}.banner-art{display:none}.task-grid{grid-template-columns:1fr}.task-card{padding:21px}.task-top{flex-wrap:nowrap}.goal-grid{grid-template-columns:1fr}.goal-card{padding:22px}.filter-bar{flex-direction:column;align-items:flex-start;gap:12px}.filter-tabs{width:100%;justify-content:space-between}.filter-tabs button{font-size:10px;padding:8px}.wallet-hero{flex-wrap:wrap;padding:24px}.wallet-hero>.button{margin-left:0}.wallet-hero h2{font-size:32px}.section-heading h2{font-size:17px}.section-heading{gap:10px;flex-wrap:wrap}.request-card{padding:18px}.row-actions{width:100%}.ledger{padding:3px 17px}.ledger-row{gap:10px}.ledger-row strong{font-size:11px}.ledger-row>span:last-child{font-size:11px}.ledger-icon{height:30px;width:30px;flex-shrink:0}.dashboard-footer{flex-direction:column;align-items:flex-start;gap:7px}.dashboard-footer:after{content:''}.sidebar-bottom{position:static;visibility:visible;pointer-events:auto;justify-content:space-between;padding-top:7px;margin-top:6px;border-top:1px solid #f0f2ec}.sidebar-bottom .nav-item{font-size:9px;padding:5px 8px;color:#99a48f}.sidebar-bottom .nav-item svg{height:13px;width:13px}.modal{padding:23px;max-height:88vh;border-radius:17px}.modal-backdrop{padding:15px}.modal-title h2{font-size:20px}.form-row{gap:10px}.form-row input{padding:10px 8px;min-width:0}.tour-backdrop{padding-bottom:18px}.tour-highlight{outline-offset:0!important}.tour-step p{font-size:13px}.tour-step .modal-actions{gap:5px}.modal-actions .button{font-size:11px;padding:10px}.landing-nav{padding:0 22px;height:80px}.landing-nav>div{gap:12px}.landing-nav>div>a:first-child{display:none}.landing-nav .brand{font-size:22px}.hero{grid-template-columns:1fr;gap:40px;padding:45px 24px 55px}.hero h1{font-size:43px;letter-spacing:-2px}.hero>div>p{font-size:14px}.hero-art{max-width:360px;width:100%;margin:auto}.art-orbit{width:330px;height:330px;left:0}.floating-badge{right:-5px}.hero-preview{max-width:290px}.how-section{margin:0 24px;padding:40px 0}.how-section>h2{font-size:27px}.how-grid{grid-template-columns:1fr;gap:22px;margin-top:30px}.how-grid article{border-bottom:1px solid #e6eadc;padding-bottom:15px}.how-grid article:last-child{border:0}.how-number{margin-bottom:12px}.how-grid h3{font-size:18px}.landing footer{padding:28px 24px;flex-direction:column;align-items:flex-start}.auth-page{display:block}.auth-story{display:none}.auth-main{padding:25px;min-height:100vh}.auth-form{padding:40px 0;max-width:420px}.auth-form h2{font-size:28px}.child-card>strong{font-size:12px}.page-alert{align-items:flex-start;flex-direction:column}.toast{bottom:16px;width:max-content;max-width:94vw;font-size:11px;padding:13px 16px}.lesson-card{padding:22px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation:none!important;transition:none!important}.button:hover{transform:none}}

/* Keep the guide and its focus trap above every highlighted page section. */
.tour-backdrop{z-index:250}.app-shell:has(.tour-backdrop) .sidebar{pointer-events:none}

/* Task evidence and Telegram notifications */
.task-evidence{display:flex;flex-direction:column;gap:8px;margin:16px 0;color:inherit;font-size:13px;text-decoration:none;max-width:440px}
.task-evidence img,.photo-preview img{display:block;width:100%;max-height:280px;object-fit:contain;border-radius:16px;background:#f2f6f4;border:1px solid #dde6e0}
.photo-preview{margin:12px 0;display:grid;gap:10px}
.telegram-card{margin:24px 0;display:grid;gap:16px}.telegram-card h2{margin:8px 0}.telegram-card p{line-height:1.65}.telegram-link{padding:16px;border-radius:14px;background:#eff7f5}
.notification-card>div{min-width:0;flex:1}.notification-note{white-space:pre-wrap;overflow-wrap:anywhere}.task-card{scroll-margin-top:100px}.task-card:target{outline:3px solid #4ba68e}
input[type=file]{max-width:100%;font-size:14px}input[type=file]::file-selector-button{border:0;border-radius:8px;padding:10px;background:#e4f0ea;color:#214f40;margin-right:8px;cursor:pointer}
@media(max-width:600px){.telegram-card .row-actions{flex-wrap:wrap}.task-evidence img{max-height:220px}}

/* Task completion: camera and gallery */
.task-photo-field{display:grid;gap:10px;margin:16px 0}
.task-photo-field p{margin:0;font-weight:600}
.task-photo-field input[hidden]{display:none!important}
.task-photo-field small{color:#62766b;line-height:1.5}
.photo-actions{display:flex;flex-wrap:wrap;gap:10px}
.photo-actions .button{flex:1 1 150px;justify-content:center}
.task-camera{display:grid;gap:12px;padding:12px;margin:14px 0;border:1px solid #dde6e0;border-radius:16px;background:#f2f6f4}
.task-camera video{display:block;width:100%;max-height:340px;aspect-ratio:4/3;object-fit:contain;background:#17251e;border-radius:12px}
.task-camera p{margin:0;line-height:1.5}

```

## app/layout.js

```javascript
import './globals.css';
import './premium.css';
export const metadata = { title: 'Birinchi Pul — Kichik qadamlar, katta maqsadlar', description: 'Ota-ona va farzand uchun vazifalar, cho‘ntak puli va jamg‘arma maqsadlari.' };
export default function RootLayout({ children }) { return <html lang="uz"><body>{children}</body></html>; }

```

## app/login/page.js

```javascript
import AuthForm from '@/components/AuthForm';
export default function LoginPage() { return <AuthForm mode="login" />; }

```

## app/not-found.js

```javascript
import Link from 'next/link';
export default function NotFound() { return <main className="center-page"><div className="card"><span className="eyebrow">404</span><h1>Bu sahifa topilmadi</h1><p>Bosh sahifadan davom etishingiz mumkin.</p><Link className="button primary" href="/">Bosh sahifaga</Link></div></main>; }

```

## app/page.js

```javascript
import Link from 'next/link';
import Brand from '@/components/Brand';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';

const steps = [
  { icon: 'users', title: 'Oilangizni birlashtiring', text: 'Ota-ona hisob ochadi va “Oila” bo‘limidan taklif kodi oladi. Farzandingiz shu kod bilan sizga ulanadi.' },
  { icon: 'tasks', title: 'Kichik vazifadan boshlang', text: 'Farzandingiz bilan vazifa, muddat va virtual mukofotni kelishib oling. U bajargan ishini sizga yuboradi.' },
  { icon: 'target', title: 'Harakatni odatga aylantiring', text: 'Vazifani tasdiqlang. Farzandingiz mukofotini ko‘radi, maqsadiga pul ajratadi va natijasini kuzatadi.' },
];
const skills = [
  { icon: 'tasks', number: '01', title: 'Mas’uliyat', text: 'Kelishilgan vazifani vaqtida bajarish va o‘z ishining natijasini ko‘rsatish.', tone: 'mint' },
  { icon: 'target', number: '02', title: 'Jamg‘arish', text: 'Istagan narsasi uchun maqsad qo‘yish va unga kichik qadamlar bilan yaqinlashish.', tone: 'peach' },
  { icon: 'wallet', number: '03', title: 'O‘ylab sarflash', text: 'Ehtiyoj va xohishning farqini tushunish, xarid oldidan o‘ziga savol berish.', tone: 'lilac' },
  { icon: 'clock', number: '04', title: 'Sabr va reja', text: 'Hamma narsaga birdan erishilmasligini, muntazam harakatning qadrini bilish.', tone: 'yellow' },
];
const faqs = [
  ['Bu haqiqiy bank hisobimi?', 'Yo‘q. Birinchi Puldagi balans va mukofotlar virtual. Bu oilada pul haqida suhbatlashish va moliyaviy odatlarni mashq qilish uchun vosita. Sayt bank kartasidan pul yechmaydi yoki pul o‘tkazmaydi.'],
  ['Farzandimni qanday qo‘shaman?', 'Avval ota-ona sifatida ro‘yxatdan o‘ting. Kabinetdagi “Oila” bo‘limida taklif kodi yarating. Farzandingiz ro‘yxatdan o‘tishda “Men bolaman”ni tanlab, shu kodni kiritadi. Kod bir martalik va 24 soat amal qiladi.'],
  ['Vazifani bajarganini kim tasdiqlaydi?', 'Farzandingiz “Qilib bo‘ldim” tugmasi orqali ishini yuboradi. Siz uni ko‘rib chiqasiz: tasdiqlashingiz yoki izoh bilan qaytarishingiz mumkin. Virtual mukofot faqat tasdiqdan so‘ng balansga qo‘shiladi.'],
  ['Virtual mukofotni haqiqiy pulga almashtirish mumkinmi?', 'Bola kabinetdan pul so‘rovi yuborishi mumkin. Uni ota-ona ko‘rib chiqadi. Haqiqiy pulni berish oiladagi kelishuv asosida, saytdan tashqarida amalga oshiriladi.'],
  ['Har bir uy ishi uchun mukofot berish kerakmi?', 'Bu oilangizning qarori. Oddiy oilaviy mas’uliyat va alohida rag‘batlantiriladigan vazifalarni oldindan kelishib olish mumkin. Mukofot bilan birga samimiy maqtov va suhbatga ham joy bering.'],
  ['Nimadan boshlaganimiz ma’qul?', 'Bitta tushunarli vazifa va farzandingiz uchun qiziqarli bitta maqsaddan boshlang. Masalan, kitob o‘qish vazifasi va yangi kitob uchun jamg‘arish. Muhimi, shartlarni birga kelishib olish.'],
];

export default function Home() {
  return <main className="landing premium-landing">
    <nav className="landing-nav" aria-label="Bosh sahifa menyusi">
      <Brand />
      <div className="landing-links"><a href="#qanday">Qanday ishlaydi?</a><a href="#konikmalar">Farzandingiz uchun</a><a href="#savollar">Savollar</a></div>
      <div className="landing-account"><Link href="/login" className="nav-login">Kirish</Link><Link href="/register" className="button primary">Boshlash <Icon name="arrow" size={17} /></Link></div>
    </nav>
    <section className="premium-hero">
      <div className="hero-copy">
        <span className="pill"><span className="dot" /> KICHIK ODATLAR. KATTA KELAJAK.</span>
        <h1>Bugun kichik vazifa.<br />Ertaga <em>katta<br className="desktop-break" /> mustaqillik.</em></h1>
        <p>Farzandingiz pulning qadrini hayotiy mashqlar orqali o‘rgansin. Vazifalar, virtual mukofotlar va orzular uchun jamg‘arma — barchasi sizning mehrli ko‘magingiz bilan.</p>
        <div className="hero-actions"><Link href="/register" className="button primary">Oilamiz bilan boshlash <Icon name="arrow" /></Link><a className="text-link" href="#qanday"><span className="play-icon">▶</span> Qanday ishlaydi?</a></div>
        <div className="hero-note"><span><Icon name="check" size={16} /> Karta kerak emas</span><span><Icon name="check" size={16} /> O‘zbek tilida</span><span><Icon name="check" size={16} /> Ota-ona nazoratida</span></div>
      </div>
      <div className="journey-scene" aria-label="Vazifa, virtual mukofot va jamg‘arma jarayonining ko‘rgazmali namunasi">
        <div className="scene-grid" aria-hidden="true" /><span className="scene-spark spark-one" aria-hidden="true">✳</span><span className="scene-spark spark-two" aria-hidden="true">✦</span>
        <div className="scene-heading"><span className="dot" /> KATTA ORZULAR SHU YERDAN BOSHLANADI</div>
        <div className="journey-wallet"><div className="wallet-card-top"><span>MENING ILK JAMG‘ARMAM</span><Icon name="wallet" size={23} /></div><strong>120 000 <small>so‘m</small></strong><div className="wallet-card-bottom"><span>Harakatlarimning natijasi</span><span>✦</span></div><span className="wallet-circle" aria-hidden="true" /></div>
        <div className="journey-task"><span className="sample-check"><Icon name="check" size={22} /></span><div><strong>Kitob o‘qish</strong><small>Vazifa ota-ona tomonidan tasdiqlandi</small></div><b>+20 000</b></div>
        <div className="journey-goal"><div className="goal-picture" aria-hidden="true">🚲</div><div className="journey-goal-copy"><span>MENING KATTA ORZUM</span><h3>Birinchi velosipedim</h3><div className="goal-demo-numbers"><strong>120 000 so‘m</strong><span>30%</span></div><div className="progress"><span style={{ width: '30%' }} /></div><small>400 000 so‘mlik maqsad sari</small></div></div>
        <div className="scene-sticker"><Icon name="star" size={18} /> Men uddalayman!</div>
        <p className="scene-caption">Ko‘rgazmali namuna · Balans va mukofotlar virtual</p>
      </div>
    </section>
    <div className="promise-strip"><span>Puldan ham muhimrog‘i — <strong>yaxshi odatlar.</strong></span><div><span><Icon name="users" /> Birga o‘rganish</span><span><Icon name="leaf" /> Har kuni o‘sish</span><span><Icon name="target" /> Maqsad bilan yashash</span></div></div>
    <Reveal className="landing-section intro-section" id="imkoniyatlar">
      <div className="section-intro"><span className="eyebrow">OTA-ONALAR UCHUN YARATILGAN</span><h2>“Olib bering”dan<br /><em>“O‘zim yig‘aman”gacha.</em></h2></div>
      <div className="intro-copy"><p>Pul haqida gaplashishni katta bo‘lguncha kutish shart emas. Kundalik kichik vazifalar orqali mehnat, tanlov va jamg‘arish o‘rtasidagi bog‘liqlikni birga kashf qiling.</p><p>Birinchi Pul shu jarayonni ko‘rinadigan qiladi: siz yo‘l ko‘rsatasiz, farzandingiz harakat qiladi, natijadan esa birga quvonasiz.</p><a className="text-link" href="#panellar">Oilamiz uchun nimalar bor? <Icon name="arrow" size={18} /></a></div>
    </Reveal>
    <Reveal className="landing-section learning-section" id="konikmalar">
      <div className="section-title-row"><div><span className="eyebrow">FAQAT PUL SANASH EMAS</span><h2>Hayotga kerakli<br />to‘rtta kichik ko‘nikma.</h2></div><p>Bugun mashq qilingan odatlar<br />ertangi mustaqil qarorlarga asos bo‘ladi.</p></div>
      <div className="skills-grid">{skills.map(skill => <article className={`skill-card ${skill.tone}`} key={skill.number}><div className="skill-top"><span className="skill-icon"><Icon name={skill.icon} size={26} /></span><span>{skill.number}</span></div><h3>{skill.title}</h3><p>{skill.text}</p></article>)}</div>
    </Reveal>
    <Reveal className="landing-section process-section" id="qanday">
      <div className="section-title-row"><div><span className="eyebrow">BOSHLASH O‘YLANGANIDAN OSON</span><h2>Bir oila. Bir jamoa.<br />Uchta oddiy qadam.</h2></div><Link className="button light" href="/register">Birinchi qadamni qo‘yish <Icon name="arrow" size={18} /></Link></div>
      <div className="process-grid">{steps.map((step, i) => <article key={step.title}><div className="process-top"><span className="process-number">0{i + 1}</span><Icon name={step.icon} size={28} /></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    </Reveal>
    <Reveal className="landing-section panels-section" id="panellar">
      <div className="center-section-title"><span className="eyebrow">HAR KIMNING O‘Z DUNYOSI</span><h2>Sizga xotirjamlik.<br />Farzandingizga ilhom.</h2><p>Ikki xil kabinet, bir xil maqsad — birga ulg‘ayish.</p></div>
      <div className="panel-showcase-grid"><article className="parent-showcase"><span className="showcase-label"><Icon name="users" size={17} /> OTA-ONA KABINETI</span><h3>Katta manzara.<br />Hammasi nazoratingizda.</h3><p>Vazifalarni belgilang, bajarilgan ishni ko‘rib chiqing va farzandingizning maqsad sari harakatini kuzating.</p><div className="sample-review"><div><span className="sample-avatar">A</span><div><strong>Aziz · Kitob o‘qish</strong><small>Ko‘rib chiqishingizni kutmoqda</small></div><span className="review-dot" /></div><div className="sample-review-note">“Bugun 20 bet o‘qidim. Eng qiziq joyi...”</div><span className="sample-approve"><Icon name="check" size={16} /> Tasdiqlash va rag‘batlantirish</span><small className="sample-label">Kabinetning ko‘rgazmali namunasi</small></div><ul className="feature-checks"><li><Icon name="check" /> Vazifa va mukofotni o‘zingiz belgilaysiz</li><li><Icon name="check" /> Har bir tasdiq sizning qo‘lingizda</li><li><Icon name="check" /> Hisob tarixi va pul so‘rovlari bir joyda</li></ul></article>
      <article className="child-showcase"><span className="showcase-label"><Icon name="star" size={17} /> BOLA KABINETI</span><h3>Har bir qadam —<br />“Men uddaladim!”</h3><p>Aniq vazifalar, ko‘rinib turadigan natija va o‘z orzusi. Farzandingiz uchun sodda, rangli va tushunarli makon.</p><div className="sample-child-goal"><span className="book-emoji" aria-hidden="true">📚</span><span className="sample-star" aria-hidden="true">✦</span><strong>Yangi kitoblarim uchun</strong><span>Orzumga yanada yaqinman!</span><div className="progress"><span style={{ width: '65%' }} /></div><small>Ko‘rgazmali namuna · 65% jamg‘arildi</small></div><ul className="feature-checks"><li><Icon name="check" /> Vazifani bajarib, natijasini yuboradi</li><li><Icon name="check" /> O‘z maqsadiga virtual pul ajratadi</li><li><Icon name="check" /> Kichik darslar orqali bilimini sinaydi</li></ul></article></div>
    </Reveal>
    <Reveal className="landing-section everyday-section"><div className="everyday-art"><span className="eyebrow">ODDIY KUNDAN BIR MISOL</span><div className="everyday-item"><span>📖</span><div><strong>20 bet kitob o‘qish</strong><small>Avval kichik vazifa</small></div><Icon name="check" /></div><div className="everyday-connector" /><div className="everyday-item"><span>🌟</span><div><strong>“Barakalla, uddalading!”</strong><small>So‘ng e’tirof va virtual mukofot</small></div><Icon name="check" /></div><div className="everyday-connector" /><div className="everyday-item"><span>🎯</span><div><strong>Orzuga yana bir qadam</strong><small>Mukofotning bir qismini jamg‘arish</small></div><Icon name="check" /></div></div><div><span className="eyebrow">ENG MUHIM QISMI — SIZ</span><h2>Ilova hisoblaydi.<br /><em>Siz yo‘l ko‘rsatasiz.</em></h2><p>Kun oxirida birga qarang: bugun nima uddalandi, nimasi qiyin bo‘ldi, keyingi qadam qanday? Oddiy suhbat ham qimmatli darsga aylanishi mumkin.</p><p>Vazifalarni farzandingizning imkoniyatiga moslang. Faqat natijani emas, intilish va halollikni ham qadrlang.</p><div className="parent-tip"><Icon name="leaf" size={24} /><span><strong>Kichik maslahat</strong> Birinchi maqsadni farzandingizning o‘zi tanlasin. O‘z orzusi uchun harakat qilish qiziqroq.</span></div></div></Reveal>
    <Reveal className="landing-section faq-section" id="savollar"><div><span className="eyebrow">OTA-ONALAR SO‘RAYDI</span><h2>Boshlashdan oldin<br />bilish yaxshi.</h2><p>Oilaviy yangi odat haqida<br />eng tabiiy savollarga javoblar.</p><span className="faq-decoration" aria-hidden="true">?</span></div><div className="faq-list">{faqs.map(([q, a], i) => <details key={q}><summary><span className="faq-number">0{i + 1}</span><span>{q}</span><Icon name="plus" size={19} /></summary><p>{a}</p></details>)}</div></Reveal>
    <Reveal className="landing-section final-cta"><span className="cta-spark" aria-hidden="true">✳</span><span className="eyebrow">BIRINCHI QADAMNI BIRGA QO‘YAMIZ</span><h2>Katta kelajak<br /><em>kichik odatdan boshlanadi.</em></h2><p>Bugun bitta vazifa. Bitta maqsad. Bitta samimiy “barakalla”.</p><Link href="/register" className="button">Oilamiz bilan boshlash <Icon name="arrow" /></Link><small>Karta kerak emas · Virtual mukofotlar · Haqiqiy ko‘nikmalar</small></Reveal>
    <footer className="premium-footer"><div><Brand /><p>Katta hayotga kichik qadam.</p></div><div className="footer-links"><a href="#qanday">Qanday ishlaydi?</a><a href="#savollar">Savollar</a><Link href="/login">Kabinetga kirish <Icon name="arrow" size={15} /></Link></div><span>Mehr bilan o‘rgatamiz.<br />Birga ulg‘ayamiz.</span></footer>
  </main>;
}

```

## app/parent/[section]/page.js

```javascript
import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
export default async function ParentSection({ params }) {
  const { section } = await params;
  if (!['tasks', 'goals', 'wallet', 'family', 'notifications', 'learn'].includes(section)) notFound();
  return <Dashboard role="parent" section={section} />;
}

```

## app/parent/page.js

```javascript
import Dashboard from '@/components/Dashboard';
export default function ParentPage() { return <Dashboard role="parent" />; }

```

## app/premium.css

```css
/* Presentation layer: shared foundations, landing, auth, and role-specific panels. */
:root{--bg:#f5f6f3;--ink:#193b31;--muted:#64736c;--green:#21634c;--green-dark:#164d3a;--line:#e2e7df;--shadow:0 5px 24px #193b3105;--radius:20px}
body{font-size:14px}::selection{background:#d3edac;color:#173d30}button,a,input,select,textarea{touch-action:manipulation}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #8fac58;outline-offset:5px}input,textarea,select{transition:border-color .2s,box-shadow .2s,background .2s}input:focus,textarea:focus,select:focus{border-color:#32745b;box-shadow:0 0 0 4px #21634c0b}input::placeholder,textarea::placeholder{color:#7c887f}.button{min-height:46px;border-radius:12px;transition:background .2s,transform .2s,box-shadow .2s}.button.primary{box-shadow:0 4px 10px #173c3010}.button:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 7px 18px #173c3015}.button:active:not(:disabled){transform:translateY(0) scale(.98)}.button svg,.text-link svg{transition:transform .2s}.button:hover svg,.text-link:hover svg{transform:translateX(3px)}.brand-mark{border-radius:13px;box-shadow:inset 0 0 0 1px #ffffff18}.progress{height:9px;background:#e8eddf}.progress>span{background:#8baa52;transition:width .8s cubic-bezier(.22,1,.36,1);animation:progress-grow 1s both;transform-origin:left}.eyebrow{font-size:10px;letter-spacing:1.8px}p{line-height:1.8}

/* A warm editorial landing page. */
.premium-landing{background:#fafbf6;overflow:clip}.premium-landing .landing-nav{max-width:1320px;height:100px;padding:0 48px;border-bottom:1px solid #193b3110;gap:30px}.premium-landing .landing-nav>div{gap:28px;font-size:12px}.premium-landing .landing-nav a:not(.button):hover{color:#4f803c}.premium-landing .landing-nav .landing-account{gap:23px}.nav-login{font-weight:650}.premium-hero{max-width:1320px;margin:auto;padding:85px 48px 80px;display:grid;grid-template-columns:1.1fr 1fr;gap:44px;align-items:center}.hero-copy{animation:rise-in .8s both}.hero-copy .pill{background:#f0f3e9;border-color:#e0e7d8;font-size:9px;letter-spacing:1.1px;padding:9px 13px}.hero-copy h1{font-size:clamp(44px,4.35vw,65px);line-height:1.14;letter-spacing:-3.2px;margin:26px 0}.hero-copy h1 em{color:#527244}.hero-copy>p{max-width:470px;font-size:15px;line-height:1.9}.hero-copy .hero-actions{gap:24px;margin-top:30px}.hero-copy .button{padding:15px 21px;font-size:12px}.play-icon{width:29px;height:29px;display:grid;place-items:center;border:1px solid #cfdbca;border-radius:50%;font-size:9px;padding-left:2px}.hero-copy .text-link{font-size:12px}.hero-copy .hero-note{gap:15px;flex-wrap:wrap;font-size:10px;margin-top:25px;color:#5f7164}.hero-note>span{display:inline-flex;gap:5px;align-items:center}
.journey-scene{position:relative;min-height:470px;padding:45px 30px 35px;background:#edf1e4;border:1px solid #e3e8d9;border-radius:150px 150px 30px 30px;isolation:isolate;animation:rise-in 1s .12s both}.scene-grid{position:absolute;inset:0;z-index:-1;overflow:hidden;border-radius:inherit;background-image:linear-gradient(#7d936110 1px,transparent 1px),linear-gradient(90deg,#7d936110 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(transparent,#000)}.scene-heading{font-size:8px;letter-spacing:1.25px;display:flex;justify-content:center;align-items:center;gap:7px;margin-bottom:26px;color:#617651}.journey-wallet{position:relative;background:#214f3e;border:1px solid #2f614c;border-radius:20px;padding:24px 27px;color:#fff;max-width:335px;margin:0 auto;transform:rotate(-7deg);overflow:hidden;box-shadow:0 20px 35px #234f3d20;animation:wallet-arrive 1.1s .1s both}.wallet-card-top{display:flex;justify-content:space-between;align-items:center;gap:16px;position:relative;z-index:1;color:#d0dfc4;font-size:9px;letter-spacing:1.1px}.journey-wallet>strong{display:block;font-family:'Manrope',sans-serif;font-size:40px;letter-spacing:-1.7px;margin:20px 0 13px;position:relative;z-index:1}.journey-wallet>strong small{font-size:15px;color:#d7e5c8;letter-spacing:0}.wallet-card-bottom{display:flex;justify-content:space-between;align-items:center;color:#cadbbe;font-size:10px}.wallet-card-bottom>span:last-child{font-size:24px}.wallet-circle{position:absolute;width:200px;height:200px;border:35px solid #ffffff06;border-radius:50%;right:-75px;bottom:-70px}.journey-task{position:relative;display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #e8ecdf;padding:16px;border-radius:14px;box-shadow:0 12px 25px #21452e0d;margin:-2px -8px 0 30px;transform:rotate(3deg);animation:task-arrive .9s .35s both}.sample-check{display:grid;place-items:center;width:38px;height:38px;flex-shrink:0;border-radius:12px;background:#e9f2dc;color:#507a38}.journey-task strong{font-size:12px;display:block}.journey-task small{font-size:8px;display:block;margin-top:3px}.journey-task>b{font-size:14px;white-space:nowrap;color:#427237;margin-left:auto}.journey-goal{display:flex;align-items:center;gap:18px;background:#fffef9;padding:22px;border-radius:18px;border:1px solid #e4e7da;margin:22px 12px 0 0;box-shadow:0 8px 20px #2b493107;transform:rotate(-3deg);animation:goal-arrive 1s .5s both}.goal-picture{background:#f7efd3;border-radius:16px;font-size:43px;display:grid;place-items:center;width:84px;height:95px;flex-shrink:0}.journey-goal-copy{flex:1;min-width:0}.journey-goal-copy>span{font-size:7px;letter-spacing:1px;color:#738166}.journey-goal h3{font-size:15px;margin:6px 0 14px;letter-spacing:-.3px}.goal-demo-numbers{display:flex;justify-content:space-between;font-size:9px;margin-bottom:8px;gap:7px}.goal-demo-numbers>span{color:#537638}.journey-goal-copy>small{font-size:8px;margin-top:6px;display:block}.scene-sticker{position:absolute;right:-14px;bottom:28px;background:#e4efb7;border:1px solid #d3dfa1;border-radius:9px;display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;padding:12px 15px;transform:rotate(7deg);box-shadow:0 5px 10px #28412608;animation:sticker-pop 1s .8s both}.scene-caption{text-align:center;font-size:8px;margin:26px 0 0;color:#66715b}.scene-spark{position:absolute;color:#b9ca81;line-height:1;animation:spark-turn 3s ease-in-out both}.spark-one{font-size:75px;left:-23px;top:130px;z-index:2}.spark-two{font-size:44px;right:17px;top:28px;color:#9fae69}
.promise-strip{max-width:1224px;margin:0 auto;border-top:1px solid #dfe5d7;border-bottom:1px solid #dfe5d7;padding:25px 0;display:flex;align-items:center;justify-content:space-between;gap:30px;font-size:12px;color:#677361}.promise-strip>span>strong{color:#284b35;font-weight:650}.promise-strip>div{display:flex;gap:38px}.promise-strip>div>span{display:flex;gap:9px;align-items:center;color:#48623f;font-size:11px}.promise-strip svg{width:18px}
.landing-section{max-width:1224px;margin:0 auto;padding:92px 0;scroll-margin-top:30px}.landing-section h2{font-size:40px;letter-spacing:-1.8px;line-height:1.22;margin-bottom:24px;font-weight:750}.landing-section h2 em{color:#68804c}.landing-section p{font-size:14px;line-height:1.9}.intro-section{display:grid;grid-template-columns:1fr 1fr;gap:100px;padding-bottom:60px}.intro-copy{padding-top:22px}.intro-copy .text-link{margin-top:8px;font-size:12px}.section-title-row{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-bottom:35px}.section-title-row h2{margin-bottom:0}.section-title-row>p{font-size:13px;margin:0 0 3px}.skills-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.skill-card{padding:25px 23px 28px;border-radius:20px;transition:transform .25s,box-shadow .25s;min-height:255px;position:relative;overflow:hidden}.skill-card:hover{transform:translateY(-7px);box-shadow:0 14px 28px #193b3110}.mint{background:#e9efdf}.peach{background:#fae9df}.lilac{background:#eee9f5}.yellow{background:#f4efda}.skill-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:35px}.skill-icon{width:47px;height:47px;border-radius:14px;background:#ffffff85;display:grid;place-items:center;color:#436544}.skill-top>span:last-child{font-family:'Manrope',sans-serif;font-size:12px;color:#6b7764}.skill-card h3{font-size:20px;letter-spacing:-.6px}.skill-card p{font-size:12px;margin:0;line-height:1.8;color:#5e6c60}.process-section{border-top:1px solid #e0e5d9}.process-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;margin-top:50px}.process-grid article{position:relative;padding-right:20px}.process-top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dce4d4;padding-bottom:22px;margin-bottom:24px;color:#728764}.process-number{font-family:'Manrope',sans-serif;font-size:52px;line-height:1;letter-spacing:-3px;color:#adba9a;font-weight:500}.process-grid h3{font-size:20px;letter-spacing:-.5px}.process-grid p{font-size:13px;margin-bottom:0}.panels-section{padding-top:25px}.center-section-title{text-align:center;margin-bottom:42px}.center-section-title p{margin:0}.panel-showcase-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.panel-showcase-grid>article{padding:40px;border-radius:26px;overflow:hidden}.parent-showcase{background:#214a3b;color:#fff}.child-showcase{background:#f1eddb;border:1px solid #e6e2d0}.showcase-label{display:inline-flex;align-items:center;gap:8px;letter-spacing:1.3px;font-size:9px;margin-bottom:22px}.parent-showcase .showcase-label{color:#c1d3af}.panel-showcase-grid h3{font-size:32px;letter-spacing:-1.2px;line-height:1.25;margin-bottom:18px}.panel-showcase-grid p{font-size:13px;margin-bottom:25px}.parent-showcase>p{color:#c2d1c3}.sample-review{background:#fff;color:#244734;padding:22px;border-radius:16px;box-shadow:0 15px 30px #0c2d261c;transform:rotate(-2deg);margin:32px 0 35px;min-height:231px}.sample-review>div:first-child{display:flex;align-items:center;gap:10px}.sample-avatar{width:36px;height:36px;display:grid;place-items:center;border-radius:12px;background:#e5ecdc;font-weight:700}.sample-review strong{font-size:12px}.sample-review small{display:block;font-size:9px;margin-top:3px}.review-dot{width:8px;height:8px;background:#d4a958;border-radius:50%;margin-left:auto}.sample-review-note{font-size:11px;color:#617161;padding:15px;background:#f5f7f1;margin:17px 0;border-radius:8px}.sample-approve{display:flex;justify-content:center;gap:8px;align-items:center;background:#285a43;color:#fff;padding:10px;border-radius:8px;font-size:10px}.sample-review .sample-label{font-size:8px;text-align:center;margin-top:12px}.feature-checks{list-style:none;padding:0;margin:0;display:grid;gap:14px;font-size:12px}.feature-checks li{display:flex;gap:9px;align-items:center;line-height:1.6}.feature-checks svg{width:16px;color:#73964a}.parent-showcase .feature-checks{color:#dce5d8}.parent-showcase .feature-checks svg{color:#bbd68a}.sample-child-goal{min-height:231px;position:relative;background:#fffdf5;border:1px solid #e6e3d2;border-radius:18px;margin:32px 0 35px;padding:18px 26px;text-align:center;transform:rotate(2deg);box-shadow:0 10px 25px #625b2510}.book-emoji{display:block;font-size:40px;line-height:1.3;margin-bottom:8px}.sample-child-goal>strong{display:block;font-size:16px}.sample-child-goal>span:not(.book-emoji):not(.sample-star){font-size:10px;color:#72815e}.sample-child-goal .progress{margin:14px 0 7px;background:#e9edda}.sample-child-goal>small{font-size:8px}.sample-star{position:absolute;right:18px;top:15px;font-size:40px;color:#dec167}
.everyday-section{display:grid;grid-template-columns:1fr 1fr;gap:85px;align-items:center;border-top:1px solid #e1e6d9}.everyday-art{padding:40px;background:#f0f2e9;border-radius:25px;border:1px solid #e3e8dc}.everyday-art>.eyebrow{font-size:9px;margin-bottom:28px}.everyday-item{background:#fff;padding:18px;border:1px solid #e6e9df;border-radius:13px;display:flex;align-items:center;gap:12px;transition:transform .2s}.everyday-item:hover{transform:translateX(5px)}.everyday-item>span{font-size:25px}.everyday-item strong{display:block;font-size:12px}.everyday-item small{display:block;font-size:9px;margin-top:4px}.everyday-item>svg{margin-left:auto;color:#7e995b;width:16px}.everyday-connector{height:24px;border-left:2px dashed #bbc9a8;margin-left:32px}.parent-tip{display:flex;gap:13px;font-size:12px;padding:18px 20px;border-left:3px solid #afc67f;background:#eff3e6;color:#657754;line-height:1.8;margin-top:27px}.parent-tip strong{display:block;color:#37593b;margin-bottom:4px}.faq-section{display:grid;grid-template-columns:.85fr 1.15fr;gap:70px;border-top:1px solid #e1e6d9}.faq-decoration{display:block;color:#d6dfbe;font-family:Georgia,serif;font-size:130px;line-height:1;margin-top:26px;transform:rotate(-13deg);width:90px}.faq-list details{border-bottom:1px solid #dfe5d8}.faq-list details:first-child{border-top:1px solid #dfe5d8}.faq-list summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:17px;padding:23px 0;font-weight:600;font-size:13px}.faq-list summary::-webkit-details-marker{display:none}.faq-number{font-size:10px;font-weight:500;color:#829075}.faq-list summary>svg{margin-left:auto;transition:transform .25s}.faq-list details[open] summary>svg{transform:rotate(45deg)}.faq-list details[open] summary{color:#53713e}.faq-list details>p{margin:0;padding:0 30px 23px;font-size:12px;animation:rise-in .3s}.final-cta{background:#e9efd8;border:1px solid #dce4c8;border-radius:28px;text-align:center;position:relative;padding:65px 40px;margin-bottom:75px;overflow:hidden}.final-cta h2{font-size:44px}.final-cta h2 em{color:#526d3f}.final-cta>p{font-size:13px}.final-cta .button{background:#244e3c;color:#fff;margin-top:13px;padding:15px 23px}.final-cta>small{display:block;font-size:9px;margin-top:20px;color:#66784e}.cta-spark{position:absolute;right:55px;top:48px;font-size:100px;line-height:1;color:#c1d392;transform:rotate(15deg)}.premium-landing .premium-footer{padding:34px 0 40px;max-width:1224px;align-items:center}.premium-footer>div:first-child>p{margin-top:12px;font-size:11px}.footer-links{display:flex;gap:28px;font-size:11px}.footer-links>a{display:flex;gap:6px;align-items:center}.premium-footer>span{font-size:11px;line-height:1.9;text-align:right}

/* Authentication shares the brand, with a playful child variant. */
.premium-auth{background:#fdfdf9;grid-template-columns:46% 54%}.premium-auth .auth-story{position:relative;background:#214c3b;color:#fff;padding:40px 55px;overflow:hidden;isolation:isolate}.premium-auth .auth-story:before{content:'';position:absolute;inset:0;z-index:-1;background-image:radial-gradient(#ffffff12 1px,transparent 1px);background-size:24px 24px;mask-image:linear-gradient(transparent,#000)}.premium-auth .auth-story>.brand{color:#fff}.premium-auth .auth-story .brand-mark{background:#e4eccd;color:#27523b}.premium-auth .auth-story>.auth-story-content{margin:55px 0 30px}.premium-auth .auth-story .eyebrow{color:#c1d8a5;font-size:9px}.premium-auth .auth-story h1{font-size:clamp(36px,3.7vw,57px);line-height:1.13;letter-spacing:-2.4px;animation:rise-in .7s both;margin:20px 0}.premium-auth .auth-story h1 em{color:#cee3a6}.premium-auth .auth-story p{color:#c8d7c7;font-size:13px;max-width:370px;line-height:1.9}.auth-illustration{position:relative;height:285px;max-width:390px;margin:30px auto 0;display:grid;place-items:center}.auth-orbit{position:absolute;width:260px;height:260px;border:1px solid #d8e5b72b;border-radius:50%;transform:rotate(-20deg)}.auth-orbit:after{content:'';position:absolute;inset:-20px;border:1px dashed #d8e5b71c;border-radius:50%}.auth-dream-card{position:relative;background:#f6f7e9;color:#274b37;width:270px;padding:25px;border-radius:20px;display:flex;flex-direction:column;align-items:center;gap:13px;transform:rotate(-7deg);box-shadow:0 25px 40px #102e3230;animation:wallet-arrive 1s .1s both}.dream-emoji{font-size:52px;line-height:1.1}.auth-dream-card>span:nth-child(2){font-size:8px;letter-spacing:1.5px;color:#69804d}.auth-dream-card>strong{font-size:14px}.auth-dream-card>small{font-size:8px;color:#6b795d}.dream-steps{display:flex;gap:6px;width:100%;margin:2px 0}.dream-steps i{height:8px;border-radius:5px;flex:1;background:#88a956;animation:progress-grow 1s both;transform-origin:left}.dream-steps i:nth-child(2){animation-delay:.12s}.dream-steps i:nth-child(3){animation-delay:.24s}.dream-steps i:nth-child(4){background:#d4dfb4;animation-delay:.36s}.dream-steps i:last-child{background:#e1e7d1;animation-delay:.48s}.auth-spark{position:absolute;right:-5px;top:5px;font-size:70px;color:#c9db92;animation:spark-turn 3s both}.auth-success{position:absolute;bottom:4px;right:-15px;background:#fff;padding:13px 17px;border:1px solid #dfe6d8;border-radius:12px;display:flex;align-items:center;gap:10px;transform:rotate(5deg);color:#2c5039;box-shadow:0 12px 20px #0e29221c;animation:task-arrive .9s .35s both}.auth-success>span{width:34px;height:34px;display:grid;place-items:center;background:#eaf2dc;border-radius:50%}.auth-success strong{display:block;font-size:11px}.auth-success small{display:block;font-size:8px;margin-top:3px}.auth-story-footer{display:flex;justify-content:space-between;align-items:center;gap:15px;font-size:10px;color:#c3d2b6}.auth-story-footer>span:first-child{display:flex;gap:9px;align-items:center}.premium-auth .auth-main{padding:35px 60px}.auth-topline{display:flex;align-items:center;justify-content:space-between;gap:20px}.auth-topline>span{display:flex;align-items:center;gap:6px;font-size:9px;color:#77866d}.premium-auth .back-link{font-size:11px;color:#64765c}.auth-mobile-brand{display:none}.premium-auth .auth-form{max-width:410px;padding:45px 0;animation:rise-in .7s .12s both}.auth-welcome-icon{display:grid;place-items:center;width:52px;height:52px;background:#eff3e4;border:1px solid #e1e7d6;color:#638149;border-radius:17px;margin-bottom:26px;transform:rotate(-7deg)}.premium-auth .auth-form .eyebrow{font-size:8px;letter-spacing:1.6px}.premium-auth .auth-form h2{font-size:33px;line-height:1.24;letter-spacing:-1.4px;margin-bottom:14px}.premium-auth .auth-form>p{font-size:12px;line-height:1.8;margin-bottom:24px}.premium-auth form label{font-size:11px;margin-bottom:17px}.premium-auth input{background:#fff;min-height:48px;border-color:#dfe5d9;border-radius:10px;font-size:12px}.premium-auth label small{font-size:9px;color:#718068}.premium-auth .role-switch{margin-bottom:11px;padding:5px;background:#eef1e7;gap:5px;border:1px solid #e4e9dc;border-radius:13px}.premium-auth .role-switch button{gap:10px;min-height:57px;padding:10px;border-radius:9px;font-size:11px;text-align:left;transition:background .25s,box-shadow .25s,color .25s}.role-switch button>span>small{display:block;font-weight:400;font-size:8px;color:#6f7d64;margin-top:3px}.premium-auth .role-switch button.selected{background:#fff;box-shadow:0 3px 10px #20391e0b;color:#305b3c}.role-hint{display:flex;gap:8px;align-items:flex-start;font-size:10px;color:#627555;line-height:1.6;margin-bottom:22px;animation:rise-in .3s}.role-hint svg{margin-top:1px}.premium-auth .auth-form form>.button{min-height:49px;border-radius:11px;font-size:12px}.auth-assurance{display:flex;justify-content:center;align-items:center;gap:6px;border-top:1px solid #e6ebdf;padding-top:21px;margin-top:25px;font-size:9px;color:#7b8872}.premium-auth .auth-bottom{font-size:11px!important}.premium-auth.auth-child .auth-story{background:#474773;transition:background .4s}.auth-child .auth-story h1 em{color:#e9dc9f}.auth-child .auth-welcome-icon{background:#efeaf7;color:#72608e}.auth-child .role-switch button.selected{color:#655183}.auth-child .button.primary{background:#655582}.auth-child .auth-dream-card{background:#f6f0dc}

/* Common dashboard: clearer hierarchy, readable data, tactile controls. */
.app-shell .sidebar{width:254px;padding:30px 18px 20px}.app-shell .app-main{margin-left:254px;width:calc(100% - 254px)}.app-shell .nav-item{min-height:46px;font-size:12px;padding:12px 15px;gap:12px;transition:background .2s,color .2s,transform .2s;border-radius:11px}.app-shell .nav-item:hover{transform:translateX(2px)}.app-shell .nav-item.active{position:relative}.app-shell .workspace-label{margin:40px 14px 15px;font-size:8px;letter-spacing:1.8px}.app-shell .topbar{height:83px;padding:0 38px;background:#ffffffb8;backdrop-filter:blur(14px)}.app-shell .breadcrumb{font-size:11px;color:#778477}.app-shell .profile-text strong{font-size:12px}.app-shell .profile-text small{font-size:10px}.app-shell .virtual-label{font-size:10px;color:#5f7650;background:#eef3e6;padding:6px 10px;border:1px solid #e3e9d9;border-radius:7px}.app-shell .avatar{border-radius:12px;background:#ede9d7;color:#685b37}.app-shell .dashboard-content{max-width:1480px;padding:38px 38px 0}.page-heading{margin-bottom:29px}.app-shell .page-heading h1{font-size:33px;letter-spacing:-1.3px}.app-shell .page-heading .eyebrow{font-size:8px;color:#6c7c67;letter-spacing:1.8px;margin-bottom:11px}.app-shell .page-heading p{font-size:12px;color:#647360;line-height:1.8}.app-shell .page-heading>.button{font-size:12px;min-height:45px}.app-shell .card,.app-shell .task-card,.app-shell .stat-card{box-shadow:0 3px 12px #1c3b2503;border-color:#e0e6dc;transition:box-shadow .25s,border-color .25s,transform .25s}.app-shell .task-card:hover,.app-shell .goal-card:hover{transform:translateY(-3px);box-shadow:0 12px 25px #24382608;border-color:#c3d1b8}.app-shell .stat-card{padding:22px;border-radius:17px;animation:rise-in .55s both}.stat-card:nth-child(2){animation-delay:.07s}.stat-card:nth-child(3){animation-delay:.14s}.stat-card:nth-child(4){animation-delay:.21s}.app-shell .stat-card>div{font-size:11px;color:#64775e}.app-shell .stat-card>div>span{color:#60715a}.app-shell .stat-card>div>svg{width:31px;height:31px;padding:6px;background:#f0f3eb;border-radius:9px}.app-shell .stat-card>strong{font-size:29px;margin:15px 0 9px;line-height:1.25;font-variant-numeric:tabular-nums;letter-spacing:-1.1px}.app-shell .stat-card>small{font-size:10px;color:#6b7962;line-height:1.6}.app-shell .stat-card.green{background:#e9efdf;border-color:#dbe5ce}.app-shell .stat-card.warm{background:#fbf3e4;border-color:#efe3cd}.app-shell .section-heading h2{font-size:19px;letter-spacing:-.6px}.app-shell .section-heading .text-link{font-size:11px}.app-shell .task-card{padding:24px;border-radius:19px}.app-shell .task-card h3{font-size:18px;margin-bottom:12px}.app-shell .task-description{font-size:12px;color:#64735f;line-height:1.8}.app-shell .tag{font-size:10px;padding:5px 9px;border-radius:6px;color:#527336;background:#edf4e4}.app-shell .tag.amber{color:#946323;background:#fbf0da}.app-shell .child-label{color:#687761;font-size:11px}.app-shell .task-deadline{font-size:11px;color:#697760}.app-shell .task-deadline.overdue{color:#a34f3a}.app-shell .task-reward{padding-top:18px;margin-top:20px}.app-shell .task-reward>span{font-size:11px;color:#697861}.app-shell .task-reward>strong{font-size:15px}.app-shell .task-actions .button,.app-shell .goal-actions .button{min-height:42px;font-size:12px}.app-shell .task-actions .text-button{font-size:11px}.app-shell .goal-card{padding:25px;border-radius:19px}.app-shell .goal-card h3{font-size:19px}.app-shell .goal-icon{background:#f2ecd8;color:#8c7942;border-radius:13px}.app-shell .goal-numbers strong,.app-shell .goal-numbers small{font-size:11px}.app-shell .goal-card>p{font-size:11px;color:#67785b}.app-shell .empty-state{background:linear-gradient(135deg,#fdfefb,#f4f7ed);border:1px dashed #cbd7bc;border-radius:19px;padding:40px 25px}.app-shell .empty-state>span{background:#eaf0db;color:#6a874c;transform:rotate(-7deg);border-radius:19px}.app-shell .empty-state h3{font-size:19px}.app-shell .empty-state p{font-size:12px;color:#6a795e}.app-shell .empty-state .button{min-height:43px;font-size:12px}.app-shell .feature-banner{background:#e9efdc;border-color:#dfe6d0;border-radius:20px;padding:30px 33px}.app-shell .feature-banner h2{font-size:24px;color:#324b2e}.app-shell .feature-banner p{font-size:12px;color:#5f7351}.app-shell .feature-banner .eyebrow{color:#607b47;font-size:8px}.app-shell .banner-art{color:#819c55}.app-shell .banner-art>span{animation:spark-turn 3s both}.app-shell .grow-note{padding:18px;background:#f3f6ed;border-color:#e5ebdb;border-radius:15px}.app-shell .grow-note strong{font-size:11px}.app-shell .grow-note p{font-size:10px;line-height:1.8;color:#687b5b}.app-shell .filter-tabs{background:#e9eee2;padding:5px;gap:4px;border-radius:12px}.app-shell .filter-tabs button{min-height:38px;padding:9px 15px;font-size:11px;color:#5d6d51;transition:background .2s,box-shadow .2s}.app-shell .filter-tabs button.active{color:#34562b;box-shadow:0 2px 8px #2347210a;border-radius:8px}.app-shell .wallet-hero{background:#214e3e;border-radius:23px;padding:35px;min-height:175px;box-shadow:0 12px 24px #203d2c0b}.app-shell .wallet-hero h2{font-size:42px;letter-spacing:-1.5px}.app-shell .wallet-hero p{font-size:12px;color:#d2dfc7}.app-shell .wallet-hero .eyebrow{color:#c7ddad}.app-shell .ledger-row{padding:21px 0}.app-shell .ledger-row strong,.app-shell .notification-card p{font-size:13px;color:#405637}.app-shell .ledger-row small,.app-shell .request-card small,.app-shell .notification-card small{font-size:11px;color:#6f7e63}.app-shell .notification-card.unread{background:#f0f5e7;border-color:#d6e3c5}.app-shell .lesson-card h2{font-size:21px}.app-shell .lesson-card>p{font-size:13px;color:#5e7053}.app-shell .answers button{font-size:12px;min-height:45px;transition:background .2s,transform .2s;border-radius:10px;color:#526744}.app-shell .answers button:hover{transform:translateX(2px);border-color:#b6c79f}.app-shell .answers button.correct{animation:answer-pop .4s both}.app-shell .section-note,.app-shell .dashboard-footer{font-size:10px;color:#6f7c64}.app-shell .steps-list strong{font-size:13px}.app-shell .steps-list p{font-size:12px;color:#617557}.app-shell .child-card p{color:#617557}.app-shell .modal-backdrop{background:#102b245e;backdrop-filter:blur(7px)}.app-shell .modal{border:1px solid #e3e9db;border-radius:24px;padding:29px;box-shadow:0 30px 100px #0b231f2e;animation:modal-in .25s both}.app-shell .modal-title h2{font-size:24px}.app-shell .modal-title p{font-size:12px;color:#607357}.app-shell .modal label{font-size:12px}.app-shell .modal label small{font-size:11px}.app-shell .modal input,.app-shell .modal textarea,.app-shell .modal select{background:#fdfefa;min-height:46px;border-radius:10px}.app-shell .toast{border:1px solid #487554;box-shadow:0 12px 35px #102e2925;animation:toast-in .35s both}.app-shell .page-heading{animation:rise-in .55s both}.app-shell .task-card,.app-shell .goal-card,.app-shell .lesson-card{animation:rise-in .6s both}.app-shell .task-card:nth-child(2),.app-shell .goal-card:nth-child(2),.app-shell .lesson-card:nth-child(2){animation-delay:.07s}.app-shell .task-card:nth-child(3),.app-shell .lesson-card:nth-child(3){animation-delay:.14s}
.dashboard-path{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid #e0e6d8;border-radius:16px;margin-bottom:24px;background:#fff;overflow:hidden}.path-intro{grid-column:1/-1;display:flex;align-items:center;gap:8px;padding:13px 18px;background:#f0f4e9;border-bottom:1px solid #e1e8d8;font-size:10px;font-weight:650;color:#5c7449}.path-intro svg{width:16px;height:16px}.dashboard-path>a{display:flex;align-items:center;gap:12px;padding:18px;transition:background .2s;min-width:0}.dashboard-path>a+a{border-left:1px solid #e6ebde}.dashboard-path>a:hover{background:#f7f9f1}.dashboard-path>a>div{min-width:0}.dashboard-path>a>svg{margin-left:auto;color:#879970;width:15px}.dashboard-path strong{font-size:11px;display:block;line-height:1.6}.dashboard-path small{display:block;font-size:9px;color:#6b7b5e;margin-top:3px}.path-step{color:#77905a;background:#eff4e5;border:1px solid #e3ebd4;border-radius:9px;width:30px;height:33px;display:grid;place-items:center;flex-shrink:0;font-size:10px;font-weight:600}

/* Parents: quiet forest navigation and concise, structured surfaces. */
.parent-theme .sidebar{background:#193d31;border-color:#193d31;color:#e9f0e4}.parent-theme .sidebar .brand{color:#fff}.parent-theme .sidebar .brand-mark{background:#c7dda6;color:#264a31}.parent-theme .workspace-label{color:#9eb69b}.parent-theme .sidebar .nav-item{color:#bdcdbb}.parent-theme .sidebar .nav-item:hover{background:#ffffff0a;color:#fff}.parent-theme .sidebar .nav-item.active{background:#dce9c5;color:#24462e;box-shadow:0 3px 10px #0c281322}.parent-theme .sidebar .nav-item b{background:#bdd294;color:#345128}.parent-theme .sidebar .grow-note{background:#ffffff05;border-color:#ffffff12}.parent-theme .sidebar .grow-note strong{color:#e2ebd5}.parent-theme .sidebar .grow-note p{color:#aec1a4}.parent-theme .sidebar .grow-note>span{font-size:28px}.parent-theme .sidebar-bottom>.nav-item{font-size:11px;color:#a7bba3}.parent-theme .feature-banner{background:#edf1e6}.parent-theme .stat-card.green{background:#e5edde}

/* Children: soft colour, rounded shapes, and a visible path to their dream. */
.child-theme{background:#f9f8f0;--green:#5b6f36;--green-dark:#45582a;--line:#e7e7d8}.child-theme .sidebar{background:#fffef8;border-color:#e7e8d9}.child-theme .sidebar .brand-mark{background:#788e45;color:#fff9df}.child-theme .workspace-label{color:#847e5f}.child-theme .nav-item{border-radius:13px}.child-theme .nav-item.active{background:#eaf0cc;color:#506732;box-shadow:inset 0 -2px 0 #d6e2ac}.child-theme .nav-item:nth-child(2)>svg{color:#b08140}.child-theme .nav-item:nth-child(3)>svg{color:#9175a6}.child-theme .nav-item:nth-child(4)>svg{color:#629289}.child-theme .nav-item:nth-child(6)>svg{color:#ad8551}.child-theme .topbar{background:#fffef8c7;border-color:#e8e9dc}.child-theme .avatar{background:#eee3b8;border-radius:14px;transform:rotate(-6deg);color:#827037}.child-theme .wave{display:inline-block;transform-origin:70% 75%;animation:wave-hello 1.4s .4s both}.child-theme .page-heading h1{font-size:35px}.child-theme .page-heading .eyebrow{color:#8a865f}.child-theme .dashboard-path{border-color:#e3e7cc;background:#fffef6;border-radius:20px}.child-theme .path-intro{background:#eff1d9;color:#6d7442;border-color:#e4e8c9}.child-theme .path-step{background:#e9edcd;color:#788243;border:0;border-radius:10px;transform:rotate(-5deg)}.child-theme .dashboard-path>a:nth-child(3) .path-step{background:#f3e0cc;color:#a27d4d;transform:rotate(5deg)}.child-theme .dashboard-path>a:nth-child(4) .path-step{background:#e8e0f3;color:#8a76a4}.child-theme .dashboard-path>a:hover{background:#f6f4e6}.child-theme .stat-card{border-radius:20px;border-color:#e7e7d6;background:#f0eaf7;box-shadow:0 4px 0 #e5deee}.child-theme .stat-card:nth-child(3){background:#edf1dd;box-shadow:0 4px 0 #e0e7c8}.child-theme .stat-card.green{background:#e6edcf;border-color:#dce5be;box-shadow:0 4px 0 #d8e2b7}.child-theme .stat-card.warm{background:#fbebd7;border-color:#efdfc7;box-shadow:0 4px 0 #f0dec3}.child-theme .stat-card>div>svg{background:#ffffff75;transform:rotate(-8deg)}.child-theme .stat-card>strong{color:#526337}.child-theme .stat-card:nth-child(2)>strong{color:#79618f}.child-theme .stat-card.warm>strong{color:#987037}.child-theme .stat-card>div>span,.child-theme .stat-card>small{color:#626b50}.child-theme .feature-banner{position:relative;background:#ece7f4;border:1px solid #dfd5ec;border-radius:23px;padding:32px;box-shadow:0 5px 0 #e5ddee;margin:30px 0 35px}.child-theme .feature-banner h2{color:#635176;font-size:27px}.child-theme .feature-banner p{color:#796989}.child-theme .feature-banner .eyebrow{color:#887499}.child-theme .feature-banner .text-link{color:#6d5687}.child-theme .banner-art{color:#a292ba}.child-theme .banner-art:before{border:2px dashed #c7b8d8}.child-theme .banner-art>svg{animation:target-bob 3s both}.child-theme .task-card{border-radius:22px;background:#fffefa;border-color:#e7e4d5;box-shadow:0 4px 0 #eeecdf;position:relative;overflow:hidden}.child-theme .task-card:before{content:'';height:5px;background:#bfd192;position:absolute;top:0;left:0;right:0}.child-theme .task-card:nth-child(3n+2):before{background:#d3bedd}.child-theme .task-card:nth-child(3n+3):before{background:#e8c195}.child-theme .task-card:hover{transform:translateY(-5px) rotate(-.3deg);box-shadow:0 9px 0 #eeecdf}.child-theme .task-card .task-reward{background:#f3f5e7;border:0;border-radius:12px;padding:13px;margin-top:20px}.child-theme .task-card .task-reward>strong{color:#6b803c}.child-theme .task-actions>.button.primary{background:#718945;box-shadow:0 4px 0 #556c30;border-radius:12px;margin-bottom:4px}.child-theme .task-actions>.button.primary:hover{background:#627b38;transform:translateY(-2px)}.child-theme .task-actions>.button.primary:active{box-shadow:0 1px 0 #556c30;transform:translateY(3px)}.child-theme .goal-card{background:#fffdf5;border-color:#e9e3cd;box-shadow:0 4px 0 #eeeadb;border-radius:22px}.child-theme .goal-card:nth-child(2n){background:#faf7ff;border-color:#e5ddef;box-shadow:0 4px 0 #eee7f4}.child-theme .goal-icon{background:#f5e9bc;color:#a58a40;transform:rotate(-7deg);width:49px;height:49px;border-radius:16px}.child-theme .goal-card:nth-child(2n) .goal-icon{background:#e9dff4;color:#9477ad;transform:rotate(7deg)}.child-theme .goal-card .progress{height:12px;background:#eeeddc}.child-theme .goal-card .progress>span{background:repeating-linear-gradient(120deg,#9fb867 0,#9fb867 12px,#a9c174 12px,#a9c174 24px)}.child-theme .empty-state{background:#fffdf3;border-color:#d9ddbc}.child-theme .empty-state>span{background:#f1edcc;color:#9b8f45;animation:sticker-pop .8s both}.child-theme .wallet-hero{background:#586e40;border:1px solid #526939;box-shadow:0 5px 0 #435933;border-radius:24px}.child-theme .lesson-card{background:#fffdf4;border-radius:23px;box-shadow:0 4px 0 #eee9d7}.child-theme .lesson-card:nth-child(2){background:#faf7ff;box-shadow:0 4px 0 #eee7f4}.child-theme .lesson-card:nth-child(3){background:#f4f8ed;box-shadow:0 4px 0 #e6eddc}.child-theme .lesson-icon{background:#f0e6be;color:#9a8242;transform:rotate(-5deg)}.child-theme .lesson-card:nth-child(2) .lesson-icon{background:#e8dcf5;color:#9577ab}.child-theme .lesson-card .answers button{background:#ffffff9c;border-color:#e3e3d4}.child-theme .lesson-card .answers button.correct{background:#e4f0d0;border-color:#95b963;color:#48692b}.child-theme .lesson-card .answers button.incorrect{background:#fff0e4;border-color:#e1bea0;color:#9b603a}.child-theme .grow-note{background:#f3efda;border-color:#eae4c7}.child-theme .modal{background:#fffef8;border-color:#ebe5d3}.child-theme .toast{background:#5a753c;border-color:#7b9558}

/* One-time welcome, family accounts, and earned experience. */
.app-shell .welcome-card {
  display: flex;
  align-items: center;
  gap: 22px;
  margin: 0 0 28px;
  padding: 25px;
  background: #eff4e7;
  border: 1px solid #dce7cb;
  border-radius: 20px;
  animation: rise-in .5s both;
}
.welcome-card-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #dfeacb;
  color: #54743a;
}
.welcome-card-copy { flex: 1; min-width: 0; }
.welcome-card .eyebrow { font-size: 8px; margin-bottom: 8px; }
.welcome-card h2 { font-size: 20px; margin-bottom: 9px; }
.welcome-card p { font-size: 12px; color: #53684a; margin-bottom: 8px; }
.welcome-card small { font-size: 10px; color: #64745c; }
.welcome-card>.button { flex-shrink: 0; }
.child-theme .welcome-card { background: #f4eedc; border-color: #e8debd; }
.child-theme .welcome-card-icon { background: #eadfac; color: #8c7535; transform: rotate(-6deg); }
.app-shell .level-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px;
  margin: 0 0 28px;
  background: linear-gradient(115deg, #eee6f6, #f9f5e7);
  border: 1px solid #e2d6ef;
  border-radius: 23px;
  box-shadow: 0 4px 0 #e9e0f0;
}
.level-medal {
  width: 88px;
  height: 98px;
  flex-shrink: 0;
  position: relative;
  display: grid;
  place-items: center;
  background: #f2e2a6;
  border: 5px solid #fcf4d7;
  border-radius: 27px;
  box-shadow: 0 4px 0 #d6bd70;
  color: #907231;
  transform: rotate(-7deg);
}
.level-medal svg { position: absolute; opacity: .2; width: 65px; height: 65px; }
.level-medal strong { font-family: 'Manrope', sans-serif; font-size: 33px; z-index: 1; }
.level-copy { flex: 1; min-width: 0; }
.level-copy .eyebrow { font-size: 8px; color: #7a638d; margin-bottom: 8px; }
.level-heading { display: flex; align-items: center; justify-content: space-between; gap: 15px; }
.level-heading h2 { margin: 0; font-size: 24px; color: #66517c; }
.level-heading h2>span { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0; margin-left: 10px; color: #776984; }
.xp-total { padding: 5px 10px; border: 1px solid #dfd5e8; background: #ffffff80; border-radius: 8px; font-size: 11px; color: #766185; white-space: nowrap; }
.level-progress-label { display: flex; justify-content: space-between; gap: 10px; margin: 17px 0 8px; font-size: 11px; color: #746380; }
.level-progress { height: 12px; background: #dfd5e6; border: 2px solid #ffffffa6; }
.level-progress>span { background: repeating-linear-gradient(120deg, #aa8cc1 0, #aa8cc1 12px, #b69acc 12px, #b69acc 24px); }
.level-copy>p { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 10px; color: #79688a; margin: 11px 0 0; }
.task-xp { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; color: #7a648f; font-size: 11px; margin-top: 11px; }
.task-xp>strong { padding: 3px 7px; background: #f1eaf8; border-radius: 6px; }
.task-xp>span { color: #6e7965; font-size: 10px; }
.app-shell .family-balances { margin: 0 0 32px; }
.family-total-strip { display: grid; grid-template-columns: 1.25fr 1fr 1fr; background: #fdfefb; border: 1px solid #dce5d5; border-radius: 18px; overflow: hidden; }
.family-total-strip>div { padding: 23px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
.family-total-strip>div+div { border-left: 1px solid #e2e9db; }
.family-total-strip .family-total-main { background: #244e3d; color: #fff; }
.family-total-strip span { font-size: 11px; color: #536a49; }
.family-total-strip strong { font-family: 'Manrope', sans-serif; font-size: 26px; line-height: 1.35; letter-spacing: -.8px; margin: 10px 0 7px; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
.family-total-strip small { font-size: 9px; color: #65755b; line-height: 1.7; }
.family-total-main span { color: #dce9cd; }
.family-total-main small { color: #bed0b4; }
.child-balance-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px; margin-top: 17px; }
.child-balance-card { background: #fff; border: 1px solid #e1e7da; border-radius: 17px; padding: 22px; min-width: 0; }
.child-balance-person { display: flex; align-items: flex-start; gap: 12px; }
.child-balance-person>div { min-width: 0; }
.child-balance-person h3 { font-size: 16px; margin-bottom: 4px; overflow-wrap: anywhere; }
.child-balance-person small { font-size: 10px; color: #6c7c60; }
.child-balance-person small strong { display: inline-block; color: #31593d; margin-left: 4px; overflow-wrap: anywhere; }
.child-balance-card dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 20px 0 0; border-top: 1px solid #e8ecdf; padding-top: 16px; }
.child-balance-card dt { font-size: 10px; color: #65795a; margin-bottom: 6px; }
.child-balance-card dd { font-size: 12px; font-weight: 650; margin: 0; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
.requested-balance dd { color: #a17635; }
.balance-explanation { display: flex; gap: 8px; font-size: 10px; color: #6d7b60; line-height: 1.8; margin: 14px 0 0; max-width: 850px; }
.balance-explanation svg { margin-top: 3px; }
.family-balance-empty { padding: 25px; border: 1px dashed #d4dfc7; border-radius: 15px; margin-top: 16px; background: #fafcf6; }
.family-balance-empty p { font-size: 12px; margin-bottom: 10px; }
@media(max-width:1080px) {
  .welcome-card-icon { display: none; }
  .family-total-strip>div { padding: 20px 16px; }
  .family-total-strip strong { font-size: 22px; }
  .child-balance-list { grid-template-columns: 1fr; }
  .level-heading h2>span { display: block; margin: 4px 0 0; }
}
@media(max-width:720px) {
  .app-shell .welcome-card { flex-wrap: wrap; padding: 23px; gap: 17px; }
  .welcome-card-copy { flex-basis: 100%; }
  .welcome-card h2 { font-size: 20px; }
  .welcome-card p { font-size: 12px; }
  .welcome-card>.button { width: 100%; }
  .app-shell .level-card { gap: 14px; padding: 21px 18px; align-items: flex-start; }
  .level-medal { width: 49px; height: 59px; border-width: 3px; border-radius: 17px; margin-top: 9px; }
  .level-medal svg { width: 38px; height: 38px; }
  .level-medal strong { font-size: 24px; }
  .level-heading { flex-wrap: wrap; gap: 8px; }
  .level-heading h2 { font-size: 21px; }
  .level-heading h2>span { font-size: 10px; }
  .xp-total { font-size: 9px; padding: 4px 7px; }
  .level-progress-label { flex-wrap: wrap; gap: 4px; font-size: 10px; margin-top: 12px; }
  .level-copy>p { font-size: 10px; line-height: 1.7; }
  .family-total-strip { grid-template-columns: 1fr 1fr; }
  .family-total-strip .family-total-main { grid-column: 1/-1; }
  .family-total-strip>div { padding: 20px 17px; }
  .family-total-strip>div:nth-child(2) { border-left: 0; }
  .family-total-strip span { font-size: 10px; }
  .family-total-strip strong { font-size: 21px; }
  .family-total-strip .family-total-main strong { font-size: 29px; }
  .family-total-strip small { font-size: 9px; }
  .child-balance-card { padding: 20px 17px; }
  .child-balance-person small strong { display: block; margin: 4px 0 0; font-size: 12px; }
  .child-balance-card dl { gap: 10px; }
  .child-balance-card dt { font-size: 9px; }
  .child-balance-card dd { font-size: 11px; }
  .balance-explanation { font-size: 10px; }
}

/* Short, purposeful animation; no endlessly moving decoration. */
.is-revealed{animation:rise-in .75s both}.is-revealed .skill-card,.is-revealed .process-grid article{animation:rise-in .7s both}.is-revealed .skill-card:nth-child(2),.is-revealed .process-grid article:nth-child(2){animation-delay:.08s}.is-revealed .skill-card:nth-child(3),.is-revealed .process-grid article:nth-child(3){animation-delay:.16s}.is-revealed .skill-card:nth-child(4){animation-delay:.24s}
@keyframes rise-in{from{opacity:0;translate:0 18px}to{opacity:1;translate:0 0}}
@keyframes progress-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes wallet-arrive{from{opacity:0;transform:translateY(25px) rotate(-12deg)}to{opacity:1;transform:translateY(0) rotate(-7deg)}}
@keyframes task-arrive{from{opacity:0;transform:translateX(25px) rotate(7deg)}to{opacity:1;transform:translateX(0) rotate(3deg)}}
@keyframes goal-arrive{from{opacity:0;transform:translateY(25px) rotate(2deg)}to{opacity:1;transform:translateY(0) rotate(-3deg)}}
@keyframes sticker-pop{0%{opacity:0;scale:.75}65%{opacity:1;scale:1.06}100%{opacity:1;scale:1}}
@keyframes spark-turn{0%{rotate:-25deg;scale:.8}50%{rotate:20deg;scale:1.1}100%{rotate:0deg;scale:1}}
@keyframes wave-hello{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(20deg)}40%,80%{transform:rotate(-8deg)}}
@keyframes target-bob{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-8px) rotate(-8deg)}70%{transform:translateY(3px) rotate(5deg)}}
@keyframes modal-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes toast-in{from{opacity:0;translate:0 12px}to{opacity:1;translate:0 0}}
@keyframes answer-pop{50%{transform:scale(1.02)}100%{transform:scale(1)}}

@media(min-width:1550px){.app-shell .dashboard-content{padding-top:45px}.app-shell .stat-card{padding:26px}.app-shell .stat-card>strong{font-size:33px}}
@media(max-width:1320px){.landing-section,.promise-strip,.premium-landing .premium-footer{margin-left:48px;margin-right:48px}.premium-hero{gap:30px}.journey-task{margin-left:10px}.journey-wallet>strong{font-size:36px}.journey-goal{gap:13px;padding:18px}.goal-picture{width:65px;height:84px;font-size:34px}.journey-goal h3{font-size:13px}.hero-copy .hero-actions{gap:15px}.hero-copy .hero-note{gap:10px;font-size:9px}.premium-hero .hero-actions .button{padding:14px 16px}.hero-copy .text-link{font-size:11px}.intro-section{gap:65px}.everyday-section{gap:55px}.panel-showcase-grid>article{padding:32px}.skill-card{padding:22px 20px}.app-shell .sidebar{width:230px;padding:28px 14px}.app-shell .app-main{margin-left:230px;width:calc(100% - 230px)}.app-shell .dashboard-content{padding:30px 28px 0}.app-shell .stat-card{padding:19px 17px}.app-shell .stat-card>strong{font-size:25px}.app-shell .stat-card>small{font-size:9px}.dashboard-path>a{padding:16px 13px;gap:9px}.dashboard-path strong{font-size:10px}.dashboard-path small{font-size:8px}.dashboard-path>a>svg{width:12px}.premium-auth .auth-story{padding:38px}.premium-auth .auth-main{padding:32px 45px}}
@media(max-width:1080px){.premium-landing .landing-nav{padding:0 32px;height:88px}.premium-landing .landing-nav>div{gap:20px;font-size:11px}.premium-hero{padding:65px 32px 60px;gap:24px}.hero-copy h1{font-size:46px;letter-spacing:-2.3px}.hero-copy>p{font-size:13px}.hero-copy .hero-actions{flex-wrap:wrap}.hero-copy .hero-note{font-size:9px}.journey-scene{padding:40px 22px 30px;min-height:440px}.journey-task{padding:12px;gap:8px}.journey-task>b{font-size:11px}.journey-task small{font-size:7px}.journey-task strong{font-size:10px}.sample-check{width:30px;height:30px}.journey-wallet{padding:22px}.scene-heading{font-size:6px;letter-spacing:.9px}.goal-picture{width:50px;height:75px;font-size:28px}.journey-goal{gap:10px;padding:16px 13px}.journey-goal h3{font-size:12px;margin-bottom:10px}.goal-demo-numbers{font-size:8px}.scene-sticker{font-size:9px;padding:10px;right:-5px}.spark-one{font-size:58px;left:-15px}.landing-section,.promise-strip,.premium-landing .premium-footer{margin-left:32px;margin-right:32px}.promise-strip{font-size:10px;gap:20px}.promise-strip>div{gap:20px}.promise-strip>div>span{font-size:9px}.landing-section{padding-top:70px;padding-bottom:70px}.landing-section h2{font-size:34px}.intro-section{gap:40px}.intro-copy{padding-top:15px}.landing-section p{font-size:13px}.skills-grid{gap:12px}.skill-card{padding:20px 17px;min-height:250px}.skill-card h3{font-size:18px}.skill-card p{font-size:11px}.process-grid{gap:25px}.process-grid h3{font-size:18px}.panel-showcase-grid>article{padding:28px}.panel-showcase-grid h3{font-size:28px}.panel-showcase-grid p{font-size:12px}.feature-checks{font-size:11px}.everyday-section{gap:35px}.everyday-art{padding:27px}.everyday-item{padding:15px;gap:9px}.everyday-item strong{font-size:10px}.everyday-item small{font-size:8px}.faq-section{gap:40px}.cta-spark{font-size:70px;right:30px;top:30px}.app-shell .sidebar{width:206px;padding:26px 12px}.app-shell .sidebar .brand{font-size:20px}.app-shell .nav-item{font-size:11px;padding:11px;gap:9px}.app-shell .app-main{margin-left:206px;width:calc(100% - 206px)}.app-shell .dashboard-content{padding:28px 23px 0}.app-shell .topbar{padding:0 23px}.app-shell .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.app-shell .stat-card>strong{font-size:29px}.app-shell .stat-card>small{font-size:10px}.dashboard-path>a{padding:14px 10px;gap:7px}.dashboard-path>a>svg{display:none}.path-step{width:25px;height:30px;font-size:9px}.app-shell .task-card{padding:21px}.app-shell .task-reward{flex-wrap:wrap;gap:7px}.premium-auth .auth-story{padding:32px}.premium-auth .auth-main{padding:30px}.premium-auth .auth-form h2{font-size:30px}.premium-auth .auth-story h1{font-size:42px}.auth-topline>span{display:none}.auth-success{right:-5px}.auth-dream-card{width:240px;padding:23px}.auth-story-footer{font-size:9px}.auth-spark{right:-5px;font-size:58px}}
@media(max-width:800px){.premium-landing .landing-nav .landing-links{display:none}.premium-hero{grid-template-columns:1fr 1fr;gap:20px}.hero-copy h1{font-size:38px;letter-spacing:-1.8px}.hero-copy .pill{font-size:7px;padding:8px 10px;letter-spacing:.6px}.journey-scene{min-height:405px;padding:34px 15px 26px;border-radius:90px 90px 24px 24px}.journey-wallet{padding:18px}.journey-wallet>strong{font-size:30px}.wallet-card-top{font-size:7px}.wallet-card-bottom{font-size:8px}.journey-task{margin-left:0;margin-right:-7px}.journey-task small{max-width:130px}.journey-goal{margin-right:0}.journey-goal h3{font-size:11px}.journey-goal-copy>span{font-size:6px}.journey-goal-copy>small{font-size:7px}.scene-heading{font-size:5px}.scene-caption{font-size:7px}.hero-copy>p{font-size:12px}.promise-strip>div{gap:15px}.promise-strip>span{max-width:175px}.skills-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.skill-card{min-height:220px;padding:24px}.skill-card p{font-size:12px}.skill-top{margin-bottom:25px}.section-title-row>p{max-width:220px;font-size:12px}.panel-showcase-grid{gap:17px}.panel-showcase-grid>article{padding:25px}.panel-showcase-grid h3{font-size:24px}.sample-review{padding:17px;min-height:220px}.sample-review strong{font-size:10px}.sample-review small{font-size:8px}.sample-review-note{font-size:9px}.sample-approve{font-size:8px}.sample-child-goal{min-height:220px;padding:18px}.sample-child-goal>strong{font-size:14px}.feature-checks{font-size:10px}.everyday-section{gap:25px}.everyday-art{padding:22px}.landing-section h2{font-size:30px}.faq-list summary{font-size:12px;gap:10px}.faq-list details>p{padding-left:20px;font-size:11px}.faq-section{gap:28px}.premium-footer .footer-links{gap:15px;font-size:10px}.premium-auth .auth-story{padding:30px 24px}.premium-auth .auth-story h1{font-size:35px}.premium-auth .auth-story p{font-size:12px}.auth-dream-card{width:215px;padding:20px}.auth-dream-card>strong{font-size:12px}.auth-spark{font-size:45px;right:0}.auth-success{right:-10px;padding:10px}.auth-success small{font-size:7px}.premium-auth .auth-form h2{font-size:27px}.premium-auth .auth-main{padding:28px}.premium-auth .role-switch button{font-size:10px;padding:8px 5px;gap:6px}.role-switch button>span>small{font-size:7px}.auth-story-footer>span:last-child{display:none}}
@media(max-width:720px){.premium-landing .landing-nav{padding:0 22px;height:78px;gap:15px}.premium-landing .landing-nav .brand{font-size:22px}.premium-landing .landing-nav .landing-account{gap:16px}.premium-landing .landing-account .nav-login{display:block;font-size:11px}.premium-landing .landing-account .button{padding:9px 13px;min-height:38px;font-size:10px}.premium-hero{grid-template-columns:1fr;padding:44px 24px 45px;gap:45px}.hero-copy h1{font-size:clamp(39px,8vw,55px);letter-spacing:-2px;line-height:1.14;margin:23px 0}.desktop-break{display:none}.hero-copy .pill{font-size:8px;letter-spacing:.7px}.hero-copy>p{font-size:14px;max-width:520px}.hero-copy .hero-actions{flex-wrap:wrap;gap:18px}.hero-copy .hero-actions>.button{font-size:12px;padding:14px 17px}.hero-copy .text-link{font-size:11px}.hero-copy .hero-note{gap:12px;font-size:9px}.journey-scene{width:100%;max-width:440px;min-height:440px;margin:0 auto;padding:39px 23px 30px;border-radius:115px 115px 26px 26px}.scene-heading{font-size:6px;letter-spacing:1px}.journey-wallet{padding:24px;max-width:310px}.journey-wallet>strong{font-size:38px}.wallet-card-top{font-size:9px}.wallet-card-bottom{font-size:9px}.journey-task{padding:14px;margin-left:15px;gap:10px}.journey-task strong{font-size:11px}.journey-task small{font-size:8px;max-width:none}.journey-task>b{font-size:12px}.journey-goal{padding:18px;gap:15px;margin-right:10px}.goal-picture{width:65px;height:80px;font-size:35px}.journey-goal h3{font-size:14px;margin-bottom:12px}.journey-goal-copy>span{font-size:7px}.goal-demo-numbers{font-size:9px}.journey-goal-copy>small{font-size:8px}.scene-sticker{font-size:10px;right:0}.scene-caption{font-size:8px}.spark-one{left:-13px;font-size:60px}.promise-strip{margin:0 24px;padding:23px 0;flex-direction:column;align-items:flex-start;gap:17px}.promise-strip>span{max-width:none;font-size:12px}.promise-strip>div{gap:20px;flex-wrap:wrap}.promise-strip>div>span{font-size:10px}.landing-section,.premium-landing .premium-footer{margin-left:24px;margin-right:24px}.landing-section{padding:55px 0}.landing-section h2{font-size:32px;letter-spacing:-1.4px}.landing-section .eyebrow{font-size:8px;letter-spacing:1.5px}.intro-section{grid-template-columns:1fr;gap:0}.intro-section h2{margin-bottom:8px}.intro-copy{padding-top:10px}.intro-copy p{font-size:13px}.section-title-row{flex-direction:column;align-items:flex-start;gap:20px;margin-bottom:28px}.section-title-row>p{max-width:none;font-size:12px}.skills-grid{gap:13px}.skill-card{padding:21px;min-height:225px;border-radius:18px}.skill-card h3{font-size:19px}.skill-card p{font-size:11px}.skill-top{margin-bottom:26px}.skill-icon{width:42px;height:42px;border-radius:13px}.process-grid{grid-template-columns:1fr;gap:28px;margin-top:33px}.process-grid article{padding-right:0;display:grid;grid-template-columns:60px 1fr;column-gap:20px;align-items:start}.process-top{grid-row:span 2;border:0;margin:0;padding:0;flex-direction:column;gap:14px}.process-number{font-size:40px}.process-top>svg{width:22px;height:22px}.process-grid h3{font-size:19px;margin:0 0 10px}.process-grid p{font-size:12px;margin:0}.center-section-title{margin-bottom:30px}.center-section-title h2{margin-bottom:16px}.center-section-title p{font-size:12px}.panel-showcase-grid{grid-template-columns:1fr;gap:22px}.panel-showcase-grid>article{padding:30px;border-radius:23px}.panel-showcase-grid h3{font-size:29px}.panel-showcase-grid p{font-size:13px}.sample-review{max-width:400px;margin:27px auto 30px;padding:23px}.sample-review strong{font-size:12px}.sample-review small{font-size:9px}.sample-review-note{font-size:11px}.sample-approve{font-size:10px}.sample-child-goal{max-width:400px;margin:27px auto 30px}.sample-child-goal>strong{font-size:16px}.feature-checks{font-size:12px;gap:13px}.everyday-section{grid-template-columns:1fr;gap:35px}.everyday-art{order:2;padding:30px}.everyday-item{padding:19px;gap:12px}.everyday-item strong{font-size:12px}.everyday-item small{font-size:9px}.faq-section{grid-template-columns:1fr;gap:15px}.faq-decoration{display:none}.faq-section h2{margin-bottom:15px}.faq-list summary{font-size:12px;padding:22px 0;gap:13px}.faq-list details>p{font-size:12px;padding-left:27px}.final-cta{padding:48px 25px;margin-bottom:40px;border-radius:23px}.final-cta h2{font-size:32px;position:relative}.final-cta>p{font-size:12px;position:relative}.final-cta>.eyebrow{position:relative;font-size:7px}.cta-spark{font-size:60px;right:12px;top:12px;opacity:.6}.final-cta>small{font-size:8px;line-height:1.8}.final-cta .button{font-size:12px}.premium-landing .premium-footer{padding:30px 0;gap:26px;align-items:flex-start}.premium-footer .footer-links{font-size:11px;gap:22px;flex-wrap:wrap}.premium-landing .premium-footer>span{display:block;text-align:left;font-size:10px}
.premium-auth{display:block;background:#fcfdf7;min-height:100svh}.premium-auth .auth-story{display:none}.premium-auth .auth-main{min-height:100svh;padding:24px;max-width:530px;margin:auto}.auth-topline>span{display:flex;font-size:8px}.auth-mobile-brand{display:block;margin:33px 0 0}.premium-auth .auth-form{padding:35px 0 25px;max-width:none;margin:0}.auth-welcome-icon{display:none}.premium-auth .auth-form h2{font-size:32px;max-width:390px}.premium-auth .auth-form>.eyebrow{font-size:8px}.premium-auth .auth-form>p{font-size:13px}.premium-auth .role-switch button{font-size:12px;padding:12px 7px;gap:10px}.role-switch button>span>small{font-size:9px}.role-hint{font-size:11px}.premium-auth form label{font-size:12px}.premium-auth input{font-size:16px;min-height:49px}.premium-auth label small{font-size:10px}.premium-auth .auth-bottom{font-size:12px!important}.premium-auth .auth-form form>.button{font-size:13px}.auth-assurance{font-size:10px}.auth-child.premium-auth{background:#faf7ff}.auth-child .auth-mobile-brand .brand-mark{background:#78638d}
.app-shell .sidebar{position:relative;width:100%;height:auto;padding:19px 18px 11px;overflow:visible}.app-shell .sidebar .brand{font-size:22px;margin:0}.app-shell .workspace-label{position:absolute;right:18px;top:31px;font-size:7px;letter-spacing:1px;margin:0;max-width:135px;text-align:right}.app-shell .sidebar nav{gap:6px;padding:19px 0 7px;scrollbar-width:none;scroll-padding-inline:6px}.app-shell .sidebar nav::-webkit-scrollbar{display:none}.app-shell .nav-item{min-height:39px;padding:10px 12px;font-size:11px;gap:7px;flex-shrink:0}.app-shell .sidebar-bottom{padding-top:8px;margin-top:6px;border-color:#e5ebdc}.app-shell .sidebar-bottom .nav-item{font-size:10px;padding:5px 8px;min-height:28px}.parent-theme .sidebar-bottom{border-color:#ffffff18}.parent-theme .sidebar-bottom .nav-item{color:#bfceb5}.app-shell .app-main{margin:0;width:100%}.app-shell .topbar{height:66px;padding:0 20px}.app-shell .topbar:before{font-size:8px;color:#718466;letter-spacing:1.1px}.app-shell .virtual-label{font-size:8px;padding:5px 7px;gap:5px}.app-shell .topbar-right{gap:8px}.app-shell .topbar-right .avatar{height:33px;width:33px}.app-shell .dashboard-content{padding:27px 19px 0}.app-shell .page-heading{gap:15px;margin-bottom:24px}.app-shell .page-heading h1,.child-theme .page-heading h1{font-size:29px}.app-shell .page-heading .eyebrow{font-size:7px;letter-spacing:1.4px}.app-shell .page-heading p{font-size:12px;max-width:430px}.app-shell .page-heading>.button{font-size:11px;min-height:42px}.dashboard-path{margin-bottom:22px;border-radius:15px}.path-intro{padding:12px 14px;font-size:10px}.dashboard-path>a{padding:13px 10px;gap:7px;flex-direction:column;align-items:flex-start}.dashboard-path strong{font-size:10px;line-height:1.5}.dashboard-path small{font-size:8px;line-height:1.6}.path-step{width:26px;height:27px;font-size:9px;border-radius:7px}.app-shell .stats-grid{gap:13px;margin-bottom:25px}.app-shell .stat-card{padding:17px 15px;border-radius:17px}.app-shell .stat-card>div{font-size:10px;gap:5px}.app-shell .stat-card>div>svg{width:25px;height:25px;padding:5px;border-radius:7px}.app-shell .stat-card>strong{font-size:25px;letter-spacing:-1px;margin:12px 0 8px}.app-shell .stat-card>small{font-size:9px;line-height:1.5;display:block}.app-shell .feature-banner{padding:25px;border-radius:20px}.app-shell .feature-banner h2,.child-theme .feature-banner h2{font-size:22px}.app-shell .feature-banner p{font-size:12px}.app-shell .feature-banner .eyebrow{font-size:7px;letter-spacing:1.3px}.app-shell .section-heading h2{font-size:18px}.app-shell .section-heading .text-link{font-size:11px}.app-shell .task-card{padding:24px 21px;border-radius:20px}.app-shell .task-card h3{font-size:18px}.app-shell .task-description{font-size:13px}.app-shell .task-top{gap:10px;flex-wrap:wrap}.app-shell .task-reward>strong{font-size:16px}.app-shell .task-actions .button{font-size:12px;min-height:44px}.app-shell .task-actions .text-button{min-height:40px}.app-shell .empty-state{padding:32px 22px}.app-shell .empty-state h3{font-size:18px}.app-shell .goal-card{padding:24px}.app-shell .goal-card h3{font-size:19px}.app-shell .goal-numbers strong,.app-shell .goal-numbers small{font-size:12px}.app-shell .goal-card>p{font-size:12px}.app-shell .filter-tabs{gap:2px;padding:4px}.app-shell .filter-tabs button{font-size:10px;padding:8px 10px;min-height:40px}.app-shell .filter-bar select{font-size:13px;min-height:42px}.app-shell .wallet-hero{padding:27px;gap:20px}.app-shell .wallet-hero h2{font-size:34px}.app-shell .wallet-hero p{font-size:11px}.app-shell .ledger-row>span:last-child{font-size:11px;white-space:normal;text-align:right;overflow-wrap:anywhere;max-width:35%}.app-shell .ledger-row strong{font-size:12px}.app-shell .ledger-row small{font-size:10px}.app-shell .lesson-card{padding:25px}.app-shell .lesson-card h2{font-size:22px}.app-shell .answers button{font-size:12px;min-height:46px}.app-shell .modal{padding:23px;border-radius:22px;max-height:calc(100svh - 30px)}.app-shell .modal input,.app-shell .modal select,.app-shell .modal textarea{font-size:16px}.app-shell .modal-title h2{font-size:22px}.app-shell .modal-actions{flex-wrap:wrap}.app-shell .modal-actions .button{min-height:44px}.app-shell .dashboard-footer{font-size:10px;padding-bottom:25px;margin-top:35px}.app-shell .notification-card{gap:12px;padding:17px}.app-shell .notification-card p{font-size:12px}.app-shell .request-card{padding:20px}.app-shell .row-actions .button{min-height:42px}}
@media(max-width:390px){.premium-landing .landing-nav{padding:0 17px}.premium-landing .landing-nav .brand{font-size:19px;gap:7px}.premium-landing .brand-mark{width:32px;height:32px}.premium-landing .landing-nav .landing-account{gap:12px}.premium-hero{padding:37px 20px 40px}.hero-copy h1{font-size:37px}.hero-copy .hero-note{font-size:8px;gap:9px}.hero-copy .hero-actions{gap:16px}.hero-copy .hero-actions>.button{font-size:11px}.journey-scene{padding:35px 16px 27px;min-height:410px}.journey-wallet>strong{font-size:34px}.journey-task{margin-left:0;padding:12px;gap:7px}.journey-task>b{font-size:11px}.journey-task small{font-size:7px}.journey-goal{padding:15px 12px;gap:11px}.journey-goal h3{font-size:12px}.goal-picture{width:55px;font-size:29px}.scene-caption{font-size:7px}.scene-sticker{font-size:9px}.landing-section,.promise-strip,.premium-landing .premium-footer{margin-left:20px;margin-right:20px}.skills-grid{gap:10px}.skill-card{padding:17px;min-height:235px}.skill-card h3{font-size:17px}.skill-card p{font-size:11px}.panel-showcase-grid>article{padding:25px}.feature-checks{font-size:11px}.everyday-art{padding:22px}.everyday-item{padding:15px 12px;gap:9px}.everyday-item strong{font-size:11px}.auth-topline>span{font-size:7px}.premium-auth .auth-main{padding:22px}.premium-auth .role-switch button{gap:7px;font-size:11px}.role-switch button>span>small{font-size:8px}.app-shell .sidebar{padding-left:15px;padding-right:15px}.app-shell .workspace-label{font-size:6px;max-width:100px}.app-shell .sidebar .brand{font-size:21px}.app-shell .dashboard-content{padding-left:15px;padding-right:15px}.app-shell .stat-card{padding:15px 12px}.app-shell .stat-card>strong{font-size:22px}.app-shell .stat-card>div{font-size:9px}.app-shell .stat-card>small{font-size:8px}.dashboard-path strong{font-size:9px}.dashboard-path small{font-size:7px}.app-shell .filter-tabs button{padding:8px;font-size:9px}.app-shell .topbar:before{font-size:7px}.app-shell .task-reward>span{font-size:10px}.app-shell .task-reward>strong{font-size:14px}.form-row{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.button:hover:not(:disabled),.skill-card:hover,.app-shell .task-card:hover,.app-shell .goal-card:hover,.app-shell .nav-item:hover{transform:none}}

```

## app/register/page.js

```javascript
import AuthForm from '@/components/AuthForm';
export default function RegisterPage() { return <AuthForm mode="register" />; }

```

## components/AuthForm.js

```javascript
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Brand from './Brand';
import Icon from './Icon';
import { api } from '@/lib/format';

export default function AuthForm({ mode }) {
  const register = mode === 'register';
  const [role, setRole] = useState('parent');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (register && body.password !== body.confirm) throw new Error('Parollar bir xil emas.');
      const { user } = await api(`auth/${mode}`, { method: 'POST', body: { ...body, role } });
      router.replace(`/${user.role}`);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main className={`auth-page premium-auth ${register && role === 'child' ? 'auth-child' : ''}`}>
    <section className="auth-story"><Brand />
      <div className="auth-story-content"><span className="eyebrow">KELAJAK BUGUNDAN BOSHLANADI</span>
        <h1>{register && role === 'child' ? <>Orzularing katta.<br /><em>Sen uddalaysan!</em></> : <>Kichik qadamlar.<br /><em>Bir umrga<br />yaxshi odatlar.</em></>}</h1>
        <p>{register && role === 'child' ? 'Vazifalarni bajar, virtual mukofot ol va o‘z orzularing uchun jamg‘ar. Sarguzashtga tayyormisan?' : 'Farzandingizga faqat cho‘ntak puli emas, uni qadrlashni ham o‘rgating. Birinchi qadamni birga qo‘ying.'}</p>
        <div className="auth-illustration" aria-hidden="true"><span className="auth-spark">✳</span><div className="auth-orbit" /><div className="auth-dream-card"><span className="dream-emoji">{register && role === 'child' ? '🚀' : '🌱'}</span><span>HAR KUNI BIR QADAM</span><strong>{register && role === 'child' ? 'Mening katta orzum' : 'Kichik harakat. Katta natija.'}</strong><div className="dream-steps"><i /><i /><i /><i /><i /></div><small>Mehr bilan o‘rgatamiz. Birga ulg‘ayamiz.</small></div><div className="auth-success"><span><Icon name="check" /></span><div><strong>Men uddaladim!</strong><small>Yangi odat sari yana bir qadam</small></div></div></div>
      </div><div className="auth-story-footer"><span><Icon name="users" size={17} /> Bitta oila. Bitta jamoa.</span><span>01 — ∞</span></div>
    </section>
    <section className="auth-main"><div className="auth-topline"><Link href="/" className="back-link">← Bosh sahifa</Link><span><span className="dot" /> Oilangiz uchun yaratilgan</span></div>
      <div className="auth-mobile-brand"><Brand /></div><div className="auth-form"><span className="auth-welcome-icon"><Icon name={register ? 'leaf' : 'users'} size={26} /></span><span className="eyebrow">{register ? 'YANGI ODATNING BIRINCHI KUNI' : 'BIRINCHI PULGA XUSH KELIBSIZ'}</span><h2>{register ? 'Birga boshlaymiz.' : 'Yana ko‘rishganimizdan xursandmiz.'}</h2><p>{register ? 'Oilangiz uchun yangi sahifa oching. Avval kim sifatida qo‘shilishingizni tanlang.' : 'Kichik qadamlar davom etadi. Oilangiz kabinetiga kiring.'}</p>
      {register && <><div className="role-switch" aria-label="Hisob turi"><button type="button" aria-pressed={role === 'parent'} className={role === 'parent' ? 'selected' : ''} onClick={() => setRole('parent')}><Icon name="users" /><span>Men ota-onaman<small>Yo‘l ko‘rsataman</small></span></button><button type="button" aria-pressed={role === 'child'} className={role === 'child' ? 'selected' : ''} onClick={() => setRole('child')}><Icon name="star" /><span>Men bolaman<small>Orzularimga intilaman</small></span></button></div><div className="role-hint" key={role}><Icon name={role === 'parent' ? 'leaf' : 'star'} size={16} /><span>{role === 'parent' ? 'Hisob oching, keyin farzandingizni kod orqali taklif qiling.' : 'Ota-onangiz bergan oila kodini tayyorlab qo‘ying.'}</span></div></>}
      <form onSubmit={submit}>
    {register && <label>Ismingiz<input name="name" placeholder="Masalan, Aziza" minLength={2} maxLength={60} autoComplete="name" required /></label>}
    <label>Login<input name="username" placeholder="Masalan, aziza_01" minLength={3} maxLength={32} pattern="[A-Za-z0-9_.\-]+" autoCapitalize="none" autoComplete="username" required /><small>Lotin harflari va raqamlar. Email shart emas.</small></label>
    <label>Parol<div className="password-field"><input name="password" type={show ? 'text' : 'password'} minLength={8} maxLength={128} placeholder="Kamida 8 ta belgi" autoComplete={register ? 'new-password' : 'current-password'} required /><button type="button" aria-label={show ? 'Parolni yashirish' : 'Parolni ko‘rish'} onClick={() => setShow(!show)}>{show ? 'Yashirish' : 'Ko‘rish'}</button></div></label>
    {register && <label>Parolni takrorlang<input name="confirm" type={show ? 'text' : 'password'} minLength={8} maxLength={128} placeholder="Parolni yana bir marta kiriting" autoComplete="new-password" required /></label>}
    {register && role === 'child' && <label>Ota-onangiz bergan oila kodi<input name="inviteCode" placeholder="Masalan, A1B2C3D4E5F6" minLength={12} maxLength={12} autoComplete="off" required /><small>Ota-ona kabinetidagi “Oila” bo‘limidan olinadi.</small></label>}
    {error && <div className="alert error" role="alert">{error}</div>}<button className="button primary full" disabled={busy}>{busy ? 'Biroz kuting…' : register ? 'Hisob yaratish' : 'Kabinetga kirish'}<Icon name="arrow" /></button></form><p className="auth-bottom">{register ? 'Hisobingiz bormi?' : 'Hali hisobingiz yo‘qmi?'} <Link href={register ? '/login' : '/register'}>{register ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</Link></p><div className="auth-assurance"><Icon name="leaf" size={15} /> Virtual mukofotlar. Haqiqiy ko‘nikmalar.</div></div></section></main>;
}

```

## components/Brand.js

```javascript
import Link from 'next/link';
import Icon from './Icon';
export default function Brand() { return <Link href="/" className="brand"><span className="brand-mark"><Icon name="leaf" size={23} /></span><span>birinchi<span className="brand-light">pul</span><i /></span></Link>; }

```

## components/Dashboard.js

```javascript
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Brand from './Brand';
import Icon from './Icon';
import Modal from './Modal';
import Tour from './Tour';
import Learn from './Learn';
import WelcomeCard from './WelcomeCard';
import FamilyBalances from './FamilyBalances';
import LevelCard from './LevelCard';
import TaskSubmission from './TaskSubmission';
import TelegramConnect from './TelegramConnect';
import { TASK_XP } from '@/lib/progression';
import { api, moneyText, dateText, localDateInput } from '@/lib/format';

const navItems = [
  ['overview', 'home', 'Umumiy ko‘rinish', 'Mening kunim'],
  ['tasks', 'tasks', 'Vazifalar', 'Vazifalarim'],
  ['goals', 'target', 'Maqsadlar', 'Maqsadlarim'],
  ['wallet', 'wallet', 'Hisob va so‘rovlar', 'Mening hamyonim'],
  ['family', 'users', 'Oila', 'Oila'],
  ['notifications', 'bell', 'Xabarnomalar', 'Xabarnomalar'],
  ['learn', 'book', 'Kichik darslar', 'Kichik darslar'],
];
const empty = { tasks: [], goals: [], payouts: [], transactions: [], wallets: {}, progression: {}, children: [], notifications: [] };
function Empty({ icon = 'tasks', title, text, action }) { return <div className="empty-state"><span><Icon name={icon} size={30} /></span><h3>{title}</h3><p>{text}</p>{action}</div>; }
function Stat({ label, value, icon, caption, tone }) { return <div className={`stat-card ${tone || ''}`}><div><span>{label}</span><Icon name={icon} size={20} /></div><strong>{value}</strong><small>{caption}</small></div>; }

export default function Dashboard({ role, section = 'overview' }) {
  const parent = role === 'parent';
  const [user, setUser] = useState(null), [data, setData] = useState(empty), [loading, setLoading] = useState(true);
  const [error, setError] = useState(''), [toast, setToast] = useState(''), [filter, setFilter] = useState('all'), [childFilter, setChildFilter] = useState('all');
  const [modal, setModal] = useState(null), [modalError, setModalError] = useState(''), [busy, setBusy] = useState(false);
  const [tour, setTour] = useState(false), [code, setCode] = useState(null);
  const [date, setDate] = useState(localDateInput), [time, setTime] = useState('19:00');
  const running = useRef(false), refreshVersion = useRef(0);
  const router = useRouter();
  const closeModal = useCallback(() => { if (!running.current) { setModal(null); setModalError(''); } }, []);
  const open = (value) => { setModalError(''); setModal(value); };
  const refresh = useCallback(async () => {
    const version = ++refreshVersion.current;
    const result = await api('state');
    if (version === refreshVersion.current) { setData(result); setError(''); }
  }, []);
  useEffect(() => {
    let alive = true;
    async function init() {
      try {
        const result = await api('auth/me');
        if (!alive) return;
        if (result.user.role !== role) { router.replace(`/${result.user.role}`); return; }
        setUser(result.user);
        await refresh();
      } catch (e) { if (alive) { if (e.status === 401) router.replace('/login'); else setError(e.message); } }
      finally { if (alive) setLoading(false); }
    }
    init();
    return () => { alive = false; };
  }, [role, refresh, router]);
  useEffect(() => {
    if (!user) return;
    const tick = () => { if (!document.hidden) refresh().catch(e => { if (e.status === 401) router.replace('/login'); else setError(e.message); }); };
    const interval = setInterval(tick, 4000);
    window.addEventListener('focus', tick);
    return () => { clearInterval(interval); window.removeEventListener('focus', tick); };
  }, [user, refresh, router]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 4500); return () => clearTimeout(timer); }, [toast]);

  async function mutate(path, body, message, method = 'POST') {
    if (running.current) return;
    running.current = true; setBusy(true); setModalError('');
    try {
      await api(path, { method, body });
      setModal(null); setToast(message);
      try { await refresh(); } catch (e) { setError(`Amal saqlandi, lekin ro‘yxat yangilanmadi: ${e.message}`); }
    } catch (e) { if (modal) setModalError(e.message); else setError(e.message); }
    finally { running.current = false; setBusy(false); }
  }
  async function createInvite() {
    if (running.current) return; running.current = true; setBusy(true);
    try { setCode(await api('family/invite', { method: 'POST', body: {} })); setToast('Yangi taklif kodi tayyor.'); }
    catch (e) { setError(e.message); } finally { running.current = false; setBusy(false); }
  }
  async function signOut() {
    if (running.current) return; running.current = true; setBusy(true);
    try { await api('auth/logout', { method: 'POST', body: {} }); router.replace('/login'); }
    catch (e) { setError(e.message); running.current = false; setBusy(false); }
  }
  function formBody(event) { event.preventDefault(); return Object.fromEntries(new FormData(event.currentTarget)); }
  if (loading) return <main className="center-page"><div className="loading"><span className="spinner" /><p>Kabinetingiz tayyorlanmoqda…</p></div></main>;
  if (!user) return <main className="center-page"><div className="card"><h2>Kabinetni ochib bo‘lmadi</h2><p role="alert">{error || 'Iltimos, qayta kiring.'}</p><Link href="/login" className="button primary">Kirish sahifasi</Link></div></main>;

  const childName = id => data.children.find(c => c.id === id)?.name || user.name;
  const pending = data.tasks.filter(t => t.status === 'pending');
  const active = data.tasks.filter(t => t.status === 'active');
  const unread = data.notifications.filter(n => !n.read).length;
  const mine = data.wallets[user.id] || { balance: 0, reserved: 0, available: 0 };
  const saved = data.goals.reduce((sum, g) => sum + g.saved, 0);
  const title = navItems.find(n => n[0] === section)?.[parent ? 2 : 3];
  const shownTasks = data.tasks.filter(t => (filter === 'all' || t.status === filter) && (childFilter === 'all' || childFilter === t.childId));

  const taskList = (items) => items.length ? <div className="task-grid">{items.map(task => <article className="task-card" key={task.id} id={`task-${task.id}`}>
    <div className="task-top"><span className={`tag ${task.status === 'pending' ? 'amber' : ''}`}>{task.status === 'pending' ? 'Tekshirish kutilmoqda' : 'Bajarish kerak'}</span>{parent && <span className="child-label">{childName(task.childId)}</span>}</div>
    <h3>{task.title}</h3>{task.description && <p className="task-description">{task.description}</p>}
    <div className={`task-deadline ${new Date(task.dueAt) < new Date() && task.status === 'active' ? 'overdue' : ''}`}><Icon name="clock" size={16} /><span>{dateText(task.dueAt)}{new Date(task.dueAt) < new Date() && task.status === 'active' ? ' · Muddat o‘tgan' : ''}</span></div>
    {task.revisionNote && task.status === 'active' && <div className="alert">Ota-onadan izoh: {task.revisionNote}</div>}
    {task.completionNote && task.status === 'pending' && <div className="alert">Bolaning izohi: {task.completionNote}</div>}
    {task.photoId && task.status === 'pending' && <a className="task-evidence" href={`/api/photos/${task.photoId}`} target="_blank" rel="noreferrer"><img src={`/api/photos/${task.photoId}`} alt={`${task.title} — bajarilgan ish rasmi`} loading="lazy" /><span>Rasmni kattalashtirish ↗</span></a>}
    <div className="task-reward"><span>Virtual mukofot</span><strong>+ {moneyText(task.amount)}</strong></div><div className="task-xp"><Icon name="star" size={15} /><strong>+{TASK_XP} XP</strong><span>Ota-ona tasdiqlaganda</span></div>
    <div className="task-actions">{parent ? <>{task.status === 'pending' && <><button disabled={busy} className="button primary" onClick={() => open({ type: 'approve', task })}><Icon name="check" size={17} />Tasdiqlash</button><button className="button light" disabled={busy} onClick={() => open({ type: 'return', task })}>Qaytarish</button></>}<button className="text-button danger-text" disabled={busy} onClick={() => open({ type: 'delete-task', task })}>Bekor qilish</button></> : <button disabled={task.status === 'pending' || busy} className={`button full ${task.status === 'pending' ? 'waiting' : 'primary'}`} onClick={() => open({ type: 'submit', task })}><Icon name={task.status === 'pending' ? 'clock' : 'check'} size={17} />{task.status === 'pending' ? 'Ota-ona tasdiqlashini kuting' : 'Qilib bo‘ldim'}</button>}</div>
  </article>)}</div> : <Empty title={filter === 'pending' ? 'Tekshirishga kelgan vazifa yo‘q' : 'Hozircha vazifalar yo‘q'} text={parent ? data.children.length ? 'Farzandingizga birinchi kichik vazifani bering.' : 'Avval “Oila” bo‘limidan farzandingizni taklif qiling.' : 'Ota-onangiz vazifa qo‘shganda shu yerda paydo bo‘ladi.'} action={parent && (data.children.length ? <button className="button primary" onClick={() => open({ type: 'new-task' })}><Icon name="plus" />Vazifa qo‘shish</button> : <Link className="button primary" href="/parent/family">Farzandni taklif qilish</Link>)} />;

  const goalList = (goals) => goals.length ? <div className="goal-grid">{goals.map(goal => <article className="card goal-card" key={goal.id}><div className="goal-heading"><span className="goal-icon"><Icon name="target" size={26} /></span>{parent && <span className="child-label">{childName(goal.childId)}</span>}<span className="percent">{Math.floor(goal.saved / goal.target * 100)}%</span></div><h3>{goal.title}</h3><div className="progress"><span style={{ width: `${Math.min(100, goal.saved / goal.target * 100)}%` }} /></div><div className="goal-numbers"><strong>{moneyText(goal.saved)}</strong><small>{moneyText(goal.target)}</small></div>{goal.saved >= goal.target ? <p className="goal-achieved">✨ Maqsadga yetdingiz! Juda yaxshi!</p> : <p>Yana {moneyText(goal.target - goal.saved)} kerak.</p>}{!parent && <div className="goal-actions">{goal.saved < goal.target && <button className="button primary" onClick={() => open({ type: 'save-goal', goal })}>Pul ajratish</button>}{goal.saved > 0 && <button className="button light" onClick={() => open({ type: 'release-goal', goal })}>Balansga qaytarish</button>}{goal.saved === 0 && <button className="text-button danger-text" onClick={() => open({ type: 'delete-goal', goal })}>O‘chirish</button>}</div>}</article>)}</div> : <Empty icon="target" title={parent ? 'Maqsadlar hali qo‘shilmagan' : 'Sizning birinchi orzuingiz nima?'} text={parent ? 'Farzandingiz maqsad ochsa, jamg‘arish jarayonini shu yerda kuzatasiz.' : 'Kitob, velosiped yoki yangi quloqchin. Maqsad qo‘ying va kichik qadamlar bilan boshlang.'} action={!parent && <button className="button primary" onClick={() => open({ type: 'new-goal' })}><Icon name="plus" />Maqsad qo‘shish</button>} />;

  return <div className={`app-shell ${parent ? 'parent-theme' : 'child-theme'}`}><aside className="sidebar"><Brand /><div className="workspace-label">{parent ? 'OILAVIY BOSHQARUV' : 'MENING KICHIK DUNYOM'}</div><nav aria-label="Kabinet bo‘limlari">{navItems.filter(n => parent || n[0] !== 'family').map(([key, icon, pLabel, cLabel]) => <Link id={`nav-${key}`} key={key} href={`/${role}${key === 'overview' ? '' : `/${key}`}`} className={`nav-item ${section === key ? 'active' : ''}`} aria-current={section === key ? 'page' : undefined}><Icon name={icon} /><span>{parent ? pLabel : cLabel}</span>{key === 'notifications' && unread > 0 && <b>{unread}</b>}{key === 'tasks' && parent && pending.length > 0 && <b>{pending.length}</b>}</Link>)}</nav><div className="sidebar-bottom"><div className="grow-note"><span>🌱</span><strong>Har kun bir kichik qadam</strong><p>{parent ? 'Rag‘bat va mehr — eng yaxshi boshlanish.' : 'Bugungi harakatingiz ertangi orzuingizga yaqinlashtiradi.'}</p></div><button className="nav-item" onClick={() => setTour(true)}><Icon name="book" /><span>Saytni tushuntirish</span></button><button className="nav-item" disabled={busy} onClick={signOut}><Icon name="logout" /><span>Hisobdan chiqish</span></button></div></aside>
  <div className="app-main"><header className="topbar"><div className="breadcrumb">Mening oilam <span>/</span> <strong>{title}</strong></div><div className="topbar-right"><span className="virtual-label"><span className="dot" /> Virtual hisob</span><Link href={`/${role}/notifications`} className="icon-button notification-button" aria-label={`${unread} ta o‘qilmagan xabar`}><Icon name="bell" />{unread > 0 && <i />}</Link><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><div className="profile-text"><strong>{user.name}</strong><small>{parent ? 'Ota-ona' : 'Yosh jamg‘aruvchi'}</small></div></div></header>
  <main className="dashboard-content" key={section}><div className="page-heading"><div><span className="eyebrow">{section === 'overview' ? parent ? 'OILANGIZNING BUGUNGI HOLATI' : 'YANGI KUN. YANGI IMKONIYAT!' : parent ? 'BIRINCHI PUL / OILAVIY BOSHQARUV' : 'KICHIK QADAMLAR, KATTA MAQSADLAR'}</span><h1>{section === 'overview' ? `Salom, ${user.name}!` : title}{section === 'overview' && !parent && <span className="wave"> 👋</span>}</h1><p>{section === 'overview' ? parent ? 'Vazifalar, tasdiqlar va oilaviy maqsadlar — bir qarashda.' : 'Bugun qaysi orzuingizga bir qadam yaqinlashamiz?' : section === 'tasks' ? 'Vazifa, muddat va mukofot — hammasi aniq.' : section === 'family' ? 'Farzandingizni oilangizga xavfsiz taklif qiling.' : section === 'wallet' ? 'Virtual hisob va ota-ona bilan kelishilgan pul so‘rovlari.' : section === 'goals' ? 'Orzular reja bilan yaqinlashadi.' : section === 'learn' ? 'Bir necha daqiqa. Hayot uchun foydali odat.' : 'Oilangizdagi so‘nggi yangiliklar.'}</p></div>{parent && ['overview', 'tasks'].includes(section) && <button id="new-task" className="button primary" onClick={() => data.children.length ? open({ type: 'new-task' }) : router.push('/parent/family')}><Icon name="plus" />Yangi vazifa</button>}{!parent && section === 'goals' && <button className="button primary" onClick={() => open({ type: 'new-goal' })}><Icon name="plus" />Yangi maqsad</button>}</div>
  {error && <div className="alert error page-alert" role="alert">{error}<button className="text-button" onClick={() => refresh().catch(e => setError(e.message))}>Qayta yangilash</button></div>}
  {!user.onboarded && <WelcomeCard parent={parent} onDone={() => setUser(u => ({ ...u, onboarded: true }))} />}
  {!parent && section === 'overview' && <LevelCard progress={data.progression?.[user.id]} />}
  {section === 'overview' && <><div className="stats-grid">{parent ? <><Stat label="Farzandlarim" value={data.children.length} icon="users" caption="Bir oilaning katta orzulari" /><Stat label="Faol vazifalar" value={active.length} icon="tasks" caption="Kichik qadamlar davom etmoqda" /><Stat label="Tasdiq kutilmoqda" value={pending.length} icon="clock" caption="Farzandingiz sizdan javob kutmoqda" tone="warm" /><Stat label="Jamg‘arilgan" value={moneyText(saved)} icon="target" caption="Maqsadlar uchun ajratilgan" tone="green" /></> : <><Stat label="Bo‘sh virtual balans" value={moneyText(mine.available)} icon="wallet" caption="Maqsadga ajratish yoki so‘rash mumkin" tone="green" /><Stat label="Maqsadlarimda" value={moneyText(saved)} icon="target" caption="Orzularingizga bir qadam yaqin" /><Stat label="Vazifalarim" value={active.length} icon="tasks" caption="Siz bajara olasiz!" /><Stat label="Tasdiq kutilmoqda" value={pending.length} icon="clock" caption="Ota-onangiz javobini kutamiz" tone="warm" /></>}</div>{parent && <FamilyBalances summary={data.familyBalances} showLink />}<div className="feature-banner"><div><span className="eyebrow">{parent ? 'MEHR BILAN RAG‘BATLANTIRING' : 'HAR BIR ORZU KICHIK QADAMDAN BOSHLANADI'}</span><h2>{parent ? 'Natijadan tashqari, harakatni ham qadrlang.' : 'Bugungi vazifa — ertangi orzu.'}</h2><p>{parent ? 'Aniq vazifa, tushunarli muddat va samimiy maqtov farzandingizga yordam beradi.' : 'Vazifani bajaring, mukofotni oling va o‘zingiz uchun muhim narsaga jamg‘aring.'}</p><Link className="text-link" href={`/${role}/${parent ? 'learn' : 'goals'}`}>{parent ? 'Kichik darslarni ko‘rish' : 'Maqsadlarimga o‘tish'} →</Link></div><div className="banner-art"><span>✦</span><Icon name={parent ? 'leaf' : 'target'} size={74} /><i>✦</i></div></div><section id="task-list"><div className="section-heading"><h2>{parent && pending.length ? 'Tasdiqlashingizni kutmoqda' : 'Bugungi kichik qadamlar'}<span className="count">{parent && pending.length ? pending.length : data.tasks.length}</span></h2><Link href={`/${role}/tasks`} className="text-link">Barchasi →</Link></div>{taskList((parent && pending.length ? pending : data.tasks).slice(0, 4))}</section><section><div className="section-heading"><h2>{parent ? 'Oilamizning maqsadlari' : 'Orzularim sari'}</h2><Link className="text-link" href={`/${role}/goals`}>Barchasi →</Link></div>{goalList(data.goals.slice(0, 2))}</section></>}
  {section === 'tasks' && <section id="task-list"><div className="filter-bar"><div className="filter-tabs">{[['all', 'Barchasi'], ['active', 'Bajarish kerak'], ['pending', 'Tekshirishda']].map(([v, label]) => <button key={v} className={filter === v ? 'active' : ''} onClick={() => setFilter(v)}>{label}<span>{v === 'all' ? data.tasks.length : data.tasks.filter(t => t.status === v).length}</span></button>)}</div>{parent && data.children.length > 1 && <select aria-label="Farzand bo‘yicha saralash" value={childFilter} onChange={e => setChildFilter(e.target.value)}><option value="all">Barcha farzandlar</option>{data.children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}</div>{taskList(shownTasks)}<p className="section-note">Tasdiqlangan vazifalar bu ro‘yxatdan o‘chadi. Mukofot tarixi “{parent ? 'Hisob va so‘rovlar' : 'Mening hamyonim'}” bo‘limida qoladi. Vaqt: Toshkent (UTC+5).</p></section>}
  {section === 'goals' && goalList(data.goals)}
  {section === 'family' && parent && <div className="family-layout"><section className="card invite-card"><span className="lesson-icon"><Icon name="users" size={30} /></span><h2>Farzandingizni taklif qiling</h2><ol className="steps-list"><li><span>1</span><div><strong>Taklif kodi yarating</strong><p>Quyidagi tugmani bosing. Kod 24 soat amal qiladi.</p></div></li><li><span>2</span><div><strong>Kodni farzandingizga bering</strong><p>Farzandingiz “Ro‘yxatdan o‘tish” → “Men bolaman”ni tanlaydi.</p></div></li><li><span>3</span><div><strong>Bitta oilaga ulanasiz</strong><p>Kod bir marta ishlatiladi. Har bir bola uchun yangisini yarating.</p></div></li></ol>{code && <div className="invite-code"><small>FARZANDINGIZ UCHUN KOD</small><strong>{code.code}</strong><span>{dateText(code.expiresAt)} gacha</span><button className="button light" onClick={async () => { try { await navigator.clipboard.writeText(code.code); setToast('Kod nusxalandi.'); } catch { setError('Nusxalash ishlamadi. Kodni belgilab, qo‘lda nusxalang.'); } }}><Icon name="copy" />Nusxalash</button></div>}<button className="button primary full" disabled={busy} onClick={createInvite}><Icon name="plus" />{busy ? 'Tayyorlanmoqda…' : code ? 'Yana bir bola uchun kod' : 'Taklif kodi yaratish'}</button></section><section><div className="section-heading"><h2>Farzandlarim <span className="count">{data.children.length}</span></h2></div>{data.children.length ? data.children.map(c => <article className="card child-card" key={c.id}><span className="avatar big">{c.name.charAt(0)}</span><div><h3>{c.name}</h3><p>@{c.username}</p><small>{data.tasks.filter(t => t.childId === c.id).length} ta vazifa · {data.goals.filter(g => g.childId === c.id).length} ta maqsad</small></div><strong>{moneyText(data.wallets[c.id]?.balance || 0)}</strong></article>) : <Empty icon="users" title="Oilangiz shu yerdan boshlanadi" text="Farzandingiz kod bilan ro‘yxatdan o‘tgach, shu yerda avtomatik ko‘rinadi." />}</section></div>}
  {section === 'wallet' && <>{parent && <FamilyBalances summary={data.familyBalances} />}<div className="wallet-hero"><div><span className="eyebrow">{parent ? 'OILAVIY VIRTUAL HISOB' : 'MENING VIRTUAL HISOBIM'}</span><h2>{moneyText(parent ? Object.values(data.wallets).reduce((s, w) => s + w.balance, 0) : mine.balance)}</h2><p>{parent ? 'Farzandlar balansining jami. Maqsadlarga ajratilgan pul alohida.' : `Shundan ${moneyText(mine.reserved)} so‘rovlar uchun band.`}</p></div>{!parent && <button className="button white" onClick={() => open({ type: 'new-payout' })}>Ota-onadan pul so‘rash <Icon name="arrow" /></button>}<Icon name="wallet" size={65} /></div><div className="alert">Bu virtual hisob. Sayt pul o‘tkazmaydi. Ota-ona pulni tashqarida bergach, so‘rovda “Pulni berdim”ni tasdiqlaydi.</div><section><div className="section-heading"><h2>Pul berish so‘rovlari</h2></div>{data.payouts.length ? <div className="request-list">{data.payouts.map(p => <article className="card request-card" key={p.id}><div><span className={`tag ${p.status === 'pending' ? 'amber' : ''}`}>{p.status === 'pending' ? 'Javob kutilmoqda' : p.status === 'approved' ? 'Pul berilgan' : 'Rad etilgan'}</span><h3>{p.title}</h3><small>{parent && `${childName(p.childId)} · `}{dateText(p.createdAt)}</small></div><strong>{moneyText(p.amount)}</strong>{parent && p.status === 'pending' && <div className="row-actions"><button className="button primary" disabled={busy} onClick={() => open({ type: 'approve-payout', payout: p })}>Pulni berdim</button><button className="button light" disabled={busy} onClick={() => open({ type: 'reject-payout', payout: p })}>Rad etish</button></div>}</article>)}</div> : <Empty icon="wallet" title="Hozircha pul so‘rovi yo‘q" text={parent ? 'Farzandingiz balansidan pul so‘raganda shu yerda ko‘rinadi.' : 'Bajargan vazifalaringizdan mukofot yig‘ib, ota-onangizdan pul so‘rashingiz mumkin.'} />}</section><section><div className="section-heading"><h2>Mukofot va berilgan pul tarixi</h2><span className="section-note">Oxirgi 100 ta yozuv</span></div>{data.transactions.length ? <div className="card ledger">{data.transactions.map(t => <div className="ledger-row" key={t.id}><span className={`ledger-icon ${t.type === 'payout' ? 'payout' : ''}`}><Icon name={t.type === 'reward' ? 'check' : 'wallet'} /></span><div><strong>{t.title}</strong><small>{parent && `${childName(t.childId)} · `}{dateText(t.createdAt)}</small></div><span className={t.amount > 0 ? 'positive' : ''}>{t.amount > 0 ? '+' : ''}{moneyText(t.amount)}</span></div>)}</div> : <Empty icon="clock" title="Birinchi mukofot oldinda" text="Ota-ona vazifani tasdiqlagach, mukofot shu yerda tarixga yoziladi." />}</section></>}
  {parent && ['family', 'notifications'].includes(section) && <TelegramConnect />}
  {section === 'notifications' && <><div className="section-heading"><h2>{unread} ta yangi xabar</h2><button className="button light" disabled={busy || unread === 0} onClick={() => mutate('notifications/read', {}, 'Xabarlar o‘qilgan deb belgilandi.')}>Barchasini o‘qidim</button></div>{data.notifications.length ? <div className="notification-list">{data.notifications.map(n => <article className={`card notification-card ${n.read ? '' : 'unread'}`} key={n.id}><span className="lesson-icon"><Icon name="bell" /></span><div><p>{n.text}</p><small>{dateText(n.createdAt)}</small>{n.completionNote && <p className="notification-note">Izoh: {n.completionNote}</p>}{n.photoId && <a className="task-evidence" href={`/api/photos/${n.photoId}`} target="_blank" rel="noreferrer"><img src={`/api/photos/${n.photoId}`} alt="Farzand yuborgan ish rasmi" loading="lazy" /><span>Rasmni kattalashtirish ↗</span></a>}{n.taskId && <Link className="text-link" href={`/parent/tasks#task-${n.taskId}`}>Vazifalar bo‘limi →</Link>}{parent && n.telegramStatus && <p className="section-note">Telegram: {n.telegramStatus === 'sent' ? 'yetkazildi' : n.telegramStatus === 'failed' ? 'yetkazilmadi — yuqoridan qayta yuboring' : 'yuborish navbatida (bot ulangan bo‘lishi kerak)'}</p>}</div>{!n.read && <span className="dot" />}</article>)}</div> : <Empty icon="bell" title="Hozircha yangilik yo‘q" text="Yangi vazifa, bajarilgan ish yoki mukofot haqida shu yerda xabar beramiz." />}</>}
  {section === 'learn' && <Learn />}
  <footer className="dashboard-footer"><span>🌱 Birinchi Pul — oilangiz bilan birga.</span><span>Haqiqiy ko‘nikmalar. Virtual mukofotlar.</span></footer></main></div>
  {toast && <div className="toast" role="status"><Icon name="check" />{toast}</div>}
  {modal && <Modal title={{ 'new-task': 'Yangi vazifa berish', approve: 'Vazifani tasdiqlaysizmi?', return: 'Vazifani qaytarish', submit: 'Vazifani bajarib bo‘ldingizmi?', 'delete-task': 'Vazifani bekor qilish', 'new-goal': 'Yangi maqsad', 'save-goal': 'Maqsadga pul ajratish', 'release-goal': 'Pulni balansga qaytarish', 'delete-goal': 'Maqsadni o‘chirish', 'new-payout': 'Ota-onadan pul so‘rash', 'approve-payout': 'Pul berganingizni tasdiqlang', 'reject-payout': 'So‘rovni rad etish' }[modal.type]} onClose={closeModal} locked={busy}>
    {modal.type === 'new-task' && <form onSubmit={event => { const b = formBody(event); mutate('tasks', { ...b, amount: Number(b.amount), dueAt: new Date(`${b.date}T${b.time}:00+05:00`).toISOString() }, 'Vazifa farzandingizga yuborildi.'); }}><label>Qaysi farzandingizga?<select name="childId" required defaultValue={data.children.length === 1 ? data.children[0].id : ''}><option value="" disabled>Farzandni tanlang</option>{data.children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Nima qilish kerak?<input name="title" placeholder="Masalan, bugun xonangni yig‘ishtir" maxLength={120} required /></label><label>Qo‘shimcha tushuntirish <span className="optional">(ixtiyoriy)</span><textarea name="description" placeholder="Kitoblarni javonga, o‘yinchoqlarni qutiga joyla." maxLength={1000} rows={3} /></label><div className="form-row"><label>Qaysi kungacha?<input name="date" type="date" min={localDateInput()} required value={date} onChange={e => setDate(e.target.value)} /></label><label>Soat nechagacha?<input name="time" type="time" required value={time} onChange={e => setTime(e.target.value)} /></label></div><small className="date-preview">{date && time ? `Muddat: ${dateText(`${date}T${time}:00+05:00`)} · Toshkent vaqti` : 'Sana va vaqtni tanlang.'}</small><label>Mukofot qancha bo‘ladi? (so‘m)<input name="amount" type="number" min={1000} max={10000000} step={1000} placeholder="Masalan, 20 000" required /><small>Vazifani tasdiqlaganingizdan keyin virtual balansga qo‘shiladi.</small></label>{modalError && <div className="alert error" role="alert">{modalError}</div>}<button disabled={busy} className="button primary full">{busy ? 'Yuborilmoqda…' : 'Vazifani yuborish'}<Icon name="arrow" /></button></form>}
    {modal.type === 'submit' && <TaskSubmission task={modal.task} onBusy={value => { running.current = value; setBusy(value); }} onDone={async () => { setModal(null); setToast('Yuborildi. Ota-ona tasdiqlashini kuting.'); try { await refresh(); } catch (e) { setError(e.message); } }} />}
    {['return'].includes(modal.type) && <form onSubmit={event => { const b = formBody(event); mutate(`tasks/${modal.task.id}`, { action: modal.type, note: b.note }, modal.type === 'submit' ? 'Yuborildi. Ota-ona tasdiqlashini kuting.' : 'Vazifa izoh bilan qaytarildi.', 'PATCH'); }}><p className="modal-summary">{modal.task.title}</p><label>{modal.type === 'return' ? 'Nimani yaxshilash kerak?' : 'Ota-onangizga izoh (ixtiyoriy)'}<textarea name="note" rows={3} maxLength={500} required={modal.type === 'return'} placeholder={modal.type === 'return' ? 'Masalan, kitoblarni ham javonga joylang.' : 'Masalan, hamma kitoblarni joyladim.'} /></label>{modalError && <div className="alert error">{modalError}</div>}<button className="button primary full" disabled={busy}>{busy ? 'Yuborilmoqda…' : modal.type === 'return' ? 'Qayta bajarishga yuborish' : 'Ota-onaga yuborish'}</button></form>}
    {['approve', 'delete-task'].includes(modal.type) && <><p className="modal-summary">{modal.task.title}</p><p>{modal.type === 'approve' ? `${moneyText(modal.task.amount)} virtual mukofot bola balansiga qo‘shiladi. Vazifa ro‘yxatdan o‘chib, mukofot tarixda qoladi.` : 'Vazifa olib tashlanadi va mukofot berilmaydi. Bolaga xabar yuboriladi.'}</p>{modalError && <div className="alert error">{modalError}</div>}<div className="modal-actions"><button className="button light" disabled={busy} onClick={closeModal}>Ortga</button><button disabled={busy} className={`button ${modal.type === 'approve' ? 'primary' : 'danger'}`} onClick={() => mutate(`tasks/${modal.task.id}`, { action: modal.type === 'approve' ? 'approve' : 'delete' }, modal.type === 'approve' ? 'Tasdiqlandi! Mukofot bola balansiga qo‘shildi.' : 'Vazifa bekor qilindi.', 'PATCH')}>{busy ? 'Saqlanmoqda…' : modal.type === 'approve' ? 'Ha, tasdiqlayman' : 'Ha, bekor qilish'}</button></div></>}
    {modal.type === 'new-goal' && <form onSubmit={event => { const b = formBody(event); mutate('goals', { title: b.title, target: Number(b.target) }, 'Yangi maqsadingiz tayyor!'); }}><label>Nima uchun jamg‘armoqchisiz?<input name="title" maxLength={80} placeholder="Masalan, birinchi velosipedim" required /></label><label>Qancha pul kerak? (so‘m)<input name="target" type="number" min={1000} max={10000000} step={1000} placeholder="400000" required /></label>{modalError && <div className="alert error">{modalError}</div>}<button disabled={busy} className="button primary full">{busy ? 'Saqlanmoqda…' : 'Maqsadni yaratish'}</button></form>}
    {modal.type === 'save-goal' && <form onSubmit={event => { const b = formBody(event); mutate(`goals/${modal.goal.id}`, { action: 'save', amount: Number(b.amount) }, 'Maqsadingizga yana bir qadam yaqinlashdingiz!', 'PATCH'); }}><p className="modal-summary">{modal.goal.title}</p><p>Bo‘sh balans: <strong>{moneyText(mine.available)}</strong></p><label>Qancha ajratamiz? (so‘m)<input name="amount" type="number" min={1000} max={Math.min(mine.available, modal.goal.target - modal.goal.saved)} step={1000} required placeholder="10000" /></label>{modalError && <div className="alert error">{modalError}</div>}<button className="button primary full" disabled={busy || mine.available < 1000}>{busy ? 'Saqlanmoqda…' : 'Jamg‘armaga qo‘shish'}</button></form>}
    {['release-goal', 'delete-goal'].includes(modal.type) && <><p className="modal-summary">{modal.goal.title}</p><p>{modal.type === 'release-goal' ? `${moneyText(modal.goal.saved)} jamg‘armadan virtual balansingizga qaytadi. Keyin pul so‘rovi yuborishingiz mumkin.` : 'Bu maqsad o‘chiriladi. Yangi maqsadni xohlagan payt ochishingiz mumkin.'}</p>{modalError && <div className="alert error">{modalError}</div>}<div className="modal-actions"><button className="button light" disabled={busy} onClick={closeModal}>Ortga</button><button className="button primary" disabled={busy} onClick={() => mutate(`goals/${modal.goal.id}`, { action: modal.type === 'release-goal' ? 'release' : 'delete' }, 'Maqsad yangilandi.', 'PATCH')}>{busy ? 'Saqlanmoqda…' : 'Tasdiqlash'}</button></div></>}
    {modal.type === 'new-payout' && <form onSubmit={event => { const b = formBody(event); mutate('payouts', { title: b.title, amount: Number(b.amount) }, 'So‘rovingiz ota-onaga yuborildi.'); }}><p>Bo‘sh balans: <strong>{moneyText(mine.available)}</strong></p><label>Pul nima uchun kerak?<input name="title" maxLength={120} required placeholder="Masalan, yangi kitob sotib olish uchun" /></label><label>Qancha kerak? (so‘m)<input name="amount" type="number" min={1000} max={mine.available} step={1000} required placeholder="20000" /></label><small>So‘ralgan summa javob kelguncha band qilinadi. Pulni ota-onangiz saytdan tashqarida beradi.</small>{modalError && <div className="alert error">{modalError}</div>}<button disabled={busy || mine.available < 1000} className="button primary full">{busy ? 'Yuborilmoqda…' : 'So‘rov yuborish'}</button></form>}
    {['approve-payout', 'reject-payout'].includes(modal.type) && <><p className="modal-summary">{modal.payout.title} · {moneyText(modal.payout.amount)}</p><p>{modal.type === 'approve-payout' ? 'Pulni bolaga naqd yoki boshqa usulda bergan bo‘lsangiz tasdiqlang. Sayt virtual balansdan shu summani ayiradi, bank o‘tkazmasini bajarmaydi.' : 'So‘rov rad etiladi. Band qilingan summa bola uchun yana ochiladi.'}</p>{modalError && <div className="alert error">{modalError}</div>}<div className="modal-actions"><button className="button light" disabled={busy} onClick={closeModal}>Ortga</button><button className="button primary" disabled={busy} onClick={() => mutate(`payouts/${modal.payout.id}`, { action: modal.type === 'approve-payout' ? 'approve' : 'reject' }, 'So‘rov yangilandi.', 'PATCH')}>{busy ? 'Saqlanmoqda…' : modal.type === 'approve-payout' ? 'Ha, pulni berdim' : 'Rad etishni tasdiqlash'}</button></div></>}
  </Modal>}
  {tour && !modal && <Tour role={role} onDone={() => { setTour(false); setUser(u => ({ ...u, onboarded: true })); }} />}
  </div>;
}

```

## components/FamilyBalances.js

```javascript
import Link from 'next/link';
import Icon from './Icon';
import { moneyText } from '@/lib/format';

export default function FamilyBalances({ summary, showLink = false }) {
  if (!summary) return null;
  return <section className="family-balances" aria-label="Farzandlar bo‘yicha hisob">
    <div className="section-heading"><h2><Icon name="users" size={22} /> Farzandlar bo‘yicha hisob</h2>{showLink && <Link className="text-link" href="/parent/wallet">Hisob va so‘rovlar <Icon name="arrow" size={16} /></Link>}</div>
    <div className="family-total-strip">
      <div className="family-total-main"><span>Jami berilmagan mukofot</span><strong>{moneyText(summary.totals.owed)}</strong><small>Barcha farzandlarning balansi + jamg‘armasi</small></div>
      <div><span>Hozir so‘ralgan pul</span><strong>{moneyText(summary.totals.reserved)}</strong><small>Kutilayotgan so‘rovlar · jami ichida</small></div>
      <div><span>Maqsadlarga jamg‘arilgan</span><strong>{moneyText(summary.totals.saved)}</strong><small>Jamg‘armalar ham jami ichida</small></div>
    </div>
    {summary.children.length ? <div className="child-balance-list">{summary.children.map(child => <article className="child-balance-card" key={child.childId}>
      <div className="child-balance-person"><span className="avatar">{child.name.charAt(0).toUpperCase()}</span><div><h3>{child.name}</h3><small>Berilmagan mukofot <strong>{moneyText(child.owed)}</strong></small></div></div>
      <dl><div><dt>Balansida</dt><dd>{moneyText(child.balance)}</dd></div><div><dt>Jamg‘armasida</dt><dd>{moneyText(child.saved)}</dd></div><div className={child.reserved > 0 ? 'requested-balance' : ''}><dt>Hozir so‘ragani</dt><dd>{moneyText(child.reserved)}</dd></div></dl>
    </article>)}</div> : <div className="family-balance-empty"><p>Farzandingizni ulasangiz, uning hisobi shu yerda ko‘rinadi.</p><Link href="/parent/family" className="text-link">Farzandni taklif qilish <Icon name="arrow" size={16} /></Link></div>}
    <p className="balance-explanation"><Icon name="leaf" size={15} /><span>Faqat tasdiqlangan mukofotlar hisoblanadi. So‘ralgan pul balans tarkibida; qayta qo‘shilmaydi. “Pulni berdim” tasdiqlangach, balans va jami summa kamayadi. Sayt pul o‘tkazmaydi.</span></p>
  </section>;
}

```

## components/Icon.js

```javascript
const paths = {
  home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  tasks: 'M9 5h11M9 12h11M9 19h11M3 5l1 1 2-2M3 12l1 1 2-2M3 19l1 1 2-2',
  wallet: 'M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v11H5a3 3 0 0 1-3-3V6m19 6h-5v5h5m-3-2.5h.01',
  target: 'M21 12a9 9 0 1 1-9-9m5 9a5 5 0 1 1-5-5m0 5 9-9m-5 0h5v5',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m7 0a4 4 0 0 1 0 8',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12l4 4L19 6',
  clock: 'M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  logout: 'M9 21H4V3h5m6 5 5 4-5 4m-6-4h11',
  book: 'M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1m0-15c3-2 7-2 10-1v15c-3-1-7-1-10 1V5',
  close: 'M6 6l12 12M6 18 18 6',
  leaf: 'M20 3C7 1 1 7 5 16c8 7 16-1 15-13ZM4 21 15 10',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
  copy: 'M9 9h12v12H9zM15 5V3H3v12h2',
};
export default function Icon({ name = 'leaf', size = 20, ...props }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.leaf} /></svg>; }

```

## components/Learn.js

```javascript
'use client';
import { useState } from 'react';
import Icon from './Icon';
const lessons = [
  { icon: 'wallet', title: 'Ehtiyojmi yoki xohish?', text: 'Ehtiyoj — kundalik hayot uchun zarur narsa. Xohish esa hozir olmasangiz ham bo‘ladigan narsa. Xarid oldidan shu savolni bering.', question: 'Maktab daftarlaringiz tugadi. Qaysi xaridni avval rejalashtirasiz?', options: ['Yangi o‘yinchoq', 'Dars uchun daftar', 'Ikkinchi quloqchin'], answer: 1, why: 'Daftar dars uchun zarur. Qolgan xaridlar uchun keyinroq jamg‘arish mumkin.' },
  { icon: 'target', title: 'Maqsadni kichik qadamlarga bo‘ling', text: 'Katta summani birdan yig‘ish qiyin ko‘rinadi. Uni kichik qismlarga ajrating va muntazam jamg‘aring.', question: 'Kitob 60 000 so‘m. Har hafta 15 000 so‘m ajratsangiz, necha haftada yetadi?', options: ['2 hafta', '3 hafta', '4 hafta'], answer: 2, why: '60 000 ÷ 15 000 = 4 hafta. Rejada boshqa xarajatlarni ham esdan chiqarmang.' },
  { icon: 'clock', title: 'Xarid qilishdan oldin to‘xtang', text: 'Biror narsa yoqib qolsa, uni darrov olish shart emas. Biroz kuting, narxini solishtiring va maqsadingizni eslang.', question: 'O‘yinda chegirma ko‘rdingiz. Eng o‘ylangan birinchi qadam qaysi?', options: ['Darhol hamma pulni sarflash', 'Kerakligini va budjetni tekshirish', 'Do‘stdan pul qarz olish'], answer: 1, why: 'Chegirma borligi xarid zarur degani emas. Avval qancha erkin pulingiz borligini tekshiring.' },
];
export default function Learn() {
  const [answers, setAnswers] = useState({});
  return <div className="lesson-grid">{lessons.map((lesson, index) => <article className="card lesson-card" key={lesson.title}><span className="lesson-icon"><Icon name={lesson.icon} size={26} /></span><span className="eyebrow">{index + 1}-KICHIK DARS</span><h2>{lesson.title}</h2><p>{lesson.text}</p><h3>{lesson.question}</h3><div className="answers">{lesson.options.map((option, i) => <button key={option} onClick={() => setAnswers({ ...answers, [index]: i })} className={answers[index] === i ? (i === lesson.answer ? 'correct' : 'incorrect') : ''}>{option}</button>)}</div>{answers[index] !== undefined && <div className={`alert ${answers[index] === lesson.answer ? 'success' : ''}`}>{answers[index] === lesson.answer ? 'To‘g‘ri! ' : 'Yana o‘ylab ko‘ring. '}{lesson.why}</div>}</article>)}</div>;
}

```

## components/LevelCard.js

```javascript
import Icon from './Icon';
import { LEVEL_XP, TASK_XP, levelProgress } from '@/lib/progression';

export default function LevelCard({ progress = levelProgress() }) {
  return <section className="level-card" aria-label="Mening darajam">
    <div className="level-medal" aria-hidden="true"><Icon name="star" size={45} /><strong>{progress.level}</strong></div>
    <div className="level-copy">
      <span className="eyebrow">MENING DARAJAM</span>
      <div className="level-heading"><h2>{progress.level}-daraja <span>Yangi marralar sari!</span></h2><span className="xp-total">Jami {progress.totalXp} XP</span></div>
      <div className="level-progress-label"><strong>{progress.currentXp} / {LEVEL_XP} XP</strong><span>{progress.nextLevel}-darajagacha {progress.remainingXp} XP</span></div>
      <div className="progress level-progress" role="progressbar" aria-label="Keyingi darajagacha tajriba" aria-valuemin={0} aria-valuemax={LEVEL_XP} aria-valuenow={progress.currentXp} aria-valuetext={`${progress.level}-daraja, ${progress.currentXp} / ${LEVEL_XP} XP`}>
        <span style={{ width: `${progress.currentXp / LEVEL_XP * 100}%` }} />
      </div>
      <p><Icon name="check" size={14} /> Ota-ona tasdiqlagan har bir vazifa uchun <strong>+{TASK_XP} XP</strong>. XP — tajriba ballari.</p>
    </div>
  </section>;
}

```

## components/Modal.js

```javascript
'use client';
import { useEffect, useRef, useId } from 'react';
import Icon from './Icon';
export default function Modal({ title, description, onClose, children, locked = false, className = '' }) {
  const ref = useRef(null);
  const heading = useId();
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => [...ref.current.querySelectorAll('button:not(:disabled), input, select, textarea, a[href], [tabindex="0"]')];
    focusable()[0]?.focus();
    function key(event) {
      if (event.key === 'Escape' && !locked) onClose?.();
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !ref.current.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus?.(); };
  }, [onClose, locked]);
  return <div className={`modal-backdrop ${className}`} onMouseDown={event => { if (event.target === event.currentTarget && !locked) onClose?.(); }}><section className="modal" ref={ref} role="dialog" aria-modal="true" aria-labelledby={heading}><div className="modal-title"><div><h2 id={heading}>{title}</h2>{description && <p>{description}</p>}</div>{onClose && <button className="icon-button" aria-label="Yopish" onClick={onClose} disabled={locked}><Icon name="close" /></button>}</div>{children}</section></div>;
}

```

## components/Reveal.js

```javascript
'use client';
import { useEffect, useRef } from 'react';

// Content stays readable without JavaScript or with reduced motion enabled.
export default function Reveal({ children, className = '', id }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} id={id} className={`reveal-section ${className}`}>{children}</section>;
}

```

## components/TaskSubmission.js

```javascript
'use client';
import { useState, useRef } from 'react';
import { api } from '@/lib/format';
import TaskCamera from './TaskCamera';
async function prepareImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('JPG, PNG yoki WebP rasm tanlang.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Tanlangan rasm 15 MB dan kichik bo‘lsin.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40000000) throw new Error('Rasm o‘lchami juda katta. Kichikroq rasm tanlang.');
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.5]) {
      const url = canvas.toDataURL('image/jpeg', quality);
      if (url.length < 2000000) return url;
    }
    throw new Error('Rasm hajmi katta. Kichikroq rasm tanlang.');
  } finally { bitmap.close(); }
}
export default function TaskSubmission({ task, onDone, onBusy }) {
  const [photo, setPhoto] = useState(''), [note, setNote] = useState(''), [error, setError] = useState('');
  const [busy, setBusy] = useState(false), [preparing, setPreparing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const running = useRef(false), input = useRef(null), cameraInput = useRef(null);
  async function choose(event) {
    const file = event.target.files?.[0]; if (!file) return;
    event.target.value = '';
    setPreparing(true); onBusy(true); setError(''); setCameraOpen(false);
    try { setPhoto(await prepareImage(file)); }
    catch (e) { setError(e.message || 'Rasm ochilmadi. Boshqa rasm tanlang.'); }
    finally { setPreparing(false); onBusy(false); }
  }
  async function submit(event) {
    event.preventDefault(); if (running.current || preparing || cameraOpen) return;
    running.current = true; setBusy(true); onBusy(true); setError('');
    try {
      await api(`tasks/${task.id}`, { method: 'PATCH', body: { action: 'submit', note, photo: photo || undefined } });
      await onDone();
    } catch (e) { setError(e.message); }
    finally { running.current = false; setBusy(false); onBusy(false); }
  }
  return <form onSubmit={submit}><p className="modal-summary">{task.title}</p>
    <label>Ota-onangizga izoh <span className="optional">(ixtiyoriy)</span><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} maxLength={500} disabled={busy} placeholder="Masalan, xonamni yig‘ishtirdim va kitoblarni joyladim." /></label>
    <div className="task-photo-field">
      <p>Bajargan ishingizning rasmi <span className="optional">(ixtiyoriy)</span></p>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy || preparing} onChange={choose} aria-label="Tayyor rasm tanlash" />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden disabled={busy || preparing} onChange={choose} aria-label="Telefon kamerasi" />
      <div className="photo-actions">
        <button type="button" className="button light" disabled={busy || preparing || cameraOpen} onClick={() => { setError(''); setCameraOpen(true); }}>📷 {photo ? 'Qayta surat olish' : 'Kamerada olish'}</button>
        <button type="button" className="button light" disabled={busy || preparing || cameraOpen} onClick={() => input.current?.click()}>🖼️ Rasm tanlash</button>
      </div>
      <small>JPG, PNG yoki WebP · 15 MB gacha. Rasm avtomatik kichraytiriladi.</small>
    </div>
    {cameraOpen && <TaskCamera onClose={() => setCameraOpen(false)} onCapture={value => { setPhoto(value); setCameraOpen(false); setError(''); }} onFallback={() => { cameraInput.current?.click(); setCameraOpen(false); }} />}
    {preparing && <p role="status">Rasm tayyorlanmoqda…</p>}
    {photo && <div className="photo-preview"><img src={photo} alt="Yuboriladigan ish rasmi" /><button type="button" className="text-button danger-text" disabled={busy} onClick={() => { setPhoto(''); if (input.current) input.current.value = ''; }}>Rasmni olib tashlash</button></div>}
    <p className="section-note">Rasm va izoh ota-onangizga saytda, Telegram ulangan bo‘lsa bot orqali ham yuboriladi.</p>
    {error && <div className="alert error" role="alert">{error}</div>}
    <button className="button primary full" disabled={busy || preparing || cameraOpen}>{busy ? 'Yuborilmoqda…' : 'Bajardim — ota-onaga yuborish'}</button>
  </form>;
}

```

## components/TelegramConnect.js

```javascript
'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/format';
export default function TelegramConnect() {
  const [status, setStatus] = useState(null), [error, setError] = useState(''), [url, setUrl] = useState(''), [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => { setStatus(await api('telegram/status')); }, []);
  useEffect(() => {
    const run = () => { if (!document.hidden) refresh().catch(e => setError(e.message)); };
    run(); const timer = setInterval(run, 5000); window.addEventListener('focus', run);
    return () => { clearInterval(timer); window.removeEventListener('focus', run); };
  }, [refresh]);
  async function action(name) {
    if (busy) return; setBusy(true); setError('');
    try {
      const result = await api(`telegram/${name}`, { method: 'POST', body: {} });
      setUrl(name === 'link' ? result.url : ''); await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <section className="card telegram-card"><div><span className="eyebrow">TELEGRAM XABARNOMALARI</span><h2>{status?.linked ? 'Telegram ulangan ✓' : 'Yangiliklar telefoningizga kelsin'}</h2>
    <p>{status?.linked ? 'Farzandingiz yuborgan vazifa, rasm va izoh bot orqali keladi.' : 'Saytga kirmasangiz ham, farzandingiz topshirgan ish haqida bilib turasiz.'}</p></div>
    {!status && !error && <p>Ulanish tekshirilmoqda…</p>}
    {status && !status.configured && <div className="alert">Telegram bot hali sozlanmagan. Hozircha xabarnomalar saytda keladi.</div>}
    {status?.configured && !status.linked && <><button className="button primary" disabled={busy} onClick={() => action('link')}>{busy ? 'Tayyorlanmoqda…' : url ? 'Yangi ulash havolasi' : 'Telegram’ni ulash'}</button>
      {url && <div className="telegram-link"><a className="button primary" href={url} target="_blank" rel="noreferrer">Telegram’ni ochish ↗</a><p>Botda <strong>Start / Boshlash</strong> tugmasini bosing. Havola 10 daqiqa amal qiladi. Ulanish holati shu yerda yangilanadi.</p></div>}</>}
    {status?.linked && <div className="row-actions"><span className="tag">{status.username ? `@${status.username}` : 'Shaxsiy Telegram akkaunti'}</span><button className="button light" disabled={busy} onClick={() => action('disconnect')}>Ulanishni uzish</button></div>}
    {status?.waiting > 0 && <div className="alert">{status.waiting} ta xabar Telegram’ga yetkazilishini kutmoqda.{status.linked && <button className="text-button" disabled={busy} onClick={() => action('resend')}>{busy ? 'Yuborilmoqda…' : 'Qayta yuborish'}</button>}</div>}
    {error && <div className="alert error" role="alert">{error}</div>}
  </section>;
}

```

## components/Tour.js

```javascript
'use client';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';
import { api } from '@/lib/format';
const steps = {
  parent: [
    ['nav-family', 'Avval farzandingizni ulang', '“Oila” bo‘limida taklif kodi yaratasiz. Bola ro‘yxatdan o‘tayotganda shu kodni kiritadi.'],
    ['new-task', 'Vazifa shu yerdan qo‘shiladi', 'Farzandingizni tanlang. Nima qilishini, muddatini va mukofot miqdorini yozing. Masalan: bugun xonangni yig‘ishtir.'],
    ['nav-tasks', 'Bajarilgan ishni tasdiqlang', 'Bola “Qilib bo‘ldim” tugmasini bossa, vazifa tekshirishga keladi. Tasdiqlasangiz, mukofot uning virtual balansiga tushadi.'],
    ['nav-wallet', 'Pul berishni qayd qiling', 'Bola pul so‘rashi mumkin. Pulni o‘zingiz berganingizdan keyin tasdiqlang. Sayt bank orqali pul jo‘natmaydi.'],
  ],
  child: [
    ['nav-tasks', 'Vazifalaringiz shu yerda', 'Mana shu yerda ota-onangiz bergan vazifalar, muddatlar va mukofotlar turadi.'],
    ['task-list', 'Bajardingizmi? Xabar bering!', '“Qilib bo‘ldim” tugmasini bosing. Keyin “Ota-ona tasdiqlashini kuting” yozuvi chiqadi.'],
    ['nav-wallet', 'Ilk pulingizni kuzating', 'Ota-onangiz tasdiqlagach, mukofot shu yerdagi virtual hisobingizga tushadi.'],
    ['nav-goals', 'Orzuingiz uchun jamg‘aring', '“Maqsadlarim” bo‘limida maqsad ochib, topgan pulingizning bir qismini unga ajrating.'],
  ],
};
export default function Tour({ role, onDone }) {
  const [step, setStep] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const list = steps[role];
  const [id, title, text] = list[step];
  useEffect(() => {
    const element = document.getElementById(id);
    element?.classList.add('tour-highlight');
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return () => element?.classList.remove('tour-highlight');
  }, [id]);
  async function finish() {
    setBusy(true); setError('');
    try { await api('onboarding', { method: 'POST', body: {} }); onDone(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <Modal title={title} locked className="tour-backdrop"><div className="tour-step"><span className="eyebrow">QISQA TANISHUV · {step + 1} / {list.length}</span><p>{text}</p><div className="tour-dots">{list.map((_, i) => <span key={i} className={i === step ? 'active' : ''} />)}</div>{error && <div className="alert error">{error}</div>}<div className="modal-actions"><button className="button ghost" onClick={finish} disabled={busy}>Tushundim, o‘tkazish</button><button className="button primary" disabled={busy} onClick={() => step === list.length - 1 ? finish() : setStep(step + 1)}>{busy ? 'Saqlanmoqda…' : step === list.length - 1 ? 'Boshlaymiz!' : 'OK, keyingisi'}<Icon name="arrow" /></button></div></div></Modal>;
}

```

## components/WelcomeCard.js

```javascript
'use client';

import { useRef, useState } from 'react';
import Icon from './Icon';
import { api } from '@/lib/format';
import { TASK_XP, LEVEL_XP } from '@/lib/progression';

export default function WelcomeCard({ parent, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const saving = useRef(false);

  async function dismiss() {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setError('');
    try {
      await api('onboarding', { method: 'POST', body: {} });
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return <section className="welcome-card" aria-label="Kabinet bilan birinchi tanishuv">
    <span className="welcome-card-icon"><Icon name={parent ? 'users' : 'star'} size={26} /></span>
    <div className="welcome-card-copy">
      <span className="eyebrow">BIRINCHI PULGA XUSH KELIBSIZ</span>
      <h2>{parent ? 'Birga yaxshi odatlarni boshlaymiz.' : 'Katta orzularing sari, olg‘a!'}</h2>
      <p>{parent
        ? 'Avval “Oila” bo‘limida farzandingizni ulang. Keyin vazifa bering, bajargan ishini tasdiqlang va hisobini kuzating.'
        : `Vazifani bajarib, ota-onangizga yuboring. Ular tasdiqlasa, virtual mukofot va ${TASK_XP} XP olasiz. Har ${LEVEL_XP} XP — yangi daraja!`}</p>
      <small>Yo‘riqnoma kerak bo‘lsa, menyudagi “Saytni tushuntirish”ni bosing.</small>
      {error && <div className="alert error" role="alert">{error}</div>}
    </div>
    <button type="button" className="button primary" disabled={busy} onClick={dismiss}>
      {busy ? 'Saqlanmoqda…' : 'Tushundim'}<Icon name="check" size={18} />
    </button>
  </section>;
}

```

## lib/api.js

```javascript
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

```

## lib/auth.js

```javascript
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

```

## lib/db.js

```javascript
import mongoose from 'mongoose';

const cache = globalThis.__bpMongo ||= { connection: null, promise: null };
export async function connectDB() {
  if (cache.connection) return cache.connection;
  if (!cache.promise) cache.promise = mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/birinchi_pul',
    { serverSelectionTimeoutMS: 5000 }
  );
  try { cache.connection = await cache.promise; return cache.connection; }
  catch (error) { cache.promise = null; throw error; }
}

```

## lib/domain.js

```javascript
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

```

## lib/format.js

```javascript
export const moneyText = value => `${Number(value || 0).toLocaleString('ru-RU')} so‘m`;
export function dateText(value) {
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value)).replace(',', '');
}
export function localDateInput() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
export async function api(path, options = {}) {
  const response = await fetch(`/api/${path}`, { cache: 'no-store', ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, body: options.body === undefined ? undefined : JSON.stringify(options.body) });
  let payload;
  try { payload = await response.json(); } catch { throw new Error('Server javobi olinmadi. Qayta urinib ko‘ring.'); }
  if (!response.ok) { const e = new Error(payload.error || 'So‘rov bajarilmadi.'); e.status = response.status; throw e; }
  return payload;
}

```

## lib/photo.js

```javascript
import sharp from 'sharp';
import { ensure } from './security.js';
export const MAX_PHOTO_BYTES = 1500000;
export async function decodePhoto(value) {
  if (value === undefined || value === null || value === '') return null;
  ensure(typeof value === 'string' && value.length <= 2100000, 'Rasm hajmi juda katta.', 413);
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  ensure(match, 'JPG, PNG yoki WebP rasm tanlang.');
  const bytes = Buffer.from(match[2], 'base64');
  ensure(bytes.length > 0 && bytes.length <= MAX_PHOTO_BYTES, 'Rasm 1,5 MB dan kichik bo‘lsin.', 413);
  try {
    // Decode, bound pixel count and re-encode: reject forged files and remove EXIF/GPS.
    return await sharp(bytes, { limitInputPixels: 25000000, animated: false })
      .rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).jpeg({ quality: 82 }).toBuffer();
  } catch { ensure(false, 'Rasmni ochib bo‘lmadi. Boshqa JPG yoki PNG rasm tanlang.'); }
}
export function canViewPhoto(photo, actor) {
  return actor.role === 'parent' ? photo.familyId === actor.id
    : photo.familyId === actor.parentId && photo.childId === actor.id;
}

```

## lib/progression.js

```javascript
export const TASK_XP = 25;
export const LEVEL_XP = 100;

export function levelProgress(xp = 0) {
  const totalXp = Number.isSafeInteger(xp) && xp >= 0 ? xp : 0;
  const level = Math.floor(totalXp / LEVEL_XP);
  const currentXp = totalXp % LEVEL_XP;
  return { totalXp, level, nextLevel: level + 1, currentXp, requiredXp: LEVEL_XP, remainingXp: LEVEL_XP - currentXp };
}

export function childProgress(data, childId) {
  // Older families have reward history but no persistent XP counter yet.
  // Use the full history, not the last 100 transactions shown in the UI.
  const stored = data.experience?.[childId];
  const totalXp = Number.isSafeInteger(stored) && stored >= 0
    ? stored
    : data.transactions.filter(t => t.childId === childId && t.type === 'reward').length * TASK_XP;
  return levelProgress(totalXp);
}

```

## lib/security.js

```javascript
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

```

## lib/store.js

```javascript
import { connectDB } from './db.js';
import { AppError } from './security.js';
import FamilyState from '../models/FamilyState.js';

export function emptyFamily() {
  return {
    tasks: [],
    wallets: {},
    experience: {},
    goals: [],
    transactions: [],
    payouts: [],
    notifications: [],
  };
}

export async function familyStore(
  familyId,
  action,
  readOnly = false
) {
  if (
    typeof familyId !== 'string' ||
    !/^[a-f0-9]{24}$/.test(familyId)
  ) {
    throw new AppError('Oila topilmadi.', 404);
  }

  await connectDB();

  // Boshqa so‘rov oldinroq saqlasa, yangi holatni o‘qib takrorlaymiz.
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const document = await FamilyState.findById(familyId)
      .read('primary')
      .lean();

    const data = document
      ? structuredClone(document.data)
      : emptyFamily();

    // action faqat data bilan ishlashi kerak.
    // Uning ichidan email, to‘lov yoki boshqa tashqi amal bajarmang.
    const result = await action(data);

    if (readOnly) {
      return result;
    }

    // Bu oilaning birinchi saqlanishi.
    if (!document) {
      try {
        await FamilyState.create({
          _id: familyId,
          revision: 0,
          data,
        });

        return result;
      } catch (error) {
        // Shu orada boshqa so‘rov oilani yaratgan bo‘lishi mumkin.
        if (error.code !== 11000) {
          throw error;
        }
      }
    } else {
      // Faqat biz o‘qigan versiya hali o‘zgarmagan bo‘lsa yozamiz.
      const update = await FamilyState.updateOne(
        {
          _id: familyId,
          revision: document.revision,
        },
        {
          $set: { data },
          $inc: { revision: 1 },
        },
        {
          runValidators: true,
        }
      );

      if (update.matchedCount === 1) {
        return result;
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 20 + Math.random() * 40);
    });
  }

  throw new AppError(
    'Bir vaqtda bir nechta o‘zgarish bo‘ldi. Qayta urinib ko‘ring.',
    409
  );
}

```

## lib/telegram-queue.js

```javascript
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

```

## lib/telegram.js

```javascript
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

```

## models/FamilyState.js

```javascript
import mongoose from 'mongoose';

const familyStateSchema = new mongoose.Schema(
  {
    // Oilaning identifikatori — ota-onaning user ID qiymati.
    _id: {
      type: String,
      required: true,
    },

    revision: {
      type: Number,
      default: 0,
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    minimize: false,
    collection: 'family_states',
  }
);

const FamilyState =
  mongoose.models.FamilyState ||
  mongoose.model('FamilyState', familyStateSchema);

export default FamilyState;
```

## models/TaskPhoto.js

```javascript
import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  familyId: { type: String, required: true, index: true },
  childId: { type: String, required: true },
  taskId: { type: String, required: true },
  bytes: { type: Buffer, required: true, select: false },
  contentType: { type: String, default: 'image/jpeg' },
  // Only abandoned uploads expire. Committed task evidence has no TTL.
  expiresAt: { type: Date, default: () => new Date(Date.now() + 86400000) },
}, { timestamps: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.models.TaskPhoto || mongoose.model('TaskPhoto', schema);

```

## models/User.js

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 60 },
  username: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['parent', 'child'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  onboarded: { type: Boolean, default: false },
  telegram: { chatId: String, username: String, linkedAt: Date, linkHash: String, linkExpiresAt: Date },
  sessions: [{ _id: false, hash: String, expiresAt: Date }],
  invitations: [{ _id: false, hash: String, expiresAt: Date }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

```

## scripts/setup.mjs

```javascript
import { copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
try {
  await copyFile('.env.example', '.env.local', constants.COPYFILE_EXCL);
  console.log('.env.local tayyor. MongoDB serverini ishga tushiring, so‘ng npm run dev.');
} catch (error) {
  if (error.code === 'EEXIST') console.log('.env.local mavjud, o‘zgartirilmadi.');
  else throw error;
}

```

## scripts/telegram-setup.mjs

```javascript
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

```

## tests/domain.test.mjs

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFamily } from '../lib/store.js';
import { createTask, changeTask, createGoal, changeGoal, createPayout, changePayout, snapshot, wallet } from '../lib/domain.js';
import { hashPassword, checkPassword } from '../lib/security.js';
import { childProgress, levelProgress } from '../lib/progression.js';
import { familyBalances } from '../lib/domain.js';
const parent = { id: 'a'.repeat(24), role: 'parent', name: 'Ota' };
const child = { id: 'b'.repeat(24), role: 'child', parentId: parent.id, name: 'Bola' };
const body = () => ({ title: 'Xonani yig‘ishtir', description: '', amount: 20000, childId: child.id, dueAt: new Date(Date.now() + 86400000).toISOString() });
function setup() { const data = emptyFamily(); const task = createTask(data, parent.id, body(), [child.id]); return { data, task }; }
test('child submission waits, parent approval removes task and rewards exactly once', () => {
  const { data, task } = setup();
  changeTask(data, child, task.id, { action: 'submit' });
  assert.equal(data.tasks[0].status, 'pending'); assert.equal(wallet(data, child.id).balance, 0);
  assert.equal(data.notifications[0].userId, parent.id);
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(data.tasks.length, 0); assert.equal(wallet(data, child.id).balance, 20000);
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  assert.equal(data.transactions.length, 1);
});
test('child cannot approve own work and unrelated users cannot submit it', () => {
  const { data, task } = setup();
  assert.throws(() => changeTask(data, child, task.id, { action: 'approve' }));
  assert.throws(() => changeTask(data, { ...child, id: 'c'.repeat(24) }, task.id, { action: 'submit' }));
  assert.throws(() => createTask(data, parent.id, { ...body(), childId: 'stranger' }, [child.id]));
});
test('parent must wait for submission; return requires a note; resubmission works', () => {
  const { data, task } = setup();
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  changeTask(data, child, task.id, { action: 'submit' });
  assert.throws(() => changeTask(data, parent, task.id, { action: 'return', note: '' }));
  changeTask(data, parent, task.id, { action: 'return', note: 'Kitoblarni ham joylang.' });
  assert.equal(data.tasks[0].status, 'active');
  changeTask(data, child, task.id, { action: 'submit' });
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(wallet(data, child.id).balance, 20000);
});
test('invalid reward and past deadlines are rejected', () => {
  for (const amount of [-1000, 0, 1.5, Infinity, '20000', 10000001]) assert.throws(() => createTask(emptyFamily(), parent.id, { ...body(), amount }, [child.id]));
  assert.throws(() => createTask(emptyFamily(), parent.id, { ...body(), dueAt: '2020-01-01' }, [child.id]));
});
test('pending payouts reserve funds; saving or requesting the same funds twice fails', () => {
  const data = emptyFamily(); data.wallets[child.id] = 30000;
  createPayout(data, child, { amount: 20000, title: 'Kitob' });
  assert.equal(wallet(data, child.id).available, 10000);
  assert.throws(() => createPayout(data, child, { amount: 20000, title: 'Kitob' }));
  createGoal(data, child.id, { title: 'Velosiped', target: 100000 });
  assert.throws(() => changeGoal(data, child.id, data.goals[0].id, { action: 'save', amount: 20000 }));
  changeGoal(data, child.id, data.goals[0].id, { action: 'save', amount: 10000 });
  changePayout(data, parent.id, data.payouts[0].id, { action: 'approve' });
  assert.equal(wallet(data, child.id).balance, 0);
  assert.throws(() => changePayout(data, parent.id, data.payouts[0].id, { action: 'approve' }));
});
test('rejecting payout releases reserve without reducing balance', () => {
  const data = emptyFamily(); data.wallets[child.id] = 20000;
  createPayout(data, child, { amount: 20000, title: 'Kitob' });
  changePayout(data, parent.id, data.payouts[0].id, { action: 'reject' });
  assert.equal(wallet(data, child.id).available, 20000); assert.equal(data.transactions.length, 0);
});
test('savings can be released, cannot exceed target or be deleted with a balance', () => {
  const data = emptyFamily(); data.wallets[child.id] = 30000;
  createGoal(data, child.id, { title: 'Kitob', target: 20000 }); const id = data.goals[0].id;
  assert.throws(() => changeGoal(data, child.id, id, { action: 'save', amount: 30000 }));
  changeGoal(data, child.id, id, { action: 'save', amount: 20000 });
  assert.throws(() => changeGoal(data, child.id, id, { action: 'delete' }));
  changeGoal(data, child.id, id, { action: 'release' });
  assert.equal(wallet(data, child.id).balance, 30000);
  changeGoal(data, child.id, id, { action: 'delete' }); assert.equal(data.goals.length, 0);
});
test('child snapshots do not expose sibling wallets, tasks, goals or notifications', () => {
  const { data } = setup();
  createTask(data, parent.id, { ...body(), childId: 'sibling' }, ['sibling']);
  data.wallets.sibling = 100000; createGoal(data, 'sibling', { title: 'Private', target: 10000 });
  const result = snapshot(data, child, []);
  assert.equal(result.tasks.length, 1); assert.equal(result.goals.length, 0);
  assert.equal(result.wallets.sibling, undefined);
  assert.ok(result.notifications.every(n => n.userId === child.id));
});
test('password hashing uses separate salts and verifies passwords', async () => {
  const a = await hashPassword('VeryStrong123'), b = await hashPassword('VeryStrong123');
  assert.notEqual(a, b); assert.equal(await checkPassword('VeryStrong123', a), true);
  assert.equal(await checkPassword('WrongPassword', a), false);
});

test('XP is earned only once on parent approval, never on submission, return or cancellation', () => {
  const { data, task } = setup();
  assert.equal(childProgress(data, child.id).totalXp, 0);
  assert.throws(() => changeTask(data, child, task.id, { action: 'approve', xp: 99999 }));
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  changeTask(data, child, task.id, { action: 'submit' });
  assert.equal(childProgress(data, child.id).totalXp, 0);
  changeTask(data, parent, task.id, { action: 'return', note: 'Yana tekshiring.' });
  assert.equal(childProgress(data, child.id).totalXp, 0);
  changeTask(data, child, task.id, { action: 'submit' });
  changeTask(data, parent, task.id, { action: 'approve', xp: 99999 });
  assert.equal(childProgress(data, child.id).totalXp, 25);
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  assert.equal(childProgress(data, child.id).totalXp, 25);
  const cancelled = createTask(data, parent.id, body(), [child.id]);
  changeTask(data, parent, cancelled.id, { action: 'delete' });
  assert.equal(childProgress(data, child.id).totalXp, 25);
});

test('every 100 XP advances one level; progress is retained across saved snapshots', () => {
  let data = emptyFamily();
  for (let i = 0; i < 5; i++) {
    const task = createTask(data, parent.id, body(), [child.id]);
    changeTask(data, child, task.id, { action: 'submit' });
    changeTask(data, parent, task.id, { action: 'approve' });
    data = JSON.parse(JSON.stringify(data));
    if (i === 3) {
      assert.deepEqual(childProgress(data, child.id), { totalXp: 100, level: 1, nextLevel: 2, currentXp: 0, requiredXp: 100, remainingXp: 100 });
      assert.match(data.notifications[0].text, /1-darajaga/);
    }
  }
  const result = snapshot(data, child, []);
  assert.equal(result.progression[child.id].totalXp, 125);
  assert.equal(result.progression[child.id].currentXp, 25);
  assert.equal(result.progression[child.id].remainingXp, 75);
  assert.equal(levelProgress(0).level, 0);
  assert.equal(levelProgress(99).remainingXp, 1);
  assert.equal(levelProgress(200).level, 2);
});

test('legacy XP uses all reward history and is persisted without double counting the next approval', () => {
  const data = emptyFamily();
  delete data.experience;
  data.transactions = Array.from({ length: 105 }, (_, i) => ({ id: String(i), childId: child.id, type: 'reward', amount: 1000 }));
  data.transactions.push({ childId: child.id, type: 'payout', amount: -5000 });
  data.transactions.push({ childId: 'sibling', type: 'reward', amount: 1000 });
  assert.equal(childProgress(data, child.id).totalXp, 2625);
  assert.equal(data.experience, undefined, 'reading old data does not mutate it');
  const task = createTask(data, parent.id, body(), [child.id]);
  changeTask(data, child, task.id, { action: 'submit' });
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(data.experience[child.id], 2650);
  const result = snapshot(data, child, []);
  assert.equal(result.transactions.length, 100);
  assert.equal(result.progression[child.id].totalXp, 2650);
  data.transactions = [];
  assert.equal(childProgress(data, child.id).totalXp, 2650, 'the saved counter does not depend on visible history');
});

test('children cannot see sibling XP or the parent family balance summary', () => {
  const data = emptyFamily();
  data.experience = { [child.id]: 25, sibling: 500 };
  const result = snapshot(data, child, []);
  assert.deepEqual(Object.keys(result.progression), [child.id]);
  assert.equal(result.familyBalances, undefined);
  const parentResult = snapshot(data, parent, [child, { id: 'sibling', name: 'Bola 2' }]);
  assert.equal(parentResult.progression.sibling.level, 5);
});

test('family totals include savings once and pending payouts remain a subset of balance', () => {
  const data = emptyFamily();
  const sibling = { id: 'sibling', name: 'Bola 2' };
  data.wallets = { [child.id]: 100000, sibling: 50000, unrelated: 999999 };
  createGoal(data, child.id, { title: 'Velosiped', target: 100000 });
  changeGoal(data, child.id, data.goals[0].id, { action: 'save', amount: 30000 });
  createPayout(data, child, { title: 'Kitob', amount: 20000 });
  const summary = familyBalances(data, [child, sibling]);
  assert.deepEqual(summary.totals, { balance: 120000, reserved: 20000, available: 100000, saved: 30000, owed: 150000 });
  assert.equal(summary.children[0].owed, 100000);
  assert.equal(summary.children[0].balance, 70000);
  assert.equal(summary.children[1].owed, 50000);
  changePayout(data, parent.id, data.payouts[0].id, { action: 'approve' });
  const after = familyBalances(data, [child, sibling]);
  assert.equal(after.totals.owed, 130000);
  assert.equal(after.totals.reserved, 0);
  changeGoal(data, child.id, data.goals[0].id, { action: 'release' });
  assert.equal(familyBalances(data, [child, sibling]).totals.owed, 130000);
});

test('unapproved tasks, rejected payouts and empty families do not inflate money owed or XP', () => {
  const { data, task } = setup();
  changeTask(data, child, task.id, { action: 'submit' });
  assert.equal(familyBalances(data, [child]).totals.owed, 0);
  data.wallets[child.id] = 50000;
  createPayout(data, child, { title: 'Kitob', amount: 20000 });
  changePayout(data, parent.id, data.payouts[0].id, { action: 'reject' });
  assert.equal(familyBalances(data, [child]).totals.owed, 50000);
  assert.equal(familyBalances(data, [child]).totals.reserved, 0);
  assert.equal(childProgress(data, child.id).totalXp, 0);
  assert.deepEqual(familyBalances(emptyFamily(), []), { children: [], totals: { balance: 0, reserved: 0, available: 0, saved: 0, owed: 0 } });
});

```

## tests/http-smoke.mjs

```javascript
// Run after npm run build. No MongoDB installation is needed for these public/unauthenticated checks.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const base = 'http://localhost:3198';
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(3000) });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3198', '--hostname', '127.0.0.1'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, APP_ORIGIN: base } });
let logs = '';
server.stdout.on('data', d => logs += d); server.stderr.on('data', d => logs += d);
try {
  let ready = false;
  for (let i = 0; i < 10; i++) {
    try { if ((await request(base)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, logs);
  for (const route of ['/', '/login', '/register', '/parent', '/child', '/parent/tasks', '/child/goals']) {
    const r = await request(base + route); assert.equal(r.status, 200, route);
    assert.ok((await r.text()).includes('<html lang="uz">'), route);
  }
  for (const route of ['/api/auth/me', '/api/state']) assert.equal((await request(base + route)).status, 401, route);
  const csrf = await request(base + '/api/auth/logout', { method: 'POST', headers: { origin: 'https://example.invalid', 'content-type': 'application/json' }, body: '{}' });
  assert.equal(csrf.status, 403);
  assert.equal((await request(base + '/api/telegram/webhook', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status, 401);
  assert.equal((await request(base + '/api/telegram/retry')).status, 401);
  assert.equal((await request(base + '/api/photos/' + 'a'.repeat(24))).status, 401);
  console.log('PASS: 7 page routes, 2 unauthenticated API denials, cross-origin mutation denial.');
} finally {
  server.kill('SIGTERM');
  if (server.exitCode === null) await new Promise(resolve => server.once('exit', resolve));
}

```

## tests/store.test.mjs

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import { familyStore } from '../lib/store.js';
import FamilyState from '../models/FamilyState.js';
const testUri = process.env.MONGODB_TEST_URI;
// This used to test a removed JSON-file store. Use an explicitly supplied test database.
test('MongoDB concurrent writes are atomic and failed mutations do not persist', { skip: !testUri }, async () => {
  process.env.MONGODB_URI = testUri;
  const id = randomBytes(12).toString('hex');
  try {
    await Promise.all(Array.from({ length: 6 }, () => familyStore(id, data => { data.wallets.child = (data.wallets.child || 0) + 1000; })));
    assert.equal(await familyStore(id, d => d.wallets.child, true), 6000);
    await assert.rejects(familyStore(id, data => { data.wallets.child = -99; throw new Error('abort'); }));
    assert.equal(await familyStore(id, d => d.wallets.child, true), 6000);
    await assert.rejects(familyStore('../escape', () => null));
  } finally { await FamilyState.deleteOne({ _id: id }); await mongoose.disconnect(); }
});

```

## tests/telegram.test.mjs

```javascript
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

```


## components/TaskCamera.js

```javascript
'use client';
import { useEffect, useRef, useState } from 'react';

export default function TaskCamera({ onCapture, onClose, onFallback }) {
  const video = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let stream;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported');
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1600 }, height: { ideal: 1200 } } });
        if (cancelled) { stream.getTracks().forEach(track => track.stop()); return; }
        video.current.srcObject = stream;
        await video.current.play();
      } catch (e) {
        if (cancelled) return;
        setError(e.name === 'NotAllowedError'
          ? 'Kameraga ruxsat berilmadi. Brauzer sozlamasidan ruxsat bering yoki rasm tanlang.'
          : e.name === 'NotFoundError'
            ? 'Kamera topilmadi. Qurilmangizdan tayyor rasm tanlashingiz mumkin.'
            : 'Kamera ochilmadi. Saytni HTTPS orqali oching yoki quyidagi tugmadan foydalaning.');
      }
    }
    start();
    return () => { cancelled = true; stream?.getTracks().forEach(track => track.stop()); };
  }, []);
  function capture() {
    if (!ready || capturing || !video.current?.videoWidth) return;
    setCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1600 / Math.max(video.current.videoWidth, video.current.videoHeight));
      canvas.width = Math.round(video.current.videoWidth * scale);
      canvas.height = Math.round(video.current.videoHeight * scale);
      canvas.getContext('2d').drawImage(video.current, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/jpeg', 0.8);
      if (photo.length >= 2000000) throw new Error('Rasm hajmi katta. Qayta urinib ko‘ring yoki rasm tanlang.');
      onCapture(photo);
    } catch (e) { setError(e.message || 'Surat olinmadi. Qayta urinib ko‘ring.'); setCapturing(false); }
  }
  return <section className="task-camera" aria-label="Vazifa uchun surat olish">
    <video ref={video} autoPlay muted playsInline onLoadedData={() => setReady(true)} aria-label="Kameradagi jonli tasvir" />
    {!ready && !error && <p role="status">Kameraga ruxsat bering. Kamera ochilmoqda…</p>}
    {error && <p className="alert error" role="alert">{error}</p>}
    <div className="photo-actions">
      <button type="button" className="button primary" disabled={!ready || capturing} onClick={capture}>Suratga olish</button>
      <button type="button" className="button light" onClick={onClose}>Kamerani yopish</button>
      {error && <button type="button" className="button light" onClick={onFallback}>Telefon kamerasi / rasm tanlash</button>}
    </div>
  </section>;
}

```
