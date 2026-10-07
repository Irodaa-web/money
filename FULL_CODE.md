# Birinchi Pul — to‘liq manba kodi

Har bir sarlavha ostidagi kodni shu nomdagi faylga yozishingiz mumkin. ZIP ichida fayllar allaqachon o‘z joyida. Ishga tushirish: README.md.

## `.env.example`

```text
MONGODB_URI=mongodb://127.0.0.1:27017/birinchi_pul
# Absolute path recommended on a VPS. Defaults to .data inside project.
DATA_DIR=.data
# false for http://localhost; true for public HTTPS deployment.
COOKIE_SECURE=false

```

## `.gitignore`

```text
node_modules/
.next/
.env.local
.data/
coverage/
*.log

```

## `app/api/[...path]/route.js`

```jsx
import { handle } from '@/lib/api';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = handle;
export const POST = handle;
export const PATCH = handle;

```

## `app/child/[section]/page.js`

```jsx
import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
export default async function ChildSection({ params }) {
  const { section } = await params;
  if (!['tasks', 'goals', 'wallet', 'notifications', 'learn'].includes(section)) notFound();
  return <Dashboard role="child" section={section} />;
}

```

## `app/child/page.js`

```jsx
import Dashboard from '@/components/Dashboard';
export default function ChildPage() { return <Dashboard role="child" />; }

```

## `app/error.js`

```jsx
'use client';
export default function ErrorPage({ reset }) { return <main className="center-page"><div className="card"><h1>Sahifa yuklanmadi</h1><p>Ulanishni tekshirib, qayta urinib ko‘ring.</p><button className="button primary" onClick={reset}>Qayta urinish</button></div></main>; }

```

## `app/globals.css`

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

```

## `app/layout.js`

```jsx
import './globals.css';
export const metadata = { title: 'Birinchi Pul — Kichik qadamlar, katta maqsadlar', description: 'Ota-ona va farzand uchun vazifalar, cho‘ntak puli va jamg‘arma maqsadlari.' };
export default function RootLayout({ children }) { return <html lang="uz"><body>{children}</body></html>; }

```

## `app/login/page.js`

```jsx
import AuthForm from '@/components/AuthForm';
export default function LoginPage() { return <AuthForm mode="login" />; }

```

## `app/not-found.js`

```jsx
import Link from 'next/link';
export default function NotFound() { return <main className="center-page"><div className="card"><span className="eyebrow">404</span><h1>Bu sahifa topilmadi</h1><p>Bosh sahifadan davom etishingiz mumkin.</p><Link className="button primary" href="/">Bosh sahifaga</Link></div></main>; }

```

## `app/page.js`

```jsx
import Link from 'next/link';
import Brand from '@/components/Brand';
import Icon from '@/components/Icon';
export default function Home() { return <main className="landing"><nav className="landing-nav"><Brand /><div><Link href="#qanday">Qanday ishlaydi?</Link><Link className="button light" href="/login">Kirish <Icon name="arrow" /></Link></div></nav><section className="hero"><div><span className="pill"><span className="dot" /> Oilalar uchun moliyaviy ta’lim</span><h1>Pulning qadrini<br /><em>birga o‘rganamiz.</em></h1><p>Vazifalarni bajaramiz, ilk mukofotni olamiz va orzularimiz uchun jamg‘aramiz. Ota-ona va farzand — bitta jamoa.</p><div className="hero-actions"><Link href="/register" className="button primary">Oilamiz bilan boshlash <Icon name="arrow" /></Link><Link href="/login" className="text-link">Mening kabinetim →</Link></div><div className="hero-note"><Icon name="check" size={17} /> Karta kerak emas <span>•</span> Virtual hisob <span>•</span> O‘zbek tilida</div></div><div className="hero-art"><div className="art-orbit" /><div className="floating-badge"><span className="success-icon"><Icon name="check" /></span><span>Vazifa tasdiqlandi!<strong>+ 20 000 so‘m</strong></span></div><div className="hero-preview"><div className="preview-top"><span className="avatar">A</span><div><small>SALOM, AZIZ!</small><strong>Orzular sari yana bir qadam 🌱</strong></div></div><div className="preview-balance"><small>MENING VIRTUAL BALANSIM</small><h2>120 000 <span>so‘m</span></h2><span>Harakatingizning natijasi ✨</span></div><div className="preview-goal"><div className="goal-emoji">🚲</div><div><strong>Birinchi velosipedim</strong><small>120 000 / 400 000 so‘m</small></div></div><div className="progress"><span style={{ width: '30%' }} /></div><small className="preview-caption">Bu ko‘rgazmali namuna. Haqiqiy bank hisobi emas.</small></div><div className="floating-star">✦</div></div></section><section className="how-section" id="qanday"><span className="eyebrow">JUDA OSON BOSHLANADI</span><h2>Uch qadam. Bir yangi odat.</h2><div className="how-grid">{[['01', 'users', 'Oilangizni ulang', 'Ota-ona hisob ochadi va farzandiga bir martalik taklif kodi beradi.'], ['02', 'tasks', 'Vazifa bering, rag‘batlantiring', 'Nima qilish, qachongacha va qancha mukofot — hammasi bir joyda.'], ['03', 'target', 'Maqsad sari jamg‘aring', 'Bola bajarganini yuboradi. Tasdiqdan so‘ng mukofot virtual balansga tushadi.']].map(([n, icon, title, text]) => <article key={n}><div className="how-number"><Icon name={icon} size={27} /><span>{n}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section><footer><Brand /><p>Birinchi pul — katta hayotga kichik qadam.</p><span>Virtual mukofotlar. Haqiqiy ko‘nikmalar.</span></footer></main>; }

```

## `app/parent/[section]/page.js`

```jsx
import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
export default async function ParentSection({ params }) {
  const { section } = await params;
  if (!['tasks', 'goals', 'wallet', 'family', 'notifications', 'learn'].includes(section)) notFound();
  return <Dashboard role="parent" section={section} />;
}

```

## `app/parent/page.js`

```jsx
import Dashboard from '@/components/Dashboard';
export default function ParentPage() { return <Dashboard role="parent" />; }

```

## `app/register/page.js`

```jsx
import AuthForm from '@/components/AuthForm';
export default function RegisterPage() { return <AuthForm mode="register" />; }

```

## `components/AuthForm.js`

```jsx
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
  return <main className="auth-page"><section className="auth-story"><Brand /><div><span className="eyebrow">OILANGIZ BILAN BIRGA</span><h1>Kichik qadamlar.<br /><em>Katta orzular.</em></h1><p>Bugungi kichik vazifa — ertangi katta maqsadning boshlanishi.</p><div className="story-graphic"><span className="coin coin-one">+</span><div className="goal-illustration"><Icon name="target" size={54} /><strong>Men uddalayman!</strong><div className="progress"><span style={{ width: '72%' }} /></div><small>Har bir harakatning qadri bor.</small></div><span className="coin coin-two">★</span></div></div><small>Mehr bilan o‘rgatamiz. Birga ulg‘ayamiz.</small></section><section className="auth-main"><Link href="/" className="back-link">← Bosh sahifa</Link><div className="auth-form"><span className="eyebrow">BIRINCHI PULGA XUSH KELIBSIZ</span><h2>{register ? 'Birga boshlaymiz' : 'Yana ko‘rishganimizdan xursandmiz'}</h2><p>{register ? 'Avval ota-ona ro‘yxatdan o‘tadi. Keyin farzandini kod orqali taklif qiladi.' : 'Loginingiz va parolingizni kiriting.'}</p>{register && <div className="role-switch"><button type="button" className={role === 'parent' ? 'selected' : ''} onClick={() => setRole('parent')}><Icon name="users" /> Men ota-onaman</button><button type="button" className={role === 'child' ? 'selected' : ''} onClick={() => setRole('child')}><Icon name="star" /> Men bolaman</button></div>}<form onSubmit={submit}>
    {register && <label>Ismingiz<input name="name" placeholder="Masalan, Aziza" minLength={2} maxLength={60} autoComplete="name" required /></label>}
    <label>Login<input name="username" placeholder="Masalan, aziza_01" minLength={3} maxLength={32} pattern="[A-Za-z0-9_.\-]+" autoCapitalize="none" autoComplete="username" required /><small>Lotin harflari va raqamlar. Email shart emas.</small></label>
    <label>Parol<div className="password-field"><input name="password" type={show ? 'text' : 'password'} minLength={8} maxLength={128} placeholder="Kamida 8 ta belgi" autoComplete={register ? 'new-password' : 'current-password'} required /><button type="button" aria-label={show ? 'Parolni yashirish' : 'Parolni ko‘rish'} onClick={() => setShow(!show)}>{show ? 'Yashirish' : 'Ko‘rish'}</button></div></label>
    {register && <label>Parolni takrorlang<input name="confirm" type={show ? 'text' : 'password'} minLength={8} maxLength={128} placeholder="Parolni yana bir marta kiriting" autoComplete="new-password" required /></label>}
    {register && role === 'child' && <label>Ota-onangiz bergan oila kodi<input name="inviteCode" placeholder="Masalan, A1B2C3D4E5F6" minLength={12} maxLength={12} autoComplete="off" required /><small>Ota-ona kabinetidagi “Oila” bo‘limidan olinadi.</small></label>}
    {error && <div className="alert error" role="alert">{error}</div>}<button className="button primary full" disabled={busy}>{busy ? 'Biroz kuting…' : register ? 'Hisob yaratish' : 'Kabinetga kirish'}<Icon name="arrow" /></button></form><p className="auth-bottom">{register ? 'Hisobingiz bormi?' : 'Hali hisobingiz yo‘qmi?'} <Link href={register ? '/login' : '/register'}>{register ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</Link></p></div></section></main>;
}

```

## `components/Brand.js`

```jsx
import Link from 'next/link';
import Icon from './Icon';
export default function Brand() { return <Link href="/" className="brand"><span className="brand-mark"><Icon name="leaf" size={23} /></span><span>birinchi<span className="brand-light">pul</span><i /></span></Link>; }

```

## `components/Dashboard.js`

```jsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Brand from './Brand';
import Icon from './Icon';
import Modal from './Modal';
import Tour from './Tour';
import Learn from './Learn';
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
const empty = { tasks: [], goals: [], payouts: [], transactions: [], wallets: {}, children: [], notifications: [] };
function Empty({ icon = 'tasks', title, text, action }) { return <div className="empty-state"><span><Icon name={icon} size={30} /></span><h3>{title}</h3><p>{text}</p>{action}</div>; }
function Stat({ label, value, icon, caption, tone }) { return <div className={`stat-card ${tone || ''}`}><div><span>{label}</span><Icon name={icon} size={20} /></div><strong>{value}</strong><small>{caption}</small></div>; }

export default function Dashboard({ role, section = 'overview' }) {
  const parent = role === 'parent';
  const [user, setUser] = useState(null), [data, setData] = useState(empty), [loading, setLoading] = useState(true);
  const [error, setError] = useState(''), [toast, setToast] = useState(''), [filter, setFilter] = useState('all'), [childFilter, setChildFilter] = useState('all');
  const [modal, setModal] = useState(null), [modalError, setModalError] = useState(''), [busy, setBusy] = useState(false);
  const [tour, setTour] = useState(false), [code, setCode] = useState(null);
  const [date, setDate] = useState(localDateInput), [time, setTime] = useState('19:00');
  const running = useRef(false), refreshVersion = useRef(0), tourStarted = useRef(false);
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
        if (alive && !result.user.onboarded && !tourStarted.current) { tourStarted.current = true; setTour(true); }
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

  const taskList = (items) => items.length ? <div className="task-grid">{items.map(task => <article className="task-card" key={task.id}>
    <div className="task-top"><span className={`tag ${task.status === 'pending' ? 'amber' : ''}`}>{task.status === 'pending' ? 'Tekshirish kutilmoqda' : 'Bajarish kerak'}</span>{parent && <span className="child-label">{childName(task.childId)}</span>}</div>
    <h3>{task.title}</h3>{task.description && <p className="task-description">{task.description}</p>}
    <div className={`task-deadline ${new Date(task.dueAt) < new Date() && task.status === 'active' ? 'overdue' : ''}`}><Icon name="clock" size={16} /><span>{dateText(task.dueAt)}{new Date(task.dueAt) < new Date() && task.status === 'active' ? ' · Muddat o‘tgan' : ''}</span></div>
    {task.revisionNote && task.status === 'active' && <div className="alert">Ota-onadan izoh: {task.revisionNote}</div>}
    {task.completionNote && task.status === 'pending' && <div className="alert">Bolaning izohi: {task.completionNote}</div>}
    <div className="task-reward"><span>Virtual mukofot</span><strong>+ {moneyText(task.amount)}</strong></div>
    <div className="task-actions">{parent ? <>{task.status === 'pending' && <><button disabled={busy} className="button primary" onClick={() => open({ type: 'approve', task })}><Icon name="check" size={17} />Tasdiqlash</button><button className="button light" disabled={busy} onClick={() => open({ type: 'return', task })}>Qaytarish</button></>}<button className="text-button danger-text" disabled={busy} onClick={() => open({ type: 'delete-task', task })}>Bekor qilish</button></> : <button disabled={task.status === 'pending' || busy} className={`button full ${task.status === 'pending' ? 'waiting' : 'primary'}`} onClick={() => open({ type: 'submit', task })}><Icon name={task.status === 'pending' ? 'clock' : 'check'} size={17} />{task.status === 'pending' ? 'Ota-ona tasdiqlashini kuting' : 'Qilib bo‘ldim'}</button>}</div>
  </article>)}</div> : <Empty title={filter === 'pending' ? 'Tekshirishga kelgan vazifa yo‘q' : 'Hozircha vazifalar yo‘q'} text={parent ? data.children.length ? 'Farzandingizga birinchi kichik vazifani bering.' : 'Avval “Oila” bo‘limidan farzandingizni taklif qiling.' : 'Ota-onangiz vazifa qo‘shganda shu yerda paydo bo‘ladi.'} action={parent && (data.children.length ? <button className="button primary" onClick={() => open({ type: 'new-task' })}><Icon name="plus" />Vazifa qo‘shish</button> : <Link className="button primary" href="/parent/family">Farzandni taklif qilish</Link>)} />;

  const goalList = (goals) => goals.length ? <div className="goal-grid">{goals.map(goal => <article className="card goal-card" key={goal.id}><div className="goal-heading"><span className="goal-icon"><Icon name="target" size={26} /></span>{parent && <span className="child-label">{childName(goal.childId)}</span>}<span className="percent">{Math.floor(goal.saved / goal.target * 100)}%</span></div><h3>{goal.title}</h3><div className="progress"><span style={{ width: `${Math.min(100, goal.saved / goal.target * 100)}%` }} /></div><div className="goal-numbers"><strong>{moneyText(goal.saved)}</strong><small>{moneyText(goal.target)}</small></div>{goal.saved >= goal.target ? <p className="goal-achieved">✨ Maqsadga yetdingiz! Juda yaxshi!</p> : <p>Yana {moneyText(goal.target - goal.saved)} kerak.</p>}{!parent && <div className="goal-actions">{goal.saved < goal.target && <button className="button primary" onClick={() => open({ type: 'save-goal', goal })}>Pul ajratish</button>}{goal.saved > 0 && <button className="button light" onClick={() => open({ type: 'release-goal', goal })}>Balansga qaytarish</button>}{goal.saved === 0 && <button className="text-button danger-text" onClick={() => open({ type: 'delete-goal', goal })}>O‘chirish</button>}</div>}</article>)}</div> : <Empty icon="target" title={parent ? 'Maqsadlar hali qo‘shilmagan' : 'Sizning birinchi orzuingiz nima?'} text={parent ? 'Farzandingiz maqsad ochsa, jamg‘arish jarayonini shu yerda kuzatasiz.' : 'Kitob, velosiped yoki yangi quloqchin. Maqsad qo‘ying va kichik qadamlar bilan boshlang.'} action={!parent && <button className="button primary" onClick={() => open({ type: 'new-goal' })}><Icon name="plus" />Maqsad qo‘shish</button>} />;

  return <div className="app-shell"><aside className="sidebar"><Brand /><div className="workspace-label">{parent ? 'OTA-ONA KABINETI' : 'BOLA KABINETI'}</div><nav aria-label="Kabinet bo‘limlari">{navItems.filter(n => parent || n[0] !== 'family').map(([key, icon, pLabel, cLabel]) => <Link id={`nav-${key}`} key={key} href={`/${role}${key === 'overview' ? '' : `/${key}`}`} className={`nav-item ${section === key ? 'active' : ''}`} aria-current={section === key ? 'page' : undefined}><Icon name={icon} /><span>{parent ? pLabel : cLabel}</span>{key === 'notifications' && unread > 0 && <b>{unread}</b>}{key === 'tasks' && parent && pending.length > 0 && <b>{pending.length}</b>}</Link>)}</nav><div className="sidebar-bottom"><div className="grow-note"><span>🌱</span><strong>Har kun bir kichik qadam</strong><p>{parent ? 'Rag‘bat va mehr — eng yaxshi boshlanish.' : 'Bugungi harakatingiz ertangi orzuingizga yaqinlashtiradi.'}</p></div><button className="nav-item" onClick={() => setTour(true)}><Icon name="book" /><span>Saytni tushuntirish</span></button><button className="nav-item" disabled={busy} onClick={signOut}><Icon name="logout" /><span>Hisobdan chiqish</span></button></div></aside>
  <div className="app-main"><header className="topbar"><div className="breadcrumb">Mening oilam <span>/</span> <strong>{title}</strong></div><div className="topbar-right"><span className="virtual-label"><span className="dot" /> Virtual hisob</span><Link href={`/${role}/notifications`} className="icon-button notification-button" aria-label={`${unread} ta o‘qilmagan xabar`}><Icon name="bell" />{unread > 0 && <i />}</Link><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><div className="profile-text"><strong>{user.name}</strong><small>{parent ? 'Ota-ona' : 'Yosh jamg‘aruvchi'}</small></div></div></header>
  <main className="dashboard-content"><div className="page-heading"><div><span className="eyebrow">{section === 'overview' ? 'BUGUN HAM BIRGA ULG‘AYAMIZ' : 'KICHIK QADAMLAR, KATTA MAQSADLAR'}</span><h1>{section === 'overview' ? `Salom, ${user.name}!` : title}{section === 'overview' && <span className="wave"> 👋</span>}</h1><p>{section === 'overview' ? parent ? 'Farzandingizning har bir harakati — yangi imkoniyat.' : 'Bugun qaysi orzuingizga bir qadam yaqinlashamiz?' : section === 'tasks' ? 'Vazifa, muddat va mukofot — hammasi aniq.' : section === 'family' ? 'Farzandingizni oilangizga xavfsiz taklif qiling.' : section === 'wallet' ? 'Virtual hisob va ota-ona bilan kelishilgan pul so‘rovlari.' : section === 'goals' ? 'Orzular reja bilan yaqinlashadi.' : section === 'learn' ? 'Bir necha daqiqa. Hayot uchun foydali odat.' : 'Oilangizdagi so‘nggi yangiliklar.'}</p></div>{parent && ['overview', 'tasks'].includes(section) && <button id="new-task" className="button primary" onClick={() => data.children.length ? open({ type: 'new-task' }) : router.push('/parent/family')}><Icon name="plus" />Yangi vazifa</button>}{!parent && section === 'goals' && <button className="button primary" onClick={() => open({ type: 'new-goal' })}><Icon name="plus" />Yangi maqsad</button>}</div>
  {error && <div className="alert error page-alert" role="alert">{error}<button className="text-button" onClick={() => refresh().catch(e => setError(e.message))}>Qayta yangilash</button></div>}
  {section === 'overview' && <><div className="stats-grid">{parent ? <><Stat label="Farzandlarim" value={data.children.length} icon="users" caption="Bir oilaning katta orzulari" /><Stat label="Faol vazifalar" value={active.length} icon="tasks" caption="Kichik qadamlar davom etmoqda" /><Stat label="Tasdiq kutilmoqda" value={pending.length} icon="clock" caption="Farzandingiz sizdan javob kutmoqda" tone="warm" /><Stat label="Jamg‘arilgan" value={moneyText(saved)} icon="target" caption="Maqsadlar uchun ajratilgan" tone="green" /></> : <><Stat label="Bo‘sh virtual balans" value={moneyText(mine.available)} icon="wallet" caption="Maqsadga ajratish yoki so‘rash mumkin" tone="green" /><Stat label="Maqsadlarimda" value={moneyText(saved)} icon="target" caption="Orzularingizga bir qadam yaqin" /><Stat label="Vazifalarim" value={active.length} icon="tasks" caption="Siz bajara olasiz!" /><Stat label="Tasdiq kutilmoqda" value={pending.length} icon="clock" caption="Ota-onangiz javobini kutamiz" tone="warm" /></>}</div><div className="feature-banner"><div><span className="eyebrow">{parent ? 'MEHR BILAN RAG‘BATLANTIRING' : 'HAR BIR ORZU KICHIK QADAMDAN BOSHLANADI'}</span><h2>{parent ? 'Natijadan tashqari, harakatni ham qadrlang.' : 'Bugungi vazifa — ertangi orzu.'}</h2><p>{parent ? 'Aniq vazifa, tushunarli muddat va samimiy maqtov farzandingizga yordam beradi.' : 'Vazifani bajaring, mukofotni oling va o‘zingiz uchun muhim narsaga jamg‘aring.'}</p><Link className="text-link" href={`/${role}/${parent ? 'learn' : 'goals'}`}>{parent ? 'Kichik darslarni ko‘rish' : 'Maqsadlarimga o‘tish'} →</Link></div><div className="banner-art"><span>✦</span><Icon name={parent ? 'leaf' : 'target'} size={74} /><i>✦</i></div></div><section id="task-list"><div className="section-heading"><h2>{parent && pending.length ? 'Tasdiqlashingizni kutmoqda' : 'Bugungi kichik qadamlar'}<span className="count">{parent && pending.length ? pending.length : data.tasks.length}</span></h2><Link href={`/${role}/tasks`} className="text-link">Barchasi →</Link></div>{taskList((parent && pending.length ? pending : data.tasks).slice(0, 4))}</section><section><div className="section-heading"><h2>{parent ? 'Oilamizning maqsadlari' : 'Orzularim sari'}</h2><Link className="text-link" href={`/${role}/goals`}>Barchasi →</Link></div>{goalList(data.goals.slice(0, 2))}</section></>}
  {section === 'tasks' && <section id="task-list"><div className="filter-bar"><div className="filter-tabs">{[['all', 'Barchasi'], ['active', 'Bajarish kerak'], ['pending', 'Tekshirishda']].map(([v, label]) => <button key={v} className={filter === v ? 'active' : ''} onClick={() => setFilter(v)}>{label}<span>{v === 'all' ? data.tasks.length : data.tasks.filter(t => t.status === v).length}</span></button>)}</div>{parent && data.children.length > 1 && <select aria-label="Farzand bo‘yicha saralash" value={childFilter} onChange={e => setChildFilter(e.target.value)}><option value="all">Barcha farzandlar</option>{data.children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}</div>{taskList(shownTasks)}<p className="section-note">Tasdiqlangan vazifalar bu ro‘yxatdan o‘chadi. Mukofot tarixi “{parent ? 'Hisob va so‘rovlar' : 'Mening hamyonim'}” bo‘limida qoladi. Vaqt: Toshkent (UTC+5).</p></section>}
  {section === 'goals' && goalList(data.goals)}
  {section === 'family' && parent && <div className="family-layout"><section className="card invite-card"><span className="lesson-icon"><Icon name="users" size={30} /></span><h2>Farzandingizni taklif qiling</h2><ol className="steps-list"><li><span>1</span><div><strong>Taklif kodi yarating</strong><p>Quyidagi tugmani bosing. Kod 24 soat amal qiladi.</p></div></li><li><span>2</span><div><strong>Kodni farzandingizga bering</strong><p>Farzandingiz “Ro‘yxatdan o‘tish” → “Men bolaman”ni tanlaydi.</p></div></li><li><span>3</span><div><strong>Bitta oilaga ulanasiz</strong><p>Kod bir marta ishlatiladi. Har bir bola uchun yangisini yarating.</p></div></li></ol>{code && <div className="invite-code"><small>FARZANDINGIZ UCHUN KOD</small><strong>{code.code}</strong><span>{dateText(code.expiresAt)} gacha</span><button className="button light" onClick={async () => { try { await navigator.clipboard.writeText(code.code); setToast('Kod nusxalandi.'); } catch { setError('Nusxalash ishlamadi. Kodni belgilab, qo‘lda nusxalang.'); } }}><Icon name="copy" />Nusxalash</button></div>}<button className="button primary full" disabled={busy} onClick={createInvite}><Icon name="plus" />{busy ? 'Tayyorlanmoqda…' : code ? 'Yana bir bola uchun kod' : 'Taklif kodi yaratish'}</button></section><section><div className="section-heading"><h2>Farzandlarim <span className="count">{data.children.length}</span></h2></div>{data.children.length ? data.children.map(c => <article className="card child-card" key={c.id}><span className="avatar big">{c.name.charAt(0)}</span><div><h3>{c.name}</h3><p>@{c.username}</p><small>{data.tasks.filter(t => t.childId === c.id).length} ta vazifa · {data.goals.filter(g => g.childId === c.id).length} ta maqsad</small></div><strong>{moneyText(data.wallets[c.id]?.balance || 0)}</strong></article>) : <Empty icon="users" title="Oilangiz shu yerdan boshlanadi" text="Farzandingiz kod bilan ro‘yxatdan o‘tgach, shu yerda avtomatik ko‘rinadi." />}</section></div>}
  {section === 'wallet' && <><div className="wallet-hero"><div><span className="eyebrow">{parent ? 'OILAVIY VIRTUAL HISOB' : 'MENING VIRTUAL HISOBIM'}</span><h2>{moneyText(parent ? Object.values(data.wallets).reduce((s, w) => s + w.balance, 0) : mine.balance)}</h2><p>{parent ? 'Farzandlar balansining jami. Maqsadlarga ajratilgan pul alohida.' : `Shundan ${moneyText(mine.reserved)} so‘rovlar uchun band.`}</p></div>{!parent && <button className="button white" onClick={() => open({ type: 'new-payout' })}>Ota-onadan pul so‘rash <Icon name="arrow" /></button>}<Icon name="wallet" size={65} /></div><div className="alert">Bu virtual hisob. Sayt pul o‘tkazmaydi. Ota-ona pulni tashqarida bergach, so‘rovda “Pulni berdim”ni tasdiqlaydi.</div><section><div className="section-heading"><h2>Pul berish so‘rovlari</h2></div>{data.payouts.length ? <div className="request-list">{data.payouts.map(p => <article className="card request-card" key={p.id}><div><span className={`tag ${p.status === 'pending' ? 'amber' : ''}`}>{p.status === 'pending' ? 'Javob kutilmoqda' : p.status === 'approved' ? 'Pul berilgan' : 'Rad etilgan'}</span><h3>{p.title}</h3><small>{parent && `${childName(p.childId)} · `}{dateText(p.createdAt)}</small></div><strong>{moneyText(p.amount)}</strong>{parent && p.status === 'pending' && <div className="row-actions"><button className="button primary" disabled={busy} onClick={() => open({ type: 'approve-payout', payout: p })}>Pulni berdim</button><button className="button light" disabled={busy} onClick={() => open({ type: 'reject-payout', payout: p })}>Rad etish</button></div>}</article>)}</div> : <Empty icon="wallet" title="Hozircha pul so‘rovi yo‘q" text={parent ? 'Farzandingiz balansidan pul so‘raganda shu yerda ko‘rinadi.' : 'Bajargan vazifalaringizdan mukofot yig‘ib, ota-onangizdan pul so‘rashingiz mumkin.'} />}</section><section><div className="section-heading"><h2>Mukofot va berilgan pul tarixi</h2><span className="section-note">Oxirgi 100 ta yozuv</span></div>{data.transactions.length ? <div className="card ledger">{data.transactions.map(t => <div className="ledger-row" key={t.id}><span className={`ledger-icon ${t.type === 'payout' ? 'payout' : ''}`}><Icon name={t.type === 'reward' ? 'check' : 'wallet'} /></span><div><strong>{t.title}</strong><small>{parent && `${childName(t.childId)} · `}{dateText(t.createdAt)}</small></div><span className={t.amount > 0 ? 'positive' : ''}>{t.amount > 0 ? '+' : ''}{moneyText(t.amount)}</span></div>)}</div> : <Empty icon="clock" title="Birinchi mukofot oldinda" text="Ota-ona vazifani tasdiqlagach, mukofot shu yerda tarixga yoziladi." />}</section></>}
  {section === 'notifications' && <><div className="section-heading"><h2>{unread} ta yangi xabar</h2><button className="button light" disabled={busy || unread === 0} onClick={() => mutate('notifications/read', {}, 'Xabarlar o‘qilgan deb belgilandi.')}>Barchasini o‘qidim</button></div>{data.notifications.length ? <div className="notification-list">{data.notifications.map(n => <article className={`card notification-card ${n.read ? '' : 'unread'}`} key={n.id}><span className="lesson-icon"><Icon name="bell" /></span><div><p>{n.text}</p><small>{dateText(n.createdAt)}</small></div>{!n.read && <span className="dot" />}</article>)}</div> : <Empty icon="bell" title="Hozircha yangilik yo‘q" text="Yangi vazifa, bajarilgan ish yoki mukofot haqida shu yerda xabar beramiz." />}</>}
  {section === 'learn' && <Learn />}
  <footer className="dashboard-footer"><span>🌱 Birinchi Pul — oilangiz bilan birga.</span><span>Haqiqiy ko‘nikmalar. Virtual mukofotlar.</span></footer></main></div>
  {toast && <div className="toast" role="status"><Icon name="check" />{toast}</div>}
  {modal && <Modal title={{ 'new-task': 'Yangi vazifa berish', approve: 'Vazifani tasdiqlaysizmi?', return: 'Vazifani qaytarish', submit: 'Vazifani bajarib bo‘ldingizmi?', 'delete-task': 'Vazifani bekor qilish', 'new-goal': 'Yangi maqsad', 'save-goal': 'Maqsadga pul ajratish', 'release-goal': 'Pulni balansga qaytarish', 'delete-goal': 'Maqsadni o‘chirish', 'new-payout': 'Ota-onadan pul so‘rash', 'approve-payout': 'Pul berganingizni tasdiqlang', 'reject-payout': 'So‘rovni rad etish' }[modal.type]} onClose={closeModal} locked={busy}>
    {modal.type === 'new-task' && <form onSubmit={event => { const b = formBody(event); mutate('tasks', { ...b, amount: Number(b.amount), dueAt: new Date(`${b.date}T${b.time}:00+05:00`).toISOString() }, 'Vazifa farzandingizga yuborildi.'); }}><label>Qaysi farzandingizga?<select name="childId" required defaultValue={data.children.length === 1 ? data.children[0].id : ''}><option value="" disabled>Farzandni tanlang</option>{data.children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Nima qilish kerak?<input name="title" placeholder="Masalan, bugun xonangni yig‘ishtir" maxLength={120} required /></label><label>Qo‘shimcha tushuntirish <span className="optional">(ixtiyoriy)</span><textarea name="description" placeholder="Kitoblarni javonga, o‘yinchoqlarni qutiga joyla." maxLength={1000} rows={3} /></label><div className="form-row"><label>Qaysi kungacha?<input name="date" type="date" min={localDateInput()} required value={date} onChange={e => setDate(e.target.value)} /></label><label>Soat nechagacha?<input name="time" type="time" required value={time} onChange={e => setTime(e.target.value)} /></label></div><small className="date-preview">{date && time ? `Muddat: ${dateText(`${date}T${time}:00+05:00`)} · Toshkent vaqti` : 'Sana va vaqtni tanlang.'}</small><label>Mukofot qancha bo‘ladi? (so‘m)<input name="amount" type="number" min={1000} max={10000000} step={1000} placeholder="Masalan, 20 000" required /><small>Vazifani tasdiqlaganingizdan keyin virtual balansga qo‘shiladi.</small></label>{modalError && <div className="alert error" role="alert">{modalError}</div>}<button disabled={busy} className="button primary full">{busy ? 'Yuborilmoqda…' : 'Vazifani yuborish'}<Icon name="arrow" /></button></form>}
    {['submit', 'return'].includes(modal.type) && <form onSubmit={event => { const b = formBody(event); mutate(`tasks/${modal.task.id}`, { action: modal.type, note: b.note }, modal.type === 'submit' ? 'Yuborildi. Ota-ona tasdiqlashini kuting.' : 'Vazifa izoh bilan qaytarildi.', 'PATCH'); }}><p className="modal-summary">{modal.task.title}</p><label>{modal.type === 'return' ? 'Nimani yaxshilash kerak?' : 'Ota-onangizga izoh (ixtiyoriy)'}<textarea name="note" rows={3} maxLength={500} required={modal.type === 'return'} placeholder={modal.type === 'return' ? 'Masalan, kitoblarni ham javonga joylang.' : 'Masalan, hamma kitoblarni joyladim.'} /></label>{modalError && <div className="alert error">{modalError}</div>}<button className="button primary full" disabled={busy}>{busy ? 'Yuborilmoqda…' : modal.type === 'return' ? 'Qayta bajarishga yuborish' : 'Ota-onaga yuborish'}</button></form>}
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

## `components/Icon.js`

```jsx
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

## `components/Learn.js`

```jsx
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

## `components/Modal.js`

```jsx
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

## `components/Tour.js`

```jsx
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

## `compose.yaml`

```yaml
services:
  mongo:
    image: mongo:8
    restart: unless-stopped
    ports:
      - "127.0.0.1:27017:27017"
    volumes:
      - mongodb_data:/data/db
volumes:
  mongodb_data:

```

## `jsconfig.json`

```json
{"compilerOptions":{"baseUrl":".","paths":{"@/*":["./*"]}}}

```

## `lib/api.js`

```jsx
import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { connectDB } from './db.js';
import User from '../models/User.js';
import { currentUser, requireUser, publicUser, createSession, logout } from './auth.js';
import { AppError, ensure, cleanText, hashPassword, checkPassword, hashToken, rateLimit } from './security.js';
import { familyStore } from './store.js';
import { createTask, changeTask, createGoal, changeGoal, createPayout, changePayout, snapshot } from './domain.js';

const json = (value, status = 200) => NextResponse.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
async function getBody(request) {
  const raw = await request.text();
  ensure(raw.length < 16000, 'Yuborilgan ma’lumot juda katta.', 413);
  try { const b = JSON.parse(raw); ensure(b && typeof b === 'object' && !Array.isArray(b), 'Noto‘g‘ri so‘rov.'); return b; }
  catch { throw new AppError('So‘rov JSON formatida bo‘lishi kerak.'); }
}
function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const allowed = new URL(request.url).origin;
  ensure(origin === allowed, 'So‘rov manbasi tasdiqlanmadi.', 403);
  ensure(request.headers.get('content-type')?.startsWith('application/json'), 'JSON so‘rov kerak.', 415);
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
    const body = mutation ? await getBody(request) : {};
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
      await familyStore(familyId, data => changeTask(data, actor, path[1], body)); return json({ ok: true });
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

## `lib/auth.js`

```jsx
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

## `lib/db.js`

```jsx
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

## `lib/domain.js`

```jsx
import { randomUUID } from 'node:crypto';
import { ensure, cleanText, money } from './security.js';
const now = () => new Date().toISOString();
export function notify(data, userId, text) {
  data.notifications.unshift({ id: randomUUID(), userId, text, read: false, createdAt: now() });
  data.notifications = data.notifications.slice(0, 500);
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
    task.status = 'pending'; task.submittedAt = now();
    task.completionNote = cleanText(body.note || '', 'Izoh', 500, 0);
    notify(data, task.parentId, `Tekshirish kerak: ${actor.name} “${task.title}” vazifasini bajardi.`);
  } else if (body.action === 'approve') {
    ensure(isParent, 'Faqat ota-ona tasdiqlaydi.', 403);
    ensure(task.status === 'pending', 'Avval bola vazifani tekshirishga yuborsin.', 409);
    data.wallets[task.childId] = (data.wallets[task.childId] || 0) + task.amount;
    data.transactions.unshift({ id: randomUUID(), childId: task.childId, type: 'reward', amount: task.amount, title: task.title, createdAt: now() });
    data.tasks = data.tasks.filter(t => t.id !== id);
    notify(data, task.childId, `Tasdiqlandi! “${task.title}” uchun ${task.amount.toLocaleString('en-US')} so‘m virtual mukofot qo‘shildi.`);
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
export function snapshot(data, actor, children) {
  const all = actor.role === 'parent';
  const own = list => list.filter(item => all || item.childId === actor.id);
  const ids = all ? children.map(c => c.id) : [actor.id];
  return { tasks: own(data.tasks), goals: own(data.goals), payouts: own(data.payouts), transactions: own(data.transactions).slice(0, 100),
    wallets: Object.fromEntries(ids.map(id => [id, wallet(data, id)])),
    notifications: data.notifications.filter(n => n.userId === actor.id), children };
}

```

## `lib/format.js`

```jsx
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

## `lib/security.js`

```jsx
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

## `lib/store.js`

```jsx
import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { AppError } from './security.js';

export const emptyFamily = () => ({ tasks: [], wallets: {}, goals: [], transactions: [], payouts: [], notifications: [] });
// All state changes for one family share an OS directory lock and one atomic rename.
// This prevents duplicate rewards, partial writes and concurrent read-modify-write loss.
export async function familyStore(familyId, action, readOnly = false) {
  if (!/^[a-f0-9]{24}$/.test(familyId)) throw new AppError('Oila topilmadi.', 404);
  const dir = path.resolve(/* turbopackIgnore: true */ process.env.DATA_DIR || '.data');
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const file = path.join(dir, `${familyId}.json`);
  const lock = `${file}.lock`;
  const started = Date.now();
  while (true) {
    try { await mkdir(lock); break; }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() - started > 5000) throw new AppError('Ma’lumot band. Bir necha soniyadan keyin qayta urinib ko‘ring.', 503);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
  }
  let temp;
  try {
    let data;
    try { data = JSON.parse(await readFile(file, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; data = emptyFamily(); }
    const result = await action(data);
    if (!readOnly) {
      temp = `${file}.${randomUUID()}.tmp`;
      await writeFile(temp, JSON.stringify(data), { mode: 0o600 });
      await rename(temp, file);
    }
    return result;
  } finally {
    if (temp) await rm(temp, { force: true });
    await rm(lock, { recursive: true, force: true });
  }
}

```

## `models/User.js`

```jsx
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 60 },
  username: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['parent', 'child'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  onboarded: { type: Boolean, default: false },
  sessions: [{ _id: false, hash: String, expiresAt: Date }],
  invitations: [{ _id: false, hash: String, expiresAt: Date }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);

```

## `next.config.mjs`

```javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const nextConfig = {
  turbopack: { root },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'same-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};
export default nextConfig;

```

## `package.json`

```json
{
  "name": "birinchi-pul",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.0.0"
  },
  "scripts": {
    "dev": "next dev --hostname 0.0.0.0",
    "build": "next build",
    "start": "next start --hostname 0.0.0.0",
    "setup": "node scripts/setup.mjs",
    "test": "node --test tests/*.test.mjs",
    "test:http": "node tests/http-smoke.mjs"
  },
  "dependencies": {
    "mongoose": "9.11.0",
    "next": "16.4.0",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  }
}

```

## `scripts/setup.mjs`

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

## `tests/domain.test.mjs`

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFamily } from '../lib/store.js';
import { createTask, changeTask, createGoal, changeGoal, createPayout, changePayout, snapshot, wallet } from '../lib/domain.js';
import { hashPassword, checkPassword } from '../lib/security.js';
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

```

## `tests/http-smoke.mjs`

```javascript
// Run after npm run build. No MongoDB installation is needed for these public/unauthenticated checks.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const base = 'http://localhost:3198';
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(3000) });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3198'], { stdio: ['ignore', 'pipe', 'pipe'] });
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
  console.log('PASS: 7 page routes, 2 unauthenticated API denials, cross-origin mutation denial.');
} finally {
  server.kill('SIGTERM');
  if (server.exitCode === null) await new Promise(resolve => server.once('exit', resolve));
}

```

## `tests/store.test.mjs`

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { familyStore } from '../lib/store.js';
const id = 'f'.repeat(24);
test('parallel writes are atomic and failed mutations leave persisted state unchanged', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'bp-test-')); process.env.DATA_DIR = dir;
  try {
    await Promise.all(Array.from({ length: 20 }, () => familyStore(id, data => { data.wallets.child = (data.wallets.child || 0) + 1000; })));
    assert.equal(await familyStore(id, d => d.wallets.child, true), 20000);
    await assert.rejects(familyStore(id, data => { data.wallets.child = -99; throw new Error('abort'); }));
    assert.equal(JSON.parse(await readFile(path.join(dir, `${id}.json`), 'utf8')).wallets.child, 20000);
    await assert.rejects(familyStore('../escape', () => null));
  } finally { await rm(dir, { recursive: true, force: true }); delete process.env.DATA_DIR; }
});

```
