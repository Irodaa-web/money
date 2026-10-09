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
