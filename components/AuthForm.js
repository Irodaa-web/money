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
