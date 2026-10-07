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
