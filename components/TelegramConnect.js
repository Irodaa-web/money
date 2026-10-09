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
