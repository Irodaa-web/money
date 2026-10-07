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
