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
